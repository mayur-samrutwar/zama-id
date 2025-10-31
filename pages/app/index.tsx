import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody } from "@/components/Card";

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

    </AppLayout>
  );
}

