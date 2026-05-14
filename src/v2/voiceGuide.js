import {
  getSpeechDiagnostics,
  getSpeechRecognition,
  normaliseSpeech,
  primeSpeech,
  speakAsync,
  stopSpeaking
} from "../lib/speech.js";
import { VOICE_PROXY_HEALTH_URL, VOICE_PROXY_URL } from "./skyIslandsData.js";

const LIVE_MODEL = "models/gemini-3.1-flash-live-preview";
const AUDIO_RESPONSE_MODALITIES = ["AUDIO"];
const OUTPUT_SAMPLE_RATE = 24000;
const GEMINI_CONNECT_TIMEOUT_MS = 1400;
const GEMINI_SETUP_TIMEOUT_MS = 7000;
const GEMINI_TURN_TIMEOUT_MS = 9000;
export const QUIET_VOICE_MESSAGE = "Luma voice is quiet on this device. Read with me.";

const voiceDebugState = {
  currentTaskId: null,
  activeListeningLock: false,
  recognitionStartCount: 0,
  lastRecognitionStopReason: null,
  permissionRequestAttempted: false,
  getUserMediaInvoked: false,
  speechRecognitionInvoked: false,
  lastTtsProvider: null,
  lastTtsSpoken: false,
  lastTtsError: null,
  lastSttError: null,
  geminiConnected: false,
  geminiStatus: "not attempted",
  geminiWorkerReachable: null,
  geminiWorkerStatus: null,
  geminiWorkerWebSocketAvailable: null,
  geminiKeyConfigured: null,
  lastGeminiError: null,
  voiceMode: "none",
  finalVoiceMode: "none",
  promptPlaybackId: null,
  activeGeminiSessions: 0,
  lastGeminiAudioChunks: 0,
  receivedGeminiChunks: 0,
  scheduledGeminiChunks: 0,
  skippedDuplicateChunks: 0,
  staleChunksIgnored: 0,
  scheduledAudioSeconds: 0,
  audioQueueDepth: 0,
  audioContextSampleRate: null,
  geminiSampleRate: null,
  browserTtsFallbackUsed: false,
  browserTtsFallbackSuppressed: false,
  geminiPlaybackStartedForPrompt: false,
  quietFallbackUsed: false,
  lastPrimeReason: null
};

let activeListen = null;
let activeGeminiSessionCount = 0;

function updateVoiceDebug(patch) {
  Object.assign(voiceDebugState, patch);
}

function adjustActiveGeminiSessions(delta) {
  activeGeminiSessionCount = Math.max(0, activeGeminiSessionCount + delta);
  updateVoiceDebug({ activeGeminiSessions: activeGeminiSessionCount });
}

function isVoiceDebugEnabled() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("debugVoice") === "1";
}

function sanitizeDiagnosticError(value) {
  return String(value || "")
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, "[REDACTED_GOOGLE_KEY]")
    .replace(/([?&]key=)[^&\s"')]+/gi, "$1[REDACTED]")
    .replace(/sk-[A-Za-z0-9_-]{20,}/g, "[REDACTED_API_KEY]")
    .slice(0, 360);
}

async function refreshWorkerHealthIfDebug() {
  if (!isVoiceDebugEnabled() || typeof fetch === "undefined") return;
  updateVoiceDebug({ geminiWorkerStatus: "checking" });
  try {
    const response = await fetch(VOICE_PROXY_HEALTH_URL, { cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    updateVoiceDebug({
      geminiWorkerReachable: response.ok && Boolean(body.workerReachable),
      geminiWorkerStatus: response.status,
      geminiWorkerWebSocketAvailable: Boolean(body.webSocketRouteAvailable),
      geminiKeyConfigured: typeof body.geminiKeyConfigured === "boolean" ? body.geminiKeyConfigured : null,
      lastGeminiError: body.lastUpstreamError ? sanitizeDiagnosticError(body.lastUpstreamError) : voiceDebugState.lastGeminiError
    });
  } catch (error) {
    updateVoiceDebug({
      geminiWorkerReachable: false,
      geminiWorkerStatus: "health-error",
      lastGeminiError: sanitizeDiagnosticError(error?.message || "Worker health check failed")
    });
  }
}

function resetVoiceDebugForTask(taskId) {
  if (!taskId || voiceDebugState.currentTaskId === taskId) return;
  updateVoiceDebug({
    currentTaskId: taskId,
    activeListeningLock: false,
    recognitionStartCount: 0,
    lastRecognitionStopReason: null,
    permissionRequestAttempted: false,
    getUserMediaInvoked: false,
    speechRecognitionInvoked: false,
    lastSttError: null
  });
}

export function primeVoice(reason = "gesture") {
  const primed = primeSpeech(reason);
  updateVoiceDebug({ lastPrimeReason: reason });
  return primed;
}

export function getVoiceGuideDiagnostics() {
  return {
    ...voiceDebugState,
    ...getSpeechDiagnostics()
  };
}

export function getVoiceCompatibilityNote() {
  if (typeof navigator === "undefined") return "";
  const ua = navigator.userAgent || "";
  const isiOS = /iPad|iPhone|iPod/.test(ua);
  const safari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  const inApp = /FBAN|FBAV|Instagram|Line|MicroMessenger|WhatsApp/i.test(ua);
  return isiOS && (!safari || inApp) ? "For Luma's voice, open in Safari." : "";
}

const TEACHER_PROMPT = [
  "You are Luma, the patient English teacher and glowing orb guide for ELI.",
  "On screen the learner name is ELI; when speaking, pronounce it Ellie.",
  "Use warm A1 to early A2 English.",
  "Ask one short question at a time.",
  "Never shame mistakes; gently model the sentence and invite another try.",
  "Do not ask to store audio or transcripts."
].join(" ");

function voiceOptionsForMood(mood) {
  const presets = {
    happy: { rate: 0.78, pitch: 1.22, volume: 0.78 },
    sad: { rate: 0.7, pitch: 1.05, volume: 0.68 },
    scared: { rate: 0.72, pitch: 1.28, volume: 0.68 },
    surprised: { rate: 0.8, pitch: 1.32, volume: 0.78 },
    bored: { rate: 0.68, pitch: 1.02, volume: 0.68 },
    annoyed: { rate: 0.78, pitch: 1.12, volume: 0.72 },
    thinking: { rate: 0.72, pitch: 1.16, volume: 0.72 },
    listening: { rate: 0.68, pitch: 1.18, volume: 0.64 },
    proud: { rate: 0.82, pitch: 1.26, volume: 0.82 }
  };
  return presets[mood] || presets.happy;
}

function geminiMoodInstruction(mood) {
  const instructions = {
    happy: "Sound bright, encouraging, and delighted. Praise Eli warmly.",
    thinking: "Sound thoughtful and slow. Give Eli time to think before answering.",
    listening: "Sound quiet and attentive. Ask one short question, then wait.",
    proud: "Sound celebratory and proud. Keep the praise short and specific.",
    sad: "Sound gentle and reassuring. Model the answer without shame.",
    scared: "Sound a little suspenseful but safe. Keep Eli confident.",
    surprised: "Sound curious and amazed. Invite Eli to notice the clue.",
    bored: "Sound playfully impatient, not unkind. Invite action.",
    annoyed: "Sound teasing and playful, never cross."
  };
  return instructions[mood] || instructions.happy;
}

function buildLiveSetup({ mood }) {
  return {
    setup: {
      model: LIVE_MODEL,
      generationConfig: {
        responseModalities: AUDIO_RESPONSE_MODALITIES,
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Kore"
            }
          }
        }
      },
      systemInstruction: {
        parts: [
          {
            text: [
              TEACHER_PROMPT,
              `Current orb mood: ${mood}. ${geminiMoodInstruction(mood)}`,
              "Privacy rule: do not store, request storage, or repeat long transcripts."
            ].join("\n")
          }
        ]
      }
    }
  };
}

function buildClientContent({ prompt, mood, world, level, task, recentEvent }) {
  return {
    clientContent: {
      turns: [
        {
          role: "user",
          parts: [
            {
              text: [
                `Orb mood: ${mood}. ${geminiMoodInstruction(mood)}`,
                `World: ${world?.title || "Sky Islands Quest"}.`,
                `Level: ${level?.title || "Cloud Harbor"}.`,
                `Task: ${task?.title || "quest task"}.`,
                `Screen object: ${task?.screenObject || "quest object"}.`,
                `Recent event: ${recentEvent || "none"}.`,
                "On screen the learner name is ELI. Speak the name as Ellie.",
                `Deterministic Luma line to voice: ${prompt}`,
                `Expected learner answer: ${task?.expectedSpokenAnswer || task?.expectedAnswer || "I am ready."}`,
                `Target words: ${(task?.targetWords || []).join(", ")}.`,
                "Do not invent new quest steps, rewards, target words, or story order.",
                "You may paraphrase very gently only if needed for natural speech.",
                "Speak naturally, then stop so the browser can open the listening window."
              ].join("\n")
            }
          ]
        }
      ],
      turnComplete: true
    }
  };
}

function finishActiveListen(reason, result = {}) {
  if (!activeListen || activeListen.settled) return;
  const current = activeListen;
  current.settled = true;
  window.clearTimeout(current.timer);
  updateVoiceDebug({
    activeListeningLock: false,
    lastRecognitionStopReason: reason,
    lastSttError: result.error ? result.error : null
  });
  activeListen = null;
  if (reason === "result" || reason.startsWith("error")) {
    try {
      current.recognition.stop();
    } catch {
      // Recognition may already be closed.
    }
  }
  current.resolve({
    provider: "browser-stt",
    transcript: "",
    ...result,
    stopReason: reason
  });
}

function stopActiveRecognition(reason = "stopped") {
  if (!activeListen) return;
  try {
    activeListen.recognition.abort();
  } catch {
    try {
      activeListen.recognition.stop();
    } catch {
      // Speech recognition is optional.
    }
  }
  finishActiveListen(reason, { transcript: "", stopped: true });
}

function listenWithBrowserSpeech({ timeoutMs = 9000, taskId = null } = {}) {
  return new Promise((resolve) => {
    resetVoiceDebugForTask(taskId);
    if (activeListen && !activeListen.settled) {
      updateVoiceDebug({ lastSttError: "duplicate-listening-blocked" });
      resolve({ provider: "browser-stt", transcript: "", error: true, duplicate: true });
      return;
    }

    updateVoiceDebug({ speechRecognitionInvoked: true });
    const recognition = getSpeechRecognition();
    if (!recognition) {
      updateVoiceDebug({
        activeListeningLock: false,
        lastRecognitionStopReason: "unsupported",
        lastSttError: "speech-recognition-unavailable"
      });
      resolve({ provider: "tap", transcript: "", available: false });
      return;
    }

    updateVoiceDebug({
      activeListeningLock: true,
      recognitionStartCount: voiceDebugState.recognitionStartCount + 1,
      permissionRequestAttempted: true,
      lastRecognitionStopReason: null,
      lastSttError: null
    });

    const timer = window.setTimeout(() => {
      try {
        recognition.abort();
      } catch {
        // Speech recognition is optional.
      }
      finishActiveListen("timeout", { transcript: "", timedOut: true });
    }, timeoutMs);

    activeListen = {
      recognition,
      resolve,
      timer,
      settled: false
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      finishActiveListen("result", { transcript });
    };

    recognition.onerror = (event) => {
      finishActiveListen(`error:${event?.error || "unknown"}`, {
        transcript: "",
        error: event?.error || true
      });
    };

    recognition.onend = () => {
      finishActiveListen("ended", { transcript: "" });
    };

    try {
      recognition.start();
    } catch (error) {
      finishActiveListen("start-error", {
        transcript: "",
        error: error?.message || true
      });
    }
  });
}

export function evaluateSpokenAnswer(transcript, targetWords = []) {
  const heard = normaliseSpeech(transcript);
  const required = targetWords.map(normaliseSpeech).filter(Boolean);
  const matched = required.filter((word) => heard.includes(word));
  const needed = Math.max(1, Math.ceil(required.length * 0.55));
  return {
    correct: matched.length >= needed,
    matched,
    heard,
    needed
  };
}

function parseSampleRate(mimeType) {
  const match = String(mimeType || "").match(/(?:rate|sample_rate|sample-rate)=(\d+)/i);
  return match ? Number(match[1]) : OUTPUT_SAMPLE_RATE;
}

function stripDataUrlPrefix(base64) {
  return String(base64 || "").replace(/^data:[^;]+;base64,/, "");
}

function base64ToBytes(base64) {
  const clean = stripDataUrlPrefix(base64).replace(/\s/g, "");
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function pcm16BytesToFloat32(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const samples = new Float32Array(Math.floor(bytes.byteLength / 2));
  for (let i = 0; i < samples.length; i += 1) {
    const value = view.getInt16(i * 2, true);
    samples[i] = Math.max(-1, Math.min(1, value / 32768));
  }
  return samples;
}

function createLiveAudioPlayer() {
  let context = null;
  let outputGain = null;
  let nextStartTime = 0;
  let activePromptId = null;
  let scheduledAudioSeconds = 0;
  let scheduledChunks = 0;
  let lastGeminiSampleRate = null;
  const activeSources = new Map();
  const waiters = new Set();

  function getContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!context) {
      context = new AudioContext();
      outputGain = context.createGain();
      outputGain.gain.value = 0.92;
      outputGain.connect(context.destination);
    }
    return context;
  }

  function sourceCountForPrompt(promptId) {
    let count = 0;
    for (const sourcePromptId of activeSources.values()) {
      if (sourcePromptId === promptId) count += 1;
    }
    return count;
  }

  function updateQueueDebug() {
    const ctx = context;
    updateVoiceDebug({
      scheduledGeminiChunks: scheduledChunks,
      scheduledAudioSeconds: Number(scheduledAudioSeconds.toFixed(2)),
      audioQueueDepth: activePromptId ? sourceCountForPrompt(activePromptId) : 0,
      audioContextSampleRate: ctx?.sampleRate || null,
      geminiSampleRate: lastGeminiSampleRate
    });
  }

  function notifyWaiters() {
    for (const waiter of Array.from(waiters)) waiter();
  }

  return {
    async resume() {
      const ctx = getContext();
      if (!ctx) return false;
      if (ctx.state !== "running") await ctx.resume();
      nextStartTime = Math.max(nextStartTime, ctx.currentTime + 0.05);
      updateQueueDebug();
      return true;
    },

    startPrompt(promptId) {
      this.stop("new-gemini-prompt");
      activePromptId = promptId;
      scheduledAudioSeconds = 0;
      scheduledChunks = 0;
      lastGeminiSampleRate = null;
      const ctx = getContext();
      nextStartTime = ctx ? ctx.currentTime + 0.05 : 0;
      updateQueueDebug();
    },

    enqueuePcm(base64, mimeType, promptId) {
      const ctx = getContext();
      if (!ctx) return { scheduled: false, stale: false, reason: "audio-context-unavailable" };
      if (!promptId || promptId !== activePromptId) {
        return { scheduled: false, stale: true, reason: "stale-prompt" };
      }
      const bytes = base64ToBytes(base64);
      if (!bytes.length) return { scheduled: false, stale: false, reason: "empty-audio" };
      const sampleRate = parseSampleRate(mimeType);
      const samples = pcm16BytesToFloat32(bytes);
      if (!samples.length) return { scheduled: false, stale: false, reason: "empty-pcm" };
      const buffer = ctx.createBuffer(1, samples.length, sampleRate);
      buffer.copyToChannel(samples, 0);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(outputGain);
      const safetyOffset = scheduledChunks === 0 ? 0.06 : 0.015;
      const startAt = Math.max(nextStartTime, ctx.currentTime + safetyOffset);
      source.start(startAt);
      nextStartTime = startAt + buffer.duration;
      scheduledChunks += 1;
      scheduledAudioSeconds += buffer.duration;
      lastGeminiSampleRate = sampleRate;
      activeSources.set(source, promptId);
      source.onended = () => {
        activeSources.delete(source);
        updateQueueDebug();
        notifyWaiters();
      };
      updateQueueDebug();
      return {
        scheduled: true,
        sampleRate,
        audioContextSampleRate: ctx.sampleRate,
        duration: buffer.duration,
        startAt,
        queueDepth: sourceCountForPrompt(promptId)
      };
    },

    waitForPrompt(promptId, maxMs = 16000) {
      const ctx = getContext();
      if (!ctx || !promptId) return Promise.resolve();
      return new Promise((resolve) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          waiters.delete(check);
          window.clearTimeout(timeout);
          updateQueueDebug();
          resolve();
        };
        const check = () => {
          if (promptId !== activePromptId) {
            finish();
            return;
          }
          const remaining = Math.max(0, nextStartTime - ctx.currentTime);
          if (sourceCountForPrompt(promptId) === 0 && remaining <= 0.04) finish();
        };
        const timeout = window.setTimeout(finish, maxMs);
        waiters.add(check);
        check();
      });
    },

    stop() {
      for (const source of activeSources.keys()) {
        try {
          source.stop();
        } catch {
          // Already stopped.
        }
      }
      activeSources.clear();
      activePromptId = null;
      if (context) nextStartTime = context.currentTime;
      updateQueueDebug();
      notifyWaiters();
    }
  };
}

function audioChunkKey(data, mimeType) {
  const clean = stripDataUrlPrefix(data);
  return `${mimeType || ""}:${clean.length}:${clean.slice(0, 40)}:${clean.slice(-40)}`;
}

function maybePushAudioChunk(chunks, data, mimeType, state) {
  if (!data || typeof data !== "string") return false;
  const resolvedMimeType = mimeType || "audio/pcm;rate=24000";
  const key = audioChunkKey(data, resolvedMimeType);
  if (state.seenChunkKeys.has(key)) {
    state.duplicateCount += 1;
    return false;
  }
  state.seenChunkKeys.add(key);
  chunks.push({
    data,
    mimeType: resolvedMimeType
  });
  return true;
}

function createExtractionState() {
  return {
    seenObjects: new WeakSet(),
    seenChunkKeys: new Set(),
    duplicateCount: 0
  };
}

function extractAudioChunksFromValue(value, chunks = [], state = createExtractionState()) {
  if (!value || typeof value !== "object") return chunks;
  if (state.seenObjects.has(value)) return chunks;
  state.seenObjects.add(value);

  if (typeof value.audio === "string") {
    maybePushAudioChunk(chunks, value.audio, value.mimeType || value.mime_type || value.audioMimeType, state);
  }

  if (typeof value.audioContent === "string") {
    maybePushAudioChunk(chunks, value.audioContent, value.mimeType || value.audioMimeType, state);
  }

  const inlineData = value.inlineData || value.inline_data;
  if (inlineData?.data && /^audio\//i.test(inlineData.mimeType || inlineData.mime_type || "")) {
    maybePushAudioChunk(chunks, inlineData.data, inlineData.mimeType || inlineData.mime_type, state);
  }

  if (typeof value.data === "string" && /^audio\//i.test(value.mimeType || value.mime_type || "")) {
    maybePushAudioChunk(chunks, value.data, value.mimeType || value.mime_type, state);
  }

  for (const child of Object.values(value)) {
    if (Array.isArray(child)) {
      for (const item of child) extractAudioChunksFromValue(item, chunks, state);
    } else if (child && typeof child === "object") {
      extractAudioChunksFromValue(child, chunks, state);
    }
  }

  return chunks;
}

async function parseWebSocketMessage(data) {
  if (typeof data === "string") return JSON.parse(data);
  if (data instanceof ArrayBuffer) return JSON.parse(new TextDecoder().decode(data));
  if (ArrayBuffer.isView(data)) return JSON.parse(new TextDecoder().decode(data));
  if (typeof Blob !== "undefined" && data instanceof Blob) return JSON.parse(await data.text());
  throw new Error("Voice proxy returned non-JSON WebSocket data");
}

export function createVoiceGuide({ voiceEnabled = true } = {}) {
  let socket = null;
  let session = null;
  let setupResolver = null;
  let setupRejecter = null;
  let turnResolver = null;
  let turnRejecter = null;
  let setupTimer = null;
  let turnTimer = null;
  let geminiConnectPromise = null;
  let sessionToken = 0;
  let activeWorld = null;
  let activeLevel = null;
  let activeTask = null;
  let activeRecentEvent = null;
  let activeMood = "happy";
  let promptPlaybackSequence = 0;
  let activePromptPlaybackId = null;
  let turnPromptPlaybackId = null;
  let audioChunkCount = 0;
  let receivedChunkCount = 0;
  let skippedDuplicateChunkCount = 0;
  let staleChunkCount = 0;
  let socketSessionCounted = false;
  let browserFallbackTimer = null;
  let browserFallbackPromptId = null;
  let browserFallbackResolve = null;
  let browserTtsFallbackSuppressed = false;
  let geminiPlaybackStartedForPrompt = false;
  const liveAudio = createLiveAudioPlayer();

  function resetPromptFallbackLatch() {
    browserTtsFallbackSuppressed = false;
    geminiPlaybackStartedForPrompt = false;
    updateVoiceDebug({
      browserTtsFallbackSuppressed: false,
      geminiPlaybackStartedForPrompt: false
    });
  }

  function cancelBrowserTtsFallback(promptPlaybackId = null, reason = "cancelled", { markSuppressed = true } = {}) {
    if (promptPlaybackId && browserFallbackPromptId && browserFallbackPromptId !== promptPlaybackId) return false;
    if (browserFallbackTimer) {
      window.clearTimeout(browserFallbackTimer);
      browserFallbackTimer = null;
    }
    if (markSuppressed) {
      browserTtsFallbackSuppressed = true;
      updateVoiceDebug({
        browserTtsFallbackSuppressed: true,
        browserTtsFallbackUsed: false,
        quietFallbackUsed: false,
        finalVoiceMode: "gemini-audio",
        voiceMode: "gemini-audio",
        lastTtsError: null
      });
    }
    stopSpeaking();
    browserFallbackResolve?.({
      spoken: false,
      suppressed: markSuppressed,
      error: markSuppressed ? null : reason
    });
    browserFallbackResolve = null;
    browserFallbackPromptId = null;
    return true;
  }

  function suppressBrowserTtsForPrompt(promptPlaybackId) {
    geminiPlaybackStartedForPrompt = true;
    updateVoiceDebug({
      geminiPlaybackStartedForPrompt: true,
      quietFallbackUsed: false
    });
    return cancelBrowserTtsFallback(promptPlaybackId, "gemini-audio-started", { markSuppressed: true });
  }

  function playBrowserTtsFallback(prompt, options, promptPlaybackId) {
    return new Promise((resolve) => {
      browserFallbackPromptId = promptPlaybackId;
      browserFallbackResolve = resolve;
      browserFallbackTimer = window.setTimeout(async () => {
        browserFallbackTimer = null;
        if (geminiPlaybackStartedForPrompt || browserTtsFallbackSuppressed) {
          resolve({ spoken: false, suppressed: true });
          browserFallbackResolve = null;
          browserFallbackPromptId = null;
          return;
        }
        const result = await speakAsync(prompt, options);
        const suppressed = browserTtsFallbackSuppressed || geminiPlaybackStartedForPrompt || result.cancelled;
        resolve({ ...result, suppressed });
        if (browserFallbackPromptId === promptPlaybackId) {
          browserFallbackResolve = null;
          browserFallbackPromptId = null;
        }
      }, 0);
    });
  }

  function cleanupSocket() {
    window.clearTimeout(setupTimer);
    window.clearTimeout(turnTimer);
    setupTimer = null;
    turnTimer = null;
    setupResolver = null;
    setupRejecter = null;
    turnResolver = null;
    turnRejecter = null;
    if (socketSessionCounted) {
      adjustActiveGeminiSessions(-1);
      socketSessionCounted = false;
    }
    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) socket.close();
    }
    socket = null;
  }

  function rejectPending(error) {
    const safeError = error instanceof Error ? error : new Error(sanitizeDiagnosticError(error?.message || error || "Gemini Live error"));
    setupRejecter?.(safeError);
    turnRejecter?.(safeError);
    setupRejecter = null;
    turnRejecter = null;
  }

  async function resolveTurnIfReady(message, promptPlaybackId) {
    if (!message.serverContent) return;
    if (!message.serverContent.turnComplete && !message.serverContent.generationComplete) return;
    window.clearTimeout(turnTimer);
    turnTimer = null;
    if (promptPlaybackId === activePromptPlaybackId) {
      await liveAudio.waitForPrompt(promptPlaybackId);
    }
    turnResolver?.({
      provider: "gemini-live",
      spoken: audioChunkCount > 0,
      audioChunkCount,
      receivedChunkCount,
      skippedDuplicateChunkCount,
      staleChunkCount
    });
    turnResolver = null;
    turnRejecter = null;
  }

  async function handleLiveMessage(event) {
    try {
      const message = await parseWebSocketMessage(event.data);
      if (message.error) {
        throw new Error(`Gemini proxy error: ${sanitizeDiagnosticError(message.error)}`);
      }
      if (message.setupComplete) {
        window.clearTimeout(setupTimer);
        setupTimer = null;
        setupResolver?.(message);
        setupResolver = null;
        setupRejecter = null;
        return;
      }

      if (message.serverContent?.interrupted) {
        liveAudio.stop();
        turnPromptPlaybackId = null;
      }

      const promptPlaybackId = activePromptPlaybackId;
      const audioSource = message.serverContent?.modelTurn || message.serverContent || message;
      const extractionState = createExtractionState();
      const audioChunks = extractAudioChunksFromValue(audioSource, [], extractionState);
      const duplicateCount = extractionState.duplicateCount;
      receivedChunkCount += audioChunks.length + duplicateCount;
      skippedDuplicateChunkCount += duplicateCount;
      if (!promptPlaybackId || promptPlaybackId !== turnPromptPlaybackId) {
        staleChunkCount += audioChunks.length;
        updateVoiceDebug({
          receivedGeminiChunks: receivedChunkCount,
          skippedDuplicateChunks: skippedDuplicateChunkCount,
          staleChunksIgnored: staleChunkCount
        });
        await resolveTurnIfReady(message, promptPlaybackId);
        return;
      }
      for (const chunk of audioChunks) {
        const result = liveAudio.enqueuePcm(chunk.data, chunk.mimeType, promptPlaybackId);
        if (result.scheduled) {
          if (audioChunkCount === 0) suppressBrowserTtsForPrompt(promptPlaybackId);
          audioChunkCount += 1;
        } else if (result.stale) {
          staleChunkCount += 1;
        }
      }
      updateVoiceDebug({
        lastGeminiAudioChunks: audioChunkCount,
        receivedGeminiChunks: receivedChunkCount,
        scheduledGeminiChunks: audioChunkCount,
        skippedDuplicateChunks: skippedDuplicateChunkCount,
        staleChunksIgnored: staleChunkCount
      });
      await resolveTurnIfReady(message, promptPlaybackId);
    } catch (error) {
      rejectPending(error);
    }
  }

  function waitForSetup() {
    return new Promise((resolve, reject) => {
      setupResolver = resolve;
      setupRejecter = reject;
      setupTimer = window.setTimeout(() => {
        reject(new Error("Gemini Live setup timed out"));
      }, GEMINI_SETUP_TIMEOUT_MS);
    });
  }

  function waitForTurn(promptPlaybackId) {
    return new Promise((resolve, reject) => {
      turnResolver = resolve;
      turnRejecter = reject;
      turnTimer = window.setTimeout(() => {
        if (audioChunkCount > 0) {
          liveAudio.waitForPrompt(promptPlaybackId).then(() => {
            resolve({
              provider: "gemini-live",
              spoken: true,
              audioChunkCount,
              receivedChunkCount,
              skippedDuplicateChunkCount,
              staleChunkCount,
              timedOutAfterAudio: true
            });
            turnResolver = null;
            turnRejecter = null;
          });
          return;
        }
        reject(new Error("Gemini Live audio timed out"));
      }, GEMINI_TURN_TIMEOUT_MS);
    });
  }

  async function waitForGeminiReady(timeoutMs = GEMINI_CONNECT_TIMEOUT_MS) {
    if (session?.provider === "gemini-live" && socket?.readyState === WebSocket.OPEN) return session;
    if (!geminiConnectPromise) return null;
    let timedOut = false;
    const timeoutPromise = new Promise((resolve) => {
      window.setTimeout(() => {
        timedOut = true;
        resolve(null);
      }, timeoutMs);
    });
    const result = await Promise.race([
      geminiConnectPromise.then((connectedSession) => connectedSession).catch(() => null),
      timeoutPromise
    ]);
    if (!result && timedOut && voiceDebugState.geminiStatus === "connecting") {
      updateVoiceDebug({ geminiStatus: "timeout", lastGeminiError: "Gemini Live connection timed out; browser TTS fallback used." });
    }
    return result;
  }

  async function connectLiveSocket(token) {
    cleanupSocket();
    await liveAudio.resume();
    if (token !== sessionToken) throw new Error("Gemini Live session was superseded");
    updateVoiceDebug({
      geminiConnected: false,
      geminiStatus: "connecting",
      lastGeminiError: null,
      lastGeminiAudioChunks: 0
    });
    socket = new WebSocket(VOICE_PROXY_URL);
    socket.binaryType = "arraybuffer";
    socket.onmessage = handleLiveMessage;
    socket.onerror = () => {
      updateVoiceDebug({ geminiStatus: "failed", lastGeminiError: "Gemini Live socket error" });
      rejectPending(new Error("Gemini Live socket error"));
    };
    socket.onclose = (event) => {
      if (socketSessionCounted) {
        adjustActiveGeminiSessions(-1);
        socketSessionCounted = false;
      }
      if (event.code !== 1000) {
        const message = sanitizeDiagnosticError(`Gemini Live socket closed: ${event.code} ${event.reason || ""}`);
        updateVoiceDebug({ geminiStatus: "failed", geminiConnected: false, lastGeminiError: message });
        rejectPending(new Error(message));
      }
    };

    const setupPromise = waitForSetup();
    socket.onopen = () => {
      if (!socketSessionCounted) {
        adjustActiveGeminiSessions(1);
        socketSessionCounted = true;
      }
      updateVoiceDebug({ geminiStatus: "connecting", geminiWorkerStatus: "websocket-open" });
      socket.send(JSON.stringify(buildLiveSetup({ mood: activeMood })));
    };

    await setupPromise;
    if (token !== sessionToken) throw new Error("Gemini Live session was superseded");
    session = {
      provider: "gemini-live",
      model: LIVE_MODEL,
      socketState: "open"
    };
    updateVoiceDebug({ geminiConnected: true, geminiStatus: "connected", lastGeminiError: null });
    return session;
  }

  return {
    get session() {
      return session;
    },

    async startSession({ uid, world, level, task, island, clue, mood = task?.mood || clue?.orbMood || "happy", recentEvent = null } = {}) {
      activeWorld = world || null;
      activeLevel = level || island || null;
      activeTask = task || clue || null;
      activeRecentEvent = recentEvent;
      activeMood = mood;
      const token = sessionToken + 1;
      sessionToken = token;
      resetVoiceDebugForTask(activeTask?.id || null);
      refreshWorkerHealthIfDebug();

      if (!voiceEnabled) {
        session = {
          provider: "silent",
          uid: uid || null
        };
        updateVoiceDebug({ voiceMode: "none" });
        return session;
      }

      primeVoice("voice-session");
      updateVoiceDebug({
        geminiStatus: "connecting",
        voiceMode: "none",
        lastGeminiAudioChunks: 0
      });
      session = {
        provider: "browser-fallback",
        reason: "Browser voice is ready while Gemini warms up.",
        uid: uid || null
      };

      geminiConnectPromise = connectLiveSocket(token)
        .then(() => {
          if (token !== sessionToken) return null;
          updateVoiceDebug({ geminiConnected: true, geminiStatus: "connected", lastGeminiError: null });
          return session;
        })
        .catch((error) => {
          if (token !== sessionToken) return null;
          cleanupSocket();
          const safeError = sanitizeDiagnosticError(error?.message || "Gemini Live unavailable");
          updateVoiceDebug({
            geminiConnected: false,
            geminiStatus: "failed",
            lastGeminiError: safeError
          });
          session = {
            provider: "browser-fallback",
            reason: safeError,
            uid: uid || null
          };
          return null;
        });

      return session;
    },

    stopSession(reason = "session-stop") {
      sessionToken += 1;
      geminiConnectPromise = null;
      stopActiveRecognition(reason);
      cancelBrowserTtsFallback(null, reason, { markSuppressed: false });
      cleanupSocket();
      liveAudio.stop();
      activePromptPlaybackId = null;
      turnPromptPlaybackId = null;
      session = null;
      stopSpeaking();
      updateVoiceDebug({
        promptPlaybackId: null,
        voiceMode: voiceDebugState.voiceMode === "gemini-audio" ? voiceDebugState.voiceMode : "none",
        finalVoiceMode: voiceDebugState.finalVoiceMode === "gemini-audio" ? voiceDebugState.finalVoiceMode : "none"
      });
    },

    async playGuidePrompt(prompt, { mood = "happy" } = {}) {
      if (!voiceEnabled) {
        updateVoiceDebug({ voiceMode: "none", finalVoiceMode: "none" });
        return { provider: "silent", spoken: false };
      }

      resetPromptFallbackLatch();
      await waitForGeminiReady();

      if (session?.provider === "gemini-live" && socket?.readyState === WebSocket.OPEN) {
        try {
          const promptPlaybackId = `${Date.now()}-${promptPlaybackSequence + 1}`;
          promptPlaybackSequence += 1;
          activePromptPlaybackId = promptPlaybackId;
          turnPromptPlaybackId = promptPlaybackId;
          audioChunkCount = 0;
          receivedChunkCount = 0;
          skippedDuplicateChunkCount = 0;
          staleChunkCount = 0;
          liveAudio.startPrompt(promptPlaybackId);
          updateVoiceDebug({
            promptPlaybackId,
            lastGeminiAudioChunks: 0,
            receivedGeminiChunks: 0,
            scheduledGeminiChunks: 0,
            skippedDuplicateChunks: 0,
            staleChunksIgnored: 0,
            scheduledAudioSeconds: 0,
            audioQueueDepth: 0,
            voiceMode: "none",
            finalVoiceMode: "pending",
            browserTtsFallbackUsed: false,
            browserTtsFallbackSuppressed: false,
            quietFallbackUsed: false,
            geminiPlaybackStartedForPrompt: false
          });
          const turnPromise = waitForTurn(promptPlaybackId);
          socket.send(JSON.stringify(buildClientContent({
            prompt,
            mood,
            world: activeWorld,
            level: activeLevel,
            task: activeTask,
            recentEvent: activeRecentEvent
          })));
          const liveResult = await turnPromise;
          if (liveResult.spoken) {
            suppressBrowserTtsForPrompt(promptPlaybackId);
            updateVoiceDebug({
              lastTtsProvider: "gemini-live",
              lastTtsSpoken: true,
              lastTtsError: null,
              lastGeminiError: null,
              geminiStatus: "connected",
              voiceMode: "gemini-audio",
              finalVoiceMode: "gemini-audio",
              lastGeminiAudioChunks: liveResult.audioChunkCount || audioChunkCount,
              receivedGeminiChunks: liveResult.receivedChunkCount || receivedChunkCount,
              scheduledGeminiChunks: liveResult.audioChunkCount || audioChunkCount,
              skippedDuplicateChunks: liveResult.skippedDuplicateChunkCount ?? skippedDuplicateChunkCount,
              staleChunksIgnored: liveResult.staleChunkCount ?? staleChunkCount,
              browserTtsFallbackUsed: false,
              browserTtsFallbackSuppressed: true,
              geminiPlaybackStartedForPrompt: true,
              quietFallbackUsed: false
            });
            turnPromptPlaybackId = null;
            return liveResult;
          }
          throw new Error("Gemini Live returned no audio");
        } catch (error) {
          const failedPromptPlaybackId = activePromptPlaybackId;
          cleanupSocket();
          const safeError = sanitizeDiagnosticError(error?.message || "Gemini Live playback failed");
          if (audioChunkCount > 0) {
            suppressBrowserTtsForPrompt(failedPromptPlaybackId);
            await liveAudio.waitForPrompt(failedPromptPlaybackId).catch(() => {});
            updateVoiceDebug({
              geminiStatus: "connected",
              voiceMode: "gemini-audio",
              finalVoiceMode: "gemini-audio",
              lastTtsProvider: "gemini-live",
              lastTtsSpoken: true,
              lastTtsError: safeError,
              lastGeminiError: safeError,
              lastGeminiAudioChunks: audioChunkCount,
              receivedGeminiChunks: receivedChunkCount,
              scheduledGeminiChunks: audioChunkCount,
              skippedDuplicateChunks: skippedDuplicateChunkCount,
              staleChunksIgnored: staleChunkCount,
              browserTtsFallbackUsed: false,
              browserTtsFallbackSuppressed: true,
              geminiPlaybackStartedForPrompt: true,
              quietFallbackUsed: false
            });
            turnPromptPlaybackId = null;
            return {
              provider: "gemini-live",
              spoken: true,
              audioChunkCount,
              partial: true,
              error: safeError
            };
          }
          liveAudio.stop();
          activePromptPlaybackId = null;
          turnPromptPlaybackId = null;
          session = { provider: "browser-fallback", reason: safeError };
          updateVoiceDebug({
            geminiStatus: "failed",
            geminiConnected: false,
            lastTtsProvider: "gemini-live",
            lastTtsSpoken: false,
            lastTtsError: safeError,
            lastGeminiError: safeError,
            voiceMode: "failed",
            finalVoiceMode: "failed",
            browserTtsFallbackSuppressed: false,
            geminiPlaybackStartedForPrompt: false
          });
        }
      }

      const fallbackPromptPlaybackId = activePromptPlaybackId || `browser-${Date.now()}-${promptPlaybackSequence + 1}`;
      if (!activePromptPlaybackId) {
        activePromptPlaybackId = fallbackPromptPlaybackId;
        promptPlaybackSequence += 1;
      }
      const result = await playBrowserTtsFallback(prompt, voiceOptionsForMood(mood), fallbackPromptPlaybackId);
      if (result.suppressed) {
        updateVoiceDebug({
          lastTtsProvider: "gemini-live",
          lastTtsSpoken: true,
          lastTtsError: null,
          voiceMode: "gemini-audio",
          finalVoiceMode: "gemini-audio",
          browserTtsFallbackUsed: false,
          browserTtsFallbackSuppressed: true,
          quietFallbackUsed: false
        });
        return { provider: "gemini-live", spoken: true, fallbackSuppressed: true };
      }
      updateVoiceDebug({
        lastTtsProvider: "browser-tts",
        lastTtsSpoken: Boolean(result.spoken),
        lastTtsError: result.error || null,
        voiceMode: result.spoken ? "browser-tts" : "quiet-caption",
        finalVoiceMode: result.spoken ? "browser-tts" : "quiet-caption",
        browserTtsFallbackUsed: true,
        browserTtsFallbackSuppressed: false,
        quietFallbackUsed: !result.spoken
      });
      return { provider: "browser-tts", spoken: result.spoken, error: result.error || null };
    },

    async listenForAnswer(options) {
      return listenWithBrowserSpeech(options);
    },

    evaluateAnswer({ transcript, targetWords }) {
      return evaluateSpokenAnswer(transcript, targetWords);
    },

    fallbackToTap({ expected }) {
      return {
        provider: "tap",
        transcript: "",
        acceptedAnswer: expected,
        correct: true
      };
    }
  };
}
