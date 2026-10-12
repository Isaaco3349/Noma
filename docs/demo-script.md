# Noma 60s demo script

1. **Hook** — “Diaspora senders shouldn’t fight chains and forms to pay family in Nigeria.”
2. **Wallet** — Mera passkey on `/app`; copy address; testnet MON + settlement token funded.
3. **Chat** — Voice (desktop Chrome) or type: e.g. *“Send $10 to my mum in Lagos just once”* or any name + Nigerian city.
4. **Plan** — NGN estimate; add bank on the plan card or pick a saved beneficiary → **Confirm** (passkey + Monad txs).
5. **History** — `/app/history`: plan id + Paystack ref (live or demo mode).
6. **Agora** — Navbar metrics; one line: Mera → Monad registry/adapter → Paystack NGN (orchestration only).

## Paystack live sandbox

1. Add `PAYSTACK_SECRET_KEY=sk_test_...` to `frontend/.env.local` (server-only).
2. Recipients/banks use the real test API; NGN **transfers** default to `NOMA_PAYSTACK_TRANSFER_MODE=auto` (demo disburse if sandbox balance is insufficient — common on test accounts).
3. Restart `npm run dev`.

Without the key, everything Paystack runs in **demo** mode (safe for judges, labeled in UI).

## Agora (bounty narrative)

1. Navbar shows **Agora AUSD on Monad** + live metrics from `/api/agora/status`.
2. Optional: set `AGORA_API_KEY` for “API connected” (free dashboard key).
3. For on-chain AUSD: see `docs/agora-integration.md` and `.env.example`.
