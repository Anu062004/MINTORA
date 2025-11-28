import { NextResponse } from "next/server";
import { ethers } from "ethers";
import {
  MINTORA_MARKETPLACE_ABI,
  MINTORA_PASSPORT_ABI,
} from "@/lib/contracts";

export const dynamic = 'force-dynamic';

const DEFAULT_IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs/";

type MetadataAttribute = {
  trait_type?: string;
  value?: string | number;
};

const resolveTokenUri = (uri: string) => {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", DEFAULT_IPFS_GATEWAY);
  }
  if (uri.startsWith("https://") || uri.startsWith("http://")) {
    return uri;
  }
  return `${DEFAULT_IPFS_GATEWAY}${uri}`;
};

const extractAttribute = (
  attributes: MetadataAttribute[] | undefined,
  traitName: string
) => {
  if (!attributes) return undefined;
  return attributes.find(
    (attr) => attr.trait_type?.toLowerCase() === traitName.toLowerCase()
  )?.value;
};

const getProvider = () => {
  const rpc =
    process.env.RPC_URL ||
    process.env.NEXT_PUBLIC_EVM_RPC ||
    process.env.NEXT_PUBLIC_EVM_RPC_URL;
  if (!rpc) {
    throw new Error(
      "RPC_URL (or NEXT_PUBLIC_EVM_RPC) environment variable is not set"
    );
  }
  return new ethers.JsonRpcProvider(rpc);
};

const resolveAddress = (envKey: string, ...extraKeys: string[]) => {
  const possibleKeys = new Set<string>([
    envKey,
    `NEXT_PUBLIC_${envKey}`,
    ...extraKeys,
  ]);

  const expandedKeys = Array.from(possibleKeys).flatMap((key) => {
    if (key.endsWith("_ADDRESS")) {
      const shortKey = key.replace(/_ADDRESS$/, "");
      return [key, shortKey, `NEXT_PUBLIC_${shortKey}`, `NEXT_PUBLIC_${key}`];
    }
    return [key];
  });

  for (const key of expandedKeys) {
    const value = process.env[key as keyof NodeJS.ProcessEnv];
    if (value && ethers.isAddress(value)) {
      return value;
    }
  }

  throw new Error(
    `${envKey} is not configured. Add ${envKey}=<address> (or NEXT_PUBLIC variant) to your environment variables.`
  );
};

const getMarketplaceContract = (
  provider: ethers.JsonRpcProvider,
  address: string
) => {
  try {
    return new ethers.Contract(
      address,
      MINTORA_MARKETPLACE_ABI,
      provider
    );
  } catch (error: any) {
    throw new Error(`Failed to create marketplace contract: ${error?.message}`);
  }
};

const getPassportContract = (
  provider: ethers.JsonRpcProvider,
  address: string
) => {
  try {
    return new ethers.Contract(
      address,
      MINTORA_PASSPORT_ABI,
      provider
    );
  } catch (error: any) {
    throw new Error(`Failed to create passport contract: ${error?.message}`);
  }
};

export async function GET() {
  try {
    const provider = getProvider();
    
    // Test provider connection
    try {
      await provider.getBlockNumber();
    } catch (error: any) {
      throw new Error(`RPC provider not responding: ${error?.message}`);
    }
    
    const marketplaceAddress = resolveAddress(
      "MINTORA_MARKETPLACE_ADDRESS",
      "MINTORA_MARKETPLACE",
      "NEXT_PUBLIC_MINTORA_MARKETPLACE"
    );
    const passportAddress = resolveAddress(
      "MINTORA_PASSPORT_ADDRESS",
      "MINTORA_PASSPORT",
      "NEXT_PUBLIC_MINTORA_PASSPORT"
    );
    
    if (!ethers.isAddress(marketplaceAddress)) {
      throw new Error(`Invalid marketplace address: ${marketplaceAddress}`);
    }
    if (!ethers.isAddress(passportAddress)) {
      throw new Error(`Invalid passport address: ${passportAddress}`);
    }
    
    const marketplace = getMarketplaceContract(provider, marketplaceAddress);
    const passport = getPassportContract(provider, passportAddress);

    // Ensure contract is connected and method exists
    if (!marketplace) {
      throw new Error("Marketplace contract not properly initialized");
    }

    let totalListings = 0;
    try {
      // Use staticCall for view functions in ethers v6
      const countResult = await marketplace.listingCount();
      totalListings = Number(countResult);
    } catch (error: any) {
      console.error("Error calling listingCount:", error);
      // If listingCount fails, return empty array instead of error
      return NextResponse.json({ listings: [] }, { status: 200 });
    }

    const listings: {
      listingId: number;
      seller: string;
      nftContract: string;
      tokenId: number;
      price: string;
      priceWei: string;
      active: boolean;
    }[] = [];

    for (let i = 1; i <= totalListings; i++) {
      try {
        const listing = await marketplace.listings(BigInt(i));
        if (!listing.active) continue;
        listings.push({
          listingId: Number(i),
          seller: listing.seller,
          nftContract: listing.nftContract,
          tokenId: Number(listing.tokenId),
          price: ethers.formatEther(listing.price),
          priceWei: listing.price.toString(),
          active: listing.active,
        });
      } catch (error: any) {
        console.warn(`Failed to fetch listing ${i}:`, error);
        // Continue to next listing
      }
    }

    const enriched = await Promise.all(
      listings.map(async (listing) => {
        let metadata: any = null;
        let tokenUri = "";
        let title = `Research #${listing.tokenId}`;
        let category = "Research";
        let image: string | null = null;
        let description: string | null = null;
        let qualityScore = 0;

        try {
          tokenUri = await passport.tokenURI(BigInt(listing.tokenId));
          const resolvedUri = resolveTokenUri(tokenUri);
          const response = await fetch(resolvedUri, { cache: "no-store" });
          if (response.ok) {
            metadata = await response.json();
            title = metadata?.name || title;
            description = metadata?.description || null;
            image = metadata?.image || null;
            const categoryAttr = extractAttribute(metadata?.attributes, "Category");
            if (categoryAttr && typeof categoryAttr === "string") {
              category = categoryAttr;
            }
          }
        } catch (error) {
          console.warn("Failed to fetch metadata for token", listing.tokenId, error);
        }

        try {
          const data = await passport.passportData(BigInt(listing.tokenId));
          qualityScore = Number(data.qualityScore) || 0;
        } catch (error) {
          console.warn("Failed to fetch passport data", listing.tokenId, error);
        }

        return {
          ...listing,
          title,
          description,
          category,
          tokenUri,
          image,
          qualityScore,
          metadata,
        };
      })
    );

    return NextResponse.json({ listings: enriched }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to load listings", error);
    // Return empty array instead of error to prevent page crash
    return NextResponse.json(
      { listings: [], error: error?.message || "Failed to load listings" },
      { status: 200 }
    );
  }
}

