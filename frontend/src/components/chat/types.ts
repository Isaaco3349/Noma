export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  body: string;
  showPlan?: boolean;
};
