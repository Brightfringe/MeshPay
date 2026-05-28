import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircuitBoard,
  LayoutDashboard,
  ListChecks,
  Moon,
  Radio,
  Settings,
  ShieldCheck,
  Sun,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAppConfig } from "@/context/app-config";
import { useMeshState } from "@/hooks/use-app-data";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/send", label: "Send", icon: ArrowUpRight },
  { to: "/app/receive", label: "Receive", icon: ArrowDownLeft },
  { to: "/app/transactions", label: "Transactions", icon: ListChecks },
  { to: "/app/mesh", label: "Mesh", icon: Radio },
  { to: "/app/security", label: "Security", icon: ShieldCheck },
  { to: "/app/profile", label: "Profile", icon: Settings },
];

const MOBILE_NAV = NAV.slice(0, 5);

function StatusPill() {
  const { data, isError, isLoading } = useMeshState();
  const online = data?.devices.filter((d) => d.hasInternet).length ?? 0;
  const total = data?.devices.length ?? 0;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
          isError
            ? "border-destructive/40 bg-destructive/10 text-destructive"
            : isLoading
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-success/40 bg-success/10 text-success",
        )}
      >
        {isError ? (
          <>
            <WifiOff className="h-3.5 w-3.5" />
            Backend offline
          </>
        ) : isLoading ? (
          <>
            <CircuitBoard className="h-3.5 w-3.5 animate-pulse" />
            Connecting…
          </>
        ) : (
          <>
            <Wifi className="h-3.5 w-3.5" />
            Live
          </>
        )}
      </div>
      <div className="hidden items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs sm:flex">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
          <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="font-mono text-muted-foreground">
          {isLoading ? "…" : `${online}/${total} bridge`}
        </span>
      </div>
    </div>
  );
}


function ThemeButton() {
  const { theme, toggleTheme } = useAppConfig();
  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-border bg-card/40 p-2 text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar/60 backdrop-blur-xl lg:flex lg:flex-col">
        <Link to="/" className="flex items-center gap-2 px-6 py-6">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Radio className="h-4 w-4 text-white" />
          </span>
          <div>
            <p className="font-display text-base font-semibold tracking-tight">MeshPay</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Offline UPI Rails
            </p>
          </div>
        </Link>
        <nav className="flex-1 px-3">
          {NAV.map((item) => {
            const active = isActive(item.to, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative my-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-card text-foreground"
                    : "text-muted-foreground hover:bg-card/50 hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 -z-10 rounded-xl border border-accent/30 bg-gradient-card"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4 text-[11px] text-muted-foreground">
          <p className="font-mono uppercase tracking-widest">Network</p>
          <p className="mt-1 text-foreground">UPI Mesh · v0.1</p>
          <p className="mt-1">RSA-2048 + AES-256-GCM</p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/70 px-4 py-3 backdrop-blur-xl lg:px-8">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary shadow-glow">
              <Radio className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="font-display text-sm font-semibold">MeshPay</span>
          </Link>
          <div className="flex items-center gap-2">
            <StatusPill />
          </div>
          <div className="flex items-center gap-2">
            <ThemeButton />
          </div>
        </header>

        <main className="flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-10">{children}</main>

        {/* Bottom nav (mobile) */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-xl lg:hidden">
          <ul className="grid grid-cols-5">
            {MOBILE_NAV.map((item) => {
              const active = isActive(item.to, item.exact);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium",
                      active ? "text-accent" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
