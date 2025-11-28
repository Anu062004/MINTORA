import { http, createConfig } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const rpcUrl = process.env.NEXT_PUBLIC_EVM_RPC || "https://rpc-amoy.polygon.technology";

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
  anchor: process.env.NEXT_PUBLIC_MINTORA_ANCHOR || "",
  passport: process.env.NEXT_PUBLIC_MINTORA_PASSPORT || "",
  marketplace: process.env.NEXT_PUBLIC_MINTORA_MARKETPLACE || "",
};


