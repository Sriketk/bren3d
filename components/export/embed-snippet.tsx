"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function EmbedSnippetWithCopy({
  embedUrl,
  className,
  ...props
}: React.ComponentProps<"div"> & { embedUrl: string }) {
  const [copied, setCopied] = useState(false);
  const snippet = `<iframe src="${embedUrl}" width="100%" height="400" frameborder="0" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen></iframe>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={className} {...props}>
      <span className="block font-medium text-foreground text-sm">
        Embed code
      </span>
      <div className="mt-2 flex gap-2">
        <pre className="flex-1 overflow-x-auto rounded-md border border-border bg-muted/50 p-3 text-xs">
          <code>{snippet}</code>
        </pre>
        <Button
          aria-label={copied ? "Copied to clipboard" : "Copy embed code"}
          aria-live="polite"
          className="shrink-0"
          onClick={handleCopy}
          size="sm"
          variant="outline"
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
