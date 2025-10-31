import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, sepolia, type AppKitNetwork } from "@reown/appkit/networks";
import { defineChain } from "viem";

export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "4cad18d442ade1574341291a8663d69f";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Local Hardhat network (for development)
const hardhatLocal = defineChain({
  id: 1337,
  name: "Hardhat Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
  },
}) as unknown as AppKitNetwork;

export const networks: AppKitNetwork[] = [hardhatLocal, mainnet, sepolia];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;


