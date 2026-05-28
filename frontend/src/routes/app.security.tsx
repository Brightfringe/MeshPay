import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Database, Fingerprint, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { useMeshState, useServerKey } from "@/hooks/use-app-data";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/app/security")({
  head: () => ({
    meta: [
      { title: "Security · MeshPay" },
      { name: "description", content: "Hybrid encryption, idempotency, and ledger integrity for MeshPay." },
    ],
  }),
  component: SecurityPage,
});

function SecurityPage() {
  const { data: key, isLoading } = useServerKey();
  const { data: mesh } = useMeshState();
  const fingerprint = key?.publicKey ? key.publicKey.slice(0, 8) + "…" + key.publicKey.slice(-8) : "";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <header className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Security model</p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">How MeshPay stays safe offline</h1>
        <p className="text-sm text-muted-foreground">
          Relays only carry ciphertext. Settlement is exactly-once. The ledger never loses an update.
        </p>
      </header>

      <div className="glass rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-white">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-base font-semibold">Server public key</p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {isLoading ? <Skeleton className="inline-block h-3 w-40" /> : key?.algorithm}
            </p>
          </div>
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Fingerprint</p>
        <p className="mt-1 font-mono text-sm">{fingerprint || "—"}</p>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Public key (base64)</p>
        <pre className="mt-1 max-h-48 overflow-auto rounded-xl border border-border bg-background/60 p-4 font-mono text-[11px] text-muted-foreground">
{key?.publicKey ?? "Loading…"}
        </pre>
        <p className="mt-4 text-sm text-muted-foreground">{key?.hybridScheme}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          icon={Lock}
          title="Hybrid encryption"
          body="Each packet generates a fresh AES-256-GCM session key. RSA-OAEP-SHA256 wraps it with the server's public key. Relays only see ciphertext + auth tag — never the payload."
        />
        <Card
          icon={Fingerprint}
          title="Packet-hash idempotency"
          body="The SHA-256 hash of the ciphertext is the dedup key. Bridge duplicate storms collapse to a single settlement — enforced by a unique DB index, not just an in-memory cache."
        />
        <Card
          icon={Cpu}
          title="Optimistic locking"
          body="Accounts carry a @Version column. Concurrent transfers race safely; the loser retries instead of overwriting."
        />
        <Card
          icon={ShieldCheck}
          title="Atomic settlement"
          body="Debit + credit + transaction insert happen in one transaction. Any failure rolls everything back."
        />
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <Database className="h-4 w-4 text-accent" />
          <p className="font-display text-sm font-semibold">Idempotency cache</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          The backend keeps a fast-path cache of packet hashes already settled. Current size:{" "}
          <span className="font-mono text-foreground">{mesh?.idempotencyCacheSize ?? 0}</span> entries.
        </p>
      </div>

      <div className="glass rounded-2xl p-5 text-xs text-muted-foreground">
        <p className="font-mono uppercase tracking-widest">Production endpoint</p>
        <p className="mt-1">
          Real bridge devices POST encrypted <span className="font-mono text-foreground">MeshPacket</span> JSON to{" "}
          <span className="font-mono text-foreground">POST /api/bridge/ingest</span> with{" "}
          <span className="font-mono text-foreground">X-Bridge-Node-Id</span> and{" "}
          <span className="font-mono text-foreground">X-Hop-Count</span> headers. This console doesn't fake bridge traffic — use the Mesh page's bridge sync button to drive it.
        </p>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, body }: { icon: typeof Lock; title: string; body: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-card">
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <p className="mt-3 font-display text-base font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
