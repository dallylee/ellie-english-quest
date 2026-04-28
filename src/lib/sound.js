let audioContext = null;
let audioReady = false;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return null;
  if (!audioContext) audioContext = new Audio();
  return audioContext;
}

function unlockAudio(event) {
  if (event && event.isTrusted === false) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "running") {
    audioReady = true;
    return;
  }
  ctx.resume()
    .then(() => {
      audioReady = ctx.state === "running";
    })
    .catch(() => {
      audioReady = false;
    });
}

if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", unlockAudio, { capture: true, passive: true });
  window.addEventListener("keydown", unlockAudio, { capture: true });
}

export function playSound(type = "correct") {
  try {
    const ctx = getAudioContext();
    if (!ctx || !audioReady || ctx.state !== "running") return;
    const now = ctx.currentTime;

    const patterns = {
      correct: [523.25, 659.25, 783.99],
      wrong: [220, 196],
      star: [659.25, 783.99, 1046.5],
      level: [523.25, 659.25, 783.99, 1046.5]
    };

    const notes = patterns[type] || patterns.correct;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.0001, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.09, now + i * 0.08 + 0.02);
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
