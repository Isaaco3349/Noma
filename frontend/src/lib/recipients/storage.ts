import type { SavedRecipient } from "./types";

const STORAGE_KEY = "noma-recipients-v1";

export function readRecipients(): SavedRecipient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedRecipient[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeRecipients(list: SavedRecipient[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function upsertRecipient(recipient: SavedRecipient): SavedRecipient[] {
  const list = readRecipients();
  const next = [...list.filter((r) => r.id !== recipient.id), recipient];
  writeRecipients(next);
  return next;
}

export function findRecipientForPlan(
  beneficiary: string,
  location: string,
  list = readRecipients(),
): SavedRecipient | undefined {
  const ben = beneficiary.toLowerCase();
  const loc = location.toLowerCase().replace(/\s+state$/, "");

  const locMatches = (saved: string) => {
    const s = saved.toLowerCase().replace(/\s+state$/, "");
    return s === loc || s.startsWith(loc) || loc.startsWith(s);
  };

  return (
    list.find(
      (r) =>
        r.nickname.toLowerCase() === ben && locMatches(r.location),
    ) ??
    list.find((r) => r.nickname.toLowerCase() === ben) ??
    list.find((r) => r.nickname.toLowerCase().includes(ben))
  );
}
