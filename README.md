# DGXANIMO — Product Photo Studio

A privacy-first product photo editor focused on **Original Product Preservation**. The first milestone establishes the shared React + TypeScript + Vite foundation for web and Windows desktop targets.

## Principles

- Keep the uploaded original immutable.
- Apply edits non-destructively as adjustments and layers.
- Never generatively redraw product pixels.
- Treat segmentation as a mask proposal, not a source of replacement product pixels.
- Require user review for edits that touch the product surface.

## Stack

- React, TypeScript, Vite
- Tailwind CSS
- Vitest and Testing Library
- Shared TypeScript image-engine package
- Tauri desktop shell (planned; added after the web foundation is verified)

## Development

```bash
npm install
npm run dev
npm run test
npm run build
```

## Current milestone

Foundation only: app shell, design tokens, non-destructive image document types, pixel-preservation utilities, and tests. AI segmentation, background compositing, and native desktop packaging are subsequent milestones.
