import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AntfarmEvent } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseTS(ts: string | null | undefined): Date | null {
  if (!ts) return null;
  let s = ts;
  if (!s.endsWith("Z") && !s.includes("+")) {
    s = s.replace(" ", "T") + "Z";
  }
  return new Date(s);
}

export function relativeTime(ts: string | null | undefined): string {
  const d = parseTS(ts);
  if (!d) return "—";
  const diff = Date.now() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatEventDesc(evt: AntfarmEvent): string {
  const e = evt.event;
  const story = evt.storyTitle
    ? `${evt.storyId}: "${evt.storyTitle}"`
    : evt.storyId || "";
  switch (e) {
    case "run.started":
      return "Run started";
    case "run.completed":
      return "Run completed";
    case "run.failed":
      return "Run failed";
    case "step.pending":
      return "Step pending";
    case "step.running":
      return "Claimed step";
    case "step.done":
      return "Step completed";
    case "step.failed":
      return "Step failed" + (evt.detail ? `: ${evt.detail.slice(0, 80)}` : "");
    case "step.timeout":
      return "Step timed out" + (evt.detail ? ` — ${evt.detail}` : "");
    case "story.started":
      return `Claimed story ${story}`;
    case "story.done":
      return `Completed ${story}`;
    case "story.verified":
      return `Verified ${story}`;
    case "story.retry":
      return `Retry ${story}` + (evt.detail ? ` — ${evt.detail.slice(0, 80)}` : "");
    case "story.failed":
      return `Story failed ${story}`;
    case "pipeline.advanced":
      return "Pipeline advanced";
    default:
      return e;
  }
}

export function formatTime(ts: string): string {
  const d = parseTS(ts);
  if (!d) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
