"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  AudioLines,
  ImageIcon,
  Captions,
  Download,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import AudioPanel from "@/components/AudioPanel";
import LiveCaptions from "@/components/LiveCaptions";
import { convertFiles } from "@/lib/conversion";

function ResultsPageInner() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const filesParam = searchParams.get("files");
  const isDemo = searchParams.get("demo") === "1";

  const fileNames = useMemo(
    () => (filesParam ? filesParam.split("|").filter(Boolean) : []),
    [filesParam]
  );

  const results = useMemo(() => convertFiles(fileNames), [fileNames]);
  const [activeSource, setActiveSource] = useState(0);
  const result = results[activeSource] ?? results[0];

  return (
    <div className="container max-w-4xl py-16">
      <div className="mb-10 text-center">
        <Badge variant="outline" className="mb-4">
          Step 3 of 3
        </Badge>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          {name ? `${name}, your` : "Your"} content is ready
        </h1>
        <p className="mt-3 text-muted-foreground">
          {isDemo
            ? "Here's a live demo of what a converted result looks like."
            : "Browse the converted formats below, tailored to your learning profile."}
        </p>
      </div>

      {results.length > 1 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {results.map((r, i) => (
            <button
              key={r.sourceName}
              onClick={() => setActiveSource(i)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                i === activeSource
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.sourceName}
            </button>
          ))}
        </div>
      )}

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="mb-2 flex w-full flex-wrap justify-center gap-1 sm:inline-flex sm:w-auto">
          <TabsTrigger value="text" className="gap-1.5">
            <FileText className="h-4 w-4" /> Simplified Text
          </TabsTrigger>
          <TabsTrigger value="audio" className="gap-1.5">
            <AudioLines className="h-4 w-4" /> Audio
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-1.5">
            <ImageIcon className="h-4 w-4" /> Image Descriptions
          </TabsTrigger>
          <TabsTrigger value="captions" className="gap-1.5">
            <Captions className="h-4 w-4" /> Captions
          </TabsTrigger>
        </TabsList>

        {/* Simplified Text */}
        <TabsContent value="text">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Simplified Text</CardTitle>
                <CardDescription>
                  Complex content rewritten in easier-to-understand language
                  while keeping key concepts.
                </CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" /> Export
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              {result.simplifiedText.map((section) => (
                <div key={section.heading}>
                  <h4 className="mb-1 font-semibold text-foreground">
                    {section.heading}
                  </h4>
                  <p className="text-muted-foreground">{section.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audio */}
        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <CardTitle>Audio Narration</CardTitle>
              <CardDescription>
                Text-to-speech conversion of your uploaded material.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AudioPanel
                fileName={result.audio.fileName}
                durationSeconds={result.audio.durationSeconds}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Image Descriptions */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Image & Diagram Descriptions</CardTitle>
              <CardDescription>
                Automatically generated alt-text for diagrams, charts, and
                educational images.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.images.map((img) => (
                <div
                  key={img.title}
                  className="flex items-start gap-4 rounded-lg border border-border bg-secondary/30 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-accent">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{img.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {img.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Captions */}
        <TabsContent value="captions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Captions & Transcript</CardTitle>
                <CardDescription>
                  Auto-generated captions for recorded or live lectures.
                </CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" /> Export .srt
              </Button>
            </CardHeader>
            <CardContent>
              <LiveCaptions lines={result.captions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild variant="outline" size="lg">
          <Link href="/upload">
            <RotateCcw className="h-4 w-4" /> Convert Another File
          </Link>
        </Button>
        <Button asChild variant="gradient" size="lg">
          <Link href="/profile">Update Learning Profile</Link>
        </Button>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={null}>
      <ResultsPageInner />
    </Suspense>
  );
}