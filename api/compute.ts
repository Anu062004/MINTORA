import { ethers } from "ethers";
import { attachAnalysis } from "./mintoraAnchor";

export interface AnalysisResult {
  qualityScore: number;
  plagiarismPercentage: number;
  integrityVerdict: "PASS" | "FAIL" | "REVIEW";
  attestationHash: string;
  summary: string;
}

/**
 * Run AI analysis on research data
 * In production, this would call a TEE-verified AI service
 */
export async function analyzeResearch(
  researchId: number,
  cid: string,
  merkleRoot: string
): Promise<AnalysisResult> {
  // Simulate AI analysis (replace with actual AI service in production)
  const qualityScore = Math.floor(Math.random() * 30) + 70; // 70-100
  const plagiarismPercentage = Math.floor(Math.random() * 15); // 0-15%
  
  let integrityVerdict: "PASS" | "FAIL" | "REVIEW";
  if (qualityScore >= 80 && plagiarismPercentage < 10) {
    integrityVerdict = "PASS";
  } else if (qualityScore < 60 || plagiarismPercentage > 20) {
    integrityVerdict = "FAIL";
  } else {
    integrityVerdict = "REVIEW";
  }

  // Create attestation data
  const attestationData = {
    researchId,
    cid,
    merkleRoot,
    qualityScore,
    plagiarismPercentage,
    integrityVerdict,
    timestamp: Date.now(),
  };

  // Hash the attestation
  const attestationHash = ethers.keccak256(
    ethers.toUtf8Bytes(JSON.stringify(attestationData))
  );

  // Attach analysis to blockchain
  await attachAnalysis(researchId, attestationHash, qualityScore);

  return {
    qualityScore,
    plagiarismPercentage,
    integrityVerdict,
    attestationHash,
    summary: `Research analysis complete. Quality: ${qualityScore}/100, Plagiarism: ${plagiarismPercentage}%, Verdict: ${integrityVerdict}`,
  };
}

/**
 * Generate metadata for iNFT
 */
export function generatePassportMetadata(
  researchId: number,
  cid: string,
  analysis: AnalysisResult,
  researcherAddress: string
): object {
  return {
    name: `Mintora Research Passport #${researchId}`,
    description: "Verified research credential on Mintora Protocol",
    image: `https://api.mintora.io/passport-image/${researchId}`,
    external_url: `https://mintora.io/research/${researchId}`,
    attributes: [
      { trait_type: "Research ID", value: researchId.toString() },
      { trait_type: "IPFS CID", value: cid },
      { trait_type: "Quality Score", value: analysis.qualityScore.toString() },
      { trait_type: "Plagiarism Check", value: `${analysis.plagiarismPercentage}%` },
      { trait_type: "Verification Status", value: analysis.integrityVerdict },
      { trait_type: "Researcher", value: researcherAddress },
      { trait_type: "Platform", value: "Mintora Protocol" },
      { trait_type: "Network", value: "Polygon Amoy" },
    ],
  };
}


