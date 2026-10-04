# Noma 60s demo script (Day 7)

1. **Hook** — “Diaspora senders shouldn’t fight chains and forms to pay family in Nigeria.”
2. **Recipients** — `/app/recipients`: show **Mum · Lagos** with Paystack bank details saved.
3. **Voice** — `/app`: mic → *“Send $10 to my mum in Lagos just once.”*
4. **Plan** — NGN estimate (Paystack), Confirm (passkey + Monad txs if configured).
5. **History** — `/app/history`: Monad plan id + Paystack ref (live or demo mode).
6. **Architecture** — Mera → Monad registry → adapter → Paystack NGN (orchestration only).

## Paystack live sandbox

1. Add `PAYSTACK_SECRET_KEY=sk_test_...` to `frontend/.env.local` (server-only).
2. Recipients/banks use the real test API; NGN **transfers** default to `NOMA_PAYSTACK_TRANSFER_MODE=auto` (demo disburse if sandbox balance is insufficient — common on test accounts).
3. Restart `npm run dev`.

Without the key, everything Paystack runs in **demo** mode (safe for judges, labeled in UI).

## Agora (bounty narrative)

1. Navbar shows **Agora AUSD on Monad** + live metrics from `/api/agora/status`.
2. Optional: set `AGORA_API_KEY` for “API connected” (free dashboard key).
3. For on-chain AUSD: see `docs/agora-integration.md` and `.env.example`.
