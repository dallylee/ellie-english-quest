# Test Results

Date: 2026-04-28

## Automated

- `npm test`: passed.
- `npm run build`: passed.

## Browser smoke test

Tested with local Vite dev server at `http://localhost:5173/` in headless Microsoft Edge with extensions disabled.

- 390 x 844 mobile viewport: passed.
- 360 x 740 mobile viewport: passed.
- No horizontal scroll detected.
- Minimum button height detected: 48px.
- Console warnings/errors from the app: none.
- Visible title/name uses Eli; no legacy spelling detected.

## Gameplay checked

- Home loads and Start Quest opens the map.
- Map shows 8 levels; only the first level is unlocked on a fresh save.
- Room Castle completed in all 5 modes:
  - Picture Match
  - Quiz
  - Memory
  - Listen & Say fallback
  - Sentence Builder
- Room Castle awarded 15 stars total after all modes.
- Progress persisted after reload.
- Breakfast Cafe unlocked after earning stars.
- Trophy room progress produced the First dozen stars trophy.
- All 8 base levels open when unlocked and show 5 modes each.

## Not tested

- Real microphone speech recognition, because support depends on browser/device permissions.
- Installation as a PWA on a physical phone.
