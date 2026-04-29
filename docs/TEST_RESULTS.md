# Test Results

Date: 2026-04-29

## Automated

- `npm test`: passed. Content validation covers 8 levels, Picture Match data, progression config, milestone rewards, default sound settings, Eli/Ellie naming, Eli image, and safe MP3 sound paths.
- `npm run build`: passed.
- `git diff --check`: passed. Only expected Windows LF/CRLF notices were printed.

## Browser smoke test

Tested with local Vite dev server at `http://localhost:5173/` in headless Microsoft Edge with extensions disabled.

- 390 x 844 mobile viewport: passed.
- 360 x 740 mobile viewport: passed.
- No horizontal scroll detected.
- Minimum visible button height detected: 48px.
- Console warnings/errors from normal app play: none.
- Full-screen welcome screen loaded with Eli's image from `public/assets/images/eli.png`.
- Visible Sound and Voice controls appeared on the welcome screen and app header.
- Visible UI text used Eli and did not show Ellie.
- Speech synthesis probe captured `Hi Ellie. Choose a little world.`
- With Sound off, tapping `START` recorded zero MP3 playback requests.
- With Sound on, local MP3 playback requests were recorded for:
  - `ui-click.mp3`
  - `startup-screen-sound.mp3`
  - `new-level-opened.mp3`
  - `star-collected.mp3`
  - `award-reveal.mp3`
  - `announcement.mp3`

## Gameplay checked

- `START` opened the quest map from a fresh save.
- Map showed 8 levels; only Room Castle was unlocked on a fresh save.
- Room Castle exposed all 5 modes.
- Quiz wrong-answer feedback stayed on Question 1 after 1.3 seconds, showed `Answer: dekica.`, showed the learning cue, and required `Next`.
- Completing one mode did not unlock Breakfast Cafe.
- Completing Quiz, Picture Match, and Memory with 8+ total stars unlocked Breakfast Cafe.
- Listen & Say tap fallback completed and saved progress when speech recognition was disabled in the smoke harness.
- Progress persisted after reload with 11 total stars and Breakfast Cafe still unlocked.
- Trophy Room showed 5 milestone collectibles; Magic Egg unlocked at 10+ stars and Magic Feather remained locked at 20 stars.
- A synthetic all-level localStorage fixture confirmed all 8 base levels can open and each exposes 5 modes.
- A synthetic 9-star fixture confirmed crossing the 10-star milestone triggers the Magic Egg award path and announcement sound.

## Not tested

- Real microphone speech recognition, because support depends on browser/device permissions.
- Installation as a PWA on a physical phone.
