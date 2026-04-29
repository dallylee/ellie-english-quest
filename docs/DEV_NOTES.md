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

## Known limitations

- Speech recognition depends on browser support and remains optional.
- Progress is device-specific because it is stored locally.
- Local MP3 effects depend on browser media support and only play after user interaction.
- Visuals use Eli's bundled PNG plus emoji and CSS effects; no backend-hosted art or paid media APIs are used.
