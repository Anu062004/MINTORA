import { ethers } from "ethers";
import { MINTORA_ANCHOR_ABI } from "../src/abis";
import {
  getContractAddress,
  getPrivateKey,
  getRpcUrl,
} from "./utils/env";

const anchorAddress = getContractAddress("MINTORA_ANCHOR_ADDRESS");
const rpcUrl = getRpcUrl();

function getProvider() {
  return new ethers.JsonRpcProvider(rpcUrl);
}

function getWallet() {
  const provider = getProvider();
  const privateKey = getPrivateKey();
  return new ethers.Wallet(privateKey, provider);
}

function getAnchorContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(
    anchorAddress,
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


