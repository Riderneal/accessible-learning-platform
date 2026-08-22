"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  readonly length: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface TranscriptLine {
  id: number;
  text: string;
}

export default function LiveCaptions() {
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [finalLines, setFinalLines] = useState<TranscriptLine[]>([]);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const nextIdRef = useRef(0);

  useEffect(() => {
    const SpeechRecognitionImpl =
      typeof window !== "undefined"
        ? window.SpeechRecognition ?? window.webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognitionImpl) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionImpl();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";
        if (result.isFinal) {
          setFinalLines((prev) => [
            ...prev,
            { id: nextIdRef.current++, text: transcript.trim() },
          ]);
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // start() throws if already started; ignore.
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
    setInterimText("");
  }, []);

  function toggleListening() {
    if (isListening) stopListening();
    else startListening();
  }

  if (!isSupported) {
    return (
      <div className="rounded-xl border border-border bg-secondary/30 p-5 text-sm text-muted-foreground">
        Your browser doesn&apos;t support the Web Speech API (
        <code>SpeechRecognition</code>). Try Chrome or Edge, and allow
        microphone access.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={`h-2 w-2 rounded-full ${
              isListening ? "animate-pulse bg-red-500" : "bg-border"
            }`}
          />
          {isListening ? "Listening…" : "Not listening"}
        </div>
        <button
          onClick={toggleListening}
          className="flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? (
            <MicOff className="h-3.5 w-3.5" />
          ) : (
            <Mic className="h-3.5 w-3.5" />
          )}
          {isListening ? "Stop" : "Start listening"}
        </button>
      </div>

      {error && (
        <p className="mb-3 text-xs text-red-400">
          Microphone error: {error}. Check that microphone access is
          allowed for this site.
        </p>
      )}

      <div className="space-y-3 font-mono text-sm">
        {finalLines.length === 0 && !interimText && (
          <p className="text-sm text-muted-foreground">
            Press &quot;Start listening&quot; and allow microphone access to
            see live captions of your speech.
          </p>
        )}
        {finalLines.map((line) => (
          <div
            key={line.id}
            className="flex gap-4 rounded-lg border border-border bg-secondary/30 p-3"
          >
            <span className="text-muted-foreground">{line.text}</span>
          </div>
        ))}
        {interimText && (
          <div className="flex gap-4 rounded-lg border border-primary/60 bg-secondary/30 p-3">
            <span className="text-muted-foreground/70 italic">
              {interimText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
