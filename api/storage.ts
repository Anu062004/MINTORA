import { ethers } from "ethers";

export interface UploadResult {
  cid: string;
  merkleRoot: string;
  size: number;
}

/**
 * Generate Merkle root from file data
 */
export function generateMerkleRoot(data: Buffer | string): string {
  const dataBuffer = typeof data === "string" ? Buffer.from(data) : data;
  
  // Split data into chunks
  const chunkSize = 1024;
  const chunks: string[] = [];
  
  for (let i = 0; i < dataBuffer.length; i += chunkSize) {
    const chunk = dataBuffer.slice(i, i + chunkSize);
    chunks.push(ethers.keccak256(chunk));
  }

  // Build Merkle tree
  if (chunks.length === 0) {
    return ethers.keccak256(dataBuffer);
  }

  while (chunks.length > 1) {
    const newLevel: string[] = [];
    for (let i = 0; i < chunks.length; i += 2) {
      if (i + 1 < chunks.length) {
        const combined = chunks[i] <= chunks[i + 1]
          ? ethers.concat([chunks[i], chunks[i + 1]])
          : ethers.concat([chunks[i + 1], chunks[i]]);
        newLevel.push(ethers.keccak256(combined));
      } else {
        newLevel.push(chunks[i]);
      }
    }
    chunks.length = 0;
    chunks.push(...newLevel);
  }

  return chunks[0];
}

/**
 * Upload to IPFS (using Pinata or similar service)
 * Replace with actual IPFS upload in production
 */
export async function uploadToIPFS(
  data: Buffer | string,
  filename: string
): Promise<UploadResult> {
  const dataBuffer = typeof data === "string" ? Buffer.from(data) : data;
  
  // Generate Merkle root
  const merkleRoot = generateMerkleRoot(dataBuffer);
  
  // In production, upload to Pinata/IPFS
  // For now, generate a mock CID based on content hash
  const contentHash = ethers.keccak256(dataBuffer);
  const cid = `Qm${contentHash.slice(2, 48)}`;

  return {
    cid,
    merkleRoot,
    size: dataBuffer.length,
  };
}

/**
 * Generate Merkle proof for a specific chunk
 */
export function generateMerkleProof(
  data: Buffer | string,
  chunkIndex: number
): string[] {
  const dataBuffer = typeof data === "string" ? Buffer.from(data) : data;
  const chunkSize = 1024;
  const chunks: string[] = [];
  
  for (let i = 0; i < dataBuffer.length; i += chunkSize) {
    const chunk = dataBuffer.slice(i, i + chunkSize);
    chunks.push(ethers.keccak256(chunk));
  }

  if (chunkIndex >= chunks.length) {
    return [];
  }

  const proof: string[] = [];
  let index = chunkIndex;
  let level = [...chunks];

  while (level.length > 1) {
    const siblingIndex = index % 2 === 0 ? index + 1 : index - 1;
    if (siblingIndex < level.length) {
      proof.push(level[siblingIndex]);
    }

    const newLevel: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        const combined = level[i] <= level[i + 1]
          ? ethers.concat([level[i], level[i + 1]])
          : ethers.concat([level[i + 1], level[i]]);
        newLevel.push(ethers.keccak256(combined));
      } else {
        newLevel.push(level[i]);
      }
    }
    level = newLevel;
    index = Math.floor(index / 2);
  }

  return proof;
}


