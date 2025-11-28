import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { ethers } = hre;

async function main() {
  console.log("🌱 Seeding Mintora contracts on Polygon Amoy...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Using seeder account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "MATIC\n"
  );

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const deploymentsPath = path.join(__dirname, "..", "deployments", "polygonAmoy.json");

  if (!fs.existsSync(deploymentsPath)) {
    throw new Error("deployments/polygonAmoy.json not found. Deploy contracts first.");
  }

  const deploymentsRaw = fs.readFileSync(deploymentsPath, "utf-8");
  const deployments = JSON.parse(deploymentsRaw) as {
    anchor: string;
    passport: string;
    marketplace: string;
  };

  console.log("Loaded deployments:", deployments, "\n");

  const anchor = await ethers.getContractAt(
    "MintoraAnchor",
    deployments.anchor,
    deployer
  );
  const passport = await ethers.getContractAt(
    "MintoraResearchPassport",
    deployments.passport,
    deployer
  );
  const marketplace = await ethers.getContractAt(
    "MintoraMarketplace",
    deployments.marketplace,
    deployer
  );

  const seeds = [
    {
      label: "AI Drug Discovery",
      cid: "ipfs://QmResearch1",
      qualityScore: 92,
      priceEth: "1",
    },
    {
      label: "Climate Impact Study",
      cid: "ipfs://QmResearch2",
      qualityScore: 88,
      priceEth: "0.75",
    },
    {
      label: "Genomics Benchmark",
      cid: "ipfs://QmResearch3",
      qualityScore: 95,
      priceEth: "1.5",
    },
  ] as const;

  for (const seed of seeds) {
    console.log(`🔍 Seeding research: ${seed.label}`);

    const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes(seed.label));

    const regTx = await anchor.registerResearch(
      merkleRoot,
      seed.cid,
      deployer.address,
      { value: ethers.parseEther("0.1") } // Pay 0.1 MATIC registration fee
    );
    await regTx.wait();

    const researchId = await anchor.researchCount();
    console.log(`  ➜ Registered researchId = ${researchId.toString()}`);

    const analysisHash = ethers.keccak256(
      ethers.toUtf8Bytes(`${seed.label}-analysis`)
    );

    const analysisTx = await anchor.attachAnalysis(
      researchId,
      analysisHash,
      seed.qualityScore
    );
    await analysisTx.wait();
    console.log("  ➜ Attached analysis & marked verified");

    const tokenUri = `ipfs://metadata/${seed.label.replace(/\s+/g, "-").toLowerCase()}`;
    const mintTx = await passport.mintResearchPassport(
      deployer.address,
      researchId,
      tokenUri
    );
    await mintTx.wait();

    const tokenId = await passport.researchIdToTokenId(researchId);
    console.log(`  ➜ Minted passport tokenId = ${tokenId.toString()}`);

    const approveTx = await passport.approve(deployments.marketplace, tokenId);
    await approveTx.wait();
    console.log("  ➜ Approved marketplace to transfer token");

    const price = ethers.parseEther(seed.priceEth);
    const listTx = await marketplace.listNFT(
      deployments.passport,
      tokenId,
      price
    );
    const receipt = await listTx.wait();

    console.log(
      `  ➜ Listed on marketplace for ${seed.priceEth} MATIC (tx: ${receipt?.hash})\n`
    );
  }

  console.log("✅ Seeding complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


