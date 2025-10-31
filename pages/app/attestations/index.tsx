import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody } from "@/components/Card";
import Table from "@/components/Table";
import Badge from "@/components/Badge";
import Link from "next/link";

type Attestation = {
  id: string;
  type: string;
  issuer: string;
  issuedAt: string;
  status: "valid" | "revoked" | "pending";
};

const data: Attestation[] = [
  { id: "att-001", type: "Age", issuer: "Civic Org", issuedAt: "2025-10-20", status: "valid" },
  { id: "att-002", type: "KYC", issuer: "Acme Bank", issuedAt: "2025-10-18", status: "pending" },
  { id: "att-003", type: "Email", issuer: "Mail Provider", issuedAt: "2025-10-12", status: "valid" },
];

export default function AttestationsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Attestations"
        subtitle="Browse, filter, and manage your attestations."
        actions={<Link href="/app/attestations/new" className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">New Attestation</Link>}
      />

      <Card>
        <CardBody>
          <Table
            columns={[
              { header: "ID", render: (r: Attestation) => r.id },
              { header: "Type", render: (r: Attestation) => r.type },
              { header: "Issuer", render: (r: Attestation) => r.issuer },
              { header: "Issued", render: (r: Attestation) => new Date(r.issuedAt).toLocaleDateString() },
              {
                header: "Status",
                render: (r: Attestation) => (
                  <Badge tone={r.status === "valid" ? "success" : r.status === "pending" ? "warning" : "danger"}>{r.status}</Badge>
                ),
              },
            ]}
            data={data}
            empty={<div>No attestations yet</div>}
          />
        </CardBody>
      </Card>
    </AppLayout>
  );
}

