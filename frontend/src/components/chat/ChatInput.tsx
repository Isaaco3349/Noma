"use client";

import { FormEvent, useState } from "react";

type ChatInputProps = {
  onMicClick?: () => void;
};

export function ChatInput({ onMicClick }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // Day 1: input is visual only; no send pipeline yet.
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-border bg-surface p-3 sm:p-4"
    >
      <label className="sr-only" htmlFor="noma-chat-input">
        Message Noma
      </label>
      <textarea
        id="noma-chat-input"
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tell Noma who to pay in Nigeria…"
        className="min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/60"
      />
      <button
        type="button"
        disabled
        title="Voice input arrives on Day 5"
        onClick={onMicClick}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-bg text-text-muted opacity-50"
        aria-label="Microphone (coming Day 5)"
      >
        <MicIcon />
      </button>
      <button
        type="submit"
        className="h-11 shrink-0 rounded-xl bg-text px-4 text-sm font-medium text-surface hover:opacity-90"
      >
        Send
      </button>
    </form>
  );
}

function MicIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}
