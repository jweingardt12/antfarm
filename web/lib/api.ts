import type { RunWithSteps, Story, AntfarmEvent, Workflow } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getWorkflows(): Promise<Workflow[]> {
  return fetchJSON("/api/workflows");
}

export async function getRuns(workflowId?: string): Promise<RunWithSteps[]> {
  const params = workflowId ? `?workflow=${encodeURIComponent(workflowId)}` : "";
  return fetchJSON(`/api/runs${params}`);
}

export async function getRunById(id: string): Promise<RunWithSteps> {
  return fetchJSON(`/api/runs/${encodeURIComponent(id)}`);
}

export async function getRunStories(id: string): Promise<Story[]> {
  return fetchJSON(`/api/runs/${encodeURIComponent(id)}/stories`);
}

export async function getRunEvents(id: string): Promise<AntfarmEvent[]> {
  return fetchJSON(`/api/runs/${encodeURIComponent(id)}/events`);
}
