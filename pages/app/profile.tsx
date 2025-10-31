import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody } from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function ProfilePage() {
  return (
    <AppLayout>
      <PageHeader title="Profile" subtitle="Manage your DID, display name, and preferences." />

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
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

    </AppLayout>
  );
}

