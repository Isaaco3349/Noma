"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toFriendlyWalletError, type FriendlyWalletError } from "@/lib/wallet/errors";
import {
  clearSessionAddress,
  readSessionAddress,
  writeSessionAddress,
} from "@/lib/wallet/sessionSnapshot";
import type { WalletClient } from "viem";
import type { WalletAuthState, WalletProvider } from "@/lib/wallet/types";

async function loadMeraWallet(): Promise<WalletProvider> {
  const { meraWallet } = await import("@/lib/wallet/meraWallet");
  return meraWallet;
}

type WalletContextValue = {
  auth: WalletAuthState;
  busy: boolean;
  error: FriendlyWalletError | null;
  clearError: () => void;
  signUp: () => Promise<boolean>;
  signIn: () => Promise<boolean>;
  signOut: () => void;
  exportRecoveryPhrase: () => Promise<string>;
  withWalletClient: () => Promise<WalletClient | null>;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<WalletAuthState>({ status: "signed_out" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<FriendlyWalletError | null>(null);

  useEffect(() => {
    const address = readSessionAddress();
    if (address) {
      setAuth({ status: "signed_in", address });
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const signUp = useCallback(async (): Promise<boolean> => {
    setBusy(true);
    setError(null);
    try {
      const wallet = await loadMeraWallet();
      const address = await wallet.signUp();
      writeSessionAddress(address);
      setAuth({ status: "signed_in", address });
      return true;
    } catch (e) {
      setError(toFriendlyWalletError(e));
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const signIn = useCallback(async (): Promise<boolean> => {
    setBusy(true);
    setError(null);
    try {
      const wallet = await loadMeraWallet();
      const address = await wallet.signIn();
      writeSessionAddress(address);
      setAuth({ status: "signed_in", address });
      return true;
    } catch (e) {
      setError(toFriendlyWalletError(e));
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const signOut = useCallback(() => {
    void loadMeraWallet().then((wallet) => wallet.signOut());
    clearSessionAddress();
    setAuth({ status: "signed_out" });
    setError(null);
  }, []);

  const withWalletClient = useCallback(async (): Promise<WalletClient | null> => {
    try {
      const wallet = await loadMeraWallet();
      let client = wallet.getWalletClient();
      if (!client) {
        await wallet.signIn();
        client = wallet.getWalletClient();
      }
      return client;
    } catch {
      return null;
    }
  }, []);

  const exportRecoveryPhrase = useCallback(async () => {
    setError(null);
    try {
      const wallet = await loadMeraWallet();
      return await wallet.exportRecoveryPhrase();
    } catch (e) {
      const friendly = toFriendlyWalletError(e);
      setError(friendly);
      throw friendly;
    }
  }, []);

  const value = useMemo(
    () => ({
      auth,
      busy,
      error,
      clearError,
      signUp,
      signIn,
      signOut,
      exportRecoveryPhrase,
      withWalletClient,
    }),
    [
      auth,
      busy,
      error,
      clearError,
      signUp,
      signIn,
      signOut,
      exportRecoveryPhrase,
      withWalletClient,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}
