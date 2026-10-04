"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parsePaymentIntent } from "@/lib/intent/parsePaymentIntent";
import { useWallet } from "@/components/wallet/WalletContext";
import { fetchChainConfigFromServer } from "@/lib/contracts/fetchChainConfig";
import { registerPlanOnChain } from "@/lib/contracts/registerPlanOnChain";
import { fetchNgnQuote, requestDisburse } from "@/lib/offramp/client";
import {
  findRecipientForPlan,
  readRecipients,
} from "@/lib/recipients/storage";
import type { SavedRecipient } from "@/lib/recipients/types";
import { appendTrackedPlan } from "@/lib/tracking/storage";
import type { OfframpState } from "@/lib/tracking/types";
import {
  isSpeechSynthesisSupported,
  speakText,
  stopSpeaking,
} from "@/lib/voice/browserSpeech";
import { messageToSpeakable } from "@/lib/voice/speakableAssistant";
import { readRepliesAloudEnabled } from "@/lib/voice/voicePreferences";
import { ChatInput, type SendOptions } from "./ChatInput";
import { MessageList } from "./MessageList";
import { ReadRepliesToggle } from "./ReadRepliesToggle";
import type { ChatMessage } from "./types";

const ASSISTANT_SUCCESS =
  "Here’s the plan I understood. Review and confirm before anything runs on Monad.";

export function ChatShell() {
  const { auth, withWalletClient } = useWallet();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recipients, setRecipients] = useState<SavedRecipient[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const [confirmingPlanId, setConfirmingPlanId] = useState<string | null>(null);
  const speakEndTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const canConfirmPlans = auth.status === "signed_in";

  const refreshRecipients = useCallback(() => {
    setRecipients(readRecipients());
  }, []);

  useEffect(() => {
    refreshRecipients();
    setReadAloud(readRepliesAloudEnabled());
    const onFocus = () => refreshRecipients();
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      stopSpeaking();
      if (speakEndTimerRef.current) clearInterval(speakEndTimerRef.current);
    };
  }, [refreshRecipients]);

  const speakScript = useCallback(
    (script: string, force?: boolean) => {
      if (!force && !readAloud && !readRepliesAloudEnabled()) return;
      if (!isSpeechSynthesisSupported()) return;

      speakText(script);
      setSpeaking(true);
      if (speakEndTimerRef.current) clearInterval(speakEndTimerRef.current);
      speakEndTimerRef.current = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setSpeaking(false);
          if (speakEndTimerRef.current) clearInterval(speakEndTimerRef.current);
          speakEndTimerRef.current = null;
        }
      }, 200);
    },
    [readAloud],
  );

  const speakMessage = useCallback(
    (message: ChatMessage, force?: boolean) => {
      speakScript(messageToSpeakable(message), force);
    },
    [speakScript],
  );

  const handleUpdateMessage = useCallback(
    (messageId: string, patch: Partial<ChatMessage>) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
      );
    },
    [],
  );

  const handleSend = useCallback(
    (text: string, options?: SendOptions) => {
      const body = text.trim();
      if (!body) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        body,
      };

      const parsed = parsePaymentIntent(body);
      const assistantMessage: ChatMessage = parsed.ok
        ? {
            id: crypto.randomUUID(),
            role: "assistant",
            body: ASSISTANT_SUCCESS,
            plan: parsed.plan,
            planStatus: "pending",
          }
        : {
            id: crypto.randomUUID(),
            role: "assistant",
            body: parsed.message,
          };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      if (parsed.ok) {
        void fetchNgnQuote(parsed.plan.amountUsd).then((q) =>
          handleUpdateMessage(assistantMessage.id, {
            ngnEstimate: {
              amount: q.ngnAmount,
              rate: q.usdNgnRate,
              disclaimer: q.disclaimer,
            },
          }),
        );
      }

      const shouldSpeak =
        options?.viaVoice || readAloud || readRepliesAloudEnabled();
      if (shouldSpeak) {
        speakMessage(assistantMessage, options?.viaVoice);
      }
    },
    [readAloud, speakMessage, handleUpdateMessage],
  );

  const handlePlanConfirm = useCallback(
    async (messageId: string) => {
      const target = messages.find((m) => m.id === messageId);
      if (!target?.plan) return;

      const recipient = findRecipientForPlan(
        target.plan.beneficiary,
        target.plan.location,
        recipients,
      );
      if (!recipient) return;

      setConfirmingPlanId(messageId);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, chain: { ...m.chain, pending: true, error: undefined } }
            : m,
        ),
      );

      let chainHint = "Plan confirmed in chat.";
      let chain = target.chain ?? {};
      let offramp: OfframpState | undefined;

      const chainConfig = await fetchChainConfigFromServer();
      if (chainConfig) {
        const client = await withWalletClient();
        if (!client) {
          chain = {
            pending: false,
            error: "Passkey session required — use Sign in, then confirm again.",
          };
        } else {
          try {
            const result = await registerPlanOnChain(
              client,
              target.plan,
              chainConfig,
            );
            chainHint = `On-chain plan #${result.planId.toString()} on Monad testnet.${
              result.executeTxHash ? " Settlement tx submitted." : ""
            }`;
            chain = {
              pending: false,
              planId: result.planId.toString(),
              createTxHash: result.createTxHash,
              executeTxHash: result.executeTxHash,
              hint: chainHint,
            };

            offramp = await requestDisburse({
              amountUsd: target.plan.amountUsd,
              paystackRecipientCode: recipient.paystackRecipientCode,
              recipientNickname: recipient.nickname,
              monadPlanId: result.planId.toString(),
            });
          } catch (e) {
            chain = {
              pending: false,
              error:
                e instanceof Error
                  ? e.message
                  : "On-chain confirm failed. Try again.",
            };
          }
        }
      } else {
        chainHint =
          "Monad addresses not set — off-chain confirm with Paystack orchestration only.";
        chain = { pending: false, hint: chainHint };
        offramp = await requestDisburse({
          amountUsd: target.plan.amountUsd,
          paystackRecipientCode: recipient.paystackRecipientCode,
          recipientNickname: recipient.nickname,
        });
      }

      const userInstruction =
        [...messages]
          .slice(
            0,
            messages.findIndex((m) => m.id === messageId),
          )
          .reverse()
          .find((m) => m.role === "user")?.body ?? "";

      const confirmedMessage: ChatMessage = {
        ...target,
        planStatus: "confirmed",
        chain,
        offramp,
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? confirmedMessage : m)),
      );
      setConfirmingPlanId(null);

      appendTrackedPlan({
        id: crypto.randomUUID(),
        messageId,
        createdAt: Date.now(),
        userInstruction,
        plan: target.plan,
        planStatus: "confirmed",
        chain,
        offramp,
      });

      const offrampLine = offramp?.ngnAmount
        ? ` Paystack ${offramp.mode} disburse ₦${offramp.ngnAmount}.`
        : "";

      if (readAloud || readRepliesAloudEnabled()) {
        speakScript(
          `${chainHint}${offrampLine} ${messageToSpeakable(confirmedMessage)}`,
          true,
        );
      }
    },
    [messages, recipients, withWalletClient, readAloud, speakScript],
  );

  const handlePlanCancel = useCallback(
    (messageId: string) => {
      const cancelledBody =
        "No problem — I won’t run this plan. You can send a new instruction anytime.";

      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId && message.plan
            ? {
                ...message,
                planStatus: "cancelled",
                body: cancelledBody,
              }
            : message,
        ),
      );

      if (readAloud || readRepliesAloudEnabled()) {
        speakScript(cancelledBody, true);
      }
    },
    [readAloud, speakScript],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ReadRepliesToggle onChange={setReadAloud} />
      <MessageList
        messages={messages}
        recipients={recipients}
        canConfirmPlans={canConfirmPlans}
        confirmingPlanId={confirmingPlanId}
        onPlanConfirm={handlePlanConfirm}
        onPlanCancel={handlePlanCancel}
        onTryExample={(text) => void handleSend(text)}
        onRecipientSaved={refreshRecipients}
      />
      <ChatInput onSend={handleSend} speaking={speaking} />
    </div>
  );
}
