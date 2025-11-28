# Mintora Protocol

Decentralized Research Verification & iNFT Marketplace on Polygon Amoy Testnet.

## Features

- **5-Step Verification Pipeline**: Upload → Merkle Root → Anchor → AI Analysis → Mint iNFT
- **Low-Cost Registration**: Register research on-chain for just 0.1 MATIC
- **NFT Marketplace**: Trade verified Research Passports with 2.5% platform fee + 5% royalties
- **On-Chain Verification**: Cryptographic proofs anchored on Polygon Amoy

## Tech Stack

- **Blockchain**: Polygon Amoy Testnet (Chain ID: 80002)
- **Smart Contracts**: Solidity 0.8.20, Hardhat
- **Frontend**: Next.js 14, React, wagmi v2, TailwindCSS
- **Backend**: Node.js, ethers v6

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Add your PRIVATE_KEY and RPC_URL

# Compile contracts
npm run compile

# Deploy to Polygon Amoy
npm run deploy

# Start frontend
npm run dev
```

## Smart Contracts

| Contract | Description |
|----------|-------------|
| MintoraAnchor | Research data registry with Merkle proofs |
| MintoraResearchPassport | ERC-721 iNFT with backend relayer minting |
| MintoraMarketplace | NFT trading with fees & royalties |

## Environment Variables

```
RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_EVM_RPC=https://rpc-amoy.polygon.technology
PRIVATE_KEY=<deployer-wallet-key>
NEXT_PUBLIC_MINTORA_ANCHOR=<deployed-address>
NEXT_PUBLIC_MINTORA_PASSPORT=<deployed-address>
NEXT_PUBLIC_MINTORA_MARKETPLACE=<deployed-address>
```

## Pages

- `/` - Landing page
- `/pipeline` - 5-step verification wizard
- `/mintora-marketplace` - NFT marketplace
- `/mintora-profile` - User dashboard
- `/mintora-verify` - Proof verification

## License

MIT


