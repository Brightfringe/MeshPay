# Offline UPI Mesh — Frontend Plan

## Backend reality (from the repo)

`perryvegehan/UPI_Without_Internet` is a **Spring Boot demo** of an offline UPI mesh simulator. There is **no auth, no per-user wallet, no real bank**. Endpoints:

| Method | Path | Purpose |
|---|---|---|
| GET  | `/api/server-key` | RSA public key + hybrid scheme info |
| GET  | `/api/accounts` | Seeded accounts `{vpa, holderName, balance, version}` |
| GET  | `/api/transactions` | Last 20 settled/rejected txns |
| POST | `/api/demo/send` | Build encrypted packet + inject into mesh |
| GET  | `/api/mesh/state` | Virtual devices, internet flag, held packets |
| POST | `/api/mesh/gossip` | One gossip round between devices |
| POST | `/api/mesh/flush` | Bridge nodes upload to backend (tests idempotency) |
| POST | `/api/mesh/reset` | Clear mesh + idempotency cache |
| POST | `/api/bridge/ingest` | Production endpoint (documented, not user-callable from UI) |

The frontend will mirror this honestly: an **operator console for an offline UPI mesh**, styled as a premium fintech product. No fabricated login/KYC/wallet flows.

## Two decisions worth flagging

1. **Routing.** Lovable's template is **TanStack Start + Vite + Tailwind v4**, not Vite + react-router-dom. I'll use TanStack file-based routing (template requirement) and keep everything else you asked for: Tailwind, Framer Motion, Axios, lucide-react, shadcn/ui.
2. **Backend connectivity.** The Java server runs at `http://localhost:8080` and isn't co-deployed. I'll add `VITE_API_BASE_URL` (default `http://localhost:8080`) plus a **Demo Mode** toggle in the navbar that serves realistic mocks matching the real DTOs, so the preview is fully interactive without the Java backend running. A live/demo status pill is always visible.

## Pages (TanStack file routes)

- `/` Landing — hero ("Send UPI Payments Without Internet"), mesh signal animation, Features, How It Works, Offline Tech, Security, Demo Flow, Footer
- `/app` AppLayout (sidebar on desktop, bottom nav on mobile, mesh status header)
  - `/app` Dashboard — accounts grid (real balances from `/api/accounts`), mesh health, recent txns, quick actions
  - `/app/send` — payer account picker, payee VPA combobox (autocomplete from accounts), amount, PIN, TTL, start device → `POST /api/demo/send`; animated packet-injected confirmation with packetId + ciphertext preview
  - `/app/receive` — active account VPA, generated UPI QR (`upi://pay?pa=...`), incoming-payment pulse polling `/api/transactions`
  - `/app/transactions` — list with filter (SETTLED/REJECTED), status chips, hop count, bridge node, signed→settled latency
  - `/app/mesh` — radial SVG of virtual devices, internet/offline badges, held-packet counts, Gossip / Flush / Reset controls, animated packets traveling along edges
  - `/app/security` — public-key fingerprint, hybrid scheme explainer, idempotency cache size, packet-hash dedup story
  - `/app/profile` — active account selector, theme toggle, API base URL + demo-mode toggle, poll-interval preference

`__root.tsx` hosts QueryClientProvider, ThemeProvider, ApiConfigProvider, ActiveAccountProvider, Sonner Toaster. Each route sets its own `head()` meta.

## Visual system (tokens in `src/styles.css`, oklch)

```text
--background  #0F172A    --surface   #111827    --card      #1E293B
--foreground  #F8FAFC    --muted-fg  #94A3B8
--primary     #5B5BD6    --accent    #8B5CF6
--success     #22C55E    --destructive #EF4444
--gradient-primary  linear-gradient(135deg, #5B5BD6, #8B5CF6)
--gradient-mesh     radial-gradient(circle, #8B5CF6 0%, transparent 70%)
--shadow-glow       0 0 40px color-mix(in oklab, #8B5CF6 35%, transparent)
```

Default dark; `.light` class for light mode. Glassmorphism: translucent `--card` with `backdrop-filter: blur(20px)` and 1px hairline borders. Type: Space Grotesk (display) + Inter (body). Motion: page fade/slide, stagger on grids, pulsing signal rings on mesh nodes, packet-dot trails on gossip, success-check morph on send, skeletons during fetch, all respecting `prefers-reduced-motion`.

## Architecture

```text
src/
├── routes/                    # TanStack file routes (replaces pages/)
├── components/
│   ├── ui/                    # shadcn primitives
│   ├── mesh/                  # MeshGraph, DeviceNode, SignalPulse, PacketTrail
│   ├── payments/              # AmountInput, VpaCombobox, PaymentConfirm
│   ├── layout/                # AppShell, Sidebar, BottomNav, TopBar, StatusPill
│   └── marketing/             # Hero, FeatureGrid, HowItWorks, SecuritySection
├── services/api/              # axios + typed clients per endpoint group
├── services/mock/             # demo-mode fixtures matching DTOs
├── hooks/                     # useAccounts, useTransactions, useMeshState,
│                              # useSendPayment, useDemoMode, useTheme
├── context/                   # Theme, ApiConfig, ActiveAccount
├── animations/                # framer variants
├── layouts/                   # AppLayout, MarketingLayout
├── utils/                     # formatCurrency, formatVpa, relativeTime
└── styles.css
```

Data: TanStack Query with `queryOptions` + `useQuery`/`useMutation`. Mesh state polls every 3s; transactions invalidate after send/flush. Forms: react-hook-form + zod (amount > 0, VPA regex, PIN 4–6 digits, TTL 1–10). QR via `qrcode` package. Toasts via sonner.

## Out of scope (and why)

- Auth / signup — backend has none.
- Per-user wallet balances — backend exposes a flat accounts list; we surface that as "Accounts on this node."
- Calling `/api/bridge/ingest` from the browser — expects a real pre-encrypted packet from a bridge device; documented in the Security page instead.

## Build order

1. Tokens, fonts, theme, app shell, demo-mode toggle.
2. Marketing landing with mesh hero animation.
3. App shell + Dashboard.
4. Axios API layer + mock layer + hooks; wire Dashboard.
5. Send, Receive, Transactions.
6. Mesh visualization + gossip/flush/reset controls.
7. Security + Profile.
8. Polish pass (motion timing, empty states, skeletons, mobile QA at 360/768/1280).
