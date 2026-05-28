import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2, Lock, Radio, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccounts, useMeshState, useSendPayment } from "@/hooks/use-app-data";
import { useAppConfig } from "@/context/app-config";
import { formatINR, shortHash, deviceLabel, isBridge } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/send")({
  head: () => ({
    meta: [
      { title: "Send · MeshPay" },
      { name: "description", content: "Sign and inject an encrypted UPI payment packet into the offline mesh." },
    ],
  }),
  component: SendPage,
});

const VPA_RE = /^[a-z0-9._-]{2,}@[a-z][a-z0-9.-]{1,}$/i;

function SendPage() {
  const { activeVpa, setActiveVpa } = useAppConfig();
  const { data: accounts } = useAccounts();
  const { data: mesh } = useMeshState();
  const send = useSendPayment();

  const [receiverVpa, setReceiverVpa] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [ttl, setTtl] = useState(5);
  const [note, setNote] = useState("");
  const [startDevice, setStartDevice] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<null | {
    packetId: string;
    ciphertextPreview: string;
    ttl: number;
    injectedAt: string;
  }>(null);

  useEffect(() => {
    if (!activeVpa && accounts && accounts[0]) setActiveVpa(accounts[0].vpa);
  }, [activeVpa, accounts, setActiveVpa]);
  useEffect(() => {
    if (!startDevice && mesh) setStartDevice(mesh.devices[0]?.deviceId ?? "");
  }, [startDevice, mesh]);

  const sender = accounts?.find((a) => a.vpa === activeVpa);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!activeVpa) e.sender = "Pick a sender account";
    if (!VPA_RE.test(receiverVpa)) e.receiver = "Must look like name@bank";
    if (receiverVpa === activeVpa) e.receiver = "Receiver and sender are the same";
    const n = parseFloat(amount);
    if (!Number.isFinite(n) || n <= 0) e.amount = "Enter an amount above ₹0";
    if (sender && n > sender.balance) e.amount = `Exceeds balance ${formatINR(sender.balance)}`;
    if (!/^\d{4,6}$/.test(pin)) e.pin = "PIN must be 4–6 digits";
    if (!(ttl >= 1 && ttl <= 10)) e.ttl = "TTL must be 1–10";
    if (!startDevice) e.startDevice = "Pick an injection device";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate() || !activeVpa) return;
    try {
      const res = await send.mutateAsync({
        senderVpa: activeVpa,
        receiverVpa,
        amount: parseFloat(amount),
        pin,
        ttl,
        startDevice,
      });
      setConfirm(res);
      toast.success("Packet injected into the mesh", {
        description: `Will hop ${ttl} times before TTL expires.`,
      });
    } catch (err) {
      toast.error("Could not inject packet", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  function resetForm() {
    setAmount("");
    setPin("");
    setNote("");
    setConfirm(null);
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-6 space-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          Sign offline · Inject to mesh
        </p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Send a payment</h1>
        <p className="text-sm text-muted-foreground">
          MeshPay seals your payment with AES-256-GCM, wraps the key with RSA-2048, and drops
          the packet into a nearby device. It will travel up to {ttl} hops until a bridge node
          settles it.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="glass space-y-5 rounded-2xl p-6 shadow-card sm:p-8"
        >
          <Field label="From account" error={errors.sender}>
            <select
              value={activeVpa ?? ""}
              onChange={(e) => setActiveVpa(e.target.value)}
              className="input"
            >
              {accounts?.map((a) => (
                <option key={a.vpa} value={a.vpa}>
                  {a.holderName} · {a.vpa} ({formatINR(a.balance)})
                </option>
              ))}
            </select>
          </Field>

          <Field label="To (UPI ID)" error={errors.receiver}>
            <input
              value={receiverVpa}
              onChange={(e) => setReceiverVpa(e.target.value.toLowerCase())}
              placeholder="bob@meshpay"
              className="input font-mono"
              autoComplete="off"
              list="vpa-suggestions"
            />
            <datalist id="vpa-suggestions">
              {accounts?.filter((a) => a.vpa !== activeVpa).map((a) => (
                <option key={a.vpa} value={a.vpa}>{a.holderName}</option>
              ))}
            </datalist>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Amount (INR)" error={errors.amount}>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                placeholder="0.00"
                className="input font-display text-2xl tabular-nums"
                inputMode="decimal"
              />
            </Field>
            <Field label="UPI PIN" error={errors.pin}>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••"
                type="password"
                className="input font-mono tracking-[0.5em]"
                inputMode="numeric"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="TTL (max hops)" error={errors.ttl}>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={ttl}
                  onChange={(e) => setTtl(parseInt(e.target.value, 10))}
                  className="flex-1 accent-[oklch(0.63_0.22_296)]"
                />
                <span className="w-10 text-right font-mono text-sm">{ttl}</span>
              </div>
            </Field>
            <Field label="Inject at device" error={errors.startDevice}>
              <select
                value={startDevice}
                onChange={(e) => setStartDevice(e.target.value)}
                className="input"
              >
                {mesh?.devices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {deviceLabel(d.deviceId)} {d.hasInternet ? "· online" : "· offline"}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Note (local only)">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Coffee at Bazaar Cafe"
              className="input"
              maxLength={120}
            />
          </Field>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-accent" />
              End-to-end encrypted before leaving this device
            </div>
            <button
              type="submit"
              disabled={send.isPending}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {send.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              )}
              {send.isPending ? "Signing & injecting…" : "Sign & inject packet"}
            </button>
          </div>
        </form>

        {/* Nearby devices */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Nearby mesh devices
            </p>
            <ul className="mt-3 space-y-2">
              {mesh?.devices.map((d) => {
                const selected = d.deviceId === startDevice;
                return (
                  <li key={d.deviceId}>
                    <button
                      type="button"
                      onClick={() => setStartDevice(d.deviceId)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                        selected
                          ? "border-accent/60 bg-accent/10"
                          : "border-border bg-card/40 hover:border-accent/30",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-lg",
                          isBridge(d.deviceId) ? "bg-gradient-primary text-white" : "bg-card",
                        )}
                      >
                        <Radio className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium capitalize">
                          {deviceLabel(d.deviceId)}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {d.packetCount} held · {d.hasInternet ? "online" : "offline"}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          d.hasInternet ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.7)]" : "bg-muted-foreground/40",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" />
              <p className="font-display text-sm font-semibold">How this packet travels</p>
            </div>
            <ol className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>1. Signed locally with your PIN hash</li>
              <li>2. AES-256-GCM encrypts payload, RSA-OAEP wraps key</li>
              <li>3. Gossips through nearby devices up to {ttl} hops</li>
              <li>4. First online bridge POSTs to /api/bridge/ingest</li>
              <li>5. Backend dedup’s by SHA-256 hash, settles atomically</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Success modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong m-4 w-full max-w-md rounded-3xl p-8 text-center shadow-card"
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success shadow-[0_0_30px_rgba(34,197,94,0.3)]"
              >
                <CheckCircle2 className="h-8 w-8" />
              </motion.div>
              <h2 className="mt-5 font-display text-xl font-semibold">Packet on the wire</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Injected at <span className="font-mono">{confirm.injectedAt}</span> · TTL {confirm.ttl}
              </p>
              <div className="mt-5 rounded-2xl border border-border bg-card/40 p-4 text-left">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Packet ID
                </p>
                <p className="mt-1 break-all font-mono text-xs">{shortHash(confirm.packetId, 12)}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Ciphertext preview
                </p>
                <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
                  {confirm.ciphertextPreview.slice(0, 96)}…
                </p>
              </div>
              <button
                onClick={resetForm}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow"
              >
                Send another
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {error && <span className="text-[11px] text-destructive">{error}</span>}
      </div>
      <div
        className={cn(
          "[&_.input]:w-full [&_.input]:rounded-xl [&_.input]:border [&_.input]:border-border [&_.input]:bg-card/40 [&_.input]:px-4 [&_.input]:py-3 [&_.input]:text-sm [&_.input]:outline-none [&_.input]:transition-colors focus-within:[&_.input]:border-accent",
        )}
      >
        {children}
      </div>
    </label>
  );
}
