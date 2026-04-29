const preferredVoiceNames = [
  "sonia",
  "libby",
  "serena",
  "jenny",
  "aria",
  "michelle",
  "natasha",
  "susan",
  "samantha",
  "karen",
  "victoria",
  "zira",
  "hazel"
];

let cachedVoice = null;
let activeUtterance = null;

function scoreVoice(voice) {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  let score = 0;

  if (lang.startsWith("en-gb")) score += 30;
  else if (lang.startsWith("en")) score += 18;

  const preferredIndex = preferredVoiceNames.findIndex((preferred) => name.includes(preferred));
  if (preferredIndex >= 0) score += 60 - preferredIndex;
  if (name.includes("natural")) score += 8;
  if (name.includes("female")) score += 8;
  if (voice.localService) score += 42;

  return score;
}

function chooseSoftVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return cachedVoice;

  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  const preferredLocalVoices = englishVoices.filter((voice) => {
    const name = voice.name.toLowerCase();
    return voice.localService && preferredVoiceNames.some((preferred) => name.includes(preferred));
  });

  cachedVoice = (preferredLocalVoices.length ? preferredLocalVoices : englishVoices)
    .sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;

  return cachedVoice;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    cachedVoice = null;
    chooseSoftVoice();
  });
}

export function speak(text, options = {}) {
  if (!("speechSynthesis" in window)) return false;
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang || "en-GB";
  utterance.rate = options.rate || 0.76;
  utterance.pitch = options.pitch || 1.18;
  utterance.volume = options.volume || 0.72;
  const voice = options.voice === null ? null : options.voice || chooseSoftVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || utterance.lang;
  }

  let started = false;
  utterance.onstart = () => {
    started = true;
  };
  utterance.onend = utterance.onerror = () => {
    if (activeUtterance === utterance) activeUtterance = null;
  };

  activeUtterance = utterance;
  synth.cancel();
  synth.resume?.();
  synth.speak(utterance);
  window.setTimeout(() => synth.resume?.(), 60);
  if (voice) {
    window.setTimeout(() => {
      if (started || activeUtterance !== utterance) return;
      speak(text, { ...options, voice: null });
    }, 850);
  }
  return true;
}

export function stopSpeaking() {
  activeUtterance = null;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

export function getSpeechRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return null;
  const recognition = new Recognition();
  recognition.lang = "en-GB";
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;
  return recognition;
}

export function normaliseSpeech(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}
