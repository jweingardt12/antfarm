"use client";

import type { Step } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const statusIcon: Record<string, { symbol: string; className: string }> = {
  done: { symbol: "\u2713", className: "text-green-600 dark:text-green-400" },
  running: { symbol: "\u25CF", className: "text-blue-600 dark:text-blue-400" },
  pending: { symbol: "\u25CB", className: "text-muted-foreground" },
  waiting: { symbol: "\u25CC", className: "text-muted-foreground" },
  failed: { symbol: "\u2717", className: "text-red-600 dark:text-red-400" },
  error: { symbol: "\u2717", className: "text-red-600 dark:text-red-400" },
  skipped: { symbol: "\u2014", className: "text-muted-foreground" },
};

export function SessionSteps({ steps }: { steps: Step[] }) {
  if (steps.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No steps found.</p>;
  }

  return (
    <Accordion type="multiple" className="w-full">
      {steps.map((step) => {
        const icon = statusIcon[step.status] ?? statusIcon.pending;
        return (
          <AccordionItem key={step.id} value={step.id}>
            <AccordionTrigger className="hover:no-underline py-2.5">
              <div className="flex items-center gap-3 text-sm">
                <span className={`font-mono text-base ${icon.className}`}>
                  {icon.symbol}
                </span>
                <span className="font-mono font-medium">{step.step_id}</span>
                <span className="text-xs text-muted-foreground">
                  {step.agent_id.split("/").pop()}
                </span>
                <StatusBadge status={step.status} />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {step.output ? (
                <ScrollArea className="max-h-[300px] w-full">
                  <pre className="rounded-md bg-muted p-3 text-xs font-mono whitespace-pre-wrap break-words">
                    {step.output}
                  </pre>
                </ScrollArea>
              ) : (
                <p className="text-xs text-muted-foreground">No output yet.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
