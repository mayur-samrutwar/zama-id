import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// @ts-ignore
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1, // Optimize for size
      },
      viaIR: true, // Use IR-based code generation for better optimization
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: [
        {
          privateKey: "f2f187ccd082d3ef031da2d29ef8bc1cf30b4142da1f26191f612ffba0dea9b6",
          balance: "10000000000000000000000", // 10000 ETH
        },
      ],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: ["f2f187ccd082d3ef031da2d29ef8bc1cf30b4142da1f26191f612ffba0dea9b6"],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;

