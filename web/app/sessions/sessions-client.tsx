"use client";

import { useCallback, useMemo, useState } from "react";
import { getRuns, getWorkflows } from "@/lib/api";
import { usePolling } from "@/lib/hooks/use-polling";
import type { RunWithSteps, Workflow } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_FILTERS = ["all", "running", "done", "failed"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export function SessionsClient() {
  const [workflowId, setWorkflowId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: workflows } = usePolling<Workflow[]>(getWorkflows, 60_000);

  const fetcher = useCallback(
    () => getRuns(workflowId || undefined),
    [workflowId]
  );
  const { data: runs, isLoading, refresh } = usePolling<RunWithSteps[]>(fetcher, 30_000);

  const filteredRuns = useMemo(() => {
    if (!runs) return [];
    if (statusFilter === "all") return runs;
    return runs.filter((r) => {
      if (statusFilter === "done") return r.status === "done" || r.status === "completed";
      if (statusFilter === "failed") return r.status === "failed" || r.status === "error";
      return r.status === statusFilter;
    });
  }, [runs, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Sessions</h1>
        <div className="flex items-center gap-3">
          <Select value={workflowId} onValueChange={setWorkflowId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All workflows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All workflows</SelectItem>
              {workflows?.map((wf) => (
                <SelectItem key={wf.id} value={wf.id}>
                  {wf.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={refresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs
        value={statusFilter}
        onValueChange={(v) => setStatusFilter(v as StatusFilter)}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="running">Running</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={filteredRuns} />
      )}

      <p className="text-xs text-muted-foreground">
        Auto-refresh: 30s
      </p>
    </div>
  );
}
