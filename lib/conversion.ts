// Mock conversion pipeline.
//
// In a real deployment, convertFiles would call out to an API route
// (e.g. app/api/convert/route.ts) that runs OCR / TTS / STT / image
// captioning / summarization on the uploaded file. For this demo build
// it returns realistic, deterministic sample output so the UI has real
// data to render without needing a backend.

export interface SimplifiedSection {
  heading: string;
  body: string;
}

export interface ImageDescription {
  title: string;
  description: string;
}

export interface CaptionLine {
  time: string;
  text: string;
}

export interface ConversionResult {
  sourceName: string;
  simplifiedText: SimplifiedSection[];
  audio: {
    fileName: string;
    durationLabel: string;
    durationSeconds: number;
  };
  images: ImageDescription[];
  captions: CaptionLine[];
}

const DEFAULT_SIMPLIFIED_TEXT: SimplifiedSection[] = [
  {
    heading: "Chapter 1: Introduction",
    body: "This chapter explains the main idea in short, simple sentences. Difficult words are replaced with easier ones. Long paragraphs are broken into small chunks so it's easier to follow along.",
  },
  {
    heading: "Key Concepts",
    body: "Concept one, explained plainly. Concept two, with a short example. Concept three, summarized in one line.",
  },
];

const DEFAULT_IMAGES: ImageDescription[] = [
  {
    title: "Figure 1.2 - Cell Structure Diagram",
    description:
      "A labeled diagram of a plant cell showing the cell wall, nucleus, chloroplasts, and mitochondria, arranged around a central vacuole.",
  },
  {
    title: "Figure 2.1 - Bar Chart",
    description:
      "A bar chart comparing quarterly sales across four regions, with the North region showing the highest values throughout the year.",
  },
  {
    title: "Figure 3.4 - Process Flow",
    description:
      "A left-to-right flowchart showing five sequential steps, connected by arrows, starting with 'Input' and ending with 'Output'.",
  },
];

const DEFAULT_CAPTIONS: CaptionLine[] = [
  { time: "00:00:01", text: "Welcome back to the lecture series." },
  { time: "00:00:06", text: "Today we'll cover the fundamentals of the topic." },
  { time: "00:00:13", text: "Let's start by reviewing what we learned last time." },
  { time: "00:00:19", text: "Here's a quick recap of the key terms." },
  { time: "00:00:27", text: "Now let's look at a worked example." },
];

/**
 * Runs the (mocked) conversion pipeline for a set of uploaded file names.
 * Returns one ConversionResult per source, falling back to a single demo
 * result when no files were provided (e.g. the "Try Demo Now" flow).
 */
export function convertFiles(fileNames: string[]): ConversionResult[] {
  const sources = fileNames.length > 0 ? fileNames : ["Sample-Lecture-Notes.pdf"];

  return sources.map((name, i) => ({
    sourceName: name,
    simplifiedText: DEFAULT_SIMPLIFIED_TEXT,
    audio: {
      fileName: `${name.replace(/\.[^/.]+$/, "")}.mp3`,
      durationLabel: "4:15",
      durationSeconds: 255 + i * 12,
    },
    images: DEFAULT_IMAGES,
    captions: DEFAULT_CAPTIONS,
  }));
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}