"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { RunWithSteps } from "@/lib/types";
import { StatusBadge } from "@/components/sessions/status-badge";
import { relativeTime } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<RunWithSteps>[] = [
  {
    accessorKey: "run_number",
    header: "#",
    cell: ({ row }) => (
      <span className="font-mono text-muted-foreground text-sm">
        {row.original.run_number ?? row.original.id.slice(0, 8)}
      </span>
    ),
    size: 60,
  },
  {
    accessorKey: "task",
    header: "Task",
    cell: ({ row }) => {
      const task = row.original.task;
      const truncated = task.length > 80 ? task.slice(0, 80) + "..." : task;
      if (task.length > 80) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">{truncated}</span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-sm">
              <p className="text-xs">{task}</p>
            </TooltipContent>
          </Tooltip>
        );
      }
      return <span>{task}</span>;
    },
  },
  {
    accessorKey: "workflow_id",
    header: "Workflow",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.workflow_id}
      </span>
    ),
    size: 140,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    size: 100,
  },
  {
    id: "steps_progress",
    header: "Steps",
    cell: ({ row }) => {
      const steps = row.original.steps;
      const done = steps.filter(
        (s) => s.status === "done" || s.status === "skipped"
      ).length;
      return (
        <span className="font-mono text-xs text-muted-foreground">
          {done}/{steps.length}
        </span>
      );
    },
    size: 70,
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {relativeTime(row.original.created_at)}
      </span>
    ),
    size: 100,
  },
];
