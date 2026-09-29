const SESSION_ADDRESS_KEY = "noma.session.address";

/** UI-only: last signed-in address for this browser tab session (not a secret). */
export function readSessionAddress(): `0x${string}` | null {
  if (typeof window === "undefined") return null;
  const address = sessionStorage.getItem(SESSION_ADDRESS_KEY);
  if (!address?.startsWith("0x")) return null;
  return address as `0x${string}`;
}

export function writeSessionAddress(address: `0x${string}`): void {
  sessionStorage.setItem(SESSION_ADDRESS_KEY, address);
}

export function clearSessionAddress(): void {
  sessionStorage.removeItem(SESSION_ADDRESS_KEY);
}
