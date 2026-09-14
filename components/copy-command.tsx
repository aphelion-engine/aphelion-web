"use client";

import { Check, Copy } from "@gravity-ui/icons";
import { useState } from "react";

type CopyCommandProps = {
  command: string;
  /** Explains when to reach for this command, when a page shows more than one. */
  label?: string;
};

/** A shell command in a terminal frame, with a copy control in the title bar. */
export function CopyCommand({ command, label }: CopyCommandProps): React.ReactElement {
  const [copied, setCopied] = useState<boolean>(false);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      // Clipboard access can be blocked. The command is selectable either way,
      // so there is nothing useful to interrupt the user with.
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="min-w-0">
      {label ? <p className="mb-1.5 text-xs text-muted">{label}</p> : null}
      <div className="aph-terminal">
        <div className="aph-terminal__bar">
          <span>Command</span>
          <button
            type="button"
            onClick={() => void copy()}
            className="aph-btn aph-btn--ghost aph-btn--sm"
            aria-label={`Copy command: ${command}`}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <code className="aph-terminal__code aph-terminal__code--wrap">{command}</code>
      </div>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
