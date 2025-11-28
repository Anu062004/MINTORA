import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { ethers } = hre;

async function main() {
  console.log("🚀 Deploying Mintora contracts to Polygon Amoy...\n");

  const signers = await ethers.getSigners();
  if (!signers.length) {
    throw new Error(
      "No deployer account found. Set PRIVATE_KEY in your .env before running hardhat."
    );
  }
  const [deployer] = signers;
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MATIC\n");

  // Deploy MintoraAnchor
  console.log("📦 Deploying MintoraAnchor...");
  const MintoraAnchor = await ethers.getContractFactory("MintoraAnchor");
  const anchor = await MintoraAnchor.deploy();
  await anchor.waitForDeployment();
  const anchorAddress = await anchor.getAddress();
  console.log("✅ MintoraAnchor deployed to:", anchorAddress);

  // Deploy MintoraResearchPassport
  console.log("\n📦 Deploying MintoraResearchPassport...");
  const MintoraResearchPassport = await ethers.getContractFactory("MintoraResearchPassport");
  const passport = await MintoraResearchPassport.deploy();
  await passport.waitForDeployment();
  const passportAddress = await passport.getAddress();
  console.log("✅ MintoraResearchPassport deployed to:", passportAddress);

  // Deploy MintoraMarketplace
  console.log("\n📦 Deploying MintoraMarketplace...");
  const MintoraMarketplace = await ethers.getContractFactory("MintoraMarketplace");
  const marketplace = await MintoraMarketplace.deploy();
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ MintoraMarketplace deployed to:", marketplaceAddress);

  // Save deployment addresses
  const deployments = {
    chainId: 80002,
    network: "polygonAmoy",
    anchor: anchorAddress,
    passport: passportAddress,
    marketplace: marketplaceAddress,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
  };

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, "polygonAmoy.json"),
    JSON.stringify(deployments, null, 2)
  );

  console.log("\n📁 Deployment addresses saved to deployments/polygonAmoy.json");
  console.log("\n🎉 Mintora deployment complete!");
  console.log("\n--- Contract Addresses ---");
  console.log("NEXT_PUBLIC_MINTORA_ANCHOR=" + anchorAddress);
  console.log("NEXT_PUBLIC_MINTORA_PASSPORT=" + passportAddress);
  console.log("NEXT_PUBLIC_MINTORA_MARKETPLACE=" + marketplaceAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

