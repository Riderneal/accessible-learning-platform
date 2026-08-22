"use client";

import { Suspense } from "react";
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
  Play,
  Pause,
  Download,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

function ResultsPageInner() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const [isPlaying, setIsPlaying] = useState(false);

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
          Browse the converted formats below, tailored to your learning
          profile.
        </p>
      </div>

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
              <div>
                <h4 className="mb-1 font-semibold text-foreground">
                  Chapter 1: Introduction
                </h4>
                <p className="text-muted-foreground">
                  This chapter explains the main idea in short, simple
                  sentences. Difficult words are replaced with easier ones.
                  Long paragraphs are broken into small chunks so it&apos;s
                  easier to follow along.
                </p>
              </div>
              <div>
                <h4 className="mb-1 font-semibold text-foreground">
                  Key Concepts
                </h4>
                <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Concept one, explained plainly.</li>
                  <li>Concept two, with a short example.</li>
                  <li>Concept three, summarized in one line.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audio */}
        <TabsContent value="audio">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Audio Narration</CardTitle>
                <CardDescription>
                  Text-to-speech conversion of your uploaded material.
                </CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" /> Download
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 p-5">
                <button
                  onClick={() => setIsPlaying((p) => !p)}
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
                    <span>Chapter 1 - Introduction.mp3</span>
                    <span>{isPlaying ? "0:42 / 4:15" : "0:00 / 4:15"}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
                      style={{ width: isPlaying ? "16%" : "0%" }}
                    />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Adjustable playback speed and voice options available in
                settings.
              </p>
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
              {[
                {
                  title: "Figure 1.2 — Cell Structure Diagram",
                  desc: "A labeled diagram of a plant cell showing the cell wall, nucleus, chloroplasts, and mitochondria, arranged around a central vacuole.",
                },
                {
                  title: "Figure 2.1 — Bar Chart",
                  desc: "A bar chart comparing quarterly sales across four regions, with the North region showing the highest values throughout the year.",
                },
                {
                  title: "Figure 3.4 — Process Flow",
                  desc: "A left-to-right flowchart showing five sequential steps, connected by arrows, starting with 'Input' and ending with 'Output'.",
                },
              ].map((img) => (
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
                      {img.desc}
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
            <CardContent className="space-y-3 font-mono text-sm">
              {[
                { time: "00:00:01", text: "Welcome back to the lecture series." },
                {
                  time: "00:00:06",
                  text: "Today we'll cover the fundamentals of the topic.",
                },
                {
                  time: "00:00:13",
                  text: "Let's start by reviewing what we learned last time.",
                },
              ].map((c) => (
                <div
                  key={c.time}
                  className="flex gap-4 rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <span className="shrink-0 text-xs text-primary">
                    {c.time}
                  </span>
                  <span className="text-muted-foreground">{c.text}</span>
                </div>
              ))}
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
