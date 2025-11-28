const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@solana/rpc-subscriptions/node_modules/ws": path.resolve(
        __dirname,
        "node_modules",
        "ws"
      ),
    "@react-native-async-storage/async-storage": path.resolve(
      __dirname,
      "src",
      "lib",
      "asyncStorageShim.js"
    ),
    "pino-pretty": path.resolve(
      __dirname,
      "src",
      "lib",
      "pinoPrettyStub.js"
    ),
    };
    return config;
  },
};

module.exports = nextConfig;


