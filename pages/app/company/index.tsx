import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody } from "@/components/Card";
import Button from "@/components/Button";
import Link from "next/link";

export default function CompanyPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Company"
        subtitle="Manage your organization and issue attestations to users."
        actions={<Link href="/app/company/issue"><Button variant="success">Issue Attestation</Button></Link>}
      />

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-600">Issued This Month</div>
            <div className="mt-2 text-3xl font-semibold">48</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-600">Active Attestations</div>
            <div className="mt-2 text-3xl font-semibold">234</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-600">Whitelisted Users</div>
            <div className="mt-2 text-3xl font-semibold">12</div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/app/company/issue">
                <Button variant="success" className="w-full justify-start">Issue New Attestation</Button>
              </Link>
              <Link href="/app/company/whitelist">
                <Button variant="outline" className="w-full justify-start">Manage Whitelist</Button>
              </Link>
              <Link href="/app/company/issued">
                <Button variant="outline" className="w-full justify-start">View All Issued</Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Company Info</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-zinc-600">Company Name</div>
                <div className="mt-1 text-base font-medium text-zinc-900">Acme Corporation</div>
              </div>
              <div>
                <div className="text-sm text-zinc-600">Issuer DID</div>
                <div className="mt-1 text-sm font-mono text-zinc-900">did:example:org123...</div>
              </div>
              <div>
                <div className="text-sm text-zinc-600">Status</div>
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}

