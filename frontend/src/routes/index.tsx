import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  CircuitBoard,
  Cpu,
  Fingerprint,
  Layers,
  Lock,
  Radio,
  ShieldCheck,
  Signal,
  Sparkles,
  Workflow,
} from "lucide-react";
import { MeshHeroAnimation, SignalPulse } from "@/components/mesh/SignalPulse";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MeshPay — Send UPI Payments Without Internet" },
      {
        name: "description",
        content:
          "MeshPay turns every nearby phone into a relay. Sign UPI packets offline, hop through the mesh, settle on the backend the moment any bridge node touches the internet.",
      },
      { property: "og:title", content: "MeshPay — UPI Payments Without Internet" },
      {
        property: "og:description",
        content: "Offline UPI rails powered by an encrypted device mesh.",
      },
    ],
  }),
  component: Landing,
});

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
      {children}
    </section>
  );
}

function Landing() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg opacity-50" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[700px] bg-gradient-to-b from-accent/10 via-transparent to-transparent" />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
              <Radio className="h-4 w-4 text-white" />
            </span>
            <div className="font-display text-base font-semibold tracking-tight">MeshPay</div>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#tech" className="transition-colors hover:text-foreground">Offline tech</a>
            <a href="#security" className="transition-colors hover:text-foreground">Security</a>
          </nav>
          <Link
            to="/app"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow"
          >
            Launch Console
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <motion.div initial="hidden" animate="show" variants={fade}>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs text-accent">
              <SignalPulse />
              <span className="font-mono uppercase tracking-widest">Offline-first UPI rails</span>
            </div>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Send UPI payments
              <br />
              <span className="text-gradient">without the internet.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              MeshPay signs your payment locally, encrypts it with hybrid
              RSA + AES, and hops it through nearby phones until a bridge node
              with internet settles it on the backend — atomically, exactly once.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/app"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow"
              >
                Open the demo console
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                See how packets travel
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">
              {[
                "RSA-2048 + AES-256-GCM",
                "Idempotent settlement",
                "Mesh gossip + bridge sync",
                "Optimistic locking ledger",
              ].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 font-mono uppercase tracking-widest">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
            <MeshHeroAnimation />
          </motion.div>
        </div>
      </Section>

      {/* Features */}
      <Section id="features">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Features</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
            A real fintech surface — built on a real offline mesh backend.
          </h2>
        </motion.div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Radio,
              title: "Mesh propagation",
              body: "Gossip your signed packet to every nearby phone with one tap. The first to find internet uploads.",
            },
            {
              icon: Lock,
              title: "Hybrid encryption",
              body: "RSA-OAEP wraps a per-packet AES-256-GCM key. Relays carry ciphertext, never plaintext.",
            },
            {
              icon: Fingerprint,
              title: "Idempotent settlement",
              body: "Packet hashes are dedup keys at the DB level. Bridge storms collapse to exactly one settlement.",
            },
            {
              icon: Cpu,
              title: "Optimistic ledger",
              body: "Account version columns prevent lost updates when concurrent transfers race.",
            },
            {
              icon: Signal,
              title: "Live bridge status",
              body: "See online/offline state of every relay and bridge node in your local mesh in real time.",
            },
            {
              icon: Workflow,
              title: "Bridge ingest API",
              body: "Drop-in /api/bridge/ingest endpoint matches what a production Android bridge would call.",
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6 shadow-card transition-colors hover:border-accent/40"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-card">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* How it works */}
      <Section id="how">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">How it works</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          From offline tap to settled UPI in four hops.
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "Sign locally",
              body: "Sender enters VPA, amount, PIN. The app builds an encrypted MeshPacket on-device — no network needed.",
            },
            {
              step: "02",
              title: "Gossip across mesh",
              body: "The packet hops between nearby phones over Bluetooth / Wi-Fi Direct. TTL decrements per hop.",
            },
            {
              step: "03",
              title: "Bridge to backend",
              body: "First device with internet POSTs to /api/bridge/ingest. Duplicates from other bridges are deduped by packet hash.",
            },
            {
              step: "04",
              title: "Atomic settlement",
              body: "Backend verifies, decrypts, debits sender, credits receiver under optimistic locking. Written once, forever.",
            },
          ].map((s, i) => (
            <motion.li
              key={s.step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6"
            >
              <p className="font-mono text-xs text-accent">{s.step}</p>
              <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </motion.li>
          ))}
        </ol>
      </Section>

      {/* Offline tech */}
      <Section id="tech">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Offline technology</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Designed for blackouts, festivals, and dead zones.
            </h2>
            <p className="mt-4 text-muted-foreground">
              When the cell tower is down, MeshPay turns every nearby phone into a delivery
              courier. Signed packets ride the device-to-device fabric until any one of them
              touches the open internet — and only then does settlement happen.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Works through Bluetooth, Wi-Fi Direct, or local hotspot mesh",
                "TTL-based flood routing — no stuck packets",
                "Single-flight settlement even under bridge duplicate-storm",
                "Atomic ledger updates with optimistic version locking",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass relative overflow-hidden rounded-2xl p-8 shadow-card">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Sample MeshPacket
              </p>
              <pre className="mt-3 max-h-72 overflow-auto rounded-xl border border-border bg-background/60 p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">{`{
  "packetId": "a1b2c3d4-…",
  "ttl": 5,
  "encryptedKey": "RSA-OAEP(…)",
  "iv": "base64…",
  "ciphertext": "AES-256-GCM(payload)",
  "authTag": "base64…",
  "createdAt": "2026-05-27T11:42:18Z"
}`}</pre>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Decrypted payload
              </p>
              <pre className="mt-2 rounded-xl border border-border bg-background/60 p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">{`{
  "sender": "alice@meshpay",
  "receiver": "bob@meshpay",
  "amount": 1499.00,
  "pinHash": "argon2id(…)",
  "signedAt": "…"
}`}</pre>
            </div>
          </div>
        </div>
      </Section>

      {/* Security */}
      <Section id="security">
        <div className="glass overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1.5 text-xs text-success">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="font-mono uppercase tracking-widest">Security model</span>
              </div>
              <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
                Relays never see your payment.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Every packet is sealed end-to-end. Only the backend's RSA key can unwrap the
                AES session key. Relays only see ciphertext + TTL — they can carry the packet
                but never read or modify it.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Lock, title: "RSA-2048", body: "OAEP-SHA256 key wrap" },
                { icon: Layers, title: "AES-256-GCM", body: "Per-packet session key" },
                { icon: Fingerprint, title: "SHA-256 hash", body: "DB-level idempotency" },
                { icon: CircuitBoard, title: "Version lock", body: "No lost updates" },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.title} className="rounded-2xl border border-border bg-card/40 p-4">
                    <Icon className="h-4 w-4 text-accent" />
                    <p className="mt-3 font-display text-sm font-semibold">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground">{c.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* Demo flow CTA */}
      <Section>
        <div className="glass relative overflow-hidden rounded-3xl p-10 text-center sm:p-16">
          <div className="absolute inset-0 -z-10 bg-gradient-primary opacity-10" />
          <Sparkles className="mx-auto h-6 w-6 text-accent" />
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            Run the full demo flow in 30 seconds.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Send a packet, watch it gossip across nearby phones, flush the bridge, and see the
            backend settle it idempotently.
          </p>
          <Link
            to="/app"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow"
          >
            Launch the console
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary">
              <Radio className="h-3.5 w-3.5 text-white" />
            </span>
            <p className="font-display text-sm font-semibold">MeshPay</p>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              · console for UPI mesh
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Backend: Spring Boot ·{" "}
            <a
              className="underline decoration-dotted underline-offset-4 hover:text-foreground"
              href="https://github.com/perryvegehan/UPI_Without_Internet"
              target="_blank"
              rel="noreferrer"
            >
              UPI_Without_Internet
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
