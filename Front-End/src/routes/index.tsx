import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Boxes,
  FileStack,
  MessagesSquare,
  Upload,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/ui/metric-card";
import { getDashboard } from "@/services/dashboard";
import { listDocuments } from "@/services/documents";
import { StatusBadge } from "@/components/ui/status-badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlantMind AI — Industrial Knowledge Intelligence" },
      {
        name: "description",
        content:
          "AI-powered operational intelligence for industrial plants. Index documents, surface asset insights, and chat with your knowledge base.",
      },
      { property: "og:title", content: "PlantMind AI" },
      {
        property: "og:description",
        content:
          "Industrial knowledge intelligence — upload plant documents and chat with cited, source-grounded answers.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const metrics = useQuery({ queryKey: ["dashboard"], queryFn: getDashboard });
  const docs = useQuery({ queryKey: ["documents"], queryFn: listDocuments });

  return (
    <AppShell
      title="Operations Dashboard"
      subtitle="Live view of your indexed plant knowledge base"
    >
      <div className="px-6 py-6 max-w-[1400px] mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            index={0}
            label="Documents Indexed"
            icon={FileStack}
            loading={metrics.isLoading}
            value={metrics.data?.documentsIndexed ?? 0}
            delta="+12 this week"
          />
          <MetricCard
            index={1}
            label="AI Queries Run"
            icon={MessagesSquare}
            loading={metrics.isLoading}
            value={metrics.data?.aiQueriesRun ?? 0}
            delta="+38 today"
          />
          <MetricCard
            index={2}
            label="Assets Detected"
            icon={Boxes}
            loading={metrics.isLoading}
            value={metrics.data?.assetsDetected ?? 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 rounded-2xl bg-card border border-border overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="text-sm font-semibold">Recent Ingestion Activity</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Latest documents processed by the knowledge engine
                </p>
              </div>
              <Link
                to="/upload"
                className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                Upload more <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {docs.isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="px-5 py-4 flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-secondary animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/2 rounded bg-secondary animate-pulse" />
                        <div className="h-2.5 w-1/4 rounded bg-secondary animate-pulse" />
                      </div>
                    </div>
                  ))
                : docs.data?.slice(0, 5).map((d) => (
                    <div key={d.id} className="px-5 py-4 flex items-center gap-4">
                      <div className="grid place-items-center w-9 h-9 rounded-lg bg-secondary/70 text-muted-foreground">
                        <FileStack className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{d.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {(d.size / 1024).toFixed(0)} KB ·{" "}
                          {new Date(d.uploadedAt).toLocaleString()}
                        </div>
                      </div>
                      <StatusBadge status={d.status} />
                    </div>
                  ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card border border-border p-5"
          >
            <h2 className="text-sm font-semibold">Quick actions</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Jump back into your workflow
            </p>
            <div className="mt-4 space-y-2">
              {[
                {
                  to: "/upload" as const,
                  label: "Upload documents",
                  icon: Upload,
                  desc: "Add PDFs, DOCX, CSV…",
                },
                {
                  to: "/chat" as const,
                  label: "Open AI Assistant",
                  icon: MessagesSquare,
                  desc: "Ask the knowledge base",
                },
                {
                  to: "/assets" as const,
                  label: "Browse assets",
                  icon: Boxes,
                  desc: "Equipment library",
                },
              ].map(({ to, label, icon: Icon, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/50 transition-all"
                >
                  <div className="grid place-items-center w-9 h-9 rounded-lg bg-primary/12 text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-[11px] text-muted-foreground">{desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                </Link>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </AppShell>
  );
}
