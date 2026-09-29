import { CREDENTIAL_STORAGE_KEY } from "./constants";

export type StoredCredential = {
  credentialId: string;
  /** Optional hint for the browser — not secret material. */
  transports?: string[];
};

export function readStoredCredential(): StoredCredential | undefined {
  if (typeof window === "undefined") return undefined;
  const raw = localStorage.getItem(CREDENTIAL_STORAGE_KEY);
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as StoredCredential;
    if (!parsed.credentialId) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

export function writeStoredCredential(credential: StoredCredential): void {
  localStorage.setItem(
    CREDENTIAL_STORAGE_KEY,
    JSON.stringify({
      credentialId: credential.credentialId,
      ...(credential.transports?.length
        ? { transports: credential.transports }
        : {}),
    }),
  );
}

export function clearStoredCredential(): void {
  localStorage.removeItem(CREDENTIAL_STORAGE_KEY);
}
