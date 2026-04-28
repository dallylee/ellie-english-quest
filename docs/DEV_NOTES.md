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

## Known limitations

- Speech recognition depends on browser support and remains optional.
- Progress is device-specific because it is stored locally.
- Visuals use emoji and CSS only; no downloaded art or sound assets are included.
