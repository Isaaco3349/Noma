import type { TrackedPlan } from "./types";

const STORAGE_KEY = "noma-plan-history-v1";

export function readPlanHistory(): TrackedPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TrackedPlan[];
    return Array.isArray(parsed) ? parsed.sort((a, b) => b.createdAt - a.createdAt) : [];
  } catch {
    return [];
  }
}

export function appendTrackedPlan(entry: TrackedPlan): TrackedPlan[] {
  const list = readPlanHistory();
  const next = [entry, ...list.filter((p) => p.id !== entry.id)];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}
