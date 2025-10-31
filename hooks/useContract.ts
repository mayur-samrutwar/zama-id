"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { DECENTRALIZED_ID_CONFIG } from "@/config/contract";
import { useAccount } from "wagmi";

export function useDecentralizedID() {
  const { address } = useAccount();
  
  return {
    contractAddress: DECENTRALIZED_ID_CONFIG.address,
    contractChainId: DECENTRALIZED_ID_CONFIG.chainId,
    userAddress: address,
  };
}

// Hook for checking if address is a whitelisted company
export function useIsWhitelistedCompany(companyAddress: `0x${string}` | undefined) {
  return useReadContract({
    ...DECENTRALIZED_ID_CONFIG,
    functionName: "isWhitelistedCompany",
    args: companyAddress ? [companyAddress] : undefined,
    query: {
      enabled: !!companyAddress,
    },
  });
}

// Hook for getting user attestations
export function useUserAttestations(userAddress: `0x${string}` | undefined) {
  return useReadContract({
    ...DECENTRALIZED_ID_CONFIG,
    functionName: "getUserAttestations",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });
}

// Hook for getting user pending requests
export function useUserPendingRequests(userAddress: `0x${string}` | undefined) {
  return useReadContract({
    ...DECENTRALIZED_ID_CONFIG,
    functionName: "getUserPendingRequests",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });
}

// Hook for getting all user received requests (with IDs)
export function useUserReceivedRequests(userAddress: `0x${string}` | undefined) {
  return useReadContract({
    ...DECENTRALIZED_ID_CONFIG,
    functionName: "getUserReceivedRequests",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      refetchInterval: 5000,
    },
  });
}

// Hook for getting a single request by ID
export function useRequest(requestId: bigint | undefined) {
  return useReadContract({
    ...DECENTRALIZED_ID_CONFIG,
    functionName: "getRequest",
    args: requestId !== undefined ? [requestId] : undefined,
    query: {
      enabled: requestId !== undefined,
    },
  });
}

// Hook for getting company requests
export function useCompanyRequests(companyAddress: `0x${string}` | undefined) {
  return useReadContract({
    ...DECENTRALIZED_ID_CONFIG,
    functionName: "getCompanyRequests",
    args: companyAddress ? [companyAddress] : undefined,
    query: {
      enabled: !!companyAddress,
      refetchInterval: 5000,
    },
  });
}

// Hook for getting company schemas
export function useCompanySchemas(companyAddress: `0x${string}` | undefined) {
  return useReadContract({
    ...DECENTRALIZED_ID_CONFIG,
    functionName: "getCompanySchemas",
    args: companyAddress ? [companyAddress] : undefined,
    query: {
      enabled: !!companyAddress,
    },
  });
}

// Hook for getting company attestations
export function useCompanyAttestations(companyAddress: `0x${string}` | undefined) {
  return useReadContract({
    ...DECENTRALIZED_ID_CONFIG,
    functionName: "getCompanyAttestations",
    args: companyAddress ? [companyAddress] : undefined,
    query: {
      enabled: !!companyAddress,
    },
  });
}

// Hook for getting company info
export function useCompanyInfo(companyAddress: `0x${string}` | undefined) {
  return useReadContract({
    ...DECENTRALIZED_ID_CONFIG,
    functionName: "getCompanyInfo",
    args: companyAddress ? [companyAddress] : undefined,
    query: {
      enabled: !!companyAddress,
    },
  });
}

// Hook for whitelisting a company (admin only)
export function useAddWhitelistedCompany() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const addCompany = async (companyAddress: `0x${string}`, metadata: string) => {
    writeContract({
      ...DECENTRALIZED_ID_CONFIG,
      functionName: "addWhitelistedCompany",
      args: [companyAddress, metadata],
    });
  };

  return {
    addCompany,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}

// Hook for creating a schema
export function useCreateSchema() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createSchema = async (name: string, description: string, schemaDefinition: string) => {
    writeContract({
      ...DECENTRALIZED_ID_CONFIG,
      functionName: "createSchema",
      args: [name, description, schemaDefinition],
    });
  };

  return {
    createSchema,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}

// Hook for issuing an attestation
export function useIssueAttestation() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const issueAttestation = async (
    recipient: `0x${string}`,
    schemaId: bigint,
    data: string,
    expiresAt: bigint = BigInt(0)
  ) => {
    writeContract({
      ...DECENTRALIZED_ID_CONFIG,
      functionName: "issueAttestation",
      args: [recipient, schemaId, data, expiresAt],
    });
  };

  return {
    issueAttestation,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}

// Hook for creating a request
export function useCreateRequest() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createRequest = async (
    recipient: `0x${string}`,
    purpose: string,
    requestType: 0 | 1, // 0 = Predicate, 1 = Direct
    claimKey: string,
    operator: string,
    value: string
  ) => {
    writeContract({
      ...DECENTRALIZED_ID_CONFIG,
      functionName: "createRequest",
      args: [recipient, purpose, requestType, claimKey, operator, value],
    });
  };

  return {
    createRequest,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}

// Hook for approving a request
export function useApproveRequest() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approveRequest = async (requestId: bigint, responseData: string) => {
    writeContract({
      ...DECENTRALIZED_ID_CONFIG,
      functionName: "approveRequest",
      args: [requestId, responseData],
    });
  };

  return {
    approveRequest,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}

// Hook for rejecting a request
export function useRejectRequest() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const rejectRequest = async (requestId: bigint) => {
    writeContract({
      ...DECENTRALIZED_ID_CONFIG,
      functionName: "rejectRequest",
      args: [requestId],
    });
  };

  return {
    rejectRequest,
    hash,
    isPending,
    isConfirming,
    isSuccess,
  };
}

