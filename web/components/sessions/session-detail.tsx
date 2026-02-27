"use client";

import { useCallback } from "react";
import { getRunById, getRunStories, getRunEvents } from "@/lib/api";
import { usePolling } from "@/lib/hooks/use-polling";
import type { RunWithSteps, Story, AntfarmEvent } from "@/lib/types";
import { relativeTime } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { SessionSteps } from "./session-steps";
import { SessionStories } from "./session-stories";
import { SessionEvents } from "./session-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function SessionDetail({ id }: { id: string }) {
  const fetchRun = useCallback(() => getRunById(id), [id]);
  const fetchStories = useCallback(() => getRunStories(id), [id]);
  const fetchEvents = useCallback(() => getRunEvents(id), [id]);

  const { data: run, isLoading: runLoading } = usePolling<RunWithSteps>(fetchRun, 5_000);
  const { data: stories } = usePolling<Story[]>(fetchStories, 5_000);
  const { data: events } = usePolling<AntfarmEvent[]>(fetchEvents, 5_000);

  if (runLoading || !run) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const stepsTotal = run.steps.length;
  const stepsDone = run.steps.filter(
    (s) => s.status === "done" || s.status === "skipped"
  ).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <span className="font-mono text-muted-foreground">
                #{run.run_number ?? run.id.slice(0, 8)}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {run.workflow_id}
              </span>
              <StatusBadge status={run.status} />
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm whitespace-pre-wrap">{run.task}</p>
          <Separator />
          <div className="flex gap-6 text-xs text-muted-foreground">
            <span>Created {relativeTime(run.created_at)}</span>
            <span>Updated {relativeTime(run.updated_at)}</span>
            <span>
              Steps: {stepsDone}/{stepsTotal}
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="steps">
        <TabsList>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="stories">
            Stories{stories && stories.length > 0 ? ` (${stories.length})` : ""}
          </TabsTrigger>
          <TabsTrigger value="activity">
            Activity
            {events && events.length > 0 ? ` (${events.length})` : ""}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="steps" className="mt-4">
          <SessionSteps steps={run.steps} />
        </TabsContent>
        <TabsContent value="stories" className="mt-4">
          <SessionStories stories={stories ?? []} />
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <SessionEvents events={events ?? []} />
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground">Auto-refresh: 5s</p>
    </div>
  );
}
