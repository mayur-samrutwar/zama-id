import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import Card, { CardBody } from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useMemo, useState } from "react";

export default function NewAttestationPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [walletAddress, setWalletAddress] = useState("");
  const [type, setType] = useState("Age");
  const [issuer, setIssuer] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [claimKey, setClaimKey] = useState("age");
  const [claimValue, setClaimValue] = useState("");

  const canNext = useMemo(() => {
    if (step === 1) return walletAddress.trim().length > 0;
    if (step === 2) return type.trim().length > 0;
    return true;
  }, [step, walletAddress, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Issued attestation\nWallet: ${walletAddress}\nType: ${type}\nIssuer: ${issuer}\nValid: ${validFrom} -> ${validUntil}\nClaim: ${claimKey} = ${claimValue}`
    );
  };

  return (
    <AppLayout>
      <PageHeader title="Issue Attestation" subtitle="Create a new attestation to issue to a subject." />

      <Card>
        <CardBody>
          <div className="mb-6 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-3">
                <div
                  className={
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium " +
                    (step >= (n as 1 | 2 | 3)
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700")
                  }
                >
                  {n}
                </div>
                <div className="text-sm font-medium text-zinc-800">
                  {n === 1 ? "Wallet" : n === 2 ? "Type" : "Details"}
                </div>
              </div>
            ))}
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="grid gap-4 sm:max-w-lg">
                <Input
                  label="Wallet Address"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs text-zinc-500">Enter the recipient wallet address.</div>
                  <Button type="button" variant="primary" onClick={() => setStep(2)} disabled={!canNext}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 sm:max-w-xl">
                <div className="grid grid-cols-3 gap-3">
                  {["Age", "KYC", "Email"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={
                        "rounded-lg border px-4 py-3 text-sm font-medium transition-colors " +
                        (type === t
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50")
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="button" variant="primary" onClick={() => setStep(3)} disabled={!canNext}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Issuer" placeholder="Your org name" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
                <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                  <Input label="Valid From" type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
                  <Input label="Valid Until" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                </div>
                <Input label="Claim Key" value={claimKey} onChange={(e) => setClaimKey(e.target.value)} />
                <Input label="Claim Value" placeholder={type === "Age" ? "e.g., 21" : type === "Email" ? "e.g., user@x.com" : ""} value={claimValue} onChange={(e) => setClaimValue(e.target.value)} />
                <div className="sm:col-span-2 mt-2 flex items-center justify-between">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit">Issue Attestation</Button>
                </div>
              </div>
            )}
          </form>
        </CardBody>
      </Card>
    </AppLayout>
  );
}

