import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  loading,
  index = 0,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  loading?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border p-5 shadow-soft"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className="grid place-items-center w-9 h-9 rounded-lg bg-primary/12 text-primary ring-1 ring-primary/25">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 flex items-end gap-2">
        {loading ? (
          <div className="h-9 w-24 rounded-md bg-secondary animate-pulse" />
        ) : (
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </span>
        )}
        {delta && !loading && (
          <span className={cn("text-xs pb-1.5 text-success font-medium")}>
            {delta}
          </span>
        )}
      </div>
      <div className="pointer-events-none absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-primary/8 blur-3xl" />
    </motion.div>
  );
}