import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import AttestationCard from "@/components/AttestationCard";
import Button from "@/components/Button";
import Link from "next/link";

type Attestation = {
  id: string;
  type: string;
  issuer: string;
  issuedAt: string;
  status: "valid" | "revoked" | "pending";
  claimKey?: string;
  claimValue?: string;
};

const data: Attestation[] = [
  { id: "att-001", type: "Age", issuer: "Civic Org", issuedAt: "2025-10-20", status: "valid", claimKey: "age", claimValue: "25" },
  { id: "att-002", type: "KYC", issuer: "Acme Bank", issuedAt: "2025-10-18", status: "pending", claimKey: "verified", claimValue: "true" },
  { id: "att-003", type: "Email", issuer: "Mail Provider", issuedAt: "2025-10-12", status: "valid", claimKey: "email", claimValue: "user@example.com" },
];

export default function AttestationsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Attestations"
        subtitle="Your received attestations and credentials."
      />

      {data.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
          No attestations yet
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((attestation) => (
            <AttestationCard key={attestation.id} {...attestation} />
          ))}
        </div>
      )}
    </AppLayout>
  );
}

