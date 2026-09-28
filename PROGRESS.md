# Noma — progress log

Running log for the ~7-day Monad Metropolis build.

## Done

- **Day 1**: Repo skeleton (`/contracts`, `/frontend`, `/docs`), root `.gitignore`, `.env.example`, `.cursor/rules`, `README.md`, design tokens, chat UI shell with mocked payment plan card, Monad testnet chain definition for wagmi/viem (no wallet connect yet).

## In progress

- _(Day 2+: wallet connect, intent parser, contracts)_

## Blocked

- _(none)_

## Decisions

| Date | Decision |
| --- | --- |
| Day 1 | Nigeria corridor only; Monad only; no Moove/Arc/Base. |
| Day 1 | Chat-first UI with mandatory confirmation pattern (mock plan on Day 1). |
| Day 1 | Monad testnet RPC/chain ID taken from official Monad docs (see `monadTestnet.ts`). |

## Open questions

- **Agora bounty criteria**: Exact judging rubric and required Stablecoin API vs direct AUSD usage for “Best Cross-Border Payments App on Monad”.
- **Wallet provider**: Mera vs Privy vs Dynamic for passkey/embedded onboarding.
- **Aurora Intents**: Feasibility and fit for Nigeria corridor settlement vs adapter-only AUSD transfers.
- **NGN off-ramp partner**: Which licensed partner API to integrate for demo vs production.
