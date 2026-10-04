# Noma

Noma is a voice- and text-driven cross-border payment agent for the **diaspora → Nigeria** corridor, built for [Monad Metropolis](https://www.monad.xyz/) **Track 02: Consumer Products & Payments**.

You say or type: *“Send $100 to my mum in Lagos on the 2nd of every month.”* Noma turns that into a structured payment plan, you **confirm**, and settlement runs on **Monad** behind the scenes. Senders should not have to think about chains, gas, or routing.

## The problem

Remittance to Nigeria is expensive and fragmented: multiple apps, opaque FX, and Web3 friction for diaspora senders. Noma focuses on **one corridor** and one flow—**plan → confirm → execute → track**.

## Hackathon strategy (how we stand out)

Judges reward a **cohesive demo**, not a logo wall. Noma intentionally targets **three integration stories** that match the product:

| Target | Why Noma fits |
| --- | --- |
| **Track 02 — Consumer Products & Payments** | Chat/voice consumer UX, recurring plans, confirmation-first |
| **Agora — Best Cross-Border Payments App on Monad** | AUSD on Monad + live Agora metrics in app; `INomaSettlementAdapter`; optional `AGORA_API_KEY` — see `docs/agora-integration.md` |
| **Monad Foundation — Mera passkeys** | Seedless passkey login; no MetaMask in the happy path |

**Explicitly not stacking** (same slot or out of scope):

- **Privy / Dynamic** — same “embedded wallet” slot as **Mera**; we chose Mera for the Monad passkey bounty and docs alignment.
- **Aurora Intents** — strong optional bounty ($5k “any-chain liquidity → Monad”); **not in the v0 demo**. Architecture leaves room to fund from other chains later; no Aurora code in this repo until requirements are confirmed with the team.
- **Moove, Arc, Base** — out of scope per project rules.

**Realistic prize focus:** Track 02 + Agora + Mera (~$22.5k stack before grand champion). Aurora remains a **stretch** if time allows after Day 7.

## NGN last mile (Day 7 direction)

Noma **orchestrates**; a **licensed partner** pays NGN. Planned integration:

| Role | Choice | Status |
| --- | --- | --- |
| **NGN payout (banks / mobile money in Nigeria)** | **[Paystack](https://paystack.com/)** | Primary for API + Nigeria credibility; **stub/mock in demo** until keys and compliance review |
| **Alternates considered** | Flutterwave | Same class of partner; one rail in v0 to avoid scope creep |
| **Sender-side fiat ↔ crypto (sponsor perk)** | Mercuryo | Evaluate only if Nigeria coverage fits **funding** the sender; **not** the primary “pay mum in Lagos” rail until verified (`TODO(verify)`) |

UI and docs must stay honest: **orchestration layer, not a money transmitter**.

## Architecture

| Layer | Implementation |
| --- | --- |
| **UX** | Chat + voice → confirm → spoken replies (optional read-aloud) |
| **Intent** | Rule-based parser (no LLM); Nigeria corridor only |
| **Wallet** | Mera passkey → EOA on Monad testnet |
| **Execution** | `NomaScheduleRegistry` — limits, schedules, executor auth |
| **Settlement** | `DirectTransferAdapter` today; `INomaSettlementAdapter` for Agora/AUSD (`TODO(verify)` mainnet/testnet AUSD address) |
| **NGN delivery** | Paystack Transfer API via Next.js routes (`/api/paystack/*`, `/api/offramp/*`) |

## Build status vs Metropolis 7-day schedule

This matches the **deadline-oriented plan** (confirm final date on your Metropolis profile, e.g. Oct 14).

| Day | Metropolis deliverable | Noma status |
| --- | --- | --- |
| **1** | Repo, rules, palette, chat shell, Monad testnet | **Done** |
| **2** | Passkey / embedded wallet | **Done** (Mera) |
| **3** | Scheduling + spend-limit contract, Foundry tests, testnet deploy | **Done** (contracts + your deploy) |
| **4** | Text intent → payment plan + confirmation | **Done** |
| **5** | Voice → same parser | **Done** |
| **6** | AUSD settlement adapter (direct first, Agora behind interface) | **Done** (direct + interface; mock token on testnet; Agora impl pending) |
| **7** | Transaction tracking, recipient management, demo flow | **Done** (Paystack API + recipients + history; live mode with `PAYSTACK_SECRET_KEY`) |

Execution order in repo differed slightly (parser before contracts), but **deliverables align** with the schedule above.

## Honest scope (what is real today)

| Real on testnet | Mocked / planned |
| --- | --- |
| Mera passkey sign-in, MON balance | Verified **AUSD** address (`TODO(verify)`) |
| `createPlan` + `executePlan` after **Confirm** (when `.env.local` set) | Full Agora mint/redeem routes (authenticated API) |
| Mock ERC-20 or **AUSD** as settlement token; Agora `/v0/metrics` in UI | Paystack funded sandbox transfers (auto falls back to demo NGN) |
| Rule-based parser + voice + TTS | Aurora cross-chain funding |
| Payout sink = deployer wallet (demo) | Licensed remittance claims |

**Try in UI:** `Send $10 to my mum in Lagos just once` → sign in → **Confirm** (passkey needs **mock token + MON** on the passkey address).

## Tech stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind, viem (+ wagmi chain config)
- **Contracts**: Solidity + Foundry (`/contracts`)
- **Backend**: thin Next.js routes (Day 7 off-ramp stub)

## Finalize for submission (lost deployer key OK)

See **[docs/finalize-hackathon.md](docs/finalize-hackathon.md)** — new testnet wallet → deploy → mint to Mera passkey → Paystack test + Agora metrics ($0 demo path) → Vercel.

## Setup

### Frontend

```bash
cd frontend
cp ../.env.example .env.local   # fill after deploy (see docs/day6-onchain.md)
npm install
npm run dev
```

Open [http://localhost:3000/app](http://localhost:3000/app).

### Contracts

```powershell
cd contracts
# First time: forge install foundry-rs/forge-std --no-commit
& "$env:USERPROFILE\.foundry\bin\forge.exe" test
```

Deploy and env vars: [docs/day6-onchain.md](docs/day6-onchain.md).

## Day 7 demo script (target)

1. **Problem** — diaspora sender, one sentence pain.
2. **Voice** — mic: *“Send $10 to my mum in Lagos just once.”*
3. **Plan card** — confirm; show **MonadVision** create/settlement links.
4. **Tracking** — plan id + status in UI (Day 7).
5. **NGN** — “Paystack transfer queued” stub + compliance one-liner.
6. **Architecture** — one slide: Mera → Monad registry → adapter → Paystack (planned).

Run this end-to-end yourself and log bugs in [PROGRESS.md](./PROGRESS.md). Full script: [docs/demo-script.md](docs/demo-script.md).

### Paystack (server)

Add to `frontend/.env.local` (never commit):

```env
PAYSTACK_SECRET_KEY=sk_test_...
NOMA_DEMO_USD_NGN_RATE=1550
```

Restart `npm run dev`. Without the secret key, banks/recipients/disburse use **demo** mode (labeled in UI).

## Auth (passkey wallet)

Noma uses **[Mera](https://mera.category.xyz/)** per the [Monad passkey guide](https://docs.monad.xyz/guides/mera):

- **Create account** / **Sign in** — WebAuthn + PRF.
- Only **credential id** in `localStorage`; signing keys in memory until sign-out.
- Optional **recovery phrase** export (BIP-39 from PRF; not a separate Mera export API).
- **Test MON**: [faucet.monad.xyz](https://faucet.monad.xyz).
- **Desktop Chrome**: PRF via Google Password Manager — [authenticator support](https://mera.category.xyz/authenticator-support).

## Compliance

Noma is an **orchestration and UX layer**. Fiat payout in Nigeria is intended via **licensed** partners (Paystack in plan). Not a money transmitter; demo copy is not legal advice. Policies: `/legal/terms`, `/legal/privacy`.

## Docs

- [PROGRESS.md](./PROGRESS.md) — log and decisions  
- [docs/day6-onchain.md](docs/day6-onchain.md) — deploy + env  
- [docs/voice-day5.md](docs/voice-day5.md) — voice/TTS  
- [docs/intent-parser.md](docs/intent-parser.md) — example phrases  
- [docs/contracts-day4.md](docs/contracts-day4.md) — registry/adapter  

## Monad testnet

Chain params: `frontend/src/lib/chains/monadTestnet.ts` ([Monad docs](https://docs.monad.xyz/developer-essentials/testnet)).

## License

TBD for hackathon submission.
