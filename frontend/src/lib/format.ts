export function formatINR(value: number | string): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (!Number.isFinite(n)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

export function shortHash(hash: string, n = 8): string {
  if (!hash) return "";
  return hash.length <= n * 2 ? hash : `${hash.slice(0, n)}…${hash.slice(-n)}`;
}

export function relativeTime(iso: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const s = Math.round(diff / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function deviceLabel(deviceId: string): string {
  return deviceId.replace(/^phone-/, "").replace(/^bridge-/, "").replace(/-/g, " ");
}

export function isBridge(deviceId: string): boolean {
  return /bridge|hub|tower/i.test(deviceId);
}
