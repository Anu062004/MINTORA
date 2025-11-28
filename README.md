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

Use `env.example` as the template for both local development and Vercel. Copy it to `.env` locally and configure the same keys in your Vercel project settings.

```
RPC_URL=https://polygon-amoy.infura.io/v3/7b9e65fcd7384c9d9742714799f14f18
NEXT_PUBLIC_EVM_RPC=https://polygon-amoy.infura.io/v3/7b9e65fcd7384c9d9742714799f14f18
PRIVATE_KEY=<deployer-wallet-key>
MINTORA_ANCHOR_ADDRESS=<deployed-address>
MINTORA_PASSPORT_ADDRESS=<deployed-address>
MINTORA_MARKETPLACE_ADDRESS=<deployed-address>
NEXT_PUBLIC_MINTORA_ANCHOR=<deployed-address>
NEXT_PUBLIC_MINTORA_PASSPORT=<deployed-address>
NEXT_PUBLIC_MINTORA_MARKETPLACE=<deployed-address>
NEXT_PUBLIC_WC_PROJECT_ID=<walletconnect-project-id>
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

## Deploying to Vercel

1. Push this repository to GitHub and import it inside Vercel.
2. In Vercel → Project → Settings → Environment Variables, add every key from `env.example` (addresses should match your deployed contracts).
3. Build command: `npm run build`, Install command: `npm install`, Output: default (`.vercel/output` managed by Next.js).
4. Trigger a deployment; Vercel will run `next build` and serve the app globally, including the `/api/listings` Route Handler.

## Pages

- `/` - Landing page
- `/pipeline` - 5-step verification wizard
- `/mintora-marketplace` - NFT marketplace
- `/mintora-profile` - User dashboard
- `/mintora-verify` - Proof verification

## License

MIT


