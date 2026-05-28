import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useAppConfig } from "@/context/app-config";
import { useAccounts } from "@/hooks/use-app-data";
import { formatINR } from "@/lib/format";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profile · MeshPay" },
      { name: "description", content: "Account, theme, mesh sync preferences, and backend configuration." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { activeVpa, setActiveVpa, theme, toggleTheme, config, setConfig } = useAppConfig();
  const { data: accounts } = useAccounts();
  const active = accounts?.find((a) => a.vpa === activeVpa) ?? accounts?.[0];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <header className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Settings</p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Profile & preferences</h1>
      </header>

      <section className="glass rounded-2xl p-6 shadow-card">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Active account</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-lg font-semibold text-white shadow-glow">
            {active?.holderName.slice(0, 1) ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold">{active?.holderName ?? "—"}</p>
            <p className="font-mono text-xs text-muted-foreground">{active?.vpa ?? "—"}</p>
          </div>
          <p className="font-display text-lg font-semibold tabular-nums">{formatINR(active?.balance ?? 0)}</p>
        </div>
        <div className="mt-5 space-y-2">
          {accounts?.map((a) => (
            <label
              key={a.vpa}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm transition-colors ${
                a.vpa === activeVpa ? "border-accent/60 bg-accent/10" : "border-border bg-card/40 hover:border-accent/30"
              }`}
            >
              <span>
                <span className="font-medium">{a.holderName}</span>
                <span className="ml-2 font-mono text-xs text-muted-foreground">{a.vpa}</span>
              </span>
              <input
                type="radio"
                name="active-vpa"
                checked={a.vpa === activeVpa}
                onChange={() => setActiveVpa(a.vpa)}
                className="accent-[oklch(0.63_0.22_296)]"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="glass rounded-2xl p-6">
        <p className="font-display text-base font-semibold">Appearance</p>
        <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-card/40 p-4">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Moon className="h-4 w-4 text-accent" /> : <Sun className="h-4 w-4 text-accent" />}
            <div>
              <p className="text-sm font-medium">{theme === "dark" ? "Dark theme" : "Light theme"}</p>
              <p className="text-xs text-muted-foreground">Dark is the default fintech feel</p>
            </div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </div>
      </section>

      <section className="glass rounded-2xl p-6">
        <p className="font-display text-base font-semibold">Backend connectivity</p>
        <p className="mt-1 text-xs text-muted-foreground">
          All requests go directly to the Spring Boot backend. Point this at your local run
          (default <span className="font-mono">http://localhost:8080</span>) or a deployed instance.
        </p>

        <label className="mt-4 block">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            API Base URL
          </span>
          <input
            value={config.baseUrl}
            onChange={(e) => setConfig({ baseUrl: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-border bg-card/40 px-4 py-3 font-mono text-sm outline-none focus:border-accent"
            placeholder="http://localhost:8080"
          />
        </label>
      </section>


      <section className="glass rounded-2xl p-6 text-xs text-muted-foreground">
        <p className="font-mono uppercase tracking-widest">About</p>
        <p className="mt-2">
          MeshPay frontend wired to{" "}
          <a
            href="https://github.com/perryvegehan/UPI_Without_Internet"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted underline-offset-4 hover:text-foreground"
          >
            perryvegehan/UPI_Without_Internet
          </a>{" "}
          (Spring Boot). Hybrid RSA-2048 + AES-256-GCM encryption, mesh gossip simulator, and idempotent settlement.
        </p>
      </section>
    </div>
  );
}
