# Accessible Learning Platform

A Next.js 14 (App Router) + TypeScript + Tailwind CSS starter for **PS-06: Accessible Learning — On-Demand Format Conversion**.

Converts standard educational content (PDFs, notes, audio, video, images) into personalized accessible formats — simplified text, audio narration, image descriptions, and captions — based on a student's selected needs (Visual, Hearing, Cognitive, Motor).

## Tech stack

- **Next.js 14** — App Router, Server & Client Components
- **TypeScript**
- **Tailwind CSS** with a dark, glowing "space-tech" theme matching the design brief
- **shadcn/ui-style components** (Button, Card, Tabs, Checkbox, Badge) built on Radix primitives
- **lucide-react** icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Folder structure

```
accessible-learning-platform/
├── app/
│   ├── layout.tsx          # Root layout (navbar, footer, fonts)
│   ├── globals.css         # Tailwind + CSS variables (dark theme)
│   ├── page.tsx             # Landing page (hero + "Start Converting")
│   ├── profile/
│   │   └── page.tsx         # Step 1: select disabilities (multi-select)
│   ├── upload/
│   │   └── page.tsx         # Step 2: drag-and-drop file upload
│   └── results/
│       └── page.tsx         # Step 3: tabbed results (Text/Audio/Images/Captions)
├── components/
│   ├── Navbar.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── tabs.tsx
│       ├── checkbox.tsx
│       └── badge.tsx
├── lib/
│   └── utils.ts             # cn() class-merging helper
├── components.json          # shadcn/ui config (for `npx shadcn add ...`)
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

## User flow

1. **Landing (`/`)** — Hero section explaining the platform, with a "Start Converting" CTA.
2. **Profile (`/profile`)** — Multi-select cards for Visual / Hearing / Cognitive / Motor needs; selections are passed via query params.
3. **Upload (`/upload`)** — Drag-and-drop zone (also supports click-to-browse) accepting PDF, images, text, audio, and video. Shows a file list with remove/size/type, then a "Convert" action.
4. **Results (`/results`)** — Tabbed view: **Simplified Text**, **Audio**, **Image Descriptions**, **Captions**, each with mocked but realistic sample output and export/download actions.

## Notes for extending this into a real product

- Wire the `/upload` page's `handleConvert` to an actual API route (e.g. `app/api/convert/route.ts`) that accepts the files and calls your conversion pipeline (OCR, TTS, STT, image captioning, summarization).
- Persist the user's profile (needs) in a database or cookie instead of query params.
- Add authentication if you need per-student history.
- Swap the mocked results in `/results` for real conversion output, streamed or polled from your backend.
- Add more shadcn/ui components as needed via `npx shadcn@latest add <component>` (the `components.json` is already configured).

## Accessibility considerations already baked in

- Semantic headings and landmark regions (`header`, `main`, `footer`)
- Visible focus rings on all interactive elements
- Sufficient color contrast on the dark theme
- Labeled icon-only buttons (`aria-label`)
- Keyboard-operable checkboxes and tabs (Radix primitives)
