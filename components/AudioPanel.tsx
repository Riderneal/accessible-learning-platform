"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Download, Gauge } from "lucide-react";
import { formatTime } from "@/lib/conversion";
import { Button } from "@/components/ui/button";

interface AudioPanelProps {
  fileName: string;
  durationSeconds: number;
}

const SPEEDS = [1, 1.25, 1.5, 2];

export default function AudioPanel({ fileName, durationSeconds }: AudioPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + SPEEDS[speedIndex];
          if (next >= durationSeconds) {
            setIsPlaying(false);
            return durationSeconds;
          }
          return next;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speedIndex, durationSeconds]);

  function togglePlay() {
    if (elapsed >= durationSeconds) setElapsed(0);
    setIsPlaying((p) => !p);
  }

  function cycleSpeed() {
    setSpeedIndex((i) => (i + 1) % SPEEDS.length);
  }

  const progress = durationSeconds > 0 ? (elapsed / durationSeconds) * 100 : 0;

  return (
    <div>
      <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 p-5">
        <button
          onClick={togglePlay}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-white transition-transform hover:scale-105"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 translate-x-0.5" />
          )}
        </button>
        <div className="flex-1">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>{fileName}</span>
            <span>
              {formatTime(elapsed)} / {formatTime(durationSeconds)}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button
          onClick={cycleSpeed}
          className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
          aria-label="Change playback speed"
        >
          <Gauge className="h-3.5 w-3.5" /> {SPEEDS[speedIndex]}x
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Adjustable playback speed and voice options available in settings.
        </p>
        <Button size="sm" variant="outline">
          <Download className="h-4 w-4" /> Download
        </Button>
      </div>
    </div>
  );
}