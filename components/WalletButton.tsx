"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import Button from "./Button";
import { useState } from "react";

export default function WalletButton() {
  const appkit = useAppKit();
  const { address, isConnected } = useAccount();
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await appkit.open();
    } finally {
      setTimeout(() => setBusy(false), 600);
    }
  };

  if (isConnected && address) {
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    return (
      <Button variant="outline" onClick={onClick} disabled={busy}>
        {shortAddress}
      </Button>
    );
  }

  return (
    <Button variant="primary" onClick={onClick} disabled={busy}>
      Connect Wallet
    </Button>
  );
}

