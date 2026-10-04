"use client";

import { useEffect, useState } from "react";
import {
  readRepliesAloudEnabled,
  writeRepliesAloudEnabled,
} from "@/lib/voice/voicePreferences";

type ReadRepliesToggleProps = {
  onChange?: (enabled: boolean) => void;
};

export function ReadRepliesToggle({ onChange }: ReadRepliesToggleProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(readRepliesAloudEnabled());
  }, []);

  return (
    <label className="flex cursor-pointer items-center gap-2 px-4 py-2 text-xs text-text-muted sm:px-6">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => {
          const next = e.target.checked;
          writeRepliesAloudEnabled(next);
          setEnabled(next);
          onChange?.(next);
        }}
        className="h-3.5 w-3.5 rounded border-border accent-text"
      />
      Read replies aloud (typed chat, confirm, and cancel)
    </label>
  );
}
