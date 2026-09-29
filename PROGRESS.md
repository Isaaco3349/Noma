# Noma — progress log

Running log for the ~7-day Monad Metropolis build.

## Done

- **Day 1**: Repo skeleton (`/contracts`, `/frontend`, `/docs`), root `.gitignore`, `.env.example`, `.cursor/rules`, `README.md`, design tokens, chat UI shell with mocked payment plan card, Monad testnet chain definition for wagmi/viem (no wallet connect yet).
- **Day 2**: Mera passkey wallet abstraction (`frontend/src/lib/wallet/`), onboarding UI in navbar, credentialId-only `localStorage`, session signing key in memory only, MON balance on Monad testnet, faucet link, friendly Mera errors (incl. PRF / Chrome), optional recovery phrase export (BIP-39 from PRF per Monad guide — not a Mera API).

## In progress

- _(Day 3+: intent parser, contracts)_

## Blocked

- _(none)_

## Decisions

| Date | Decision |
| --- | --- |
| Day 1 | Nigeria corridor only; Monad only; no Moove/Arc/Base. |
| Day 1 | Chat-first UI with mandatory confirmation pattern (mock plan on Day 1). |
| Day 1 | Monad testnet RPC/chain ID taken from official Monad docs (see `monadTestnet.ts`). |
| Day 2 | **Wallet provider: Mera** (`@category-labs/mera@0.2.0`) for passkey → EOA on Monad testnet; swap via `WalletProvider` interface. |
| Day 2 | Persist only passkey `credentialId` (+ optional `transports`); recovery phrase shown only on explicit export after passkey verify. |
| Day 2 | Testnet MON faucet: https://faucet.monad.xyz (Monad docs). PRF help link: https://mera.category.xyz/authenticator-support (verified). |

## Open questions

- **Agora bounty criteria**: Exact judging rubric and required Stablecoin API vs direct AUSD usage for “Best Cross-Border Payments App on Monad”.
- **Mera Node engine**: Package declares `node >= 24`; local dev on Node 22 works for install/build today — confirm CI Node version.
- **Aurora Intents**: Feasibility and fit for Nigeria corridor settlement vs adapter-only AUSD transfers.
- **NGN off-ramp partner**: Which licensed partner API to integrate for demo vs production.
