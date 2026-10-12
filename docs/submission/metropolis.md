# Metropolis application form — paste-ready (updated for live AUSD)

**Live URL:** https://noma-pink.vercel.app/app  
**Repo:** https://github.com/Isaaco3349/Noma

---

## Primary track

Consumer Products & Payments

---

## Project name

Noma

---

## One-line description

Voice and text payment plans for diaspora senders paying family and friends in Nigeria, with Agora AUSD settlement on Monad testnet.

---

## Description (problem, solution, usefulness)

Diaspora senders moving money to Nigeria still juggle apps, unclear fees, and crypto steps that family back home should never see. Noma is a consumer app for one corridor only: diaspora to Nigeria.

You speak or type a plain instruction, for example send one hundred dollars to family in Lagos every month. Noma turns that into a structured payment plan with amount, recipient name, place in Nigeria, and schedule. You review the Nigerian bank account on the plan card, then confirm or cancel. Nothing runs until you approve.

On confirm, a Mera passkey re-unlocks and signs on Monad testnet: approve Agora AUSD, register the plan in NomaScheduleRegistry, and execute settlement through our adapter. MON pays gas; AUSD pays the dollar amount (not USDT). Paystack handles the NGN leg (live test API for banks and recipients; labeled test demo NGN when Paystack sandbox balance is unfunded). The header shows Agora AUSD on Monad, live public Agora metrics, and MON plus AUSD wallet balances. We are an orchestration and UX layer, not a money transmitter.

Noma fits remittance-shaped workflows: recurring support, named beneficiaries, and a chat-first flow instead of chain jargon up front.

---

## Go-to-market and user acquisition strategy

First users are Nigerian diaspora in the UK, US, and Canada who already send money home monthly to family or friends. We would start with direct outreach in diaspora WhatsApp groups, university alumni networks, and church communities where trust already exists. The product wins on simplicity: say the payment in one sentence, verify the bank details on screen, confirm with a passkey.

Early growth is word of mouth after a successful first transfer, plus short demo clips shared on X and LinkedIn. Partnership conversations would follow with licensed payout partners (Paystack class) rather than marketing crypto first. We would measure activation by first saved beneficiary, first confirmed plan, and repeat monthly plans.

---

## GitHub repository

https://github.com/Isaaco3349/Noma

Make the repo public or grant access to metropolis@hackathon.monad.xyz before you submit.

---

## Project logo

Upload from repo: `docs/submission/noma-project-logo-1024.png` (PNG, at least 500 px, max 2 MB). Dark N on cream/stone background for Metropolis dark UI.

---

## Live product (Monad testnet)

https://noma-pink.vercel.app/app

Landing: https://noma-pink.vercel.app/

---

## Technical demo video (up to 3 min, working product)

Suggested narrative (record on https://noma-pink.vercel.app/app):

1. **Why no MetaMask:** Noma uses **Mera passkeys**—create account with passkey for a new embedded Monad wallet, or sign in if you already registered on this domain. No external wallet extension or seed phrase in the happy path.
2. **After login:** wallet address, MON (gas), AUSD (settlement); optional Get test MON / Get test AUSD; settlement strip **Agora AUSD on Monad** + live metrics.
3. **Chat/voice** plan, e.g. $100 to Ada in Abuja monthly.
4. **Plan card:** NGN estimate; verify Nigerian bank on card before Confirm.
5. **Confirm:** passkey re-unlock → Monad plan + **AUSD settlement** explorer links.
6. **NGN** line on card (Paystack test demo OK if sandbox unfunded—say orchestration once).
7. **History** tab.

Spoken script with exact lines: `docs/demo-script.md`. Live demo settles **Agora AUSD** on Monad testnet (not mock token).

---

## Pitch video (up to 2 min, team + problem + why)

1. Who you are and why remittance to Nigeria matters to you.
2. Problem in one line: too many steps for senders, too much friction for family.
3. What Noma does: voice or text, plan, verify bank account, confirm on Monad with Mera and Agora AUSD.
4. Why Monad and partners: schedules and AUSD settlement on chain, NGN via Paystack orchestration, Mera passkeys.
5. Try the build at https://noma-pink.vercel.app/app and what is next after the hackathon.

---

## Judge access instructions (optional)

```
1. Open https://noma-pink.vercel.app/app in desktop Chrome.
2. Create account with passkey or Sign in (passkeys are tied to this domain, not localhost).
3. If Confirm fails for gas: copy the wallet address in the header, request test MON at https://faucet.monad.xyz, wait about one minute, refresh.
4. If AUSD balance is zero: click Get test AUSD / Test AUSD in the header (passkey signs; needs MON). One successful drip is enough (~10,000 AUSD). Repeat requests may hit faucet cooldown—that is normal.
5. Settlement strip should read Agora AUSD on Monad and Monad on-chain confirm enabled.
6. Example: Send $100 to Ada in Abuja on the 1st of every month.
7. On the payment plan card, select a saved beneficiary or enter Nigerian bank details, then Confirm payout and plan.
8. Recipients tab: save profiles for repeat demos. History tab: plan id and payout status.
9. Header: Agora metrics on Monad; wallet shows MON and AUSD.

No password login. Passkeys are per domain (localhost vs Vercel are different accounts).
Orchestration demo only, not licensed remittance.
```

---

## Bounty: Monad Foundation (Mera passkeys)

### Question 1 (features / passkey integration)

Noma uses Mera for the full sender path on Monad testnet. Users create an account or sign in with a device passkey. We store only the credential id in the browser; signing keys stay in memory until sign-out. The header shows wallet address, MON and AUSD balances, copy address, test MON link, and Get test AUSD (Agora Monad testnet faucet).

Before Confirm and Get test AUSD, the app re-unlocks the passkey (PRF)—no silent in-memory signing. Confirm triggers passkey-backed writes: approve Agora AUSD, create plan on NomaScheduleRegistry, execute settlement per schedule. Optional recovery phrase export is backup only. MetaMask is not required.

### Question 2 (demo video, if separate field)

Use the technical demo on https://noma-pink.vercel.app/app. Show passkey onboarding, MON and AUSD in the header, passkey prompt on Confirm, and a confirmed plan with Create plan on Monad and AUSD settlement on Monad explorer links after bank details are verified on the plan card.

---

## Bounty: Agora (Best Cross-Border Payments App on Monad)

### Question 1: Core features and how the app enables sending AUSD / cross border

Noma is built for diaspora-to-Nigeria remittance. Senders use natural language for amount, who, where in Nigeria, and how often. Cross-border value is scheduled and settled on Monad through NomaScheduleRegistry and INomaSettlementAdapter using Agora AUSD on Monad testnet (production demo on Vercel—not a mock ERC-20). The app shows live Agora public metrics (AUSD supply on Monad), Get test AUSD via Agora’s faucet, and MON plus AUSD balances in the wallet bar. Optional AGORA_API_KEY can show API connectivity in status. NGN to Nigerian bank accounts is orchestrated via Paystack after confirm; users see payout account details before confirm. Loop: plan and AUSD settlement on Monad, Paystack NGN orchestration, Agora as settlement token and metrics layer.

### Question 2: Demo video (passkey, AUSD balance, completed send)

Record on https://noma-pink.vercel.app/app. Show passkey onboarding, AUSD balance in the header, Agora AUSD on Monad in the settlement strip, and Confirm on a plan with verified Nigerian bank details. Open the AUSD settlement on Monad explorer link. Show history entry. NGN payout (test demo) on the card is acceptable—say once that production funds Paystack for live NGN disburse.

---

## Optional promotion

Leave blank unless you have a 30 s ad cut or project X profile.

---

## Checklist reminder

| Item | Action |
|------|--------|
| Primary track | Consumer Products & Payments |
| Project details | Paste sections above |
| Logo | Upload noma-project-logo-1024.png |
| Live product | https://noma-pink.vercel.app/app |
| Demo + pitch | Upload video links |
| Bounties | Paste Mera + Agora answers; save each section |
| Dry run | MON + AUSD on passkey before recording |
