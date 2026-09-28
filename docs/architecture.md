# Noma architecture (planned)

High-level reference for the ~7-day build. Implementation status is tracked in [PROGRESS.md](../PROGRESS.md).

## Layers

1. **Voice / chat UI** — intent capture with mandatory confirmation and spend limits.
2. **Intent parser** — structured payment plans (amount, beneficiary, schedule).
3. **Execution (Monad)** — authorization, limits, recurring schedules on-chain.
4. **Settlement** — AUSD via an adapter (direct token transfer and/or Agora Stablecoin API TBD).
5. **NGN delivery** — licensed local off-ramp partner; Noma orchestrates only.

## Out of scope for v0

- Non–Nigeria corridors
- Custody of user fiat
- Moove, Arc, Base-specific integrations
