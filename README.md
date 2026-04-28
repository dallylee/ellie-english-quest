# Eli’s English Quest

A personalised, mobile-first browser game for Eli, a Croatian A1 English learner.

The app is designed as a playful alternative to a voice tutor. It uses short games, rewards, local progress saving, and optional browser speech features.

## What is included

- 8 A1 learning worlds with map progression
- Quiz, Picture Match, Memory, Listen & Say, and Sentence Builder modes
- Star rewards, level unlocks, and a trophy room
- Local progress saving via `localStorage`
- Mobile-first layout with large touch targets
- Browser-native speech synthesis and optional speech recognition fallback
- PWA manifest and basic service worker
- Static-site deployment with no backend required

## Quick start

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Test

```bash
npm test
npm run build
```

## Deploy

Build the static site:

```bash
npm run build
```

Deploy the `dist` folder to GitHub Pages, Cloudflare Pages, Netlify, or Vercel.

Progress is saved only on the device using `localStorage`; no login or database is required.

## Design notes

Keep future changes child-friendly and phone-first:

- A1 English only
- short questions and gentle feedback
- Croatian only as support
- rewards for trying, not only for correctness
- no sensitive personal data
