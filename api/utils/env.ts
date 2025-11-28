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
  return requireEnv(["RPC_URL", "NEXT_PUBLIC_EVM_RPC", "NEXT_PUBLIC_EVM_RPC_URL"]);
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

  return requireEnv(Array.from(candidates));
}


