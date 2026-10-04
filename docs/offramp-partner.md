# Paystack NGN off-ramp (Day 7)

## Integration

Server-only REST client: `frontend/src/lib/paystack/server.ts`  
Routes:

| Route | Purpose |
| --- | --- |
| `GET /api/paystack/banks` | Nigerian banks list |
| `POST /api/paystack/recipient` | Resolve account + create transfer recipient |
| `POST /api/offramp/quote` | USD → NGN indicative quote |
| `POST /api/offramp/disburse` | Initiate Paystack transfer (kobo) |

Secret: `PAYSTACK_SECRET_KEY` in `frontend/.env.local` (not `NEXT_PUBLIC_*`).

## Modes

- **Demo** — no secret key; demo banks, fake recipient/transfer codes; UI labels `demo`.
- **Live sandbox** — `sk_test_...` from [Paystack dashboard](https://dashboard.paystack.com/#/settings/developer); uses Transfer API; fund test balance per Paystack docs.

## User flow

1. Save **Mum · Lagos** (+ bank account) under `/app/recipients`.
2. Chat plan to **Mum** in **Lagos** auto-matches nickname + city.
3. **Confirm** → Monad registry (if env set) → Paystack disburse.

Noma does not custody fiat; Paystack executes NGN transfer as licensed rail.
