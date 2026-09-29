"use client";

import type { ReactNode } from "react";
import { WalletProvider } from "./WalletContext";

export function WalletShell({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
