import { getSpeechRecognition, normaliseSpeech, speakAsync, stopSpeaking } from "../lib/speech.js";
import { VOICE_PROXY_URL } from "./skyIslandsData.js";

const LIVE_MODEL = "models/gemini-2.0-flash-exp";
const AUDIO_RESPONSE_MODALITIES = ["AUDIO"];
const OUTPUT_SAMPLE_RATE = 24000;

const TEACHER_PROMPT = [
  "You are the patient English teacher and glowing orb guide for Eli.",
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
        responseModalities: AUDIO_RESPONSE_MODALITIES
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
                `Deterministic Luma line to voice: ${prompt}`,
                `Expected learner answer: ${task?.expectedAnswer || "I am ready."}`,
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

function listenWithBrowserSpeech({ timeoutMs = 9000 } = {}) {
  return new Promise((resolve) => {
    const recognition = getSpeechRecognition();
    if (!recognition) {
      resolve({ provider: "tap", transcript: "", available: false });
      return;
    }

    let settled = false;
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      try {
        recognition.stop();
      } catch {
        // Speech recognition is optional.
      }
      resolve({ provider: "browser-stt", transcript: "", timedOut: true });
    }, timeoutMs);

    recognition.onresult = (event) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      resolve({ provider: "browser-stt", transcript });
    };

    recognition.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve({ provider: "browser-stt", transcript: "", error: true });
    };

    try {
      recognition.start();
    } catch {
      window.clearTimeout(timer);
      resolve({ provider: "browser-stt", transcript: "", error: true });
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
  let nextStartTime = 0;
  const activeSources = new Set();

  function getContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!context) context = new AudioContext();
    return context;
  }

  return {
    async resume() {
      const ctx = getContext();
      if (!ctx) return false;
      if (ctx.state !== "running") await ctx.resume();
      nextStartTime = Math.max(nextStartTime, ctx.currentTime + 0.04);
      return true;
    },

    enqueuePcm(base64, mimeType) {
      const ctx = getContext();
      if (!ctx) return false;
      const bytes = base64ToBytes(base64);
      if (!bytes.length) return false;
      const sampleRate = parseSampleRate(mimeType);
      const samples = pcm16BytesToFloat32(bytes);
      if (!samples.length) return false;
      const buffer = ctx.createBuffer(1, samples.length, sampleRate);
      buffer.copyToChannel(samples, 0);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      const startAt = Math.max(nextStartTime, ctx.currentTime + 0.025);
      source.start(startAt);
      nextStartTime = startAt + buffer.duration;
      activeSources.add(source);
      source.onended = () => activeSources.delete(source);
      return true;
    },

    stop() {
      for (const source of activeSources) {
        try {
          source.stop();
        } catch {
          // Already stopped.
        }
      }
      activeSources.clear();
      if (context) nextStartTime = context.currentTime;
    }
  };
}

function maybePushAudioChunk(chunks, data, mimeType) {
  if (!data || typeof data !== "string") return;
  chunks.push({
    data,
    mimeType: mimeType || "audio/pcm;rate=24000"
  });
}

function extractAudioChunksFromValue(value, chunks = []) {
  if (!value || typeof value !== "object") return chunks;

  if (typeof value.audio === "string") {
    maybePushAudioChunk(chunks, value.audio, value.mimeType || value.mime_type || value.audioMimeType);
  }

  if (typeof value.audioContent === "string") {
    maybePushAudioChunk(chunks, value.audioContent, value.mimeType || value.audioMimeType);
  }

  const inlineData = value.inlineData || value.inline_data;
  if (inlineData?.data && /^audio\//i.test(inlineData.mimeType || inlineData.mime_type || "")) {
    maybePushAudioChunk(chunks, inlineData.data, inlineData.mimeType || inlineData.mime_type);
  }

  if (typeof value.data === "string" && /^audio\//i.test(value.mimeType || value.mime_type || "")) {
    maybePushAudioChunk(chunks, value.data, value.mimeType || value.mime_type);
  }

  for (const child of Object.values(value)) {
    if (Array.isArray(child)) {
      for (const item of child) extractAudioChunksFromValue(item, chunks);
    } else if (child && typeof child === "object") {
      extractAudioChunksFromValue(child, chunks);
    }
  }

  return chunks;
}

function parseWebSocketMessage(data) {
  if (typeof data === "string") return JSON.parse(data);
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
  let activeWorld = null;
  let activeLevel = null;
  let activeTask = null;
  let activeRecentEvent = null;
  let activeMood = "happy";
  let audioChunkCount = 0;
  const liveAudio = createLiveAudioPlayer();

  function cleanupSocket() {
    window.clearTimeout(setupTimer);
    window.clearTimeout(turnTimer);
    setupTimer = null;
    turnTimer = null;
    setupResolver = null;
    setupRejecter = null;
    turnResolver = null;
    turnRejecter = null;
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
    setupRejecter?.(error);
    turnRejecter?.(error);
    setupRejecter = null;
    turnRejecter = null;
  }

  function resolveTurnIfReady(message) {
    if (!message.serverContent) return;
    if (!message.serverContent.turnComplete && !message.serverContent.generationComplete) return;
    window.clearTimeout(turnTimer);
    turnTimer = null;
    turnResolver?.({
      provider: "gemini-live",
      spoken: audioChunkCount > 0,
      audioChunkCount
    });
    turnResolver = null;
    turnRejecter = null;
  }

  function handleLiveMessage(event) {
    try {
      const message = parseWebSocketMessage(event.data);
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
      }

      const audioSource = message.serverContent?.modelTurn || message.serverContent || message;
      const audioChunks = extractAudioChunksFromValue(audioSource);
      for (const chunk of audioChunks) {
        if (liveAudio.enqueuePcm(chunk.data, chunk.mimeType)) {
          audioChunkCount += 1;
        }
      }
      resolveTurnIfReady(message);
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
      }, 9000);
    });
  }

  function waitForTurn() {
    return new Promise((resolve, reject) => {
      turnResolver = resolve;
      turnRejecter = reject;
      turnTimer = window.setTimeout(() => {
        reject(new Error("Gemini Live audio timed out"));
      }, 18000);
    });
  }

  async function connectLiveSocket() {
    cleanupSocket();
    await liveAudio.resume();
    socket = new WebSocket(VOICE_PROXY_URL);
    socket.onmessage = handleLiveMessage;
    socket.onerror = () => rejectPending(new Error("Gemini Live socket error"));
    socket.onclose = (event) => {
      if (event.code !== 1000) rejectPending(new Error(`Gemini Live socket closed: ${event.code}`));
    };

    const setupPromise = waitForSetup();
    socket.onopen = () => {
      socket.send(JSON.stringify(buildLiveSetup({ mood: activeMood })));
    };

    await setupPromise;
    session = {
      provider: "gemini-live",
      model: LIVE_MODEL,
      socketState: "open"
    };
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

      if (!voiceEnabled) {
        session = {
          provider: "silent",
          uid: uid || null
        };
        return session;
      }

      try {
        await connectLiveSocket();
        return { provider: "gemini-live", session };
      } catch (error) {
        cleanupSocket();
        session = {
          provider: "browser-fallback",
          reason: error.message,
          uid: uid || null
        };
        return session;
      }
    },

    stopSession() {
      cleanupSocket();
      liveAudio.stop();
      session = null;
      stopSpeaking();
    },

    async playGuidePrompt(prompt, { mood = "happy" } = {}) {
      if (!voiceEnabled) return { provider: "silent", spoken: false };

      if (session?.provider === "gemini-live" && socket?.readyState === WebSocket.OPEN) {
        try {
          audioChunkCount = 0;
          const turnPromise = waitForTurn();
          socket.send(JSON.stringify(buildClientContent({
            prompt,
            mood,
            world: activeWorld,
            level: activeLevel,
            task: activeTask,
            recentEvent: activeRecentEvent
          })));
          return await turnPromise;
        } catch {
          cleanupSocket();
          liveAudio.stop();
          session = { provider: "browser-fallback", reason: "Gemini Live playback failed" };
        }
      }

      const result = await speakAsync(prompt, voiceOptionsForMood(mood));
      return { provider: "browser-tts", spoken: result.spoken };
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
