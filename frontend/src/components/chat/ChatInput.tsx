"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  stopSpeaking,
} from "@/lib/voice/browserSpeech";

export type SendOptions = {
  viaVoice?: boolean;
};

type ChatInputProps = {
  onSend?: (text: string, options?: SendOptions) => void;
  speaking?: boolean;
};

export function ChatInput({ onSend, speaking }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setVoiceSupported(isSpeechRecognitionSupported());
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const submitText = useCallback(
    (text: string, options?: SendOptions) => {
      const body = text.trim();
      if (!body) return;
      onSend?.(body, options);
      setValue("");
    },
    [onSend],
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submitText(value);
  }

  const toggleListening = useCallback(() => {
    setVoiceError(null);

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    if (!voiceSupported) {
      setVoiceError("Voice input needs Chrome or Edge with microphone access.");
      return;
    }

    stopSpeaking();
    const recognition = createSpeechRecognition();
    if (!recognition) {
      setVoiceError("Could not start speech recognition in this browser.");
      return;
    }

    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i]![0]!.transcript;
        if (event.results[i]!.isFinal) final += transcript;
        else interim += transcript;
      }
      const draft = final || interim;
      if (draft) setValue(draft.trim());
      if (final.trim()) {
        recognition.stop();
        submitText(final, { viaVoice: true });
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted" || event.error === "no-speech") {
        setVoiceError(
          event.error === "no-speech"
            ? "I did not hear anything. Try again."
            : null,
        );
      } else if (event.error === "not-allowed") {
        setVoiceError("Microphone permission is blocked for this site.");
      } else {
        setVoiceError("Voice input failed. You can type instead.");
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
      setListening(true);
    } catch {
      setVoiceError("Could not start listening. Try again.");
      setListening(false);
    }
  }, [listening, voiceSupported, submitText]);

  const micDisabled = !voiceSupported || Boolean(speaking);
  const micTitle = !voiceSupported
    ? "Voice input requires a supported browser (Chrome or Edge)"
    : speaking
      ? "Noma is speaking…"
      : listening
        ? "Stop listening"
        : "Speak your payment instruction";

  return (
    <div className="border-t border-border bg-surface lg:px-4">
      {voiceError ? (
        <p className="px-4 pt-2 text-xs text-semantic-error" role="status">
          {voiceError}
        </p>
      ) : null}
      {listening ? (
        <p className="px-4 pt-2 text-xs text-text-muted" role="status">
          Listening… say who to pay in Nigeria, how much, and when.
        </p>
      ) : null}
      {speaking ? (
        <p className="px-4 pt-2 text-xs text-text-muted" role="status">
          Speaking…
        </p>
      ) : null}
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-4xl items-end gap-2 p-3 sm:max-w-5xl sm:p-4 lg:px-8"
      >
        <label className="sr-only" htmlFor="noma-chat-input">
          Message Noma
        </label>
        <textarea
          id="noma-chat-input"
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Send $50 to Chidi in Enugu every month"
          className="min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/60"
        />
        <button
          type="button"
          disabled={micDisabled}
          title={micTitle}
          onClick={toggleListening}
          aria-pressed={listening}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            listening
              ? "border-accent bg-accent/30 text-text"
              : "border-border bg-bg text-text-muted hover:bg-surface"
          } disabled:cursor-not-allowed disabled:opacity-50`}
          aria-label={micTitle}
        >
          <MicIcon active={listening} />
        </button>
        <button
          type="submit"
          className="h-11 shrink-0 rounded-xl bg-text px-4 text-sm font-medium text-surface hover:opacity-90"
        >
          Send
        </button>
      </form>
    </div>
  );
}

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
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
