"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody } from "@/components/Card";
import Table from "@/components/Table";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { useAccount } from "wagmi";
import { useUserReceivedRequests, useApproveRequest, useRejectRequest } from "@/hooks/useContract";
import { useState, useEffect } from "react";
import { formatAddress } from "@/utils/format";
import { useReadContract } from "wagmi";
import { DECENTRALIZED_ID_CONFIG } from "@/config/contract";

type Request = {
  id: string;
  requestId: bigint;
  requester: string;
  purpose: string;
  scope: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  requestType: 0 | 1; // 0 = Predicate, 1 = Direct
  claimKey: string;
  operator?: string;
  value?: string;
};

export default function RequestsPage() {
  const { address, isConnected } = useAccount();
  const { data: requestsData, isLoading, refetch } = useUserReceivedRequests(address);
  const { data: requestIds } = useReadContract({
    ...DECENTRALIZED_ID_CONFIG,
    functionName: "getUserReceivedRequestIds",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  const { approveRequest, isPending: isApproving, isSuccess: approveSuccess } = useApproveRequest();
  const { rejectRequest, isPending: isRejecting, isSuccess: rejectSuccess } = useRejectRequest();

  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    if (approveSuccess || rejectSuccess) {
      refetch();
    }
  }, [approveSuccess, rejectSuccess, refetch]);

  useEffect(() => {
    if (requestsData && Array.isArray(requestsData)) {
      const formatted = requestsData.map((req: any, index: number) => {
        const scope =
          req.requestType === 0 // Predicate
            ? `${req.claimKey} ${req.operator} ${req.value}`
            : req.claimKey;

        const status: "pending" | "approved" | "rejected" =
          req.status === 0 ? "pending" : req.status === 1 ? "approved" : "rejected";

        return {
          id: `req-${index}`,
          requestId: requestIds && Array.isArray(requestIds) && requestIds[index] ? requestIds[index] : BigInt(index + 1),
          requester: formatAddress(req.requester),
          purpose: req.purpose || "N/A",
          scope,
          status,
          date: new Date(Number(req.createdAt) * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          requestType: req.requestType,
          claimKey: req.claimKey,
          operator: req.operator,
          value: req.value,
        };
      });
      setRequests(formatted);
    } else {
      setRequests([]);
    }
  }, [requestsData, requestIds]);

  const handleApprove = async (requestId: bigint) => {
    // For predicate requests, response is usually "true" or "false"
    // For direct requests, user would provide the actual value
    // For now, just use "true" as response
    await approveRequest(requestId, "true");
  };

  const handleReject = async (requestId: bigint) => {
    await rejectRequest(requestId);
  };

  if (!isConnected) {
    return (
      <AppLayout>
        <PageHeader title="Requests" subtitle="Approve or deny what others can access or prove about you." />
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
          Please connect your wallet to view requests
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <PageHeader title="Requests" subtitle="Approve or deny what others can access or prove about you." />
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-16 text-sm text-zinc-600">
          Loading requests...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
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
                  <Badge tone={r.status === "approved" ? "success" : r.status === "pending" ? "warning" : "danger"}>
                    {r.status}
                  </Badge>
                ),
              },
              {
                header: "Actions",
                render: (r: Request) =>
                  r.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(r.requestId)}
                        disabled={isApproving || isRejecting}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(r.requestId)}
                        disabled={isApproving || isRejecting}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-zinc-500">—</span>
                  ),
              },
            ]}
            data={requests}
            empty={<div>No requests</div>}
          />
        </CardBody>
      </Card>
    </AppLayout>
  );
}

