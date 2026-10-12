/** Shown in empty chat when there are no messages yet. */
export const COMMAND_KEYWORDS = [
  { label: "Amount", example: "$50 or 100 dollars" },
  { label: "Who", example: "Any name, family or friends" },
  { label: "Where", example: "Lagos, Abuja, or any Nigerian city or state" },
  { label: "When", example: "once, weekly, monthly, daily" },
] as const;

export const EXAMPLE_PROMPTS = [
  "Send $50 to a friend in Lagos just once",
  "Pay 100 dollars to Ada in Abuja every month",
  "Send $25 to Chidi in Lagos every week",
] as const;
