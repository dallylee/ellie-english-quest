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
let speechPrimed = false;
let lastSpeechError = null;

function hasSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

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
  if (!hasSpeechSynthesis()) return null;
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

function splitSpeechText(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= 150) return clean ? [clean] : [];
  const sentences = clean.match(/[^.!?]+[.!?]*/g) || [clean];
  const chunks = [];
  let current = "";
  for (const sentence of sentences) {
    const next = `${current} ${sentence}`.trim();
    if (next.length > 150 && current) {
      chunks.push(current);
      current = sentence.trim();
    } else {
      current = next;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

if (hasSpeechSynthesis()) {
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    cachedVoice = null;
    chooseSoftVoice();
  });
}

export function primeSpeech(reason = "gesture") {
  if (!hasSpeechSynthesis()) return false;
  speechPrimed = true;
  lastSpeechError = null;
  try {
    chooseSoftVoice();
    window.speechSynthesis.resume?.();
    window.__lumaVoicePrimeReason = reason;
    return true;
  } catch (error) {
    lastSpeechError = error?.message || "speech-prime-failed";
    return false;
  }
}

function speakChunkWithDone(text, options = {}, onDone) {
  if (!hasSpeechSynthesis()) return false;
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
  let settled = false;
  let startRetry = null;
  const guardMs = Math.min(12000, Math.max(2800, text.length * 95));

  function finish(result = {}) {
    if (settled) return;
    settled = true;
    window.clearTimeout(guard);
    window.clearTimeout(startRetry);
    if (activeUtterance === utterance) activeUtterance = null;
    if (result.error) lastSpeechError = result.error;
    onDone?.({ spoken: started, ...result });
  }

  const guard = window.setTimeout(() => {
    finish({
      spoken: started,
      error: started ? "speech-end-timeout" : "speech-start-timeout"
    });
    try {
      synth.cancel();
    } catch {
      // Browser speech is optional.
    }
  }, guardMs);

  utterance.onstart = () => {
    started = true;
    lastSpeechError = null;
  };
  utterance.onend = () => finish({ spoken: started });
  utterance.onerror = (event) => finish({
    spoken: started,
    error: event?.error || "speech-error"
  });

  activeUtterance = utterance;
  try {
    synth.cancel();
    synth.resume?.();
    synth.speak(utterance);
    window.setTimeout(() => synth.resume?.(), 60);
  } catch (error) {
    finish({ spoken: false, error: error?.message || "speech-start-failed" });
    return true;
  }

  if (voice) {
    startRetry = window.setTimeout(() => {
      if (started || activeUtterance !== utterance || settled) return;
      settled = true;
      window.clearTimeout(guard);
      activeUtterance = null;
      try {
        synth.cancel();
      } catch {
        // Browser speech is optional.
      }
      speakChunkWithDone(text, { ...options, voice: null }, onDone);
    }, 850);
  }

  return true;
}

export function speak(text, options = {}) {
  const [firstChunk] = splitSpeechText(text);
  if (!firstChunk) return false;
  return speakChunkWithDone(firstChunk, options);
}

export async function speakAsync(text, options = {}) {
  const chunks = splitSpeechText(text);
  if (!chunks.length) return { spoken: false, error: "empty-speech" };
  let spoken = false;
  let lastError = null;

  for (const chunk of chunks) {
    const result = await new Promise((resolve) => {
      const started = speakChunkWithDone(chunk, options, resolve);
      if (!started) resolve({ spoken: false, error: "speech-synthesis-unavailable" });
    });
    spoken = spoken || Boolean(result.spoken);
    lastError = result.error || lastError;
    if (!result.spoken && result.error) break;
  }

  return { spoken, error: spoken ? null : lastError };
}

export function stopSpeaking() {
  activeUtterance = null;
  if (hasSpeechSynthesis()) window.speechSynthesis.cancel();
}

export function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return null;
  const recognition = new Recognition();
  recognition.lang = "en-GB";
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;
  return recognition;
}

export function getSpeechDiagnostics() {
  const speechRecognitionSupported = typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  return {
    speechSynthesisSupported: hasSpeechSynthesis(),
    speechRecognitionSupported,
    speechPrimed,
    activeUtterance: Boolean(activeUtterance),
    voicesLoaded: hasSpeechSynthesis() ? window.speechSynthesis.getVoices().length : 0,
    selectedVoice: cachedVoice?.name || null,
    lastSpeechError,
    audioContextUnlocked: Boolean(speechPrimed)
  };
}

export function normaliseSpeech(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}
