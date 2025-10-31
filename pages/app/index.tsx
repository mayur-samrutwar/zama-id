import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody, CardHeader } from "@/components/Card";
import Table from "@/components/Table";
import Badge from "@/components/Badge";

type Row = { id: string; type: string; issuer: string; status: string; date: string };

const recent: Row[] = [
  { id: "att-001", type: "Age", issuer: "Civic Org", status: "valid", date: "Oct 20, 2025" },
  { id: "att-002", type: "KYC", issuer: "Acme Bank", status: "pending", date: "Oct 18, 2025" },
  { id: "att-003", type: "Email", issuer: "Mail Provider", status: "valid", date: "Oct 12, 2025" },
];

export default function AppDashboard() {
  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Your identity at a glance. Manage attestations and handle requests."
        actions={<Link href="/app/attestations/new" className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">Issue Attestation</Link>}
      />

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-600">Total Attestations</div>
            <div className="mt-2 text-3xl font-semibold">12</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-600">Pending Requests</div>
            <div className="mt-2 text-3xl font-semibold">3</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-600">Trusted Issuers</div>
            <div className="mt-2 text-3xl font-semibold">5</div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent Attestations" description="A quick view of your latest updates." />
        <CardBody>
          <Table
            columns={[
              { header: "Attestation", render: (r: Row) => r.id },
              { header: "Type", render: (r: Row) => r.type },
              { header: "Issuer", render: (r: Row) => r.issuer },
              {
                header: "Status",
                render: (r: Row) => (
                  <Badge tone={r.status === "valid" ? "success" : "warning"}>{r.status}</Badge>
                ),
              },
              { header: "Date", render: (r: Row) => r.date, className: "text-right" },
            ]}
            data={recent}
            empty={<div>No recent attestations</div>}
          />
        </CardBody>
      </Card>
    </AppLayout>
  );
}

