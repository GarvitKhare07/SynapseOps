import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Boxes,
  LayoutDashboard,
  MessagesSquare,
  Upload,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Documents", icon: Upload },
  { to: "/chat", label: "AI Assistant", icon: MessagesSquare },
  { to: "/assets", label: "Assets", icon: Boxes },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground sticky top-0">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="grid place-items-center w-9 h-9 rounded-xl bg-primary/15 ring-1 ring-primary/30">
          <Sparkles className="w-4.5 h-4.5 text-primary" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">PlantMind</div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Industrial AI
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active =
            item.to === "/"
              ? pathname === "/"
              : pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r-full bg-primary"
                />
              )}
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 p-3 rounded-xl glass">
        <div className="text-xs font-medium text-foreground">Knowledge base</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          128 documents indexed
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-primary-glow" />
        </div>
      </div>
    </aside>
  );
}