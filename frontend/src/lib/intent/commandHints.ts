/** Shown in empty chat — patterns users can say or type. */
export const COMMAND_KEYWORDS = [
  { label: "Amount", example: "$50 or 100 dollars" },
  { label: "Who", example: "Chidi, my friend, Ada" },
  { label: "Where", example: "Enugu, Kano, Lagos state" },
  { label: "When", example: "once · weekly · monthly · daily" },
] as const;

export const EXAMPLE_PROMPTS = [
  "Send $50 to Chidi in Enugu just once",
  "Pay 100 dollars to my friend in Kano every month",
  "Send $25 to Ada in Port Harcourt every week",
] as const;
