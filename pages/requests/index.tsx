import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody } from "@/components/Card";
import Table from "@/components/Table";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

type Request = {
  id: string;
  requester: string;
  purpose: string;
  scope: string;
  status: "pending" | "approved" | "denied";
  date: string;
};

const items: Request[] = [
  { id: "req-101", requester: "DApp A", purpose: "Access email", scope: "email", status: "pending", date: "Oct 21" },
  { id: "req-102", requester: "Marketplace", purpose: "Age verification", scope: "age > 18", status: "approved", date: "Oct 18" },
  { id: "req-103", requester: "Fintech", purpose: "KYC check", scope: "KYC", status: "denied", date: "Oct 12" },
];

export default function RequestsPage() {
  return (
    <Layout>
      <PageHeader title="Requests" subtitle="Approve or deny what others can access or prove about you." />

      <Card>
        <CardBody>
          <Table
            columns={[
              { header: "Request", render: (r: Request) => r.id },
              { header: "From", render: (r: Request) => r.requester },
              { header: "Purpose", render: (r: Request) => r.purpose },
              { header: "Scope", render: (r: Request) => r.scope },
              { header: "Date", render: (r: Request) => r.date },
              {
                header: "Status",
                render: (r: Request) => (
                  <Badge tone={r.status === "approved" ? "success" : r.status === "pending" ? "warning" : "danger"}>{r.status}</Badge>
                ),
              },
              {
                header: "Actions",
                render: (r: Request) => (
                  <div className="flex gap-2">
                    <Button variant="secondary">Approve</Button>
                    <Button variant="ghost">Deny</Button>
                  </div>
                ),
              },
            ]}
            data={items}
            empty={<div>No requests</div>}
          />
        </CardBody>
      </Card>
    </Layout>
  );
}


