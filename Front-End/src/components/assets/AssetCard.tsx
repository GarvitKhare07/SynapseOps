import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, MapPin } from "lucide-react";
import type { Asset } from "@/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<NonNullable<Asset["status"]>, string> = {
  operational: "bg-success/12 text-success ring-success/30",
  warning: "bg-warning/12 text-warning ring-warning/30",
  critical: "bg-danger/12 text-danger ring-danger/30",
  unknown: "bg-secondary text-muted-foreground ring-border",
};

export function AssetCard({ asset, index = 0 }: { asset: Asset; index?: number }) {
  const status = asset.status ?? "unknown";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link
        to="/assets/$id"
        params={{ id: asset.id }}
        className="group block rounded-2xl bg-card border border-border p-5 hover:border-primary/40 hover:shadow-elevated transition-all"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {asset.type}
            </div>
            <div className="mt-1 text-base font-semibold tracking-tight truncate group-hover:text-primary transition-colors">
              {asset.name}
            </div>
          </div>
          <span
            className={cn(
              "shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ring-1 capitalize",
              statusStyles[status],
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          {asset.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {asset.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            {asset.documentCount} docs
          </span>
        </div>

        {asset.tags && asset.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {asset.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-md bg-secondary/70 text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
}