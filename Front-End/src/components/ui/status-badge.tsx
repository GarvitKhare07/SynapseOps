import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/types";
import { CheckCircle2, Loader2, AlertCircle, UploadCloud } from "lucide-react";

const map: Record<
  DocumentStatus,
  { label: string; cls: string; icon: typeof CheckCircle2; spin?: boolean }
> = {
  Uploading: {
    label: "Uploading",
    cls: "bg-primary/12 text-primary ring-primary/30",
    icon: UploadCloud,
  },
  Processing: {
    label: "Processing",
    cls: "bg-warning/12 text-warning ring-warning/30",
    icon: Loader2,
    spin: true,
  },
  Indexed: {
    label: "Indexed",
    cls: "bg-success/12 text-success ring-success/30",
    icon: CheckCircle2,
  },
  Failed: {
    label: "Failed",
    cls: "bg-danger/12 text-danger ring-danger/30",
    icon: AlertCircle,
  },
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const s = map[status];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ring-1",
        s.cls,
      )}
    >
      <Icon className={cn("w-3 h-3", s.spin && "animate-spin")} />
      {s.label}
    </span>
  );
}