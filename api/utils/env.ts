import deployments from "../../deployments/polygonAmoy.json";

const DEFAULT_RPC = "https://rpc-amoy.polygon.technology";

const FALLBACK_ADDRESS_MAP: Record<string, string | undefined> = {
  MINTORA_ANCHOR_ADDRESS: deployments?.anchor,
  MINTORA_PASSPORT_ADDRESS: deployments?.passport,
  MINTORA_MARKETPLACE_ADDRESS: deployments?.marketplace,
};

const formatMissing = (keys: string[]) =>
  `Missing required environment variable. Set one of: ${keys.join(", ")}`;

export function requireEnv(keys: string[]): string {
  for (const key of keys) {
    const value = process.env[key as keyof NodeJS.ProcessEnv];
    if (value) {
      return value;
    }
  }
  throw new Error(formatMissing(keys));
}

export function getRpcUrl(): string {
  try {
    return requireEnv([
      "RPC_URL",
      "NEXT_PUBLIC_EVM_RPC",
      "NEXT_PUBLIC_EVM_RPC_URL",
    ]);
  } catch {
    return DEFAULT_RPC;
  }
}

export function getPrivateKey(): string {
  return requireEnv(["PRIVATE_KEY"]);
}

export function getContractAddress(envKey: string): string {
  const candidates = new Set<string>([envKey]);

  if (envKey.endsWith("_ADDRESS")) {
    const shortKey = envKey.replace(/_ADDRESS$/, "");
    candidates.add(shortKey);
    candidates.add(`NEXT_PUBLIC_${shortKey}`);
    candidates.add(`NEXT_PUBLIC_${envKey}`);
  } else {
    candidates.add(`NEXT_PUBLIC_${envKey}`);
  }

  try {
    return requireEnv(Array.from(candidates));
  } catch (error) {
    const normalizedKey = envKey.endsWith("_ADDRESS")
      ? envKey
      : `${envKey}_ADDRESS`;
    const fallback = FALLBACK_ADDRESS_MAP[normalizedKey];
    if (fallback) {
      return fallback;
    }
    throw error;
  }
}


