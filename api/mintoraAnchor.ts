import { ethers } from "ethers";
import deployments from "../deployments/polygonAmoy.json";

const MINTORA_ANCHOR_ABI = [
  "function registerResearch(bytes32 merkleRoot, string cid, address researcher) external returns (uint256)",
  "function attachAnalysis(uint256 researchId, bytes32 analysisHash, uint256 qualityScore) external",
  "function getResearch(uint256 researchId) external view returns (tuple(bytes32 merkleRoot, string cid, address researcher, uint256 timestamp, bool verified, bytes32 analysisHash, uint256 qualityScore))",
  "function getResearcherIds(address researcher) external view returns (uint256[])",
  "function verifyMerkleProof(uint256 researchId, bytes32[] proof, bytes32 leaf) external view returns (bool)",
  "function researchCount() external view returns (uint256)",
  "event ResearchRegistered(uint256 indexed researchId, bytes32 merkleRoot, string cid, address indexed researcher, uint256 timestamp)",
  "event AnalysisAttached(uint256 indexed researchId, bytes32 analysisHash, uint256 qualityScore)",
];

function getProvider() {
  return new ethers.JsonRpcProvider(process.env.RPC_URL);
}

function getWallet() {
  const provider = getProvider();
  return new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
}

function getAnchorContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(
    deployments.anchor,
    MINTORA_ANCHOR_ABI,
    signerOrProvider || getProvider()
  );
}

/**
 * Register research on-chain
 */
export async function registerResearch(
  merkleRoot: string,
  cid: string,
  researcherAddress: string
): Promise<{ researchId: number; txHash: string }> {
  const wallet = getWallet();
  const contract = getAnchorContract(wallet);

  const tx = await contract.registerResearch(merkleRoot, cid, researcherAddress);
  const receipt = await tx.wait();

  const event = receipt.logs.find(
    (log: any) => log.fragment?.name === "ResearchRegistered"
  );
  const researchId = event ? Number(event.args[0]) : 0;

  return {
    researchId,
    txHash: receipt.hash,
  };
}

/**
 * Attach AI analysis to research
 */
export async function attachAnalysis(
  researchId: number,
  analysisHash: string,
  qualityScore: number
): Promise<string> {
  const wallet = getWallet();
  const contract = getAnchorContract(wallet);

  const tx = await contract.attachAnalysis(researchId, analysisHash, qualityScore);
  const receipt = await tx.wait();

  return receipt.hash;
}

/**
 * Get research by ID
 */
export async function getResearch(researchId: number) {
  const contract = getAnchorContract();
  return await contract.getResearch(researchId);
}

/**
 * Get all research IDs for a researcher
 */
export async function getResearcherIds(address: string): Promise<number[]> {
  const contract = getAnchorContract();
  const ids = await contract.getResearcherIds(address);
  return ids.map((id: bigint) => Number(id));
}

/**
 * Verify Merkle proof
 */
export async function verifyMerkleProof(
  researchId: number,
  proof: string[],
  leaf: string
): Promise<boolean> {
  const contract = getAnchorContract();
  return await contract.verifyMerkleProof(researchId, proof, leaf);
}

/**
 * Get total research count
 */
export async function getResearchCount(): Promise<number> {
  const contract = getAnchorContract();
  return Number(await contract.researchCount());
}


