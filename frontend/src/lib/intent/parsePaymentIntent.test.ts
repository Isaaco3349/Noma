import assert from "node:assert/strict";
import test from "node:test";
import { parsePaymentIntent } from "./parsePaymentIntent";

test("parses canonical monthly Lagos plan", () => {
  const result = parsePaymentIntent(
    "Send $100 to my mum in Lagos on the 2nd of every month.",
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.plan.amountUsd, 100);
  assert.equal(result.plan.beneficiary, "Mum");
  assert.equal(result.plan.location, "Lagos");
  assert.equal(result.plan.schedule.kind, "recurring");
  if (result.plan.schedule.kind === "recurring") {
    assert.equal(result.plan.schedule.frequency, "monthly");
    assert.equal(result.plan.schedule.dayOfMonth, 2);
  }
});

test("parses one-time Abuja payment", () => {
  const result = parsePaymentIntent(
    "Pay 50 dollars to my sister in Abuja just once",
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.plan.schedule.kind, "one_time");
});

test("rejects out-of-corridor destination", () => {
  const result = parsePaymentIntent("Send $20 to my friend in Nairobi");
  assert.equal(result.ok, false);
});

test("asks for missing fields", () => {
  const result = parsePaymentIntent("Send money to Nigeria");
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.ok(result.missingFields.includes("amount"));
});

test("treats USDT amount as USD for demo", () => {
  const result = parsePaymentIntent(
    "Send 25 USDT to my mum in Lagos just once",
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.plan.amountUsd, 25);
});

test("parses spoken hundred dollars and once (voice-style)", () => {
  const result = parsePaymentIntent(
    "send hundred dollar to my mom in Lagos once",
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.plan.amountUsd, 100);
  assert.equal(result.plan.beneficiary, "Mum");
  assert.equal(result.plan.location, "Lagos");
  assert.equal(result.plan.schedule.kind, "one_time");
});
