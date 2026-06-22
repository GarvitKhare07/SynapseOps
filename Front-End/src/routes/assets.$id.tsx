import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  MapPin,
  MessagesSquare,
  Quote,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { getAsset } from "@/services/assets";

export const Route = createFileRoute("/assets/$id")({
  head: () => ({
    meta: [
      { title: "Asset — PlantMind AI" },
      {
        name: "description",
        content: "Asset details and related documents indexed by PlantMind AI.",
      },
    ],
  }),
  component: AssetDetailPage,
  notFoundComponent: () => (
    <AppShell title="Asset not found">
      <div className="p-6 max-w-3xl">
        <p className="text-sm text-muted-foreground">
          We couldn't locate that asset.
        </p>
        <Link to="/assets" className="text-primary text-sm hover:underline">
          Back to library
        </Link>
      </div>
    </AppShell>
  ),
});

function AssetDetailPage() {
  const { id } = Route.useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => getAsset(id),
  });

  if (isError) {
    return (
      <AppShell title="Asset">
        <div className="p-6 text-sm text-danger">Failed to load asset.</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={data?.name ?? "Asset"}
      subtitle={data ? `${data.type}${data.location ? ` · ${data.location}` : ""}` : undefined}
    >
      <div className="px-6 py-6 max-w-[1200px] mx-auto space-y-6">
        <Link
          to="/assets"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to library
        </Link>

        {isLoading || !data ? (
          <div className="space-y-4">
            <div className="h-32 rounded-2xl bg-card border border-border animate-pulse" />
            <div className="h-64 rounded-2xl bg-card border border-border animate-pulse" />
          </div>
        ) : (
          <>
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card border border-border p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {data.type}
                  </div>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    {data.name}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    {data.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {data.location}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> {data.documentCount} documents
                    </span>
                  </div>
                  {data.description && (
                    <p className="mt-4 text-sm text-foreground/80 max-w-2xl leading-relaxed">
                      {data.description}
                    </p>
                  )}
                </div>
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition shadow-soft"
                >
                  <MessagesSquare className="w-3.5 h-3.5" />
                  Ask AI about this asset
                </Link>
              </div>
            </motion.section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-2xl bg-card border border-border overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="text-sm font-semibold">Related documents</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Source files containing references to this asset
                  </p>
                </div>
                <ul className="divide-y divide-border">
                  {data.relatedDocuments.length === 0 && (
                    <li className="px-5 py-6 text-sm text-muted-foreground">
                      No documents linked yet.
                    </li>
                  )}
                  {data.relatedDocuments.map((d) => (
                    <li key={d.id} className="px-5 py-3.5 flex items-center gap-3">
                      <div className="grid place-items-center w-8 h-8 rounded-lg bg-secondary/70 text-muted-foreground">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{d.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {d.type}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl bg-card border border-border overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="text-sm font-semibold">Indexed passages</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Document chunks mentioning this asset
                  </p>
                </div>
                <ul className="divide-y divide-border">
                  {data.relatedChunks.length === 0 && (
                    <li className="px-5 py-6 text-sm text-muted-foreground">
                      No passages indexed yet.
                    </li>
                  )}
                  {data.relatedChunks.map((c) => (
                    <li key={c.id} className="px-5 py-4">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Quote className="w-3 h-3" />
                        <span className="font-medium text-foreground/80 truncate">
                          {c.documentName}
                        </span>
                        {c.page && <span>· p.{c.page}</span>}
                      </div>
                      <p className="mt-2 text-sm text-foreground/85 leading-relaxed border-l-2 border-primary/40 pl-3">
                        {c.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.section>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}