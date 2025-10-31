"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import AttestationCard from "@/components/AttestationCard";
import { useAccount } from "wagmi";
import { useUserAttestations } from "@/hooks/useContract";
import { useReadContract } from "wagmi";
import { DECENTRALIZED_ID_CONFIG } from "@/config/contract";
import { useState, useEffect } from "react";

type Attestation = {
  id: string;
  type: string;
  issuer: string;
  issuedAt: string;
  status: "valid" | "revoked" | "pending";
  claimKey?: string;
  claimValue?: string;
};

export default function AttestationsPage() {
  const { address, isConnected } = useAccount();
  const { data: attestationsData, isLoading, error } = useUserAttestations(address);

  const [attestations, setAttestations] = useState<Attestation[]>([]);

  useEffect(() => {
    if (attestationsData && Array.isArray(attestationsData)) {
      const formatted = attestationsData.map((att: any, index: number) => {
        // Get schema name for type
        let schemaName = "Unknown";
        if (att.schemaId !== undefined) {
          // You'd need to fetch schema info, for now use schemaId
          schemaName = `Schema ${att.schemaId.toString()}`;
        }

        // Parse data if it's JSON, otherwise use as-is
        let parsedData: any = {};
        try {
          parsedData = JSON.parse(att.data || "{}");
        } catch {
          parsedData = { raw: att.data };
        }

        const status: "valid" | "revoked" | "pending" = att.isRevoked
          ? "revoked"
          : att.expiresAt && BigInt(att.expiresAt) !== BigInt(0) && BigInt(att.expiresAt) < BigInt(Math.floor(Date.now() / 1000))
          ? "pending"
          : "valid";

        return {
          id: `att-${index}`,
          type: schemaName,
          issuer: att.issuer || "Unknown",
          issuedAt: new Date(Number(att.issuedAt) * 1000).toISOString().split("T")[0],
          status,
          claimKey: Object.keys(parsedData)[0] || "data",
          claimValue: Object.values(parsedData)[0]?.toString() || att.data || "",
        };
      });
      setAttestations(formatted);
    } else {
      setAttestations([]);
    }
  }, [attestationsData]);

  if (!isConnected) {
    return (
      <AppLayout>
        <PageHeader title="Attestations" subtitle="Your received attestations and credentials." />
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
          Please connect your wallet to view attestations
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <PageHeader title="Attestations" subtitle="Your received attestations and credentials." />
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
          Loading attestations...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title="Attestations" subtitle="Your received attestations and credentials." />

      {attestations.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
          No attestations yet
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {attestations.map((attestation, index) => (
            <AttestationCard key={attestation.id || index} {...attestation} />
          ))}
        </div>
      )}
    </AppLayout>
  );
}

