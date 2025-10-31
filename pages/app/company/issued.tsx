"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import AttestationCard from "@/components/AttestationCard";
import { useAccount, useReadContract } from "wagmi";
import { useCompanyAttestations, useCompanySchemas } from "@/hooks/useContract";
import { useState, useEffect } from "react";
import { formatAddress } from "@/utils/format";
import { DECENTRALIZED_ID_CONFIG } from "@/config/contract";

type IssuedAttestation = {
  id: string;
  type: string;
  issuer: string;
  issuedAt: string;
  status: "valid" | "revoked" | "pending";
  recipient: string;
  claimKey?: string;
  claimValue?: string;
  schemaId?: bigint;
};

export default function IssuedAttestationsPage() {
  const { address, isConnected } = useAccount();
  const { data: attestationsData, isLoading } = useCompanyAttestations(address);
  const { data: schemasData } = useCompanySchemas(address);
  const { data: schemaIds } = useReadContract({
    ...DECENTRALIZED_ID_CONFIG,
    functionName: "companySchemas",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  const [attestations, setAttestations] = useState<IssuedAttestation[]>([]);
  const [schemas, setSchemas] = useState<Record<string, string>>({});

  // Build schema map - match schema IDs with schema data
  useEffect(() => {
    if (schemasData && Array.isArray(schemasData) && schemaIds && Array.isArray(schemaIds)) {
      const schemaMap: Record<string, string> = {};
      schemaIds.forEach((schemaId: bigint, index: number) => {
        if (schemasData[index]) {
          schemaMap[schemaId.toString()] = schemasData[index].name || "Unknown";
        }
      });
      setSchemas(schemaMap);
    }
  }, [schemasData, schemaIds]);

  // Format attestations
  useEffect(() => {
    if (attestationsData && Array.isArray(attestationsData)) {
      const formatted = attestationsData.map((att: any, index: number) => {
        // att.schemaId is a bigint/number from the contract
        const schemaIdStr = att.schemaId?.toString() || "";
        const schemaName = schemas[schemaIdStr] || `Schema ${schemaIdStr || "Unknown"}`;

        let parsedData: any = {};
        try {
          parsedData = JSON.parse(att.data || "{}");
        } catch {
          parsedData = { raw: att.data };
        }

        const now = Math.floor(Date.now() / 1000);
        const status: "valid" | "revoked" | "pending" = att.isRevoked
          ? "revoked"
          : att.expiresAt && BigInt(att.expiresAt) !== 0n && BigInt(att.expiresAt) < BigInt(now)
          ? "pending"
          : "valid";

        return {
          id: `att-${index}`,
          type: schemaName,
          issuer: formatAddress(att.issuer),
          issuedAt: new Date(Number(att.issuedAt) * 1000).toISOString().split("T")[0],
          status,
          recipient: formatAddress(att.recipient),
          claimKey: Object.keys(parsedData)[0] || "data",
          claimValue: Object.values(parsedData)[0]?.toString() || att.data || "",
          schemaId: att.schemaId,
        };
      });
      setAttestations(formatted);
    } else {
      setAttestations([]);
    }
  }, [attestationsData, schemas]);

  if (!isConnected) {
    return (
      <AppLayout>
        <PageHeader title="Issued Attestations" subtitle="All attestations you've issued to users." />
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
          Please connect your wallet to view issued attestations
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <PageHeader title="Issued Attestations" subtitle="All attestations you've issued to users." />
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
          Loading attestations...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title="Issued Attestations" subtitle="All attestations you've issued to users." />

      {attestations.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
          No attestations issued yet
        </div>
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-zinc-600">Showing {attestations.length} attestations</div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {attestations.map((attestation) => (
              <div key={attestation.id}>
                <AttestationCard
                  id={attestation.id}
                  type={attestation.type}
                  issuer={attestation.issuer}
                  issuedAt={attestation.issuedAt}
                  status={attestation.status}
                  claimKey={attestation.claimKey}
                  claimValue={attestation.claimValue}
                />
                <div className="mt-2 text-xs text-zinc-500">To: {attestation.recipient}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

