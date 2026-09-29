# Noma

Noma is a voice- and text-driven cross-border payment agent for the **diaspora → Nigeria** corridor, built for [Monad Metropolis](https://www.monad.xyz/) (Track 02: Consumer Products & Payments) and targeting the Agora **Best Cross-Border Payments App on Monad** bounty.

You say or type: *“Send $100 to my mum in Lagos on the 2nd of every month.”* Noma turns that into a structured payment plan, shows it for **explicit confirmation**, and (when fully built) executes it on Monad. Users should not need to think about chains, gas, or routing.

## The problem

Remittance to Nigeria is expensive and fragmented: multiple apps, opaque FX, and technical Web3 friction for diaspora senders. Noma focuses on one corridor and one conversational flow—plan, confirm, execute.

## Architecture (planned)

| Layer | Role |
| --- | --- |
| **Execution** | Solidity on Monad: authorization, spend limits, recurring schedules |
| **Settlement** | AUSD behind an adapter (direct AUSD transfers and/or Agora Stablecoin API — **not chosen yet**) |
| **Onboarding** | Mera passkey → derived EOA (see [Auth](#auth-passkey-wallet)) |
| **Voice agent** | Speech-to-text → intent parser; always confirm; hard spend limits |
| **NGN delivery** | Licensed local payment / off-ramp partner; Noma **orchestrates only** |

Noma is **not** a money transmitter and does **not** custody fiat. The product must represent that honestly in UI and docs.

## Honest scope and limitations (Day 1)

- **Corridor**: Nigeria only.
- **Chain**: Monad testnet configuration only; no live on-chain payments yet.
- **Mocked today**: chat assistant reply, payment plan card, Confirm/Cancel (no-op), mic button (disabled until voice work).
- **Not built yet**: contracts, AUSD settlement, voice, real NGN payout API, transaction signing from chat.
- **Built (Day 2)**: passkey sign-up/sign-in via Mera, testnet address + MON balance, recovery phrase export (optional).
- **No** Moove, Arc, or Base-specific code in this repository.

## Tech stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, wagmi + viem
- **Contracts**: Solidity + Foundry (`/contracts`)
- **Backend**: thin Next.js route handlers when needed

## Setup

### Prerequisites

- Node.js 20+
- npm
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for contract work later)

### Frontend

```bash
cd frontend
cp ../.env.example .env.local
# Set NEXT_PUBLIC_MONAD_TESTNET_RPC_URL (see frontend/src/lib/chains/monadTestnet.ts)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Contracts (skeleton)

```bash
cd contracts
# forge test — once contracts and forge-std are added
```

## Roadmap by day

| Day | Focus |
| --- | --- |
| **1** | Repo skeleton, rules, design tokens, chat shell, Monad testnet chain config |
| **2** | Mera passkey wallet, testnet balance + faucet link |
| **3** | Intent parser + confirmation UX (text) |
| **4** | Foundry contracts: authorization + limits + tests |
| **5** | Voice (STT) + mic integration |
| **6** | AUSD settlement adapter + testnet execution |
| **7** | NGN partner integration (or stub), polish, demo script |

Details and blockers: [PROGRESS.md](./PROGRESS.md).

## Compliance note

Noma is an **orchestration and user-experience layer** for cross-border payments. Fiat payout to beneficiaries in Nigeria is intended to flow through **licensed** local payment or off-ramp partners. Noma does not hold customer fiat as a money transmitter. Copy and flows should avoid implying licensed remittance status until partnerships and legal review say otherwise.

## Auth (passkey wallet)

Noma uses **[Mera](https://mera.category.xyz/)** (`@category-labs/mera`) per the [Monad passkey guide](https://docs.monad.xyz/guides/mera):

- **Create account** / **Sign in** in the header — WebAuthn passkey with PRF (Face ID, Touch ID, device PIN, or security key).
- Only the passkey **credential id** is stored in the browser (`localStorage`); signing keys live in memory for the session and are cleared on sign-out.
- **Recovery phrase** is optional: derived from the passkey when you export it (same words as the Monad guide’s BIP-39 path); Mera does not provide a separate export API.
- **Test MON**: [Monad testnet faucet](https://faucet.monad.xyz) ([docs](https://docs.monad.xyz/developer-essentials/testnet)).
- **Desktop Chrome**: passkeys must use **Google Password Manager** for PRF; see [Authenticator support](https://mera.category.xyz/authenticator-support).

Implementation: `frontend/src/lib/wallet/` (`WalletProvider` interface + `meraWallet`).

## Monad testnet reference

Chain parameters used in this repo are documented in `frontend/src/lib/chains/monadTestnet.ts` with links to official Monad documentation.

## License

TBD for hackathon submission.
