# Voice (Day 5)

## Flow

1. Tap the **mic** on `/app` (Chrome or Edge recommended).
2. Speak a payment instruction (same patterns as typed text — see [intent-parser.md](./intent-parser.md)).
3. Noma transcribes, parses, shows the plan card, and **reads the assistant reply aloud** through your speakers.

Typed **Send** does not trigger speech (only voice-triggered sends).

## Browser requirements

- **Speech-to-text**: `SpeechRecognition` / `webkitSpeechRecognition` (Chrome, Edge).
- **Text-to-speech**: `speechSynthesis` (widely supported).
- **Microphone** permission for the site.
- Use **localhost** or **HTTPS** (browsers block mic on insecure origins).

## Implementation

- `frontend/src/lib/voice/browserSpeech.ts`
- `frontend/src/lib/voice/speakableAssistant.ts`
- `frontend/src/components/chat/ChatInput.tsx` (mic)
- `frontend/src/components/chat/ChatShell.tsx` (TTS after `viaVoice` send)

No cloud STT/TTS API keys in Day 5.
