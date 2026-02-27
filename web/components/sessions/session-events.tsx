"use client";

import type { AntfarmEvent } from "@/lib/types";
import { formatEventDesc, formatTime } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SessionEvents({ events }: { events: AntfarmEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">No activity yet.</p>
    );
  }

  return (
    <ScrollArea className="max-h-[400px]">
      <div className="space-y-0">
        {events.map((evt, i) => {
          const agent = evt.agentId?.split("/").pop();
          return (
            <div
              key={i}
              className="flex items-baseline gap-3 border-b border-border/50 py-1.5 text-xs"
            >
              <span className="font-mono text-muted-foreground shrink-0 w-12">
                {formatTime(evt.ts)}
              </span>
              {agent && (
                <span className="font-mono text-blue-600 dark:text-blue-400 shrink-0 w-20 truncate">
                  {agent}
                </span>
              )}
              <span className="text-foreground">{formatEventDesc(evt)}</span>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
