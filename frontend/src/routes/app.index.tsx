import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircuitBoard,
  Cloud,
  Database,
  Radio,
  Repeat,
  ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";
import { useAccounts, useMeshState, useTransactions } from "@/hooks/use-app-data";
import { useAppConfig } from "@/context/app-config";
import { formatINR } from "@/lib/format";
import { TransactionList } from "@/components/payments/TransactionList";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard · MeshPay" },
      { name: "description", content: "Mesh health, account balances, and recent settlements." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { activeVpa, setActiveVpa } = useAppConfig();
  const { data: accounts, isLoading: aLoading } = useAccounts();
  const { data: mesh } = useMeshState();
  const { data: txns, isLoading: tLoading } = useTransactions();

  // Auto-select first account
  useEffect(() => {
    if (!activeVpa && accounts && accounts.length > 0) setActiveVpa(accounts[0].vpa);
  }, [activeVpa, accounts, setActiveVpa]);

  const active = accounts?.find((a) => a.vpa === activeVpa) ?? accounts?.[0];
  const onlineBridges = mesh?.devices.filter((d) => d.hasInternet).length ?? 0;
  const heldPackets = mesh?.devices.reduce((s, d) => s + d.packetCount, 0) ?? 0;

  const quickActions: Array<{ to: string; label: string; icon: typeof ArrowUpRight; accent?: boolean }> = [
    { to: "/app/send", label: "Send", icon: ArrowUpRight, accent: true },
    { to: "/app/receive", label: "Receive", icon: ArrowDownLeft },
    { to: "/app/mesh", label: "Mesh", icon: Radio },
    { to: "/app/transactions", label: "History", icon: Repeat },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          Mesh Console · Overview
        </p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          {active ? `Welcome, ${active.holderName.split(" ")[0]}` : "Welcome"}
        </h1>
      </header>

      {/* Balance + actions */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass relative overflow-hidden rounded-3xl p-6 shadow-card sm:p-8"
        >
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Active account balance
              </p>
              <select
                className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs"
                value={activeVpa ?? ""}
                onChange={(e) => setActiveVpa(e.target.value)}
              >
                {accounts?.map((a) => (
                  <option key={a.vpa} value={a.vpa}>
                    {a.vpa}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 font-display text-4xl font-semibold tabular-nums sm:text-5xl">
              {aLoading ? (
                <Skeleton className="h-12 w-48" />
              ) : (
                formatINR(active?.balance ?? 0)
              )}
            </div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {active?.holderName} · v{active?.version ?? 0}
            </p>
            <div className="mt-6 grid grid-cols-4 gap-2">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.to}
                    to={a.to}
                    className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border p-3 text-xs transition-colors ${
                      a.accent
                        ? "bg-gradient-primary text-primary-foreground shadow-glow"
                        : "bg-card/40 hover:border-accent/40"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {a.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4">
          <StatCard
            icon={Cloud}
            label="Bridges online"
            value={`${onlineBridges}/${mesh?.devices.length ?? 0}`}
            sub="devices reachable to backend"
            accent="success"
          />
          <StatCard
            icon={CircuitBoard}
            label="Packets in mesh"
            value={String(heldPackets)}
            sub="across all relays"
          />
          <StatCard
            icon={Database}
            label="Idempotency cache"
            value={String(mesh?.idempotencyCacheSize ?? 0)}
            sub="hashes dedup’d at backend"
          />
        </div>
      </div>

      {/* Accounts on this node */}
      <section>
        <SectionTitle title="Accounts on this node" linkTo="/app/profile" linkLabel="Manage" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(accounts ?? []).map((a, i) => (
            <motion.button
              key={a.vpa}
              type="button"
              onClick={() => setActiveVpa(a.vpa)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`glass rounded-2xl p-4 text-left transition-colors ${
                a.vpa === activeVpa ? "border-accent/60" : "hover:border-accent/30"
              }`}
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {a.vpa}
              </p>
              <p className="mt-1 font-display text-base font-semibold">{a.holderName}</p>
              <p className="mt-3 font-display text-xl font-semibold tabular-nums">
                {formatINR(a.balance)}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Recent transactions */}
      <section>
        <SectionTitle title="Recent settlements" linkTo="/app/transactions" linkLabel="See all" />
        {tLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <TransactionList txns={(txns ?? []).slice(0, 5)} perspectiveVpa={activeVpa} />
        )}
      </section>

      {/* Security strip */}
      <Link
        to="/app/security"
        className="glass flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-accent/40"
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-card">
          <ShieldCheck className="h-5 w-5 text-success" />
        </div>
        <div className="flex-1">
          <p className="font-display text-sm font-semibold">Hybrid encryption is healthy</p>
          <p className="text-xs text-muted-foreground">
            RSA-2048 OAEP-SHA256 wrap · AES-256-GCM payload · DB-level packet hash idempotency
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof Cloud;
  label: string;
  value: string;
  sub: string;
  accent?: "success" | "default";
}) {
  return (
    <div className="glass rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <div
          className={`grid h-8 w-8 place-items-center rounded-lg ${
            accent === "success" ? "bg-success/10 text-success" : "bg-card/60 text-accent"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function SectionTitle({
  title,
  linkTo,
  linkLabel,
}: {
  title: string;
  linkTo?: "/app/transactions" | "/app/profile";
  linkLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {linkTo && (
        <Link to={linkTo} className="text-xs text-muted-foreground hover:text-foreground">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
