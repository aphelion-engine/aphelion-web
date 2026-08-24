"use client";

import { Check, Copy } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { useState } from "react";

type CopyCommandProps = {
  command: string;
};

export function CopyCommand({ command }: CopyCommandProps): React.ReactElement {
  const [copied, setCopied] = useState<boolean>(false);

  async function copy(): Promise<void> {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-separator bg-surface-secondary px-3 py-2">
      <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">{command}</code>
      <Button isIconOnly size="sm" variant="tertiary" onPress={() => void copy()} aria-label="Copy command">
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
}
