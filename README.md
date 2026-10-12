# Noma

Noma is a voice- and text-driven cross-border payment agent for the **diaspora → Nigeria** corridor, built for [Monad Metropolis](https://www.monad.xyz/) **Track 02: Consumer Products & Payments**.

You say or type: *“Send $100 to my mum in Lagos on the 2nd of every month.”* Noma turns that into a structured payment plan, you **confirm**, and settlement runs on **Monad** behind the scenes. Senders should not have to think about chains, gas, or routing.

## The problem

Remittance to Nigeria is expensive and fragmented: multiple apps, opaque FX, and Web3 friction for diaspora senders. Noma focuses on **one corridor** and one flow—**plan → confirm → execute → track**.

## Monad Metropolis submission

Noma is built as one product story across **three prize angles** (cohesive demo, not a integration checklist):

| Submission angle | What we ship |
| --- | --- |
| **Track 02 — Consumer Products & Payments** | Chat/voice UX, payment plans, confirm/cancel, recipients, history |
| **Agora — Best Cross-Border Payments App on Monad** | Cross-border diaspora → Nigeria; `INomaSettlementAdapter`; live Agora metrics in the app — see [docs/agora-integration.md](docs/agora-integration.md) |
| **Monad Foundation — Mera passkeys** | Passkey sign-in and transaction signing; no MetaMask in the happy path |

**Out of scope for this repo** (by design):

- **Privy / Dynamic** — same embedded-wallet slot as **Mera**; we use Mera for Monad passkey docs and the Mera bounty.
- **Aurora Intents** — optional future funding path; no Aurora code in v0.
- **Moove, Arc, Base** — not part of the Nigeria / Monad corridor.

Optional stretch bounty (**Aurora**) is documented as future work only; the submitted demo does not depend on it.

## NGN last mile

Noma **orchestrates**; a **licensed partner** pays NGN.

| Role | Choice | Status |
| --- | --- | --- |
| **NGN payout (banks in Nigeria)** | **[Paystack](https://paystack.com/)** | Test API for banks/recipients; transfers via Transfer API with **`auto`** mode (demo NGN when sandbox balance is insufficient) |
| **Alternates considered** | Flutterwave | Same class of partner; not wired in v0 |
| **Sender-side fiat ↔ crypto** | Mercuryo | Evaluate for sender funding only; `TODO(verify)` Nigeria fit |

UI copy stays honest: **orchestration layer, not a money transmitter**.

## Architecture

| Layer | Implementation |
| --- | --- |
| **UX** | Chat + voice → plan card → inline or saved recipient → confirm → optional read-aloud |
| **Intent** | Rule-based parser (no LLM); Nigeria places and names; unit tests |
| **Wallet** | [Mera](https://mera.category.xyz/) passkey → EOA on Monad testnet |
| **Execution** | `NomaScheduleRegistry` — limits, schedules, executor auth |
| **Settlement** | `DirectTransferAdapter` + `INomaSettlementAdapter` (Agora AUSD path — `TODO(verify)` token address) |
| **NGN delivery** | Paystack via Next.js routes (`/api/paystack/*`, `/api/offramp/*`) |

End-to-end reference: [docs/architecture.md](docs/architecture.md).

## What is implemented

| Area | Includes |
| --- | --- |
| **Frontend** | Landing + full-width app shell, chat, plan cards, inline recipient setup on pending plans |
| **Wallet** | Mera sign-up/sign-in, copy address, test MON faucet link, optional recovery phrase export |
| **On-chain** | Deployed registry + adapter on Monad testnet; confirm → approve, create, execute |
| **Paystack** | Banks, recipient resolve/save, NGN quote on plan, disburse orchestration |
| **Voice** | Mic STT + TTS (Chrome/Edge desktop; see [docs/voice.md](docs/voice-day5.md)) |
| **Agora** | Public metrics + `/api/agora/status`; optional `AGORA_API_KEY` |
| **Contracts** | Foundry tests for registry/adapter |

## Honest scope (demo vs production)

| Works on testnet today | Labeled demo / planned |
| --- | --- |
| Mera passkey, MON balance, on-chain confirm when env + token funded | Production **AUSD** address (`TODO(verify)`) |
| Mock ERC-20 settlement (or AUSD if configured and wallet holds balance) | Full Agora authenticated mint/redeem |
| Paystack live test API; **auto** demo NGN when sandbox unfunded | Aurora cross-chain funding |
| Rule-based parser, recipients, history, MonadVision tx links | Licensed remittance operator claims |

**Try in UI:** `Send $10 to my mum in Lagos just once` → sign in → add bank on plan or use saved recipient → **Confirm** (passkey needs **MON + settlement token** on the passkey address).

## Tech stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind, viem
- **Contracts**: Solidity + Foundry (`/contracts`)
- **Backend**: Next.js route handlers (Paystack, off-ramp, Agora, chain config)

## Deploy and env

See **[docs/finalize-hackathon.md](docs/finalize-hackathon.md)** — testnet deploy → mint to Mera passkey → Paystack test key → Vercel.

On-chain env vars: [docs/onchain-deploy.md](docs/day6-onchain.md). Validate local placeholders: `cd frontend && npm run verify-env`.

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

## Demo video (60s)

Full script: **[docs/demo-script.md](docs/demo-script.md)**.

1. **Hook** — diaspora → Nigeria without chain jargon.
2. **Wallet** — Mera passkey; copy address; fund MON + settlement token on testnet.
3. **Chat** — voice or text (e.g. any name + Nigerian city); plan card with NGN estimate.
4. **Recipient** — bank details on the plan card or pick a saved beneficiary; **Confirm**; MonadVision links.
5. **History** — `/app/history`; navbar **Agora** metrics.
6. **One line** — Mera → Monad registry/adapter → Paystack NGN orchestration.

### Paystack (server)

Add to `frontend/.env.local` or Vercel (never commit):

```env
PAYSTACK_SECRET_KEY=sk_test_...
NOMA_DEMO_USD_NGN_RATE=1550
```

Without the secret key, Paystack routes run in **demo** mode (labeled in UI).

## Auth (passkey wallet)

Noma uses **[Mera](https://mera.category.xyz/)** per the [Monad passkey guide](https://docs.monad.xyz/guides/mera):

- **Create account** / **Sign in** — WebAuthn + PRF.
- Only **credential id** in `localStorage`; signing keys in memory until sign-out.
- Optional **recovery phrase** export (BIP-39 from PRF; not a separate Mera export API).
- **Test MON**: [faucet.monad.xyz](https://faucet.monad.xyz).
- **Desktop Chrome**: PRF via Google Password Manager — [authenticator support](https://mera.category.xyz/authenticator-support).

Passkeys are **per domain** — production (Vercel) and localhost use different credentials.

## Compliance

Noma is an **orchestration and UX layer**. Fiat payout in Nigeria is intended via **licensed** partners (Paystack). Not a money transmitter; demo copy is not legal advice. Policies: `/legal/terms`, `/legal/privacy`.

## Docs

| Doc | Topic |
| --- | --- |
| [PROGRESS.md](./PROGRESS.md) | Decisions and open questions |
| [docs/onchain-deploy.md](docs/day6-onchain.md) | Deploy + env |
| [docs/voice.md](docs/voice-day5.md) | Mic + TTS |
| [docs/intent-parser.md](docs/intent-parser.md) | Example phrases |
| [docs/contracts-registry.md](docs/contracts-day4.md) | Registry + adapter |
| [docs/agora-integration.md](docs/agora-integration.md) | Agora + AUSD |
| [docs/finalize-hackathon.md](docs/finalize-hackathon.md) | Submission checklist |

## Monad testnet

Chain params: `frontend/src/lib/chains/monadTestnet.ts` ([Monad docs](https://docs.monad.xyz/developer-essentials/testnet)).

## License

TBD for hackathon submission.
