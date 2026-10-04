/** Fallback when Paystack secret is unset (UI development only). */
export const DEMO_NIGERIAN_BANKS = [
  { name: "Test Bank", code: "001", slug: "test-bank" },
  { name: "Guaranty Trust Bank", code: "058", slug: "guaranty-trust-bank" },
  { name: "Access Bank", code: "044", slug: "access-bank" },
  { name: "Zenith Bank", code: "057", slug: "zenith-bank" },
] as const;
