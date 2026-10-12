# Noma

Noma is a voice and text cross-border payment agent for the **diaspora to Nigeria** corridor, built for [Monad Metropolis](https://www.monad.xyz/) **Track 02: Consumer Products & Payments**.

You say or type something like *“Send $100 to family in Lagos on the 2nd of every month.”* Noma turns that into a structured payment plan, you **confirm**, and settlement runs on **Monad** behind the scenes. Senders should not have to think about chains, gas, or routing.

**Live demo (Monad testnet):** [https://noma-pink.vercel.app/app](https://noma-pink.vercel.app/app)

## The problem

Remittance to Nigeria is expensive and fragmented: multiple apps, opaque FX, and Web3 friction for diaspora senders. Noma focuses on **one corridor** and one flow: **plan, confirm, execute, track**.

## Monad Metropolis submission

Noma is built as one product story across **three prize angles** (cohesive demo, not a integration checklist):

| Submission angle | What we ship |
| --- | --- |
| **Track 02 — Consumer Products & Payments** | Chat/voice UX, payment plans, confirm/cancel, recipients, history |
| **Agora — Best Cross-Border Payments App on Monad** | Diaspora → Nigeria; **Agora AUSD** settlement on Monad testnet; live metrics; in-app testnet faucet — [docs/agora-integration.md](docs/agora-integration.md) |
| **Monad Foundation — Mera passkeys** | Passkey sign-in; **passkey re-unlock before each on-chain action** (Confirm, Test AUSD); no MetaMask in the happy path |

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
| **Settlement** | `DirectTransferAdapter` + `INomaSettlementAdapter`; production demo uses **Agora AUSD** on Monad testnet (6 decimals) |
| **NGN delivery** | Paystack via Next.js routes (`/api/paystack/*`, `/api/offramp/*`) |

**Money model on Confirm (testnet):**

| Asset | Role |
| --- | --- |
| **MON** | Gas on Monad only (from [Monad faucet](https://faucet.monad.xyz)) |
| **AUSD** | Settlement amount — Agora USD stablecoin on Monad, **not USDT**; plan USD maps to AUSD pulled from the passkey wallet |
| **NGN** | Paid to the Nigerian bank via **Paystack** orchestration (test API + optional demo NGN when sandbox is unfunded) |

End-to-end reference: [docs/architecture.md](docs/architecture.md).

## What is implemented

| Area | Includes |
| --- | --- |
| **Frontend** | Landing + full-width app shell, chat, plan cards, inline recipient setup on pending plans |
| **Wallet** | Mera sign-up/sign-in, copy address, **MON + AUSD balances** in the app bar, **Get test AUSD** (Agora faucet), MON faucet link, optional recovery phrase export |
| **On-chain** | Deployed registry + adapter on Monad testnet; confirm → approve AUSD, create plan, execute settlement |
| **Paystack** | Banks, recipient resolve/save, NGN quote on plan, disburse orchestration |
| **Voice** | Mic STT + TTS (Chrome/Edge desktop; see [docs/voice-day5.md](docs/voice-day5.md)) |
| **Agora** | Public metrics + `/api/agora/status`; testnet AUSD faucet in UI; optional `AGORA_API_KEY` |
| **Contracts** | Foundry tests for registry/adapter |

## Honest scope (demo vs production)

| Works on testnet today | Labeled demo / planned |
| --- | --- |
| Mera passkey, **MON + AUSD** balances, **Agora AUSD** settlement when env + wallet funded | Mainnet AUSD addresses (`TODO(verify)` on Monad mainnet) |
| On-chain confirm (approve + registry + adapter); **Get test AUSD** (faucet cooldown applies) | Full Agora authenticated mint/redeem API |
| Mock ERC-20 settlement if env points at deployer mint token instead of AUSD | Aurora cross-chain funding |
| Paystack live test API; **auto** demo NGN when sandbox unfunded | Licensed remittance operator claims |
| Rule-based parser, recipients, history, MonadVision tx links | Sender-side Mercuryo on-ramp |

**Try in UI:** `Send $10 to a friend in Lagos just once` → sign in (passkey) → fund passkey with **MON** + **AUSD** → add bank on plan or use saved recipient → **Confirm** (passkey unlock + chain txs; NGN via Paystack).

### Agora AUSD on Monad testnet (production demo env)

| | Address / value |
| --- | --- |
| AUSD token | `0xa9012a055bd4e0eDfF8Ce09f960291C09D5322dC` |
| Faucet (`requestFunds`) | `0xd236c18D274E54FAccC3dd9DDA4b27965a73ee6C` |
| Decimals | `6` |

Vercel (or `.env.local`): `NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS` + `NEXT_PUBLIC_SETTLEMENT_TOKEN_DECIMALS=6`, plus deployed `NEXT_PUBLIC_NOMA_*` addresses. Faucet mints ~**10,000 AUSD** per successful drip; repeat requests revert with **cooldown** (`MaxFrequencyExceeded`) — one drip is enough for the demo.

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

## Demo script

Optional recording outline: **[docs/demo-script.md](docs/demo-script.md)** (not required in this README).

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
- **Confirm** and **Get test AUSD** call `signIn()` again so the passkey is used before on-chain txs (not a silent in-memory session).
- Only **credential id** in `localStorage`; signing keys in memory until sign-out.
- Optional **recovery phrase** export (BIP-39 from PRF; not a separate Mera export API).
- **Test MON**: [faucet.monad.xyz](https://faucet.monad.xyz) → passkey address.
- **Test AUSD**: in-app **Get test AUSD** or `requestFunds(yourAddress)` on the Agora faucet (MON for gas).
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
| [docs/agora-integration.md](docs/agora-integration.md) | Agora + AUSD faucet |
| [docs/finalize-hackathon.md](docs/finalize-hackathon.md) | Submission checklist |

## Monad testnet

Chain params: `frontend/src/lib/chains/monadTestnet.ts` ([Monad docs](https://docs.monad.xyz/developer-essentials/testnet)).

## License

TBD for hackathon submission.
