import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody } from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function VerifyPage() {
  return (
    <AppLayout>
      <PageHeader title="Verify" subtitle="Request a proof from a user without seeing their raw data." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <h3 className="text-base font-semibold text-zinc-900">Predicate Proof</h3>
            <p className="mt-1 text-sm text-zinc-600">Ask for a true/false proof, e.g. age {">"} 18.</p>
            <form className="mt-4 grid gap-4">
              <Input label="Subject DID" placeholder="did:example:123..." />
              <div className="grid grid-cols-3 gap-3">
                <Input label="Claim Key" placeholder="age" />
                <Input label="Operator" placeholder=">, >=, =" />
                <Input label="Value" placeholder="18" />
              </div>
              <Button type="submit">Request Proof</Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-base font-semibold text-zinc-900">Direct Claim Request</h3>
            <p className="mt-1 text-sm text-zinc-600">Ask the user to share a specific field, e.g. email.</p>
            <form className="mt-4 grid gap-4">
              <Input label="Subject DID" placeholder="did:example:123..." />
              <Input label="Claim Key" placeholder="email" />
              <Button type="submit">Request Access</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}

