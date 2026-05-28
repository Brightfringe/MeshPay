import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Copy, Download, RefreshCw, ScanLine } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { useAccounts, useTransactions } from "@/hooks/use-app-data";
import { useAppConfig } from "@/context/app-config";
import { formatINR, initials, relativeTime } from "@/lib/format";
import { SignalPulse } from "@/components/mesh/SignalPulse";
import { toast } from "sonner";

export const Route = createFileRoute("/app/receive")({
  head: () => ({
    meta: [
      { title: "Receive · MeshPay" },
      { name: "description", content: "Share your VPA QR to receive UPI payments over the mesh." },
    ],
  }),
  component: ReceivePage,
});

function ReceivePage() {
  const { activeVpa, setActiveVpa } = useAppConfig();
  const { data: accounts } = useAccounts();
  const { data: txns } = useTransactions();

  const [amount, setAmount] = useState("");
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const active = accounts?.find((a) => a.vpa === activeVpa) ?? accounts?.[0];

  useEffect(() => {
    if (!activeVpa && accounts && accounts[0]) setActiveVpa(accounts[0].vpa);
  }, [activeVpa, accounts, setActiveVpa]);

  const upiUri = useMemo(() => {
    if (!active) return "";
    const params = new URLSearchParams({
      pa: active.vpa,
      pn: active.holderName,
      cu: "INR",
    });
    if (amount && parseFloat(amount) > 0) params.set("am", amount);
    return `upi://pay?${params.toString()}`;
  }, [active, amount]);

  useEffect(() => {
    if (!upiUri) return;
    QRCode.toDataURL(upiUri, {
      width: 360,
      margin: 1,
      color: { dark: "#F8FAFC", light: "#0000" },
      errorCorrectionLevel: "H",
    }).then(setQr).catch(() => setQr(null));
  }, [upiUri]);

  const incoming = (txns ?? [])
    .filter((t) => t.receiverVpa === active?.vpa && t.status === "SETTLED")
    .slice(0, 4);

  function copyVpa() {
    if (!active) return;
    navigator.clipboard.writeText(active.vpa).then(() => {
      setCopied(true);
      toast.success("UPI ID copied");
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function downloadQr() {
    if (!qr) return;
    const a = document.createElement("a");
    a.href = qr;
    a.download = `${active?.vpa.replace("@", "-")}-meshpay.png`;
    a.click();
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-6 space-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          Receive · Share your VPA
        </p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          Request a payment
        </h1>
        <p className="text-sm text-muted-foreground">
          Any payer near you can scan this QR, sign offline, and hop the packet through the
          mesh until it settles into your account.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* QR card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass relative overflow-hidden rounded-3xl p-8 shadow-card"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative flex flex-col items-center text-center">
            <div className="flex items-center gap-2">
              <SignalPulse />
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                Mesh listening for incoming
              </p>
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-background/60 p-4 shadow-glow">
              {qr ? (
                <img src={qr} alt="UPI QR" className="h-64 w-64" />
              ) : (
                <div className="grid h-64 w-64 place-items-center">
                  <ScanLine className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="mt-5 font-display text-lg font-semibold">{active?.holderName}</p>
            <button
              onClick={copyVpa}
              className="mt-1 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 font-mono text-xs"
            >
              {active?.vpa}
              {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
            </button>

            <div className="mt-6 w-full max-w-sm">
              <label className="mb-1.5 block text-left">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Request specific amount (optional)
                </span>
              </label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                placeholder="0.00"
                inputMode="decimal"
                className="w-full rounded-xl border border-border bg-card/40 px-4 py-3 text-center font-display text-2xl tabular-nums outline-none focus:border-accent"
              />
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={downloadQr}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Download QR
              </button>
              <select
                value={active?.vpa ?? ""}
                onChange={(e) => setActiveVpa(e.target.value)}
                className="rounded-full border border-border bg-card/40 px-3 py-2 text-xs"
              >
                {accounts?.map((a) => (
                  <option key={a.vpa} value={a.vpa}>{a.vpa}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Incoming feed */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Wallet balance
            </p>
            <p className="mt-2 font-display text-3xl font-semibold tabular-nums">
              {formatINR(active?.balance ?? 0)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Updated on every bridge sync</p>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Recent inbound
              </p>
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            {incoming.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No inbound payments yet. Share your QR to get started.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {incoming.map((tx) => (
                  <motion.li
                    key={tx.id}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-xs font-semibold text-white">
                      {initials(tx.senderVpa.split("@")[0])}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{tx.senderVpa}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {relativeTime(tx.settledAt)} · via {tx.bridgeNodeId}
                      </p>
                    </div>
                    <p className="font-display text-sm font-semibold text-success">
                      +{formatINR(tx.amount)}
                    </p>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
