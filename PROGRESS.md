# Noma — progress log

Running log for the ~7-day Monad Metropolis build.

## Done

- **Day 1**: Repo skeleton (`/contracts`, `/frontend`, `/docs`), root `.gitignore`, `.env.example`, `.cursor/rules`, `README.md`, design tokens, chat UI shell with mocked payment plan card, Monad testnet chain definition for wagmi/viem (no wallet connect yet).
- **Day 2**: Mera passkey wallet abstraction (`frontend/src/lib/wallet/`), onboarding UI in navbar, credentialId-only `localStorage`, session signing key in memory only, MON balance on Monad testnet, faucet link, friendly Mera errors (incl. PRF / Chrome), optional recovery phrase export (BIP-39 from PRF per Monad guide — not a Mera API).
- **Day 3**: Rule-based payment intent parser (`frontend/src/lib/intent/`), live chat send → structured plan card, confirm/cancel UX (passkey required to confirm; no on-chain execution yet), unit tests for parser.
- **Day 4**: `NomaScheduleRegistry` + `DirectTransferAdapter` + `INomaSettlementAdapter`; spend caps, executor authorization, one-time/monthly/weekly schedules; Foundry tests (7 passing); deploy script stub.
- **Day 5**: Browser Web Speech API — mic STT on `/app` chat, assistant reply spoken via TTS after voice sends (Chrome/Edge; HTTPS or localhost).
- **Day 5+ polish**: “Read replies aloud” toggle (typed + confirm/cancel); USDT→USD demo parsing; clearer handle/USDT errors.
- **Day 6**: Confirm → `NomaScheduleRegistry` on Monad testnet (env addresses), approve + create + execute via Mera wallet client; deploy script logs env vars.

- **Day 7**: Paystack server API (banks, resolve, transfer recipient, disburse), recipient management UI, plan history, NGN quote on plan card, confirm → Monad + Paystack orchestration, demo script.
- **Finalize**: Paystack `auto` transfer mode (demo NGN when sandbox balance insufficient); Agora public metrics + status API + navbar strip; `docs/agora-integration.md`.

## In progress

- _(Final: GitHub + Vercel deploy, demo video)_

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
| Day 3 | **Intent parser**: deterministic rules in-browser (no LLM/API). Confirm gated on Mera sign-in; execution deferred to Day 6+. |
| Day 4 | On-chain plans via registry + adapter interface; monthly period = 30 days (documented approximation); AUSD address still TODO(verify). |
| Hackathon | **3-bounty focus**: Track 02 + Agora (adapter) + Mera. No Privy/Dynamic stack. Aurora stretch only after Day 7. |
| Day 7 NGN | **Paystack** primary for Nigeria payout API (stub in demo); Flutterwave alternate; Mercuryo sender-side only — TODO(verify) Nigeria product fit. |

## Open questions

- **Agora bounty criteria**: Exact judging rubric and required Stablecoin API vs direct AUSD usage for “Best Cross-Border Payments App on Monad”.
- **Mera Node engine**: Package declares `node >= 24`; local dev on Node 22 works for install/build today — confirm CI Node version.
- **Aurora Intents**: Pursue for $5k bounty post–Day 7 or skip; no code until team confirms.
- **Paystack**: Sandbox keys + which transfer API (recipient bank vs dedicated cross-border product) for demo narrative.
- **Mercuryo**: Confirm Nigeria coverage before mentioning in live demo beyond README plan.
