import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(root, "..", ".env.local");

const REQUIRED = [
  "NEXT_PUBLIC_MONAD_TESTNET_RPC_URL",
  "NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS",
  "NEXT_PUBLIC_NOMA_SETTLEMENT_ADAPTER_ADDRESS",
  "NEXT_PUBLIC_NOMA_REGISTRY_ADDRESS",
  "NEXT_PUBLIC_PAYOUT_SINK_ADDRESS",
  "NEXT_PUBLIC_SETTLEMENT_TOKEN_DECIMALS",
];

function parseEnvFile(content) {
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) {
      console.log("SKIP bad line:", t.slice(0, 60));
      continue;
    }
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function isAddress(v) {
  return /^0x[0-9a-fA-F]{40}$/.test(v ?? "");
}

function maskAddr(v) {
  if (!v) return "(empty)";
  return `${v.slice(0, 8)}…${v.slice(-4)}`;
}

if (!fs.existsSync(envPath)) {
  console.error("MISSING:", envPath);
  console.error("Create frontend/.env.local (not repo root).");
  process.exit(1);
}

const env = parseEnvFile(fs.readFileSync(envPath, "utf8"));
console.log("File:", envPath);
console.log("---");

let ok = true;
for (const key of REQUIRED) {
  const val = env[key]?.trim() ?? "";
  if (!val) {
    console.log("EMPTY:", key);
    ok = false;
    continue;
  }
  if (key.includes("ADDRESS") || key === "NEXT_PUBLIC_MONAD_TESTNET_RPC_URL") {
    if (key.includes("RPC")) {
      console.log("OK:", key, val.startsWith("http") ? val : `unexpected: ${val}`);
      if (!val.startsWith("http")) ok = false;
    } else if (isAddress(val)) {
      console.log("OK:", key, maskAddr(val));
    } else {
      console.log("INVALID (need 0x + 40 hex):", key, JSON.stringify(val.slice(0, 20)));
      ok = false;
    }
  } else if (key === "NEXT_PUBLIC_SETTLEMENT_TOKEN_DECIMALS") {
    const n = Number.parseInt(val, 10);
    if (!Number.isFinite(n) || n < 0 || n > 18) {
      console.log("INVALID:", key, val);
      ok = false;
    } else {
      console.log("OK:", key, String(n));
    }
  }
}

console.log("---");
console.log(ok ? "RESULT: chain env looks valid — restart npm run dev if you changed this file." : "RESULT: fix issues above, then restart npm run dev.");

if (env.PAYSTACK_SECRET_KEY?.trim()) {
  console.log("OK: PAYSTACK_SECRET_KEY is set (value hidden)");
} else {
  console.log("NOTE: PAYSTACK_SECRET_KEY empty — Paystack runs in demo mode");
}

process.exit(ok ? 0 : 1);
