import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { WagmiProvider, type Config } from "wagmi";
import { wagmiAdapter, projectId, networks } from "@/config";

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

const metadata = {
  name: "Zama ID",
  description: "Decentralized identity and attestation platform",
  url: "https://zama.id",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks,
  defaultNetwork: networks[0], // Use hardhat local as default
  metadata,
  features: {
    analytics: true,
  },
});

function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;


