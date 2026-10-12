# Noma architecture

High-level reference for the shipped v0. Details and env setup: [README.md](../README.md), [PROGRESS.md](../PROGRESS.md).

## Layers

1. **Voice / chat UI** — intent capture, mandatory confirmation, inline or saved recipients.
2. **Intent parser** — structured payment plans (amount, beneficiary, schedule); Nigeria corridor only.
3. **Execution (Monad)** — `NomaScheduleRegistry`: authorization, limits, recurring schedules on-chain.
4. **Settlement** — `DirectTransferAdapter` today; `INomaSettlementAdapter` for Agora AUSD (`TODO(verify)` addresses).
5. **NGN delivery** — Paystack orchestration via Next.js API routes; Noma is not the money transmitter.

## Out of scope for v0

- Non–Nigeria corridors
- Custody of user fiat
- Moove, Arc, Base-specific integrations
- Aurora Intents (documented as future funding only)
