import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Search, XCircle } from "lucide-react";
import { useTransactions } from "@/hooks/use-app-data";
import { useAppConfig } from "@/context/app-config";
import { TransactionList } from "@/components/payments/TransactionList";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions · MeshPay" },
      { name: "description", content: "Full ledger of settled and rejected mesh transactions." },
    ],
  }),
  component: TransactionsPage,
});

type Filter = "ALL" | "SETTLED" | "REJECTED";

function TransactionsPage() {
  const { activeVpa } = useAppConfig();
  const { data, isLoading } = useTransactions();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const list = data ?? [];
    return list.filter((t) => {
      if (filter !== "ALL" && t.status !== filter) return false;
      if (q && !`${t.senderVpa} ${t.receiverVpa} ${t.bridgeNodeId} ${t.packetHash}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [data, filter, q]);

  const settled = (data ?? []).filter((t) => t.status === "SETTLED").length;
  const rejected = (data ?? []).filter((t) => t.status === "REJECTED").length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <header className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Ledger</p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Once settled, every transaction is immutable — uniqueness enforced by SHA-256 packet hash at the DB level.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Total" value={data?.length ?? 0} />
        <Stat label="Settled" value={settled} tone="success" icon={CheckCircle2} />
        <Stat label="Rejected" value={rejected} tone="destructive" icon={XCircle} />
      </div>

      <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search VPA, bridge node, packet hash…"
            className="w-full rounded-xl border border-border bg-card/40 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex gap-1 rounded-xl border border-border bg-card/40 p-1">
          {(["ALL", "SETTLED", "REJECTED"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <TransactionList txns={filtered} perspectiveVpa={activeVpa} empty="No transactions match your filters." />
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: number;
  tone?: "success" | "destructive";
  icon?: typeof CheckCircle2;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
        {Icon && (
          <Icon className={cn("h-4 w-4", tone === "success" && "text-success", tone === "destructive" && "text-destructive")} />
        )}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
