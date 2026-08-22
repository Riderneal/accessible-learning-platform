"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Eye, Ear, Brain, Accessibility, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type DisabilityType = "visual" | "hearing" | "cognitive" | "motor";

const options: {
  id: DisabilityType;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  formats: string[];
}[] = [
  {
    id: "visual",
    label: "Visual",
    desc: "Low vision, blindness, or color blindness.",
    icon: Eye,
    formats: ["Audio narration", "Screen-reader text", "Image descriptions"],
  },
  {
    id: "hearing",
    label: "Hearing",
    desc: "Deaf or hard of hearing.",
    icon: Ear,
    formats: ["Captions", "Full transcripts", "Visual alerts"],
  },
  {
    id: "cognitive",
    label: "Cognitive",
    desc: "Dyslexia, ADHD, or other learning differences.",
    icon: Brain,
    formats: ["Simplified text", "Chunked content", "Key concept highlights"],
  },
  {
    id: "motor",
    label: "Motor",
    desc: "Limited mobility or dexterity.",
    icon: Accessibility,
    formats: ["Voice navigation", "Speech-to-text input", "Keyboard-first UI"],
  },
];

export default function ProfilePage() {
  const [selected, setSelected] = useState<DisabilityType[]>([]);
  const [name, setName] = useState("");
  const router = useRouter();

  function toggle(id: DisabilityType) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleContinue() {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (selected.length) params.set("needs", selected.join(","));
    router.push(`/upload?${params.toString()}`);
  }

  return (
    <div className="container max-w-4xl py-16">
      <div className="mb-10 text-center">
        <Badge variant="outline" className="mb-4">
          Step 1 of 3
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Tell us about your learning needs
        </h1>
        <p className="mt-3 text-muted-foreground">
          Select all that apply. We&apos;ll tailor the converted formats to
          fit you.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Your name (optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Johnson"
            className="h-11 w-full rounded-md border border-border bg-secondary/40 px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {options.map((opt) => {
          const isChecked = selected.includes(opt.id);
          return (
            <Card
              key={opt.id}
              onClick={() => toggle(opt.id)}
              className={cn(
                "cursor-pointer select-none transition-all hover:-translate-y-0.5",
                isChecked
                  ? "border-primary glow-border bg-primary/5"
                  : "hover:border-border/80"
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                      isChecked
                        ? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <opt.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{opt.label}</CardTitle>
                    <CardDescription>{opt.desc}</CardDescription>
                  </div>
                </div>
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggle(opt.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {opt.formats.map((f) => (
                    <Badge key={f} variant="secondary">
                      {f}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selected.length === 0
            ? "No needs selected — you can still continue with default formats."
            : `${selected.length} need${selected.length > 1 ? "s" : ""} selected`}
        </p>
        <Button size="lg" variant="gradient" onClick={handleContinue}>
          Continue to Upload <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
