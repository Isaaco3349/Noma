# Finalize Noma for hackathon submission

Use this when you **lost the old deployer key** or env addresses were empty. Total **cash cost** for a strong demo is usually **$0** (testnet + Paystack test + Agora public metrics). Optional live Paystack NGN is separate (business balance, not “API subscription”).

## What judges should see (60s)

1. **Mera** — passkey sign-in  
2. **Recipients** — Paystack test API saved **Mum · Lagos**  
3. **Chat/voice** — plan → **Confirm**  
4. **Monad** — plan id + explorer tx (needs env + mock token on passkey)  
5. **NGN** — Paystack **demo orchestration** (auto mode if sandbox unfunded)  
6. **Agora** — navbar metrics + settlement story (`docs/agora-integration.md`)

---

## Phase 1 — New deployer (15 min, $0)

You do **not** need the old deployer. Old contract addresses can be abandoned.

1. **MetaMask** (or Rabby): **Create account** → name it `Noma deployer testnet`.  
2. Copy **address** → [Monad faucet](https://faucet.monad.xyz) → get **MON** (repeat tomorrow if needed).  
3. Export **private key** (testnet only). Store in a password manager — **never** commit or paste in Discord/chat.

This wallet is **only** for deploy + mint. Your **Mera passkey** in Noma stays the “user” wallet.

---

## Phase 2 — Deploy + mint (10 min, $0)

PowerShell:

```powershell
cd C:\Users\user\projects\noma

$env:DEPLOYER_PRIVATE_KEY = "0xYOUR_NEW_DEPLOYER_KEY"
$env:MINT_TO = "0xYOUR_MERA_PASSKEY_FROM_NOMA_HEADER"

.\scripts\finalize-testnet.ps1
```

First run prints `NEXT_PUBLIC_*` lines. Put them in **`frontend/.env.local`**:

```env
NEXT_PUBLIC_MONAD_TESTNET_RPC_URL=https://testnet-rpc.monad.xyz
NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS=<from deploy log>
NEXT_PUBLIC_NOMA_SETTLEMENT_ADAPTER_ADDRESS=<from deploy log>
NEXT_PUBLIC_NOMA_REGISTRY_ADDRESS=<from deploy log>
NEXT_PUBLIC_PAYOUT_SINK_ADDRESS=<from deploy log>
NEXT_PUBLIC_SETTLEMENT_TOKEN_DECIMALS=18

PAYSTACK_SECRET_KEY=sk_test_...
# NOMA_PAYSTACK_TRANSFER_MODE=auto
```

Then set `$env:SETTLEMENT_TOKEN_ADDRESS` to the **same token** as above and re-run the script to **mint** (or run forge mint script manually — see `contracts/script/MintMockToken.s.sol`).

**Passkey wallet needs:**

| Asset | How |
| --- | --- |
| **MON** | Faucet → **passkey address** (for Confirm gas) |
| **Mock ERC-20** | Mint script → **passkey address** |

---

## Phase 3 — Paystack ($0 for demo)

| Item | Cost |
| --- | --- |
| `sk_test_...` | **Free** |
| Test **recipients/banks** | **Free** |
| Test **transfer** / NGN payout | Needs Paystack **balance**; test accounts often **cannot top up** |

**Recommended:** keep `NOMA_PAYSTACK_TRANSFER_MODE=auto` (default). Confirm shows **demo NGN** when sandbox is unfunded — say on camera: *“Production funds Paystack balance; test sandbox uses orchestration demo.”*

**Optional spend (<$10):** only if you switch to **live** Paystack (not test) and fund a real business balance for a real NGN transfer — **not required** for hackathon if auto/demo is explained.

---

## Phase 4 — Agora ($0 for demo)

| Item | Cost |
| --- | --- |
| `/v0/metrics` in app | **Free**, no key |
| `AGORA_API_KEY` | **Free** to create; optional “API connected” badge |
| **AUSD in wallet** | **No public faucet** like MON |

**Recommended for submission:**

- Keep **mock token** for working on-chain Confirm.  
- Navbar + README: **Agora AUSD** is production settlement (`docs/agora-integration.md`).  
- Optional env for **label only** (only if you later hold AUSD):

```env
NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS=0xa9012a055bd4e0eDfF8Ce09f960291C09D5322dC
NEXT_PUBLIC_SETTLEMENT_TOKEN_DECIMALS=6
```

Do **not** switch to AUSD until the passkey holds AUSD or Confirm will fail.

---

## Phase 5 — Smoke test

```powershell
cd frontend
npm run dev
```

1. Sign in (Mera).  
2. `/app/recipients` — Mum · Lagos saved.  
3. Chat: `Send $10 to my mom in Lagos just once.` → **Confirm**.  
4. Expect: **no** “Monad addresses not set”; **Monad plan/tx**; **NGN demo or live**; `/app/history` entry.

```powershell
npm test
npm run build
```

---

## Phase 6 — GitHub + Vercel

1. Commit (no `.env.local`, no private keys).  
2. Push.  
3. Vercel: root directory **`frontend`**.  
4. Environment variables: same names as `.env.example` (secrets in Vercel UI only).  
5. Redeploy after env changes.

---

## Mental model (for judges)

```
You (Mera passkey)
  → Confirm: mock/AUSD settlement on Monad (registry + adapter)
  → Server: Paystack NGN orchestration (demo or live)
Recipient bank: saved once in Recipients (Paystack RCP_…)
```

**MON** = gas. **Mock/AUSD** = settlement amount. **Paystack** = NGN leg (not MON conversion in-app).
