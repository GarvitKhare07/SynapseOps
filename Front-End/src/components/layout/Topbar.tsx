import { Bell, Search } from "lucide-react";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="h-full px-6 flex items-center gap-6">
        <div className="min-w-0">
          <h1 className="text-base font-semibold tracking-tight truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search assets, documents…"
              className="h-9 w-72 pl-9 pr-3 rounded-lg bg-secondary/60 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/60 focus:border-transparent"
            />
          </div>

          <button
            type="button"
            className="relative grid place-items-center w-9 h-9 rounded-lg bg-secondary/60 border border-border hover:bg-secondary transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
          </button>

          <div className="flex items-center gap-2.5 pl-3 border-l border-border">
            <div className="grid place-items-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xs font-semibold">
              MR
            </div>
            <div className="hidden md:block leading-tight">
              <div className="text-xs font-medium">Maria Reyes</div>
              <div className="text-[10px] text-muted-foreground">Reliability Eng.</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}