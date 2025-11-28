import { ethers } from "ethers";
import deployments from "../deployments/polygonAmoy.json";

const MINTORA_PASSPORT_ABI = [
  "function mintResearchPassport(address to, uint256 researchId, string uri) external returns (uint256)",
  "function updatePassportData(uint256 tokenId, uint256 qualityScore, bool isVerified) external",
  "function getOwnedTokens(address owner) external view returns (uint256[])",
  "function passportData(uint256 tokenId) external view returns (uint256 researchId, uint256 mintTimestamp, uint256 qualityScore, bool isVerified)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function balanceOf(address owner) external view returns (uint256)",
  "event PassportMinted(uint256 indexed tokenId, address indexed owner, uint256 indexed researchId, string tokenURI)",
];

function getProvider() {
  return new ethers.JsonRpcProvider(process.env.RPC_URL);
}

function getWallet() {
  const provider = getProvider();
  return new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
}

function getPassportContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(
    deployments.passport,
    MINTORA_PASSPORT_ABI,
    signerOrProvider || getProvider()
  );
}

/**
 * Gasless mint - Backend pays gas, user receives NFT
 */
export async function mintResearchPassport(
  userAddress: string,
  researchId: number,
  tokenURI: string
): Promise<{ tokenId: number; txHash: string }> {
  const wallet = getWallet();
  const contract = getPassportContract(wallet);

  // Backend wallet pays gas
  const tx = await contract.mintResearchPassport(userAddress, researchId, tokenURI, {
    gasLimit: 500000,
  });
  
  const receipt = await tx.wait();

  const event = receipt.logs.find(
    (log: any) => log.fragment?.name === "PassportMinted"
  );
  const tokenId = event ? Number(event.args[0]) : 0;

  return {
    tokenId,
    txHash: receipt.hash,
  };
}

/**
 * Update passport verification data
 */
export async function updatePassportData(
  tokenId: number,
  qualityScore: number,
  isVerified: boolean
): Promise<string> {
  const wallet = getWallet();
  const contract = getPassportContract(wallet);

  const tx = await contract.updatePassportData(tokenId, qualityScore, isVerified);
  const receipt = await tx.wait();

  return receipt.hash;
}

/**
 * Get all tokens owned by an address
 */
export async function getOwnedTokens(address: string): Promise<number[]> {
  const contract = getPassportContract();
  const tokens = await contract.getOwnedTokens(address);
  return tokens.map((id: bigint) => Number(id));
}

/**
 * Get passport data for a token
 */
export async function getPassportData(tokenId: number) {
  const contract = getPassportContract();
  const data = await contract.passportData(tokenId);
  return {
    researchId: Number(data.researchId),
    mintTimestamp: Number(data.mintTimestamp),
    qualityScore: Number(data.qualityScore),
    isVerified: data.isVerified,
  };
}

/**
 * Get token URI
 */
export async function getTokenURI(tokenId: number): Promise<string> {
  const contract = getPassportContract();
  return await contract.tokenURI(tokenId);
}

/**
 * Get token owner
 */
export async function getTokenOwner(tokenId: number): Promise<string> {
  const contract = getPassportContract();
  return await contract.ownerOf(tokenId);
}


