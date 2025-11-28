export const MINTORA_ANCHOR_ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
      { internalType: "string", name: "cid", type: "string" },
      { internalType: "address", name: "researcher", type: "address" },
    ],
    name: "registerResearch",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export const MINTORA_MARKETPLACE_ABI = [
  {
    inputs: [],
    name: "listingCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "listings",
    outputs: [
      { internalType: "address", name: "seller", type: "address" },
      { internalType: "address", name: "nftContract", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "listingId", type: "uint256" }],
    name: "buyNFT",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export const MINTORA_PASSPORT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "passportData",
    outputs: [
      { internalType: "uint256", name: "researchId", type: "uint256" },
      { internalType: "uint256", name: "mintTimestamp", type: "uint256" },
      { internalType: "uint256", name: "qualityScore", type: "uint256" },
      { internalType: "bool", name: "isVerified", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;


