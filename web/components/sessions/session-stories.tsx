"use client";

import type { Story } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function parseAcceptanceCriteria(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON, return as single item
  }
  return raw ? [raw] : [];
}

export function SessionStories({ stories }: { stories: Story[] }) {
  if (stories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">No stories found.</p>
    );
  }

  const doneCount = stories.filter(
    (s) => s.status === "done" || s.status === "completed"
  ).length;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-mono text-green-600 dark:text-green-400">
            {doneCount} / {stories.length} done
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{
              width: `${stories.length > 0 ? (doneCount / stories.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {stories.map((story) => {
          const criteria = parseAcceptanceCriteria(story.acceptance_criteria);
          return (
            <AccordionItem key={story.id} value={story.id}>
              <AccordionTrigger className="hover:no-underline py-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <StatusBadge status={story.status} />
                  <span className="font-medium">{story.title}</span>
                  {story.retry_count > 0 && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400">
                      retry {story.retry_count}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  {story.description && (
                    <p className="text-muted-foreground">{story.description}</p>
                  )}
                  {criteria.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Acceptance Criteria
                      </p>
                      <ul className="space-y-0.5">
                        {criteria.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <span className="text-muted-foreground">
                              {story.status === "done" ? "\u2611" : "\u2610"}
                            </span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {story.output && (
                    <ScrollArea className="max-h-[200px] w-full">
                      <pre className="rounded-md bg-muted p-3 text-xs font-mono whitespace-pre-wrap break-words">
                        {story.output}
                      </pre>
                    </ScrollArea>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
