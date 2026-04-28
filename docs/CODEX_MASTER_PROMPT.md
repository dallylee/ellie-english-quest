# Codex Master Prompt

You are Codex working as a senior full-stack product engineer, educational game designer, and QA engineer.

## Mission

Develop this starter project into a polished browser-based English learning game for Eli.

Eli is:
- 10 years old
- Croatian L1
- English CEFR A1, moving toward A1+
- sensitive to discouragement
- more likely to enjoy a playful game than a formal tutor

The previous Custom GPT voice-tutor approach did not work well for her. This app must feel like a game first, with English practice built in.

## Core product goal

Create a fun, mobile-friendly, personalised English game with:

- a map of levels
- multiple game modes
- stars and rewards
- trophy room
- local progress saving
- optional voice/listening features
- cute visuals
- A1-level English only

The app should be deployable as a static site. Avoid backend complexity unless there is a clear reason.

## Development protocol

Work autonomously. Do not stop after one pass.

1. Read every file in `/docs`.
2. Run the app.
3. Run tests.
4. Inspect UX and code structure.
5. Improve the app.
6. Re-test.
7. Repeat until acceptance criteria are met.

Only ask for human input if you are truly blocked.

## Priority order

1. Child-friendly UX and safety
2. A1 curriculum correctness
3. Mobile usability
4. Game fun and reward loop
5. Code maintainability
6. Deployment simplicity

## Technical expectations

Current scaffold:
- Vanilla JavaScript
- Vite
- Static PWA-style app
- localStorage progress

You may refactor into React, Svelte, Vue, or keep vanilla JS. If you change framework, justify it in `docs/DEV_NOTES.md`.

## Must-have features

### Levels
There must be a visible level map with progression. Current levels can be expanded:

1. Room Castle
2. Breakfast Café
3. School Stars
4. Time Tower
5. Tram Trail
6. Family Garden
7. Dance Stage
8. Weekend Adventure

Bonus levels to consider:
- London Bonus
- Grandma’s Juhica Bonus
- Music & Hip Hop Bonus

### Game modes
Keep or improve:

- Quiz: multiple-choice, immediate feedback
- Memory: pair English and Croatian words
- Listen & Say: TTS + optional speech recognition
- Sentence Builder: tap words in correct order

Add at least one new mode if feasible:
- Picture Match
- Word Catcher
- Star Path Review
- Mini Story Choice

### Rewards
- Stars
- Level completion animation
- Trophy room
- Unlocking map progression
- Optional daily streak if it remains local and simple

### Progress
- Save automatically in localStorage
- Restore progress on reload
- Include reset option
- Avoid storing sensitive personal data

### Voice
Use browser-native features only:
- SpeechSynthesis for TTS
- SpeechRecognition / webkitSpeechRecognition if available
- Provide tap-based fallback if speech recognition is unavailable

Do not require paid APIs.

### Assets
Use CSS, SVG, emoji, and generated visual elements by default.
If external images or sounds are needed, use placeholders and document exactly where the user can add them.

## Personalisation

Use these safely:
- Eli
- Mum Mia
- Uncle Dali
- Zagreb
- Bjelovar
- London
- singing
- hip hop dancing
- Maths, Music, Informatics
- foods: lasagne, pizza, juhica, cake

Do not include sensitive family details or teasing.

## A1 language rules

- Use short sentences.
- Use simple common words.
- Use multiple-choice before open-ended answers.
- Feedback examples:
  - “Nice!”
  - “Good try.”
  - “You got a star.”
  - “A better sentence is…”
- Avoid grammar jargon.

## Acceptance criteria

The project is “good enough” when:

1. `npm test` passes.
2. `npm run build` passes.
3. The app works on a mobile viewport.
4. Progress saves after reload.
5. All 8 base levels are playable.
6. Each base level has at least 4 modes.
7. No console errors during normal play.
8. The UI feels cheerful and child-friendly.
9. The English remains A1-level.
10. The repo has clear deployment instructions.

## Deliverables after development

Update or create:
- `README.md`
- `docs/DEV_NOTES.md`
- `docs/TEST_RESULTS.md`
- any changed source files

If adding assets, document them in `docs/ASSET_GUIDE.md`.
