import {
  createPasskeyWithPrfOutput,
  createSecp256k1SigningSession,
  getPasskeyPrfOutput,
  type Secp256k1SigningSession,
} from "@category-labs/mera";
import { toViemAccount } from "@category-labs/mera/viem";
import { createWalletClient, http, type LocalAccount, type WalletClient } from "viem";
import { monadTestnet } from "@/lib/chains/monadTestnet";
import { RP_NAME } from "./constants";
import {
  readStoredCredential,
  writeStoredCredential,
} from "./credentialStorage";
import {
  deriveEvmPrivateKey,
  prfOutputToRecoveryPhrase,
} from "./deriveEvmKey";
import type { WalletProvider } from "./types";

function rpId(): string {
  if (typeof window === "undefined") {
    throw new Error("wallet requires browser");
  }
  return window.location.hostname;
}

function openSession(prfOutput: Uint8Array): Secp256k1SigningSession {
  return createSecp256k1SigningSession({
    privateKey: deriveEvmPrivateKey(prfOutput),
  });
}

function createMonadWalletClient(account: LocalAccount): WalletClient {
  const rpc =
    process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC_URL ??
    monadTestnet.rpcUrls.default.http[0];
  return createWalletClient({
    account,
    chain: monadTestnet,
    transport: http(rpc),
  });
}

let session: Secp256k1SigningSession | undefined;

function endSession(): void {
  session?.end();
  session = undefined;
}

async function establishSessionFromPasskey(
  credential?: ReturnType<typeof readStoredCredential>,
): Promise<`0x${string}`> {
  const { prfOutput, credentialId } = await getPasskeyPrfOutput({
    rpId: rpId(),
    credential,
  });

  const stored = readStoredCredential();
  writeStoredCredential(
    stored?.credentialId === credentialId
      ? stored
      : { credentialId },
  );

  endSession();
  session = openSession(prfOutput);
  return toViemAccount(session).address;
}

export const meraWallet: WalletProvider = {
  async signUp() {
    const created = await createPasskeyWithPrfOutput({
      rp: { id: rpId(), name: RP_NAME },
      user: {
        name: `noma-${crypto.randomUUID()}@local`,
        displayName: "Noma user",
      },
    });

    writeStoredCredential({
      credentialId: created.credentialId,
      transports: created.transports
        ? [...created.transports]
        : undefined,
    });

    endSession();
    session = openSession(created.prfOutput);
    return toViemAccount(session).address;
  },

  async signIn() {
    const stored = readStoredCredential();
    return establishSessionFromPasskey(stored);
  },

  signOut() {
    endSession();
  },

  getAddress() {
    if (!session) return null;
    return toViemAccount(session).address;
  },

  getViemAccount() {
    if (!session) return null;
    return toViemAccount(session);
  },

  getWalletClient() {
    const account = this.getViemAccount();
    if (!account) return null;
    return createMonadWalletClient(account);
  },

  async exportRecoveryPhrase() {
    const stored = readStoredCredential();
    const { prfOutput } = await getPasskeyPrfOutput({
      rpId: rpId(),
      credential: stored,
    });
    return prfOutputToRecoveryPhrase(prfOutput);
  },
};
