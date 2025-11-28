import { ethers } from "ethers";
import { MINTORA_MARKETPLACE_ABI } from "../src/abis";
import { getContractAddress, getRpcUrl } from "./utils/env";

const marketplaceAddress = getContractAddress("MINTORA_MARKETPLACE_ADDRESS");
const rpcUrl = getRpcUrl();

function getProvider() {
  return new ethers.JsonRpcProvider(rpcUrl);
}

function getMarketplaceContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(
    marketplaceAddress,
    MINTORA_MARKETPLACE_ABI,
    signerOrProvider || getProvider()
  );
}

export interface Listing {
  listingId: number;
  seller: string;
  nftContract: string;
  tokenId: number;
  price: string;
  priceWei: string;
  active: boolean;
}

/**
 * Get all active listings
 */
export async function getActiveListings(): Promise<Listing[]> {
  const contract = getMarketplaceContract();
  const listings = await contract.getActiveListings();
  
  return listings.map((listing: any, index: number) => ({
    listingId: index + 1,
    seller: listing.seller,
    nftContract: listing.nftContract,
    tokenId: Number(listing.tokenId),
    price: ethers.formatEther(listing.price),
    priceWei: listing.price.toString(),
    active: listing.active,
  }));
}

/**
 * Get a specific listing
 */
export async function getListing(listingId: number): Promise<Listing> {
  const contract = getMarketplaceContract();
  const listing = await contract.listings(listingId);
  
  return {
    listingId,
    seller: listing.seller,
    nftContract: listing.nftContract,
    tokenId: Number(listing.tokenId),
    price: ethers.formatEther(listing.price),
    priceWei: listing.price.toString(),
    active: listing.active,
  };
}

/**
 * Get listing count
 */
export async function getListingCount(): Promise<number> {
  const contract = getMarketplaceContract();
  return Number(await contract.listingCount());
}

// Platform fee: 2.5%
export const PLATFORM_FEE_PERCENT = 2.5;

// Royalty fee: 5%
export const ROYALTY_FEE_PERCENT = 5;

