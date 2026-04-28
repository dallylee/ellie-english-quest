# Voice Feature Guide

## Browser APIs

The app uses browser-native voice features:

- Text-to-speech: `window.speechSynthesis`
- Speech recognition: `SpeechRecognition` or `webkitSpeechRecognition`

## Important limitations

Speech recognition support varies by browser and device. The app must always provide a tap-based fallback.

## UX principles for Eli

- Voice is helpful, not mandatory.
- Never block progression if recognition fails.
- Always reward trying.
- Use slow speech rate.
- Keep sentences short.

## Current implementation

The Listen & Say mode:
1. Shows a sentence.
2. Reads it aloud.
3. Lets Eli try to say it.
4. If recognition works, checks for target words.
5. If recognition does not work, Eli taps “I said it”.
