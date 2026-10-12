import { createConfig, http } from "wagmi";
import { monadTestnet } from "@/lib/chains/monadTestnet";

/**
 * Wagmi config for Monad testnet only. User wallet is Mera passkey, not wagmi connect.
 */
export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(
      process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC_URL ??
        monadTestnet.rpcUrls.default.http[0],
    ),
  },
  ssr: true,
});
