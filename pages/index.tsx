import Link from "next/link";
import Layout from "@/components/Layout";
import Card, { CardBody } from "@/components/Card";

export default function Home() {
  return (
    <Layout>
      <section className="grid items-center gap-10 py-10 lg:grid-cols-2">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Decentralized identity and attestations that you own
          </h1>
          <p className="max-w-prose text-lg leading-relaxed text-zinc-600">
            Zama ID lets any entity issue attestations. Users hold them, share them
            selectively, or prove things like age {">"} 18 without revealing everything.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/verify"
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50"
            >
              Verify an Attestation
            </Link>
          </div>
        </div>
        <Card>
          <CardBody className="p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-zinc-200 p-4">
                <div className="text-sm text-zinc-600">Attestations</div>
                <div className="mt-2 text-2xl font-semibold">12</div>
              </div>
              <div className="rounded-lg border border-zinc-200 p-4">
                <div className="text-sm text-zinc-600">Pending Requests</div>
                <div className="mt-2 text-2xl font-semibold">3</div>
              </div>
              <div className="rounded-lg border border-zinc-200 p-4">
                <div className="text-sm text-zinc-600">Issuers</div>
                <div className="mt-2 text-2xl font-semibold">5</div>
              </div>
              <div className="rounded-lg border border-zinc-200 p-4">
                <div className="text-sm text-zinc-600">Proofs Shared</div>
                <div className="mt-2 text-2xl font-semibold">8</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
    </Layout>
  );
}
