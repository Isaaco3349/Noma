# Noma — progress log

Engineering log for the Monad Metropolis build. Feature status for judges and contributors is summarized in [README.md](./README.md).

## Shipped

- **Product shell** — `/contracts`, `/frontend`, `/docs`, design tokens, Nigeria-only corridor rules, chat-first confirm pattern.
- **Wallet** — Mera passkey (`@category-labs/mera`), credential id in `localStorage`, session keys in memory, MON balance, faucet link, PRF-friendly errors, optional recovery phrase export.
- **Intent** — Rule-based parser with tests; plan card; confirm/cancel; broad Nigerian places and beneficiary names.
- **Contracts** — `NomaScheduleRegistry`, `DirectTransferAdapter`, `INomaSettlementAdapter`; Foundry tests; deploy + mint scripts.
- **On-chain confirm** — Registry create/execute on Monad testnet via Mera wallet client; server chain-config for Vercel env.
- **Voice** — Web Speech STT (mic) + TTS; read-aloud toggle for typed sends and confirm/cancel.
- **Paystack** — Banks, recipient API, NGN quote, disburse; `auto` transfer mode; recipient UI + inline setup on payment plans.
- **Tracking** — Plan history; off-ramp state on confirm.
- **Agora** — Public metrics + status route; navbar strip; integration doc.
- **Polish** — Full-width app layout, copy wallet address, return-to-chat from Recipients when linked from a plan.

## In progress

- _(Hackathon: demo video and Devpost copy.)_

## Blocked

- _(none)_

## Decisions

| Topic | Decision |
| --- | --- |
| Corridor | Nigeria diaspora → Nigeria only; Monad chain only; no Moove/Arc/Base. |
| Wallet | **Mera** for passkey → EOA; no Privy/Dynamic in v0. |
| Intent | Deterministic in-browser parser; no LLM. |
| On-chain | Registry + adapter; monthly period = 30 days (documented approximation). |
| Settlement | Direct adapter today; Agora AUSD via same interface — address `TODO(verify)`. |
| Hackathon | Primary angles: **Track 02 + Agora + Mera**. Aurora optional later. |
| NGN | **Paystack** primary; Flutterwave alternate; Mercuryo sender-side only — `TODO(verify)`. |
| RPC / faucet | From [Monad docs](https://docs.monad.xyz/); PRF help at [mera.category.xyz/authenticator-support](https://mera.category.xyz/authenticator-support). |

## Open questions

- **Agora bounty**: Stablecoin API vs direct AUSD usage for judging rubric.
- **Mera**: Package `node >= 24` vs local Node 22 — align CI if needed.
- **Aurora Intents**: Pursue as stretch bounty or skip; no code until confirmed.
- **Paystack**: Sandbox transfer limits vs demo narrative in video.
- **Mercuryo**: Nigeria coverage before marketing sender on-ramp.
