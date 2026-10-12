# Payment intent parser

Client-side rules in `frontend/src/lib/intent/parsePaymentIntent.ts` — no LLM or paid API.

## Supported patterns (examples)

- **Amount**: `$100`, `100 dollars`, `send 100`
- **Beneficiary**: any name or label — `Chidi`, `my friend`, `Ada`, `Uncle Tunde` (family words like mum/mom still map to a display name)
- **Location**: Nigerian cities and states in the place list (e.g. Lagos, Abuja, plus other cities and states nationwide)
- **Schedule**: `on the 2nd of every month`, `monthly`, `every week`, `just once`

## Out of scope

- Non-Nigeria corridors (e.g. Nairobi) return a corridor error.
- Bank account numbers, FX quotes, and execution are not parsed here.

Run tests: `cd frontend && npm test`
