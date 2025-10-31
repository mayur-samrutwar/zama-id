import Badge from "./Badge";
import Card, { CardBody } from "./Card";

type AttestationCardProps = {
  id: string;
  type: string;
  issuer: string;
  issuedAt: string;
  status: "valid" | "revoked" | "pending";
  claimKey?: string;
  claimValue?: string;
};

export default function AttestationCard({ id, type, issuer, issuedAt, status, claimKey, claimValue }: AttestationCardProps) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "age":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "kyc":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "email":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardBody>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg border-2 flex items-center justify-center font-semibold text-sm ${getTypeColor(type)}`}>
              {type.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 text-base">{type}</h3>
              <p className="text-sm text-zinc-600 mt-0.5">{issuer}</p>
            </div>
          </div>
          <Badge tone={status === "valid" ? "success" : status === "pending" ? "warning" : "danger"}>{status}</Badge>
        </div>

        {(claimKey || claimValue) && (
          <div className="mt-4 pt-4 border-t border-zinc-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500 font-medium">{claimKey}:</span>
              <span className="text-zinc-900 font-medium">{claimValue || "—"}</span>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-zinc-200 flex items-center justify-between">
          <div className="text-xs text-zinc-500">Issued {new Date(issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
          <div className="text-xs text-zinc-400 font-mono">{id}</div>
        </div>
      </CardBody>
    </Card>
  );
}

