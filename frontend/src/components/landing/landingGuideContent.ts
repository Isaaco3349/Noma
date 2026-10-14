export type WalkthroughStep = {
  title: string;
  body: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    title: "What Noma is for",
    body: "Noma helps diaspora senders plan payments to family and friends in Nigeria. You describe the payment in everyday language. Noma turns that into a clear plan. Nothing runs until you confirm.",
  },
  {
    title: "Start with a passkey, not MetaMask",
    body: "On this page, choose Create account with passkey if you are new, or Sign in if you already registered on this website. A passkey uses your face, fingerprint, or device PIN. You do not install MetaMask or write down a seed phrase for the normal flow.",
  },
  {
    title: "Your embedded wallet on Monad testnet",
    body: "After sign in, the app opens with your wallet address in the header. That address is your account on Monad testnet. MON in the bar pays network fees. AUSD is the settlement token used when you confirm a plan. Use Get test MON or Get test AUSD if you need test funds for a demo.",
  },
  {
    title: "Save a recipient once",
    body: "Open the Recipients tab and add a Nigerian beneficiary with bank details through Paystack test lookup. Saved profiles appear when you build a plan so you do not retype account numbers every time.",
  },
  {
    title: "Describe the payment in Chat",
    body: "Type or use the microphone on desktop Chrome to say who to pay, where in Nigeria, how much in dollars, and how often. Example: send one hundred dollars to Ada in Abuja on the first of every month.",
  },
  {
    title: "Review the plan card before Confirm",
    body: "Noma shows amount, schedule, NGN estimate, and the payout account. Add or pick a bank account on the card if needed. Confirm stays disabled until payout details are set. Read the account name and bank carefully.",
  },
  {
    title: "Confirm with your passkey",
    body: "Tap Confirm payout and plan. Your passkey will ask you to approve again. That signs the on chain steps: AUSD approval and settlement on Monad through Noma contracts. You will see links to view transactions on MonadVision.",
  },
  {
    title: "NGN and History",
    body: "After confirm, the card shows NGN payout status. On Paystack test sandbox, you may see a test demo label when the sandbox has no transfer balance. That is expected for demos. History lists past plans and references.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is a passkey?",
    answer:
      "A passkey is a secure sign in method tied to your device and this website. It replaces passwords for Noma. When you confirm a payment, you may be asked to use your face, fingerprint, or PIN again.",
  },
  {
    question: "Do I need MetaMask or another browser wallet?",
    answer:
      "No for the main demo. Noma uses Mera passkeys to create and use a wallet inside the app. MetaMask is not required to sign in or confirm plans.",
  },
  {
    question: "What is the difference between MON and AUSD?",
    answer:
      "MON is the native token on Monad testnet and pays transaction fees, like gas. AUSD is Agora stablecoin on Monad testnet. When you confirm a plan, the dollar amount is settled in AUSD from your passkey balance, not in USDT.",
  },
  {
    question: "Why does Confirm ask for my passkey more than once?",
    answer:
      "Sign in unlocks your session. Confirm and Get test AUSD ask for your passkey again before on chain actions so payments are not signed silently in the background.",
  },
  {
    question: "I created an account on my laptop. Why does my phone not recognize me?",
    answer:
      "Passkeys are linked to the website domain and your device. noma-pink.vercel.app and localhost are different sites. Use the same device and browser where you created the passkey, or create a new passkey on the new device for this domain.",
  },
  {
    question: "Confirm failed because of gas or token balance",
    answer:
      "Copy your wallet address from the header. Request test MON from faucet.monad.xyz for gas. For AUSD, use Get test AUSD in the app once you have MON. The Agora faucet limits how often you can request again.",
  },
  {
    question: "What does NGN payout test demo mean?",
    answer:
      "Noma orchestrates naira delivery through Paystack. On test keys, real bank lookup and saved recipients work. If the Paystack sandbox has no transfer balance, the app records a labeled demo NGN step so you can still see the full flow.",
  },
  {
    question: "Is this real money?",
    answer:
      "This build runs on Monad testnet with test MON and test AUSD. It is a product demo, not licensed remittance. Production would use licensed partners and funded payout balances.",
  },
  {
    question: "Can I use voice?",
    answer:
      "On desktop Chrome or Edge you can use the microphone in Chat. Turn on read replies aloud if you want the app to speak confirmations. Mobile support for voice varies by browser.",
  },
  {
    question: "Where do I go after I sign in on this page?",
    answer:
      "Use Continue to Noma or Open app to reach Chat, Recipients, and History. If you landed here again while signed in, Open app takes you straight back.",
  },
];
