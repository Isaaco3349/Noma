import { defineChain } from "viem";

/**
 * Monad Testnet — values from official Monad documentation:
 * - https://docs.monad.xyz/developer-essentials/testnet
 * - https://docs.monad.xyz/guides/add-monad-to-wallet/testnet
 *
 * Verified (docs, Sep 2026): chain ID 10143, symbol MON, decimals 18,
 * RPC https://testnet-rpc.monad.xyz, explorer https://testnet.monadvision.com
 */
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC_URL ??
          "https://testnet-rpc.monad.xyz",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "MonadVision",
      url: "https://testnet.monadvision.com",
    },
  },
  testnet: true,
});
