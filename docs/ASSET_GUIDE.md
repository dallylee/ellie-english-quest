# Asset Guide

The app ships as a static site with local image and sound assets.

## Current approach

- Visuals: Eli PNG, CSS, emoji, SVG icon
- Sounds: bundled MP3 files, with generated Web Audio as a fallback
- Voice: browser SpeechSynthesis

## Current local assets

```text
public/assets/images/eli.png
public/assets/sounds/startup-screen-sound.mp3
public/assets/sounds/ui-click.mp3
public/assets/sounds/new-level-opened.mp3
public/assets/sounds/award-reveal.mp3
public/assets/sounds/announcement.mp3
public/assets/sounds/star-collected.mp3
```

## Optional user-provided assets

If the user provides assets, place them here:

```text
public/assets/images/
public/assets/sounds/
```

Suggested sounds:
- star collect
- correct answer
- level complete
- gentle wrong answer

Suggested images:
- Eli mascot
- room background
- breakfast café
- school stars
- London bonus
- Bjelovar weekend

## Rules

- Keep assets lightweight.
- Do not use copyrighted characters unless the user supplies rights-safe assets.
- Prefer SVG or compressed WebP.
