const hre = require("hardhat");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const DecentralizedID = await ethers.getContractFactory("DecentralizedID");
  const decentralizedID = await DecentralizedID.deploy();

  await decentralizedID.waitForDeployment();

  const address = await decentralizedID.getAddress();
  console.log("DecentralizedID deployed to:", address);
  console.log("Admin:", await decentralizedID.admin());

  // Save deployment info to a JSON file
  const deploymentInfo = {
    address: address,
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    admin: await decentralizedID.admin(),
    deployedAt: new Date().toISOString(),
  };

  const configPath = path.join(__dirname, "../config/contract.json");
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("Deployment info saved to:", configPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

