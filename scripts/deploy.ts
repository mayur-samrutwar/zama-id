import hre from "hardhat";

const { ethers } = hre;

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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

