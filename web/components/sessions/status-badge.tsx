import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
  running: {
    label: "Running",
    className: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/25",
  },
  done: {
    label: "Done",
    className: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/25",
  },
  completed: {
    label: "Done",
    className: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/25",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/25",
  },
  error: {
    label: "Error",
    className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/25",
  },
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground border-transparent",
  },
  waiting: {
    label: "Waiting",
    className: "bg-muted text-muted-foreground border-transparent",
  },
  canceled: {
    label: "Canceled",
    className: "bg-muted text-muted-foreground border-transparent line-through",
  },
  cancelled: {
    label: "Canceled",
    className: "bg-muted text-muted-foreground border-transparent line-through",
  },
  skipped: {
    label: "Skipped",
    className: "bg-muted text-muted-foreground border-transparent",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-transparent",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0",
        config.className
      )}
    >
      {config.label}
    </Badge>
  );
}
