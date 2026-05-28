import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, Send, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MeshGraph, DeviceCard } from "@/components/mesh/MeshGraph";
import { useFlush, useGossip, useMeshState, useReset } from "@/hooks/use-app-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/mesh")({
  head: () => ({
    meta: [
      { title: "Mesh · MeshPay" },
      { name: "description", content: "Live visualization of the offline mesh — devices, held packets, bridge sync." },
    ],
  }),
  component: MeshPage,
});

function MeshPage() {
  const { data } = useMeshState();
  const gossip = useGossip();
  const flush = useFlush();
  const reset = useReset();
  const [lastFlush, setLastFlush] = useState<{ settled: number; dups: number } | null>(null);

  async function onGossip() {
    const res = await gossip.mutateAsync();
    toast.success(`Gossip round — ${res.transfers.length} transfer${res.transfers.length === 1 ? "" : "s"}`);
  }
  async function onFlush() {
    const res = await flush.mutateAsync();
    const settled = res.results.filter((r) => r.outcome === "SETTLED").length;
    const dups = res.results.filter((r) => r.outcome === "DUPLICATE").length;
    setLastFlush({ settled, dups });
    toast.success(`Bridge sync · ${settled} settled · ${dups} dedup'd`);
  }
  async function onReset() {
    await reset.mutateAsync();
    setLastFlush(null);
    toast("Mesh and idempotency cache cleared");
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Network</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Mesh visualization</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Each node is a device. Lines mean shared packets. Pulsing rings mean the device has internet.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Action onClick={onGossip} pending={gossip.isPending} icon={Send} label="Gossip once" />
          <Action onClick={onFlush} pending={flush.isPending} icon={Zap} label="Bridge sync" primary />
          <Action onClick={onReset} pending={reset.isPending} icon={RefreshCw} label="Reset mesh" />
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-4 shadow-card sm:p-6"
      >
        <MeshGraph state={data} height={460} />
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Mini label="Devices" value={data?.devices.length ?? 0} />
        <Mini label="Held packets" value={data?.devices.reduce((s, d) => s + d.packetCount, 0) ?? 0} />
        <Mini label="Idempotency cache" value={data?.idempotencyCacheSize ?? 0} />
      </div>

      {lastFlush && (
        <div className="glass flex items-center gap-4 rounded-2xl p-4 text-sm">
          <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-xs text-success">
            {lastFlush.settled} settled
          </span>
          <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-xs text-accent">
            {lastFlush.dups} duplicate-storm deduped
          </span>
          <p className="text-xs text-muted-foreground">Last bridge sync · idempotency held the line</p>
        </div>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Devices</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.devices.map((d) => <DeviceCard key={d.deviceId} device={d} />)}
        </div>
      </section>
    </div>
  );
}

function Action({
  onClick,
  pending,
  icon: Icon,
  label,
  primary,
}: {
  onClick: () => void;
  pending?: boolean;
  icon: typeof Send;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors disabled:opacity-60",
        primary ? "bg-gradient-primary text-primary-foreground shadow-glow" : "border border-border bg-card/40 hover:border-accent/40",
      )}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
