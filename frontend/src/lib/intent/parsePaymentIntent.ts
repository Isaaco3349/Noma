import type { ParseFailure, ParseResult, PaymentPlan, PaymentSchedule } from "./types";

const NIGERIA_LOCATIONS: Record<string, string> = {
  lagos: "Lagos",
  abuja: "Abuja",
  "port harcourt": "Port Harcourt",
  ibadan: "Ibadan",
  kano: "Kano",
  enugu: "Enugu",
  benin: "Benin City",
  nigeria: "Nigeria",
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  mum: "Mum",
  mom: "Mum",
  mother: "Mum",
  dad: "Dad",
  father: "Dad",
  papa: "Dad",
  mama: "Mum",
  sister: "Sister",
  brother: "Brother",
  wife: "Wife",
  husband: "Husband",
  son: "Son",
  daughter: "Daughter",
  uncle: "Uncle",
  aunt: "Aunt",
  cousin: "Cousin",
  friend: "Friend",
};

const OUT_OF_CORRIDOR =
  /\b(kenya|nairobi|ghana|accra|uk\b|london|india|mumbai|philippines|mexico)\b/i;

/**
 * Rule-based parser for diaspora → Nigeria payment intents (Day 3).
 * No LLM or external API — deterministic for demo and tests.
 */
export function parsePaymentIntent(raw: string): ParseResult {
  const text = raw.trim();
  if (!text) {
    return failure("Say who to pay in Nigeria, how much, and when.", []);
  }

  if (OUT_OF_CORRIDOR.test(text) && !/\bnigeria\b/i.test(text)) {
    return failure(
      "Noma only supports the Nigeria corridor right now. Try a city like Lagos or Abuja.",
      [],
    );
  }

  const amountUsd = parseAmount(text);
  const beneficiary = parseBeneficiary(text);
  const location = parseLocation(text);
  const schedule = parseSchedule(text);

  const missing: ParseFailure["missingFields"] = [];
  if (amountUsd == null) missing.push("amount");
  if (!beneficiary) missing.push("beneficiary");
  if (!location) missing.push("location");
  if (!schedule) missing.push("schedule");

  if (missing.length > 0) {
    if (mentionsUnsupportedRail(text)) {
      return failure(buildUnsupportedRailMessage(missing), missing);
    }
    return failure(buildMissingMessage(missing), missing);
  }

  const plan: PaymentPlan = {
    amountUsd: amountUsd!,
    beneficiary: beneficiary!,
    location: location!,
    schedule: schedule!,
    corridor: "NG",
  };

  return { ok: true, plan };
}

const WORD_ONES: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

const WORD_TENS: Record<string, number> = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

function parseAmount(text: string): number | null {
  const patterns = [
    /\$\s*(\d+(?:\.\d{1,2})?)/,
    /(\d+(?:\.\d{1,2})?)\s*(?:usd|usdt|usdc|dollars?)\b/i,
    /\bsend\s+(\d+(?:\.\d{1,2})?)\s*(?:usdt|usd|dollars?)?\b/i,
    /\bpay\s+(\d+(?:\.\d{1,2})?)\s*(?:usdt|usd|dollars?)?\b/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = Number.parseFloat(match[1]!);
      if (Number.isFinite(value) && value > 0 && value <= 1_000_000) {
        return Math.round(value * 100) / 100;
      }
    }
  }

  const spoken = parseSpokenDollarAmount(text);
  if (spoken != null) return spoken;

  return null;
}

/** Voice-friendly amounts: "hundred dollars", "one hundred dollars", "fifty dollar". */
function parseSpokenDollarAmount(text: string): number | null {
  const lower = text.toLowerCase();
  if (!/\bdollars?\b|\busd\b|\busdt\b/i.test(lower)) {
    return null;
  }

  const hundredOnly = lower.match(
    /\b(?:send|pay)?\s*(?:one\s+)?hundred\s+dollars?\b/,
  );
  if (hundredOnly) return 100;

  const tensOnes = lower.match(
    /\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[-\s]?(one|two|three|four|five|six|seven|eight|nine)?\s+dollars?\b/,
  );
  if (tensOnes) {
    const base = WORD_TENS[tensOnes[1]!] ?? 0;
    const extra = tensOnes[2] ? (WORD_ONES[tensOnes[2]!] ?? 0) : 0;
    const total = base + extra;
    if (total > 0) return total;
  }

  const singleWord = lower.match(
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)\s+dollars?\b/,
  );
  if (singleWord) {
    if (singleWord[1] === "hundred") return 100;
    const n = WORD_ONES[singleWord[1]!] ?? WORD_TENS[singleWord[1]!];
    if (n != null && n > 0) return n;
  }

  return null;
}

function parseBeneficiary(text: string): string | null {
  const lower = text.toLowerCase();

  for (const [key, label] of Object.entries(RELATIONSHIP_LABELS)) {
    const rel = new RegExp(`\\b(?:my\\s+)?${key}\\b`, "i");
    if (rel.test(lower)) return label;
  }

  const toName = text.match(
    /\b(?:to|for)\s+(?:my\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/,
  );
  if (toName) return toName[1]!;

  const toWord = lower.match(/\b(?:to|for)\s+my\s+([a-z]{2,20})\b/);
  if (toWord && !NIGERIA_LOCATIONS[toWord[1]!]) {
    return capitalize(toWord[1]!);
  }

  const handle = text.match(/@([A-Za-z0-9._-]{2,32})/);
  if (handle) return `@${handle[1]}`;

  return null;
}

function parseLocation(text: string): string | null {
  const lower = text.toLowerCase();

  for (const [key, label] of Object.entries(NIGERIA_LOCATIONS)) {
    if (key === "nigeria") continue;
    if (lower.includes(key)) return label;
  }

  if (/\bnigeria\b/i.test(text)) return "Nigeria";

  const inMatch = lower.match(/\b(?:in|at)\s+([a-z][a-z\s]{1,24})\b/);
  if (inMatch) {
    const candidate = inMatch[1]!.trim();
    if (NIGERIA_LOCATIONS[candidate]) return NIGERIA_LOCATIONS[candidate]!;
  }

  return null;
}

function parseSchedule(text: string): PaymentSchedule | null {
  const lower = text.toLowerCase();

  if (
    /\b(one[- ]?time|just once|this once|asap|today)\b/.test(lower) &&
    !/\bmonthly|every month|every week\b/.test(lower)
  ) {
    return { kind: "one_time" };
  }

  if (
    /\bonce\b/.test(lower) &&
    !/\bmonthly|every month|every week|once a month|once a week\b/.test(lower)
  ) {
    return { kind: "one_time" };
  }

  if (/\b(every week|weekly|each week)\b/.test(lower)) {
    return { kind: "recurring", frequency: "weekly" };
  }

  if (/\b(every month|each month|monthly)\b/.test(lower)) {
    const day = parseDayOfMonth(lower);
    return { kind: "recurring", frequency: "monthly", dayOfMonth: day ?? 1 };
  }

  const onTheNth = lower.match(/\bon\s+the\s+(\d{1,2})(?:st|nd|rd|th)?\b/);
  if (onTheNth) {
    const day = clampDay(Number.parseInt(onTheNth[1]!, 10));
    return { kind: "recurring", frequency: "monthly", dayOfMonth: day };
  }

  return null;
}

function parseDayOfMonth(lower: string): number | null {
  const ofMonth = lower.match(
    /(\d{1,2})(?:st|nd|rd|th)?\s+of\s+(?:every|each)\s+month/,
  );
  if (ofMonth) return clampDay(Number.parseInt(ofMonth[1]!, 10));

  const ordinalOnly = lower.match(/\b(\d{1,2})(?:st|nd|rd|th)\b/);
  if (ordinalOnly) return clampDay(Number.parseInt(ordinalOnly[1]!, 10));

  return null;
}

function clampDay(day: number): number {
  if (!Number.isFinite(day)) return 1;
  return Math.min(28, Math.max(1, day));
}

function mentionsUnsupportedRail(text: string): boolean {
  return /\b(usdt|usdc|destination handle|crypto handle|@\w+)\b/i.test(text);
}

function buildUnsupportedRailMessage(
  missing: ParseFailure["missingFields"],
): string {
  const base =
    "Noma is for family payments to Nigeria (city + recipient), not USDT or social handles alone. ";
  return base + buildMissingMessage(missing);
}

function buildMissingMessage(
  missing: ParseFailure["missingFields"],
): string {
  const parts: string[] = [];
  if (missing.includes("amount")) {
    parts.push("how much in dollars (e.g. $100 or 100 USDT treated as USD for demo)");
  }
  if (missing.includes("beneficiary")) {
    parts.push("who receives it (e.g. my mum)");
  }
  if (missing.includes("location")) {
    parts.push("where in Nigeria (e.g. Lagos)");
  }
  if (missing.includes("schedule")) {
    parts.push("when (e.g. on the 2nd of every month, or one-time)");
  }
  return `I need a bit more: ${parts.join(", ")}.`;
}

function failure(
  message: string,
  missingFields: ParseFailure["missingFields"],
): ParseFailure {
  return { ok: false, message, missingFields };
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
