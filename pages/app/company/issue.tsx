"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody } from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useMemo, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useCreateSchema, useIssueAttestation, useCompanySchemas } from "@/hooks/useContract";
import { useReadContract } from "wagmi";
import { DECENTRALIZED_ID_CONFIG } from "@/config/contract";

export default function IssueAttestationPage() {
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [walletAddress, setWalletAddress] = useState("");
  const [type, setType] = useState("Age");
  const [issuer, setIssuer] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [claimKey, setClaimKey] = useState("age");
  const [claimValue, setClaimValue] = useState("");
  const [selectedSchemaId, setSelectedSchemaId] = useState<bigint | null>(null);
  const [needsSchema, setNeedsSchema] = useState(false);

  const { data: schemasData } = useCompanySchemas(address);
  const { data: schemaIds } = useReadContract({
    ...DECENTRALIZED_ID_CONFIG,
    functionName: "companySchemas",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  const { createSchema, isPending: isCreatingSchema, isSuccess: schemaCreated } = useCreateSchema();
  const { issueAttestation, isPending: isIssuing, isSuccess: attestationIssued, isConfirming: isConfirmingIssue } = useIssueAttestation();

  // Map schema names to IDs
  const schemaMap = useMemo(() => {
    if (!schemasData || !Array.isArray(schemasData) || !schemaIds || !Array.isArray(schemaIds)) return {};
    const map: Record<string, bigint> = {};
    schemasData.forEach((schema: any, index: number) => {
      if (schemaIds[index]) {
        map[schema.name?.toLowerCase() || ""] = schemaIds[index];
      }
    });
    return map;
  }, [schemasData, schemaIds]);

  const canNext = useMemo(() => {
    if (step === 1) return walletAddress.trim().length > 0 && walletAddress.match(/^0x[a-fA-F0-9]{40}$/);
    if (step === 2) return type.trim().length > 0;
    return claimKey.trim().length > 0 && claimValue.trim().length > 0;
  }, [step, walletAddress, type, claimKey, claimValue]);


  // Handle schema creation
  const handleCreateSchema = () => {
    if (!type || !issuer) return;
    const schemaDefinition = JSON.stringify({ type, claimKey });
    createSchema(type, `Attestation schema for ${type}`, schemaDefinition);
  };

  // Handle attestation issuance
  const handleIssueAttestation = (schemaIdToUse: bigint) => {
    if (!walletAddress || !claimKey || !claimValue) return;
    
    const data = JSON.stringify({ [claimKey]: claimValue });
    const expiresAt = validUntil ? BigInt(Math.floor(new Date(validUntil).getTime() / 1000)) : BigInt(0);
    
    issueAttestation(
      walletAddress as `0x${string}`,
      schemaIdToUse,
      data,
      expiresAt
    );
  };

  // Reset form after success
  useEffect(() => {
    if (attestationIssued) {
      setStep(1);
      setWalletAddress("");
      setType("Age");
      setIssuer("");
      setValidFrom("");
      setValidUntil("");
      setClaimKey("age");
      setClaimValue("");
      setSelectedSchemaId(null);
    }
  }, [attestationIssued]);

  // After schema is created, automatically issue attestation
  useEffect(() => {
    if (schemaCreated && needsSchema && schemaIds && Array.isArray(schemaIds) && schemaIds.length > 0) {
      // Get the latest schema ID (the one we just created)
      const latestSchemaId = schemaIds[schemaIds.length - 1];
      setSelectedSchemaId(latestSchemaId);
      setNeedsSchema(false);
      // Issue attestation with the new schema
      handleIssueAttestation(latestSchemaId);
    }
  }, [schemaCreated, schemaIds, needsSchema]);

  // Update schema selection when type changes
  useEffect(() => {
    if (type && schemaMap[type.toLowerCase()]) {
      setSelectedSchemaId(schemaMap[type.toLowerCase()]);
      setNeedsSchema(false);
    } else if (type) {
      setSelectedSchemaId(null);
      setNeedsSchema(true);
    }
  }, [type, schemaMap]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (needsSchema && !schemaCreated && !isCreatingSchema) {
      // Create schema first - useEffect will auto-issue after
      handleCreateSchema();
      return;
    }
    
    if (selectedSchemaId && !needsSchema && !isCreatingSchema) {
      // Issue attestation directly if schema exists
      handleIssueAttestation(selectedSchemaId);
    }
  };

  if (!isConnected) {
    return (
      <AppLayout>
        <PageHeader title="Issue Attestation" subtitle="Create a new attestation to issue to a user." />
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
          Please connect your wallet to issue attestations
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title="Issue Attestation" subtitle="Create a new attestation to issue to a user." />

      <Card>
        <CardBody>
          <div className="mb-6 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-3">
                <div
                  className={
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium " +
                    (step >= (n as 1 | 2 | 3)
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700")
                  }
                >
                  {n}
                </div>
                <div className="text-sm font-medium text-zinc-800">
                  {n === 1 ? "Wallet" : n === 2 ? "Type" : "Details"}
                </div>
              </div>
            ))}
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="grid gap-4 sm:max-w-lg">
                <Input
                  label="Wallet Address"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs text-zinc-500">Enter the recipient wallet address.</div>
                  <Button type="button" variant="primary" onClick={() => setStep(2)} disabled={!canNext}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 sm:max-w-xl">
                <div className="grid grid-cols-3 gap-3">
                  {["Age", "KYC", "Email"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={
                        "rounded-lg border px-4 py-3 text-sm font-medium transition-colors " +
                        (type === t
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50")
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="button" variant="primary" onClick={() => setStep(3)} disabled={!canNext}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Issuer Name" placeholder="Your org name" value={issuer} onChange={(e) => setIssuer(e.target.value)} required />
                <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                  <Input label="Valid From (optional)" type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
                  <Input label="Valid Until (optional)" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                </div>
                <Input label="Claim Key" value={claimKey} onChange={(e) => setClaimKey(e.target.value)} required />
                <Input label="Claim Value" placeholder={type === "Age" ? "e.g., 21" : type === "Email" ? "e.g., user@x.com" : ""} value={claimValue} onChange={(e) => setClaimValue(e.target.value)} required />
                {needsSchema && !schemaCreated && (
                  <div className="sm:col-span-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      Schema "{type}" doesn't exist. It will be created when you submit.
                    </p>
                  </div>
                )}
                {isCreatingSchema && (
                  <div className="sm:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">Creating schema "{type}"...</p>
                  </div>
                )}
                {schemaCreated && needsSchema && (
                  <div className="sm:col-span-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-800">Schema created! Issuing attestation...</p>
                  </div>
                )}
                {isIssuing && (
                  <div className="sm:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">Issuing attestation...</p>
                  </div>
                )}
                {attestationIssued && (
                  <div className="sm:col-span-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-800">Attestation issued successfully!</p>
                  </div>
                )}
                <div className="sm:col-span-2 mt-2 flex items-center justify-between">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)} disabled={isCreatingSchema || isIssuing || isConfirmingIssue}>
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="success" 
                    disabled={!canNext || isCreatingSchema || isIssuing || isConfirmingIssue || !isConnected}
                  >
                    {isCreatingSchema ? "Creating Schema..." : isIssuing || isConfirmingIssue ? "Issuing..." : needsSchema && !schemaCreated ? "Create Schema & Issue" : "Issue Attestation"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardBody>
      </Card>
    </AppLayout>
  );
}
