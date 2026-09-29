import type { LocalAccount, WalletClient } from "viem";

export type WalletAuthState =
  | { status: "signed_out" }
  | { status: "signed_in"; address: `0x${string}` };

export interface WalletProvider {
  signUp(): Promise<`0x${string}`>;
  signIn(): Promise<`0x${string}`>;
  signOut(): void;
  getAddress(): `0x${string}` | null;
  getViemAccount(): LocalAccount | null;
  getWalletClient(): WalletClient | null;
  /** Derive recovery phrase after passkey verification; never persisted. */
  exportRecoveryPhrase(): Promise<string>;
}
