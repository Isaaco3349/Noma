const STORAGE_KEY = "noma-read-replies-aloud";

export function readRepliesAloudEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return false;
  return raw === "1";
}

export function writeRepliesAloudEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
}
