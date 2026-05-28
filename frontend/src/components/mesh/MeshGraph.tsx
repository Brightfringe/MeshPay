import { motion } from "framer-motion";
import { Cloud, CloudOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { deviceLabel, isBridge } from "@/lib/format";
import type { MeshState, VirtualDevice } from "@/lib/types";

interface Props {
  state: MeshState | undefined;
  height?: number;
}

export function MeshGraph({ state, height = 420 }: Props) {
  const devices = state?.devices ?? [];
  const n = devices.length || 1;
  const r = Math.min(170, height / 2 - 60);
  const positions: Array<VirtualDevice & { x: number; y: number }> = devices.map((d, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { ...d, x: Math.cos(angle) * r, y: Math.sin(angle) * r };
  });

  // Edges: connect devices that share a packet
  const edges: Array<{ from: typeof positions[number]; to: typeof positions[number]; pkt: string }> = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const shared = positions[i].packetIds.find((p) => positions[j].packetIds.includes(p));
      if (shared) edges.push({ from: positions[i], to: positions[j], pkt: shared });
    }
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <div className="absolute inset-12 rounded-full bg-gradient-primary opacity-10 blur-3xl" />
      <svg
        viewBox={`-${r + 60} -${r + 60} ${(r + 60) * 2} ${(r + 60) * 2}`}
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="meshEdge" x1="0" x2="1">
            <stop offset="0%" stopColor="#5B5BD6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#5B5BD6" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r={r + 30} fill="none" stroke="rgba(148,163,184,0.12)" strokeDasharray="2 6" />
        <circle r={r - 30} fill="none" stroke="rgba(148,163,184,0.08)" strokeDasharray="2 6" />
        <circle r={r * 0.55} fill="url(#centerGlow)" />

        {edges.map((e, idx) => (
          <g key={idx}>
            <line
              x1={e.from.x}
              y1={e.from.y}
              x2={e.to.x}
              y2={e.to.y}
              stroke="url(#meshEdge)"
              strokeWidth="1.2"
            />
            <motion.circle
              r="2.5"
              fill="#8B5CF6"
              initial={{ cx: e.from.x, cy: e.from.y, opacity: 0 }}
              animate={{
                cx: [e.from.x, e.to.x],
                cy: [e.from.y, e.to.y],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2.2, repeat: Infinity, delay: idx * 0.3 }}
            />
          </g>
        ))}

        {positions.map((d, idx) => (
          <g key={d.deviceId} transform={`translate(${d.x} ${d.y})`}>
            {d.hasInternet && (
              <motion.circle
                r="18"
                fill="none"
                stroke="#8B5CF6"
                strokeOpacity="0.5"
                initial={{ r: 12, opacity: 0.6 }}
                animate={{ r: [12, 28], opacity: [0.6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.1 }}
              />
            )}
            <circle
              r="14"
              fill={isBridge(d.deviceId) ? "#5B5BD6" : "#1E293B"}
              stroke={d.hasInternet ? "#8B5CF6" : "rgba(148,163,184,0.6)"}
              strokeWidth="1.5"
            />
            <text
              y="3"
              textAnchor="middle"
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
              fill="#F8FAFC"
            >
              {d.packetCount}
            </text>
            <text
              y={d.y > 0 ? 34 : -22}
              textAnchor="middle"
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fill="#94A3B8"
              className="capitalize"
            >
              {deviceLabel(d.deviceId)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function DeviceCard({ device, onClick }: { device: VirtualDevice; onClick?: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "glass group relative flex w-full flex-col gap-3 rounded-2xl p-4 text-left shadow-card transition-colors",
        "hover:border-accent/40",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {isBridge(device.deviceId) ? "Bridge Node" : "Peer Device"}
          </p>
          <p className="mt-0.5 font-display text-sm font-semibold capitalize">
            {deviceLabel(device.deviceId)}
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium",
            device.hasInternet
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-border bg-card/40 text-muted-foreground",
          )}
        >
          {device.hasInternet ? <Cloud className="h-3 w-3" /> : <CloudOff className="h-3 w-3" />}
          {device.hasInternet ? "Online" : "Offline"}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-2xl">{device.packetCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            held packets
          </p>
        </div>
        <div className="flex -space-x-1">
          {device.packetIds.slice(0, 3).map((p) => (
            <span
              key={p}
              className="inline-block rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[9px] text-muted-foreground"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
