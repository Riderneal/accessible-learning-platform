"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Square, RotateCcw, Gauge } from "lucide-react";

interface AudioPanelProps {
  text: string;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

type SpeechStatus = "idle" | "speaking" | "paused";

export default function AudioPanel({ text }: AudioPanelProps) {
  const [isSupported, setIsSupported] = useState(true);
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>("");
  const [rate, setRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    function loadVoices() {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
        setVoiceURI((current) => current || available[0].voiceURI);
      }
    }

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);

  const selectedVoice = useMemo(
    () => voices.find((v) => v.voiceURI === voiceURI) ?? null,
    [voices, voiceURI]
  );

  function speak() {
    if (!isSupported || !text.trim()) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => setStatus("speaking");
    utterance.onresume = () => setStatus("speaking");
    utterance.onpause = () => setStatus("paused");
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function pause() {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }

  function resume() {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setStatus("speaking");
  }

  function stop() {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setStatus("idle");
  }

  if (!isSupported) {
    return (
      <div className="rounded-xl border border-border bg-secondary/30 p-5 text-sm text-muted-foreground">
        Your browser doesn&apos;t support the Web Speech API (
        <code>speechSynthesis</code>). Try Chrome, Edge, or Safari.
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-xl border border-border bg-secondary/30 p-5">
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={`h-2 w-2 rounded-full ${
              status === "speaking"
                ? "animate-pulse bg-emerald-500"
                : status === "paused"
                  ? "bg-amber-500"
                  : "bg-border"
            }`}
          />
          {status === "speaking"
            ? "Speaking"
            : status === "paused"
              ? "Paused"
              : "Idle"}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={speak}
            disabled={!text.trim()}
            className="flex h-11 items-center gap-2 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 px-4 text-sm font-medium text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            <Play className="h-4 w-4" /> Speak
          </button>
          <button
            onClick={pause}
            disabled={status !== "speaking"}
            className="flex h-11 items-center gap-2 rounded-full border border-border bg-background/60 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Pause className="h-4 w-4" /> Pause
          </button>
          <button
            onClick={resume}
            disabled={status !== "paused"}
            className="flex h-11 items-center gap-2 rounded-full border border-border bg-background/60 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" /> Resume
          </button>
          <button
            onClick={stop}
            disabled={status === "idle"}
            className="flex h-11 items-center gap-2 rounded-full border border-border bg-background/60 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Square className="h-4 w-4" /> Stop
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="voice-select"
              className="mb-1.5 block text-xs text-muted-foreground"
            >
              Voice
            </label>
            <select
              id="voice-select"
              value={voiceURI}
              onChange={(e) => setVoiceURI(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-foreground"
            >
              {voices.length === 0 && <option value="">Loading voices…</option>}
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="speed-select"
              className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Gauge className="h-3.5 w-3.5" /> Speed
            </label>
            <select
              id="speed-select"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-foreground"
            >
              {SPEEDS.map((s) => (
                <option key={s} value={s}>
                  {s}x
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Uses your browser&apos;s built-in text-to-speech engine to read the
        simplified text aloud.
      </p>
    </div>
  );
}
