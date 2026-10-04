import assert from "node:assert/strict";
import test from "node:test";
import {
  getPaystackTransferMode,
  isPaystackBalanceOrFundingError,
} from "./config";

test("getPaystackTransferMode defaults to auto", () => {
  delete process.env.NOMA_PAYSTACK_TRANSFER_MODE;
  assert.equal(getPaystackTransferMode(), "auto");
});

test("isPaystackBalanceOrFundingError detects insufficient balance copy", () => {
  assert.equal(
    isPaystackBalanceOrFundingError(
      "Your balance is not enough to fulfill this request.",
    ),
    true,
  );
  assert.equal(isPaystackBalanceOrFundingError("Invalid recipient"), false);
});
