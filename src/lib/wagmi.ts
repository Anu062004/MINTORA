import { http, createConfig } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import deployments from "../../deployments/polygonAmoy.json";

const rpcUrl =
  process.env.NEXT_PUBLIC_EVM_RPC ||
  "https://polygon-amoy.infura.io/v3/7b9e65fcd7384c9d9742714799f14f18";

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo",
    }),
  ],
  transports: {
    [polygonAmoy.id]: http(rpcUrl),
  },
});

export const CHAIN_ID = 80002;
export const CHAIN_NAME = "Polygon Amoy";

export const CONTRACT_ADDRESSES = {
  anchor:
    process.env.NEXT_PUBLIC_MINTORA_ANCHOR ||
    deployments?.anchor ||
    ("" as `0x${string}`),
  passport:
    process.env.NEXT_PUBLIC_MINTORA_PASSPORT ||
    deployments?.passport ||
    ("" as `0x${string}`),
  marketplace:
    process.env.NEXT_PUBLIC_MINTORA_MARKETPLACE ||
    deployments?.marketplace ||
    ("" as `0x${string}`),
};


