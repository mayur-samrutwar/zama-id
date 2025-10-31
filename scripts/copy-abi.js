const fs = require("fs");
const path = require("path");

// Copy ABI from artifacts to config directory
const artifactPath = path.join(__dirname, "../artifacts/contracts/DecentralizedID.sol/DecentralizedID.json");
const abiPath = path.join(__dirname, "../config/contract-abi.json");

try {
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
  console.log("ABI copied to config/contract-abi.json");
} catch (error) {
  console.error("Error copying ABI:", error);
  process.exit(1);
}

