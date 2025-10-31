"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody } from "@/components/Card";
import Button from "@/components/Button";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useCompanyAttestations, useCompanyInfo } from "@/hooks/useContract";
import { formatAddress } from "@/utils/format";
import { useMemo } from "react";

export default function CompanyPage() {
  const { address, isConnected } = useAccount();
  const { data: companyInfo } = useCompanyInfo(address);
  const { data: attestations } = useCompanyAttestations(address);

  const stats = useMemo(() => {
    if (!attestations || !Array.isArray(attestations)) {
      return { total: 0, active: 0, thisMonth: 0 };
    }

    const now = Math.floor(Date.now() / 1000);
    const thisMonthStart = Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000);

    const active = attestations.filter(
      (att: any) => !att.isRevoked && (att.expiresAt === 0n || BigInt(att.expiresAt) > BigInt(now))
    ).length;

    const thisMonth = attestations.filter((att: any) => Number(att.issuedAt) >= thisMonthStart).length;

    return {
      total: attestations.length,
      active,
      thisMonth,
    };
  }, [attestations]);

  if (!isConnected) {
    return (
      <AppLayout>
        <PageHeader title="Company" subtitle="Manage your organization and issue attestations to users." />
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
          Please connect your wallet to view company dashboard
        </div>
      </AppLayout>
    );
  }


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
            <div className="mt-2 text-3xl font-semibold">{stats.thisMonth}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-600">Active Attestations</div>
            <div className="mt-2 text-3xl font-semibold">{stats.active}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-600">Total Attestations</div>
            <div className="mt-2 text-3xl font-semibold">{stats.total}</div>
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
                <div className="text-sm text-zinc-600">Company Address</div>
                <div className="mt-1 text-sm font-mono text-zinc-900">{formatAddress(address)}</div>
              </div>
              {companyInfo && companyInfo.metadata && (
                <div>
                  <div className="text-sm text-zinc-600">Metadata</div>
                  <div className="mt-1 text-base font-medium text-zinc-900">{companyInfo.metadata}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-zinc-600">Status</div>
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {companyInfo?.isActive ? "Active" : "Inactive"}
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

