# Noma demo scripts (Metropolis)

**Live app:** https://noma-pink.vercel.app/app  
**Full paste copy:** [submission/metropolis.md](./submission/metropolis.md)

Record **technical demo first**, then **pitch**, then any extra clips the portal requires.

---

## Technical demo (≤3 min)

### Spoken walkthrough (say this as you click)

**Open (10 s)**  
“I’m on Noma’s live Monad testnet build—diaspora senders paying family in Nigeria without fighting MetaMask or seed phrases.”

**Passkey = embedded wallet (30–45 s)**  
- **New user:** “I’ll **Create account with passkey**. That registers a **Mera** wallet on Monad—face, fingerprint, or device PIN. No external wallet extension; the address you see in the header **is** the on-chain account.”  
- **Returning user (optional take):** “If you’ve used this site before on this domain, **Sign in** with the same passkey—same embedded wallet, no password.”  
- After login: “Here’s my **Monad testnet address**, **MON** for gas, and **AUSD** for settlement. I can copy the address or use **Get test MON / Get test AUSD** if I need test funds.”  
- Point at strip: “Settlement is **Agora AUSD on Monad**—that’s the stablecoin rail; the metrics line is live Agora data.”

**Intent → plan (45 s)**  
“I describe the payment in plain language—voice or type.”  
Example: *“Send $100 to Ada in Abuja on the 1st of every month.”*  
“Noma parses that into a **payment plan**: amount, who, where in Nigeria, schedule, and an **NGN estimate** via Paystack.”

**Recipient / trust (30 s)**  
“Before anything runs, I **verify the Nigerian bank account** on the plan card—saved beneficiary or enter bank details here. Confirm stays off until payout details are set. That’s deliberate: family shouldn’t get the wrong account.”

**Confirm (45 s)**  
“**Confirm payout and plan** asks for my passkey again—that signs **AUSD approval and settlement** on Monad, plus our schedule registry.”  
After success: “**Monad plan** id, link to **AUSD settlement on Monad**, and **NGN payout** (test demo if Paystack sandbox is unfunded—we orchestrate; production funds Paystack balance).”

**Close (15 s)**  
“**History** keeps the trail. Same flow end to end: passkey wallet → AUSD on Monad → Paystack NGN story—one corridor, Nigeria only.”

### Shot list (if you edit tight)

1. Hook → passkey create **or** sign-in → wallet bar (MON + AUSD) + Agora strip  
2. Chat prompt → plan card → bank/recipient  
3. Confirm + passkey prompt → confirmed card + explorer links  
4. History tab  

**Recording tip:** Use a **fresh passkey** on camera for “new user,” or sign in if you already funded MON/AUSD on noma-pink—say which you’re doing so judges aren’t confused.

## Pitch (≤2 min)

Problem → Noma (voice/text, verify bank, passkey) → Monad + Agora AUSD + Mera + Paystack → https://noma-pink.vercel.app/app → what’s next.

---

## Paystack (server)

`PAYSTACK_SECRET_KEY=sk_test_...` in Vercel (never commit). Default **`auto`** mode: demo NGN when sandbox balance is insufficient.

## Agora / AUSD

- Production demo: **Agora AUSD** on Monad testnet (see [agora-integration.md](./agora-integration.md)).
- Fund passkey: **MON** (Monad faucet) + **AUSD** (in-app **Get test AUSD** or one-time faucet; cooldown on repeat).

## Mera

Passkey re-unlock before **Confirm** and **Get test AUSD**. Passkeys are **per domain** (localhost ≠ Vercel).
