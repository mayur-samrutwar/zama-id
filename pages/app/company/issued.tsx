import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import AttestationCard from "@/components/AttestationCard";

type IssuedAttestation = {
  id: string;
  type: string;
  issuer: string;
  issuedAt: string;
  status: "valid" | "revoked" | "pending";
  recipient: string;
  claimKey?: string;
  claimValue?: string;
};

const issuedData: IssuedAttestation[] = [
  { id: "att-101", type: "Age", issuer: "Acme Corp", issuedAt: "2025-10-20", status: "valid", recipient: "0x1234...5678", claimKey: "age", claimValue: "25" },
  { id: "att-102", type: "KYC", issuer: "Acme Corp", issuedAt: "2025-10-18", status: "valid", recipient: "0xabcd...efgh", claimKey: "verified", claimValue: "true" },
  { id: "att-103", type: "Email", issuer: "Acme Corp", issuedAt: "2025-10-15", status: "valid", recipient: "0x9876...5432", claimKey: "email", claimValue: "user@example.com" },
  { id: "att-104", type: "Age", issuer: "Acme Corp", issuedAt: "2025-10-10", status: "revoked", recipient: "0x1111...2222", claimKey: "age", claimValue: "18" },
];

export default function IssuedAttestationsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Issued Attestations"
        subtitle="All attestations you've issued to users."
      />

      {issuedData.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
          No attestations issued yet
        </div>
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-zinc-600">
              Showing {issuedData.length} attestations
            </div>
            <div className="flex gap-2">
              <select className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900">
                <option>All Status</option>
                <option>Valid</option>
                <option>Pending</option>
                <option>Revoked</option>
              </select>
              <select className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900">
                <option>All Types</option>
                <option>Age</option>
                <option>KYC</option>
                <option>Email</option>
              </select>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {issuedData.map((attestation) => (
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
                <div className="mt-2 text-xs text-zinc-500">
                  To: {attestation.recipient}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

