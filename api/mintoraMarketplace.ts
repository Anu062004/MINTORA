import { ethers } from "ethers";
import deployments from "../deployments/polygonAmoy.json";

const MINTORA_MARKETPLACE_ABI = [
  "function listNFT(address nftContract, uint256 tokenId, uint256 price) external returns (uint256)",
  "function buyNFT(uint256 listingId) external payable",
  "function cancelListing(uint256 listingId) external",
  "function updatePrice(uint256 listingId, uint256 newPrice) external",
  "function getActiveListings() external view returns (tuple(address seller, address nftContract, uint256 tokenId, uint256 price, bool active)[])",
  "function listings(uint256 listingId) external view returns (address seller, address nftContract, uint256 tokenId, uint256 price, bool active)",
  "function listingCount() external view returns (uint256)",
  "event Listed(uint256 indexed listingId, address indexed seller, address indexed nftContract, uint256 tokenId, uint256 price)",
  "event Sale(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price)",
];

function getProvider() {
  return new ethers.JsonRpcProvider(process.env.RPC_URL);
}

function getMarketplaceContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(
    deployments.marketplace,
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

