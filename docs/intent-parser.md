# Payment intent parser (Day 3)

Client-side rules in `frontend/src/lib/intent/parsePaymentIntent.ts` — no LLM or paid API.

## Supported patterns (examples)

- **Amount**: `$100`, `100 dollars`, `send 100`
- **Beneficiary**: `my mum`, `my sister`, `to Ada`
- **Location**: Lagos, Abuja, Port Harcourt, Ibadan, Kano, Enugu, Benin City, or `Nigeria`
- **Schedule**: `on the 2nd of every month`, `monthly`, `every week`, `just once`

## Out of scope

- Non-Nigeria corridors (e.g. Nairobi) return a corridor error.
- Bank account numbers, FX quotes, and execution are not parsed here.

Run tests: `cd frontend && npm test`
