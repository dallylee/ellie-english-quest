# Developer Notes

## Current direction

- Kept the app as vanilla JavaScript on Vite.
- Kept deployment static-only with no backend, accounts, or paid APIs.
- Kept progress local to `localStorage`.
- Updated visible naming to Eli.

## April 28, 2026 polish pass

- Added Picture Match as a fifth mode for every base level.
- Added `pictureItems` curriculum data and `pictureStars` progress.
- Updated progress loading to deep-merge saved level progress so older saves gain new fields.
- Reworked CSS mobile-first: phone layout is the default, with desktop enhancements in larger media queries.
- Updated generated sound to wait for a trusted user gesture before using Web Audio.
- Expanded content validation to cover Picture Match data and default progress.

## April 29, 2026 quest polish pass

- Shifted the visual style toward Eli's magical pink/lilac quest theme with glow, sparkle, tap, and reward animations.
- Added a full-screen welcome screen that uses `public/assets/images/eli.png` and a glowing `START` action.
- Reused Eli's image on the quest map helper panel so the old winged character is no longer the app mascot.
- Changed wrong-answer handling in Quiz, Picture Match, Listen & Say recognition fallback/error states, and Sentence Builder so mistakes show a clear answer/cue and wait for an explicit continue action.
- Changed level progression to require at least 8 stars across at least 3 completed games in the current level before the next world unlocks.
- Progress loading still preserves saved stars and attempts, then recalculates completed/unlocked state from the new quest rule for consistency.
- Added milestone collectibles in the Trophy Room: Magic Egg, Magic Feather, Magic Potion, Magic Wand, and Crown.
- Added visible Sound and Voice toggles to the welcome screen and app header. Generated sound still waits for browser interaction before playing.

## April 29, 2026 pre-deploy audio and naming pass

- Renamed bundled MP3 files to safe web paths under `public/assets/sounds/`.
- Added MP3 playback for welcome, UI taps, star collection, level open/unlock, award reveal, and announcements.
- Kept generated Web Audio as a silent fallback only when MP3 playback is unavailable.
- Sound still waits for a trusted browser interaction before attempting playback, and the Sound toggle gates all effects.
- Split naming into `displayName: "Eli"` for visible UI and `spokenName: "Ellie"` for speech synthesis.
- Added a speech text guard so any spoken string containing visible `Eli` is converted to `Ellie` before browser text-to-speech.
- Expanded validation to check the Eli image, safe MP3 asset paths, display/spoken names, and sound settings.

## April 29, 2026 answer flow pass

- Correct Quiz and Picture Match answers now show brief positive feedback and auto-advance after the sound moment.
- Wrong Quiz and Picture Match answers still stop with the correct answer, a learning cue, and an explicit `Next`.
- Added the local `wrong-answer.mp3` effect for wrong answers and unclear Listen & Say attempts.
- Kept `Read question` on Quiz and made it give visible status: it reads with speech synthesis when available, or says why it cannot read.
- Mode completion now returns straight to the current level menu after saving progress instead of showing replay/map buttons.
- Memory cards now rely on the normal tap sound only, avoiding stacked sparkle/match effects during card play.
- Lowered MP3 and generated fallback effect volume to about 40%.
- Added softer browser speech preferences, with reliable local English female/natural voices preferred when the device provides them.
- Kept speech utterances alive while the browser speaks and retry without a selected voice if the chosen voice does not start, so the `Listen` button is less likely to fail silently.
- Listen & Say now automatically keeps the Voice toggle on while that game is active, because the mode depends on hearing the prompt.
- Added lightweight ambient sparkles/flowers/butterfly details and a short level-complete burst when returning to the level menu.
- The next active unlocked quest card now gently pulses on the map, and 3-star games are styled as soft-gray `Done` cards while remaining replayable.
- Wired `public/assets/images/eli_.icon` into the browser favicon and PWA manifest icon.

## April 29, 2026 stale-cache recovery pass

- Reworked the service worker to use a new `eli-english-quest-v3` cache and network-first loading for HTML, scripts, styles, and worker files.
- The new worker activates immediately, claims open pages, deletes older app caches, and stops serving cached HTML as the first choice.
- Service worker registration now bypasses the browser HTTP cache for update checks and reloads once when an already-controlled page gets a new controller.
- New/default progress now starts with Sound on and Voice off. Existing saved settings are still merged and preserved; Listen & Say turns Voice on automatically when the mode needs it.

## April 29, 2026 reward audio pass

- Added `correct answer.mp3` for correct-answer feedback so the star sound is reserved for final star collection/accounting.
- Added `magic reward unlock.mp3` for milestone reward unlocks, both when a new reward is earned after star accounting and the first time the Trophy Room is entered after that unlock.
- Added `pendingRewardReveals` to local progress as a backward-compatible field so Trophy Room reward reveal sound/confetti plays once, then clears.
- Made unlocked milestone reward cards brighter, bouncier, and higher contrast so Magic Egg and later rewards feel collectible instead of pale.

## Known limitations

- Speech recognition depends on browser support and remains optional.
- Progress is device-specific because it is stored locally.
- Local MP3 effects depend on browser media support and only play after user interaction.
- Visuals use Eli's bundled PNG plus emoji and CSS effects; no backend-hosted art or paid media APIs are used.
