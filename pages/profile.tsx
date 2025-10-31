import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody, CardHeader } from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Table from "@/components/Table";
import Badge from "@/components/Badge";

type Credential = {
  id: string;
  type: string;
  issuer: string;
  issuedAt: string;
  status: "valid" | "revoked" | "pending";
};

const sampleCredentials: Credential[] = [
  { id: "att-001", type: "Age", issuer: "Civic Org", issuedAt: "2025-10-20", status: "valid" },
  { id: "att-002", type: "KYC", issuer: "Acme Bank", issuedAt: "2025-10-18", status: "pending" },
  { id: "att-003", type: "Email", issuer: "Mail Provider", issuedAt: "2025-10-12", status: "valid" },
];

export default function ProfilePage() {
  return (
    <Layout>
      <PageHeader title="Profile" subtitle="Manage your DID, display name, and preferences." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <form className="grid gap-4">
              <Input label="Display Name" placeholder="Satoshi N." />
              <Input label="Primary DID" placeholder="did:example:123..." />
              <Input label="Email (optional)" placeholder="you@example.com" type="email" />
              <div>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div>
              <h3 className="text-base font-semibold text-zinc-900">Security</h3>
              <p className="mt-1 text-sm text-zinc-600">Control sessions and trusted devices.</p>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg border border-zinc-200 p-4">
              <div>
                <div className="text-sm font-medium">Connected Wallet</div>
                <div className="text-sm text-zinc-600">No wallet connected</div>
              </div>
              <Button variant="secondary">Connect</Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Your Credentials" description="All attestations linked to your profile." />
        <CardBody>
          <Table
            columns={[
              { header: "ID", render: (r: Credential) => r.id },
              { header: "Type", render: (r: Credential) => r.type },
              { header: "Issuer", render: (r: Credential) => r.issuer },
              { header: "Issued", render: (r: Credential) => new Date(r.issuedAt).toLocaleDateString() },
              {
                header: "Status",
                render: (r: Credential) => (
                  <Badge tone={r.status === "valid" ? "success" : r.status === "pending" ? "warning" : "danger"}>{r.status}</Badge>
                ),
              },
            ]}
            data={sampleCredentials}
            empty={<div>No credentials yet</div>}
          />
        </CardBody>
      </Card>
    </Layout>
  );
}


