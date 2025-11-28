// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MintoraAnchor
 * @dev On-chain registry for research data anchoring with Merkle proofs
 */
contract MintoraAnchor is Ownable, ReentrancyGuard {
    struct Research {
        bytes32 merkleRoot;
        string cid;
        address researcher;
        uint256 timestamp;
        bool verified;
        bytes32 analysisHash;
        uint256 qualityScore;
    }

    mapping(uint256 => Research) public researches;
    mapping(address => uint256[]) public researcherToIds;
    mapping(bytes32 => bool) public usedMerkleRoots;

    uint256 public researchCount;
    uint256 public constant REGISTRATION_FEE = 0.1 ether; // 0.1 MATIC

    event ResearchRegistered(
        uint256 indexed researchId,
        bytes32 merkleRoot,
        string cid,
        address indexed researcher,
        uint256 timestamp
    );

    event AnalysisAttached(
        uint256 indexed researchId,
        bytes32 analysisHash,
        uint256 qualityScore
    );

    event ResearchVerified(uint256 indexed researchId);

    error MerkleRootAlreadyUsed();
    error ResearchNotFound();
    error InvalidMerkleRoot();
    error InvalidCID();
    error InsufficientPayment();

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Register new research with Merkle root and IPFS CID
     * @param merkleRoot The Merkle root of the research data
     * @param cid IPFS Content Identifier
     * @param researcher Address of the researcher
     * @notice Requires 0.1 MATIC payment to register research
     */
    function registerResearch(
        bytes32 merkleRoot,
        string calldata cid,
        address researcher
    ) external payable returns (uint256) {
        if (msg.value < REGISTRATION_FEE) revert InsufficientPayment();
        if (merkleRoot == bytes32(0)) revert InvalidMerkleRoot();
        if (bytes(cid).length == 0) revert InvalidCID();
        if (usedMerkleRoots[merkleRoot]) revert MerkleRootAlreadyUsed();

        usedMerkleRoots[merkleRoot] = true;
        researchCount++;

        researches[researchCount] = Research({
            merkleRoot: merkleRoot,
            cid: cid,
            researcher: researcher,
            timestamp: block.timestamp,
            verified: false,
            analysisHash: bytes32(0),
            qualityScore: 0
        });

        researcherToIds[researcher].push(researchCount);

        emit ResearchRegistered(
            researchCount,
            merkleRoot,
            cid,
            researcher,
            block.timestamp
        );

        return researchCount;
    }

    /**
     * @dev Attach AI analysis results to research
     * @param researchId The research ID
     * @param analysisHash Hash of the analysis attestation
     * @param qualityScore Quality score (0-100)
     */
    function attachAnalysis(
        uint256 researchId,
        bytes32 analysisHash,
        uint256 qualityScore
    ) external onlyOwner {
        if (researches[researchId].timestamp == 0) revert ResearchNotFound();

        researches[researchId].analysisHash = analysisHash;
        researches[researchId].qualityScore = qualityScore;
        researches[researchId].verified = true;

        emit AnalysisAttached(researchId, analysisHash, qualityScore);
        emit ResearchVerified(researchId);
    }

    /**
     * @dev Get research by ID
     */
    function getResearch(uint256 researchId) external view returns (Research memory) {
        if (researches[researchId].timestamp == 0) revert ResearchNotFound();
        return researches[researchId];
    }

    /**
     * @dev Get all research IDs for a researcher
     */
    function getResearcherIds(address researcher) external view returns (uint256[] memory) {
        return researcherToIds[researcher];
    }

    /**
     * @dev Verify Merkle proof for research data
     */
    function verifyMerkleProof(
        uint256 researchId,
        bytes32[] calldata proof,
        bytes32 leaf
    ) external view returns (bool) {
        if (researches[researchId].timestamp == 0) revert ResearchNotFound();
        
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        return computedHash == researches[researchId].merkleRoot;
    }

    /**
     * @dev Withdraw accumulated registration fees
     * @notice Only owner can withdraw funds
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) revert("No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}


