# Eli's English Quest 2.0: Art and Asset Strategy Addendum

## Purpose

This addendum tells Codex how to make the V2 rebuild genuinely beautiful while staying safe, performant and practical. The game should look like a polished magical adventure, not a prototype made from flat cards.

## Main visual rule

Use Three.js through React Three Fiber as the main scene engine. Every level should feel like a 3D space, even when some scenery is made from generated images or SVG layers. The camera, lighting, particles, reward objects and interactive puzzle objects should make the scene feel alive.

## Asset decision rules

1. Use procedural Three.js/R3F geometry for interactive objects that Eli solves or touches: islands, keys, gates, doors, potions, crystals, clocks, bridges, rewards, puzzle props and Luma.
2. Use generated images, SVGs or lightweight textures for non-interactive beauty: sky gradients, cave wall backplates, portal backdrops, trophy shelf art, illustrated signs, soft UI stickers and decorative reward frames.
3. Use public assets only when they are clearly permissively licensed, lightweight, locally hosted and documented with source and licence.
4. Do not hotlink remote assets at runtime.
5. Do not use copyrighted character art, copyrighted game assets, unverified models or large asset packs.
6. When a generated or public asset is unavailable, build a procedural placeholder that still looks cute and report exactly what should be replaced later.

## Codex image creation instruction

If Codex has access to image creation or design-generation capability in its environment, it may create original assets for:

- panoramic sky backgrounds;
- soft cave wall textures;
- portal hub backgrounds;
- trophy shelf or reward-room backgrounds;
- reward icons and badges;
- sticker-style UI decorations;
- cloud, sparkle, star, crystal and clock particle sprites.

Generated assets must be treated as project assets, stored locally and referenced through the app. Codex should report where the images were placed and how they are used. If image creation is not available, Codex should create SVG/CSS/Three.js equivalents and report the limitation.

## Public asset instruction

Codex may search for and use available public assets only if all of these are true:

- the licence is public domain, CC0, MIT-compatible or otherwise clearly suitable for this private child game project;
- the licence and source URL are recorded in `public/assets/v2/ATTRIBUTIONS.md`;
- the asset is copied locally into `public/assets/v2/` or `src/v2/assets/`;
- the asset is optimised for mobile;
- the asset does not make the bundle excessively large;
- the source does not require a paid subscription, private account, unclear licence or ongoing external dependency.

## Suggested folder structure

Use or create:

```text
public/assets/v2/
  backgrounds/
  models/
  textures/
  trophies/
  sfx/
  music/
  sprites/
  ATTRIBUTIONS.md
src/v2/assets/
  assetManifest.js
```

The asset manifest should describe every non-code visual or sound asset used by the V2 saga.

## Beauty targets

Codex should aim for:

- toy-like low-poly 3D objects;
- soft pastel but vivid colours;
- generous glow and sparkle effects;
- clear silhouettes for active puzzle objects;
- animated success moments after every task;
- world-specific atmosphere for each saga;
- a visible reward shelf or trophy space where Eli can see what she has earned;
- camera movement that feels magical but does not confuse a child;
- mobile readability over visual clutter.

## Performance limits

- Prefer low-poly geometry and instanced/simple particles.
- Lazy-load world assets and level assets.
- Avoid heavy post-processing until the core game is stable.
- Keep texture sizes modest, ideally 512 px to 1024 px for backgrounds and lower for small sprites.
- Avoid frequent React state updates inside animation frames. Use `useFrame`, refs and shader/material updates for animation.
- Test on a mobile viewport around 390 x 844 with no horizontal overflow.

## Sound assets

Sound should be magical but gentle. Use soft loops and short cues:

- map ambience;
- world ambience;
- task success chime;
- bridge or portal unlock;
- reward fanfare;
- Luma reaction sparkle;
- gentle miss sound.

Public sound assets follow the same attribution and licence rules as visual assets. If unavailable, Codex should implement silent-safe hooks and report missing sound assets.

## Trophy shelf requirement

Add or plan a trophy shelf/reward room for V2. It can be a 3D shelf, an illustrated generated background with 3D trophy objects in front, or a hybrid. The shelf should show earned rewards from all worlds:

- Sky Islands rewards;
- Crystal Mystery rewards;
- Time Portal Case rewards.

The shelf should be accessible from the saga map, but it must not dominate the child play surface during active level gameplay.

## QA for assets

Codex must verify:

- no missing asset paths;
- no broken imports;
- no external hotlinks in runtime code;
- attribution file exists when public assets are used;
- generated assets are referenced correctly;
- mobile layout remains clean;
- `npm test` passes;
- `npm run build` passes.
