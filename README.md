# Accessible Learning Platform

**On-demand accessible format conversion for educational content.**

Converts standard study materials (PDFs, notes, audio, video, images) into personalized accessible formats — simplified text, audio narration, image descriptions, and live captions — based on a student's selected needs (Visual, Hearing, Cognitive, Motor).

Built for **PS-06: Accessible Learning — On-Demand Format Conversion**.

## Features

- Simplified Text — complex material rewritten in plain language, key concepts preserved
- Text-to-Speech Audio — playable narration with speed control and a progress bar
- Image & Diagram Descriptions — auto-generated alt-text for figures and charts
- Live Captions — simulated real-time captioning plus a full transcript, exportable as .srt
- Personalized Profile — students pick Visual / Hearing / Cognitive / Motor needs up front
- Try Demo Now — one-click demo flow straight from the landing page, no upload required

## Tech stack

- Next.js 14 — App Router, Server & Client Components
- TypeScript
- Tailwind CSS with a dark, glowing "space-tech" theme
- shadcn/ui-style components (Button, Card, Tabs, Checkbox, Badge) built on Radix primitives
- lucide-react icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## User flow

1. Landing (`/`) — Hero section explaining the platform, with "Start Converting", "Skip to Upload", and "Try Demo Now" CTAs.
2. Profile (`/profile`) — Multi-select cards for Visual / Hearing / Cognitive / Motor needs; selections are passed via query params.
3. Upload (`/upload`) — Drag-and-drop zone (also supports click-to-browse) accepting PDF, images, text, audio, and video. Shows a file list with remove/size/type, then a "Convert" action.
4. Results (`/results`) — Tabbed view: Simplified Text, Audio, Image Descriptions, Captions. Each uploaded file gets its own converted result, driven by `lib/conversion.ts` and rendered with the `AudioPanel` and `LiveCaptions` components.

## Folder structure

```
accessible-learning-platform/
  app/
      layout.tsx           - Root layout (navbar, footer, fonts)
          globals.css          - Tailwind + CSS variables (dark theme)
              page.tsx             - Landing page (hero + CTAs, incl. "Try Demo Now")
                  profile/page.tsx     - Step 1: select disabilities (multi-select)
                      upload/page.tsx      - Step 2: drag-and-drop file upload
                          results/page.tsx     - Step 3: tabbed results (Text/Audio/Images/Captions)
                            components/
                                Navbar.tsx
                                    AudioPanel.tsx       - Playable audio narration player (speed control, progress)
                                        LiveCaptions.tsx     - Simulated live captions + transcript
                                            ui/
                                                  button.tsx
                                                        card.tsx
                                                              tabs.tsx
                                                                    checkbox.tsx
                                                                          badge.tsx
                                                                            lib/
                                                                                utils.ts             - cn() class-merging helper
                                                                                    conversion.ts        - Mock conversion pipeline (swap for a real API)
                                                                                      components.json        - shadcn/ui config (for npx shadcn add ...)
                                                                                        tailwind.config.ts
                                                                                          postcss.config.js
                                                                                            next.config.js
                                                                                              tsconfig.json
                                                                                                package.json
                                                                                                ```

                                                                                                ## Notes for extending this into a real product

                                                                                                - Wire `lib/conversion.ts`'s `convertFiles` to an actual API route (e.g. `app/api/convert/route.ts`) that accepts the files and calls your conversion pipeline (OCR, TTS, STT, image captioning, summarization) instead of returning mock data.
                                                                                                - Persist the user's profile (needs) in a database or cookie instead of query params.
                                                                                                - Add authentication if you need per-student history.
                                                                                                - Stream or poll real conversion output for the Audio and Captions tabs instead of the simulated playback/live-caption timers.
                                                                                                - Add more shadcn/ui components as needed via `npx shadcn@latest add <component>` (the `components.json` is already configured).

                                                                                                ## Accessibility considerations already baked in

                                                                                                - Semantic headings and landmark regions (`header`, `main`, `footer`)
                                                                                                - Visible focus rings on all interactive elements
                                                                                                - Sufficient color contrast on the dark theme
                                                                                                - Labeled icon-only buttons (`aria-label`)
                                                                                                - Keyboard-operable checkboxes, tabs, and controls (Radix primitives)