import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  Ear,
  Brain,
  Accessibility,
  FileText,
  AudioLines,
  Captions,
  ImageIcon,
  ArrowRight,
} from "lucide-react";

const needs = [
  {
    icon: Eye,
    title: "Visual",
    desc: "Screen-reader friendly text, audio narration, and image descriptions.",
  },
  {
    icon: Ear,
    title: "Hearing",
    desc: "Automated captions and transcripts for lectures and videos.",
  },
  {
    icon: Brain,
    title: "Cognitive",
    desc: "Simplified language mode that retains key concepts.",
  },
  {
    icon: Accessibility,
    title: "Motor",
    desc: "Hands-free navigation with speech-to-text input.",
  },
];

const features = [
  {
    icon: FileText,
    title: "Accessible Content Conversion",
    desc: "Converts PDFs, notes, and study materials into accessible formats.",
  },
  {
    icon: AudioLines,
    title: "Text-to-Speech & Speech-to-Text",
    desc: "Converts written content to audio and spoken content into text.",
  },
  {
    icon: Captions,
    title: "Automated Captions",
    desc: "Generates captions and transcripts for recorded or live lectures.",
  },
  {
    icon: ImageIcon,
    title: "Simplified Learning Mode",
    desc: "Converts complex content into easier-to-understand language.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="container flex flex-col items-center gap-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          PS-06 &middot; Accessible Learning
        </div>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Learning materials that adapt to{" "}
          <span className="text-gradient">every student</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Students with visual, hearing, motor, or learning difficulties
          deserve content built for them. Transform any study material into
          accessible, personalized formats — on demand.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="gradient">
            <Link href="/profile">
              Start Converting <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/upload">Skip to Upload</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/results?demo=1">Try Demo Now</Link>
          </Button>
        </div>
      </section>

      {/* Who it's for */}
      <section className="container py-16">
        <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
          Built for every kind of learner
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          Select your needs and we personalize the format for you.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {needs.map((n) => (
            <Card
              key={n.title}
              className="glow-border transition-transform hover:-translate-y-1"
            >
              <CardHeader>
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-primary">
                  <n.icon className="h-5 w-5" />
                </div>
                <CardTitle>{n.title}</CardTitle>
                <CardDescription>{n.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
          Expected Features
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          One platform, every accessible format you need.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="flex items-start gap-4 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-accent">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24 pt-8">
        <Card className="glow-border overflow-hidden bg-gradient-to-br from-violet-950/60 via-card to-cyan-950/40">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to make your content accessible?
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Set up your profile, upload your materials, and get results in
              the format that works best for you.
            </p>
            <Button asChild size="lg" variant="gradient">
              <Link href="/profile">
                Start Converting <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
