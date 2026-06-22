import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AssetCard } from "@/components/assets/AssetCard";
import { listAssets } from "@/services/assets";

export const Route = createFileRoute("/assets/")({
  head: () => ({
    meta: [
      { title: "Asset Library — PlantMind AI" },
      {
        name: "description",
        content:
          "Browse plant assets and the documents associated with each piece of equipment.",
      },
      { property: "og:title", content: "Asset Library — PlantMind AI" },
      {
        property: "og:description",
        content: "Plant equipment library powered by your indexed knowledge base.",
      },
    ],
  }),
  component: AssetsPage,
});

function AssetsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: listAssets,
  });
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");

  const types = useMemo(() => {
    const s = new Set<string>();
    data?.forEach((a) => s.add(a.type));
    return ["all", ...Array.from(s)];
  }, [data]);

  const filtered = useMemo(() => {
    return (data ?? []).filter((a) => {
      const matchesQ =
        !q ||
        a.name.toLowerCase().includes(q.toLowerCase()) ||
        a.type.toLowerCase().includes(q.toLowerCase());
      const matchesType = type === "all" || a.type === type;
      return matchesQ && matchesType;
    });
  }, [data, q, type]);

  return (
    <AppShell
      title="Asset Library"
      subtitle="Equipment detected across your indexed plant documents"
    >
      <div className="px-6 py-6 max-w-[1400px] mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search assets…"
              className="h-10 w-full pl-9 pr-3 rounded-lg bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/60"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`h-9 px-3 rounded-lg text-xs font-medium border transition capitalize ${
                  type === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-card border border-border p-5 h-40 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-14 text-center text-sm text-muted-foreground">
            No assets match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((a, i) => (
              <AssetCard key={a.id} asset={a} index={i} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}