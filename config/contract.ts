import contractInfo from "./contract.json";
import contractABI from "./contract-abi.json";

export const CONTRACT_ADDRESS = contractInfo.address as `0x${string}`;
export const CONTRACT_CHAIN_ID = Number(contractInfo.chainId);
export const CONTRACT_ABI = contractABI as any[];

export const DECENTRALIZED_ID_CONFIG = {
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  chainId: CONTRACT_CHAIN_ID,
};

