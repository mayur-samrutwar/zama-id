import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody } from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function NewAttestationPage() {
  return (
    <Layout>
      <PageHeader title="Issue Attestation" subtitle="Create a new attestation to issue to a subject." />

      <Card>
        <CardBody>
          <form className="grid gap-4 sm:grid-cols-2">
            <Input label="Subject DID" placeholder="did:example:123..." className="sm:col-span-2" />
            <Input label="Attestation Type" placeholder="e.g., Age, KYC, Email" />
            <Input label="Issuer" placeholder="Your org name" />
            <Input label="Valid From" type="date" />
            <Input label="Valid Until" type="date" />
            <Input label="Claim Key" placeholder="e.g., age" />
            <Input label="Claim Value" placeholder="e.g., 21" />
            <div className="sm:col-span-2 mt-2">
              <Button type="submit">Issue Attestation</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Layout>
  );
}


