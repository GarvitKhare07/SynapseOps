import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import type { Citation } from "@/types";

export function CitationPanel({ citations }: { citations: Citation[] }) {
  if (!citations.length) {
    return (
      <div className="h-full grid place-items-center text-center px-6">
        <div>
          <div className="mx-auto grid place-items-center w-12 h-12 rounded-2xl bg-secondary/60 ring-1 ring-border">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium">No sources yet</p>
          <p className="mt-1 text-xs text-muted-foreground max-w-[220px]">
            Ask a question — cited passages from your indexed documents appear here.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-5 space-y-3 scrollbar-thin overflow-y-auto h-full">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        Sources · {citations.length}
      </div>
      {citations.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-border bg-card/60 p-4 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-start gap-2.5">
            <div className="grid place-items-center w-7 h-7 rounded-md bg-primary/12 text-primary shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold truncate">{c.documentName}</div>
              <div className="text-[10px] text-muted-foreground">
                {c.page ? `Page ${c.page}` : "—"}
                {c.confidence != null &&
                  ` · ${(c.confidence * 100).toFixed(0)}% match`}
              </div>
            </div>
          </div>
          <blockquote className="mt-3 text-[13px] leading-relaxed text-foreground/85 border-l-2 border-primary/40 pl-3">
            {c.snippet}
          </blockquote>
        </motion.div>
      ))}
    </div>
  );
}