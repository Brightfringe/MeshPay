import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SignalPulseProps {
  active?: boolean;
  className?: string;
}

export function SignalPulse({ active = true, className }: SignalPulseProps) {
  return (
    <span className={cn("relative inline-flex h-2.5 w-2.5", className)}>
      {active && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-accent signal-pulse"
        />
      )}
      <span
        className={cn(
          "relative inline-block h-2.5 w-2.5 rounded-full",
          active ? "bg-accent shadow-[0_0_12px_rgba(139,92,246,0.7)]" : "bg-muted-foreground/40",
        )}
      />
    </span>
  );
}

export function MeshHeroAnimation() {
  // Decorative hero animation — nodes on a circle, signal pulses, dashed orbit.
  const nodes = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const r = 140;
    return { x: Math.cos(angle) * r, y: Math.sin(angle) * r, i };
  });

  return (
    <div className="relative mx-auto h-[360px] w-[360px] sm:h-[440px] sm:w-[440px]">
      {/* glow */}
      <div className="absolute inset-10 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
      {/* orbit */}
      <svg viewBox="-220 -220 440 440" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="edge" x1="0" x2="1">
            <stop offset="0%" stopColor="#5B5BD6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#5B5BD6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle r="170" fill="none" stroke="rgba(148,163,184,0.18)" strokeDasharray="2 6" />
        <circle r="120" fill="none" stroke="rgba(148,163,184,0.1)" strokeDasharray="2 6" />
        {nodes.map((n, idx) => {
          const next = nodes[(idx + 2) % nodes.length];
          return (
            <line
              key={idx}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              stroke="url(#edge)"
              strokeWidth="1"
            />
          );
        })}
        {nodes.map((n, idx) => (
          <g key={n.i} transform={`translate(${n.x} ${n.y})`}>
            <motion.circle
              r="5"
              fill="#8B5CF6"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.15 }}
            />
            <motion.circle
              r="14"
              fill="none"
              stroke="#8B5CF6"
              strokeOpacity="0.5"
              initial={{ r: 5, opacity: 0.6 }}
              animate={{ r: [5, 22], opacity: [0.6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.2 }}
            />
          </g>
        ))}
        {/* center */}
        <circle r="20" fill="url(#edge)" />
        <circle r="8" fill="#fff" />
      </svg>

      {/* floating chips */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass absolute -left-4 top-10 hidden rounded-2xl px-4 py-3 shadow-card sm:block"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Packet relay
        </p>
        <p className="mt-1 font-mono text-xs">a1b2c3d4 → bob@meshpay</p>
      </motion.div>
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass absolute -right-2 bottom-10 hidden rounded-2xl px-4 py-3 shadow-card sm:block"
      >
        <div className="flex items-center gap-2">
          <SignalPulse />
          <p className="text-xs font-medium">Bridge online · settling</p>
        </div>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">+₹1,499.00</p>
      </motion.div>
    </div>
  );
}
