import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Sparkles, FileText } from "lucide-react";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FileUploader } from "@/components/upload/FileUploader";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  listDocuments,
  removeDocument,
  uploadDocument,
} from "@/services/documents";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Documents — PlantMind AI" },
      {
        name: "description",
        content:
          "Ingest plant documents into the PlantMind knowledge base. Track processing status from upload to indexed.",
      },
      { property: "og:title", content: "Upload Documents — PlantMind AI" },
      {
        property: "og:description",
        content: "Ingest and index industrial plant documents.",
      },
    ],
  }),
  component: UploadPage,
});

function formatSize(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function UploadPage() {
  const qc = useQueryClient();
  const docs = useQuery({ queryKey: ["documents"], queryFn: listDocuments });

  // Poll while any doc is in-flight so status transitions are reflected.
  useEffect(() => {
    const inflight = docs.data?.some(
      (d) => d.status === "Uploading" || d.status === "Processing",
    );
    if (!inflight) return;
    const t = setInterval(
      () => qc.invalidateQueries({ queryKey: ["documents"] }),
      500,
    );
    return () => clearInterval(t);
  }, [docs.data, qc]);

  const upload = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });

  const del = useMutation({
    mutationFn: removeDocument,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });

  const ready = docs.data?.filter((d) => d.status === "Indexed").length ?? 0;

  return (
    <AppShell
      title="Upload Documents"
      subtitle="Add plant documentation to your AI-ready knowledge base"
    >
      <div className="px-6 py-6 max-w-[1200px] mx-auto space-y-6">
        <FileUploader
          onFiles={(files) => files.forEach((f) => upload.mutate(f))}
        />

        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold">Uploaded files</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {docs.data?.length ?? 0} files · {ready} indexed
              </p>
            </div>
            <button
              type="button"
              disabled={ready === 0}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Build knowledge base
            </button>
          </div>

          <div className="divide-y divide-border">
            {docs.isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-secondary animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 rounded bg-secondary animate-pulse" />
                      <div className="h-2.5 w-20 rounded bg-secondary animate-pulse" />
                    </div>
                  </div>
                ))
              : !docs.data?.length ? (
                  <div className="px-5 py-14 text-center">
                    <div className="mx-auto grid place-items-center w-12 h-12 rounded-2xl bg-secondary/60 ring-1 ring-border">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="mt-4 text-sm font-medium">No files yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Drop documents above to start building your knowledge base.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {docs.data.map((d) => (
                      <motion.div
                        key={d.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="px-5 py-4 flex items-center gap-4"
                      >
                        <div className="grid place-items-center w-9 h-9 rounded-lg bg-secondary/70 text-muted-foreground">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">{d.name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {formatSize(d.size)}
                          </div>
                          {(d.status === "Uploading" ||
                            d.status === "Processing") &&
                            d.progress != null && (
                              <div className="mt-2 h-1 w-full max-w-xs rounded-full bg-secondary overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full bg-primary"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${d.progress}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                            )}
                          {d.status === "Failed" && d.errorMessage && (
                            <div className="mt-1 text-[11px] text-danger">
                              {d.errorMessage}
                            </div>
                          )}
                        </div>
                        <StatusBadge status={d.status} />
                        <button
                          type="button"
                          onClick={() => del.mutate(d.id)}
                          className="grid place-items-center w-8 h-8 rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition"
                          aria-label="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}