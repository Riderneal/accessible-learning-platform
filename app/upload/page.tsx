"use client";

import { useCallback, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  AudioLines,
  Video,
  FileType,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  kind: "pdf" | "image" | "text" | "audio" | "video" | "other";
}

const acceptedTypes = [
  { icon: FileType, label: "PDF" },
  { icon: ImageIcon, label: "Images" },
  { icon: FileText, label: "Text" },
  { icon: AudioLines, label: "Audio" },
  { icon: Video, label: "Video" },
];

function kindFromFile(file: File): UploadedFile["kind"] {
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("text/")) return "text";
  return "other";
}

const kindIcon: Record<UploadedFile["kind"], React.ComponentType<{ className?: string }>> = {
  pdf: FileType,
  image: ImageIcon,
  text: FileText,
  audio: AudioLines,
  video: Video,
  other: FileText,
};

function UploadPageInner() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: f.size,
      kind: kindFromFile(f),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function handleConvert() {
    setIsConverting(true);
    const params = new URLSearchParams(searchParams.toString());
    setTimeout(() => {
      router.push(`/results?${params.toString()}`);
    }, 1200);
  }

  const needs = searchParams.get("needs");

  return (
    <div className="container max-w-4xl py-16">
      <div className="mb-10 text-center">
        <Badge variant="outline" className="mb-4">
          Step 2 of 3
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Upload your learning material
        </h1>
        <p className="mt-3 text-muted-foreground">
          Drag and drop PDFs, images, text, audio, or video files to convert.
        </p>
        {needs && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {needs.split(",").map((n) => (
              <Badge key={n} variant="secondary" className="capitalize">
                {n}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border bg-secondary/20 hover:border-primary/60 hover:bg-secondary/30"
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-primary">
          <UploadCloud className="h-8 w-8" />
        </div>
        <div>
          <p className="font-semibold">
            {isDragging ? "Drop your files here" : "Drag & drop files here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse from your device
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept=".pdf,image/*,.txt,.doc,.docx,audio/*,video/*"
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {acceptedTypes.map((t) => (
            <span
              key={t.label}
              className="flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
            >
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </span>
          ))}
        </div>
      </div>

      {files.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Uploaded files</CardTitle>
            <CardDescription>
              {files.length} file{files.length > 1 ? "s" : ""} ready for
              conversion
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {files.map((f) => {
              const Icon = kindIcon[f.kind];
              return (
                <div
                  key={f.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-accent">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(f.size)} &middot; {f.kind.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(f.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    aria-label={`Remove ${f.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="mt-10 flex justify-end">
        <Button
          size="lg"
          variant="gradient"
          disabled={files.length === 0 || isConverting}
          onClick={handleConvert}
        >
          {isConverting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Converting...
            </>
          ) : (
            <>
              Convert to Accessible Formats <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={null}>
      <UploadPageInner />
    </Suspense>
  );
}
