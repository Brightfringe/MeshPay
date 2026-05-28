import { motion } from "framer-motion";
import { formatINR, initials, relativeTime, shortHash } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/lib/types";
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  txns: Transaction[];
  perspectiveVpa?: string | null;
  empty?: React.ReactNode;
}

export function TransactionList({ txns, perspectiveVpa, empty }: Props) {
  if (!txns.length) {
    return (
      <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
        {empty ?? "No transactions yet. Send your first packet to settle on the mesh."}
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {txns.map((tx, idx) => {
        const outbound = perspectiveVpa ? tx.senderVpa === perspectiveVpa : true;
        const counterparty = perspectiveVpa
          ? outbound
            ? tx.receiverVpa
            : tx.senderVpa
          : `${tx.senderVpa} → ${tx.receiverVpa}`;
        const settled = tx.status === "SETTLED";
        return (
          <motion.li
            key={tx.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.03, 0.25) }}
          >
            <div className="glass group flex items-center gap-4 rounded-2xl p-3.5 transition-colors hover:border-accent/30 sm:p-4">
              <div
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-xl text-xs font-semibold",
                  outbound
                    ? "bg-card text-muted-foreground"
                    : "bg-gradient-primary text-primary-foreground shadow-glow",
                )}
              >
                {initials(counterparty.split("@")[0] || counterparty)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{counterparty}</p>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                      settled
                        ? "border-success/40 bg-success/10 text-success"
                        : "border-destructive/40 bg-destructive/10 text-destructive",
                    )}
                  >
                    {settled ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {tx.status}
                  </span>
                </div>
                <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                  {shortHash(tx.packetHash, 6)} · {tx.hopCount} hop
                  {tx.hopCount === 1 ? "" : "s"} · via {tx.bridgeNodeId} · {relativeTime(tx.settledAt)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "flex items-center justify-end gap-1 font-display text-base font-semibold tabular-nums",
                    outbound ? "text-foreground" : "text-success",
                  )}
                >
                  {outbound ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ArrowDownLeft className="h-3.5 w-3.5 text-success" />
                  )}
                  {outbound ? "−" : "+"}
                  {formatINR(tx.amount).replace("₹", "₹ ")}
                </p>
                {tx.reason && (
                  <p className="mt-0.5 text-[10px] text-destructive">{tx.reason}</p>
                )}
              </div>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
