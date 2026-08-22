"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import type { CaptionLine } from "@/lib/conversion";

interface LiveCaptionsProps {
  lines: CaptionLine[];
}

/**
 * Simulates a live captioning stream: lines "arrive" one at a time so the
 * UI reads like real-time speech-to-text output rather than a static
 * transcript dump.
 */
export default function LiveCaptions({ lines }: LiveCaptionsProps) {
  const [isLive, setIsLive] = useState(false);
  const [visibleCount, setVisibleCount] = useState(lines.length > 0 ? 1 : 0);

  useEffect(() => {
    if (!isLive) return;
    if (visibleCount >= lines.length) {
      setIsLive(false);
      return;
    }
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 900);
    return () => clearTimeout(t);
  }, [isLive, visibleCount, lines.length]);

  function toggleLive() {
    if (visibleCount >= lines.length) setVisibleCount(1);
    setIsLive((l) => !l);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={`h-2 w-2 rounded-full ${
              isLive ? "animate-pulse bg-red-500" : "bg-border"
            }`}
          />
          {isLive ? "Live captioning" : "Paused"}
        </div>
        <button
          onClick={toggleLive}
          className="flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
          aria-label={isLive ? "Stop live captions" : "Start live captions"}
        >
          {isLive ? (
            <MicOff className="h-3.5 w-3.5" />
          ) : (
            <Mic className="h-3.5 w-3.5" />
          )}
          {isLive ? "Stop" : "Simulate live"}
        </button>
      </div>
      <div className="space-y-3 font-mono text-sm">
        {lines.slice(0, visibleCount).map((c, i) => (
          <div
            key={c.time}
            className={`flex gap-4 rounded-lg border border-border bg-secondary/30 p-3 ${
              i === visibleCount - 1 && isLive ? "border-primary/60" : ""
            }`}
          >
            <span className="shrink-0 text-xs text-primary">{c.time}</span>
            <span className="text-muted-foreground">{c.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}