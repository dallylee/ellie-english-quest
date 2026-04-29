export const soundAssets = {
  welcome: "/assets/sounds/startup-screen-sound.mp3",
  ui: "/assets/sounds/ui-click.mp3",
  level: "/assets/sounds/new-level-opened.mp3",
  award: "/assets/sounds/award-reveal.mp3",
  announcement: "/assets/sounds/announcement.mp3",
  star: "/assets/sounds/star-collected.mp3",
  wrong: "/assets/sounds/wrong-answer.mp3"
};

const effectAssets = {
  welcome: "welcome",
  startup: "welcome",
  ui: "ui",
  click: "ui",
  correct: "star",
  wrong: "wrong",
  star: "star",
  level: "level",
  unlock: "level",
  award: "award",
  announcement: "announcement"
};

const DEFAULT_VOLUME = 0.4;

let audioUnlocked = false;
let generatedAudioContext = null;
let generatedAudioReady = false;

function getGeneratedAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!generatedAudioContext) generatedAudioContext = new AudioContext();
  return generatedAudioContext;
}

function unlockGeneratedAudio() {
  const ctx = getGeneratedAudioContext();
  if (!ctx) return;
  if (ctx.state === "running") {
    generatedAudioReady = true;
    return;
  }
  ctx.resume()
    .then(() => {
      generatedAudioReady = ctx.state === "running";
    })
    .catch(() => {
      generatedAudioReady = false;
    });
}

function unlockAudio(event) {
  if (event && event.isTrusted === false) return;
  audioUnlocked = true;
  unlockGeneratedAudio();
}

if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", unlockAudio, { capture: true, passive: true });
  window.addEventListener("touchstart", unlockAudio, { capture: true, passive: true });
  window.addEventListener("keydown", unlockAudio, { capture: true });
}

function playMp3(assetKey) {
  if (!audioUnlocked || typeof Audio === "undefined") return false;
  const src = soundAssets[assetKey];
  if (!src) return false;

  try {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = DEFAULT_VOLUME;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
    return true;
  } catch {
    return false;
  }
}

function playGeneratedSound(type) {
  try {
    const ctx = getGeneratedAudioContext();
    if (!ctx || !generatedAudioReady || ctx.state !== "running") return;
    const now = ctx.currentTime;

    const patterns = {
      correct: [523.25, 659.25, 783.99],
      wrong: [220, 196],
      star: [659.25, 783.99, 1046.5],
      level: [523.25, 659.25, 783.99, 1046.5],
      ui: [659.25],
      welcome: [523.25, 783.99, 1046.5],
      award: [783.99, 1046.5, 1318.51],
      announcement: [392, 523.25, 659.25]
    };

    const notes = patterns[type] || patterns.correct;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.0001, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.04, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.18);
    });
  } catch {
    // Sound is optional. Fail silently.
  }
}

export function playSound(type = "ui") {
  const assetKey = effectAssets[type] || type;
  const playedMp3 = playMp3(assetKey);
  if (!playedMp3) playGeneratedSound(type);
}
