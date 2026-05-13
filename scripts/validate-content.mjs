import fs from "node:fs";
import path from "node:path";

import { learnerProfile, gameConfig, levels, rewardMilestones } from "../src/data/curriculum.js";
import { soundAssets } from "../src/lib/sound.js";
import { createDefaultProgress } from "../src/lib/storage.js";
import {
  END_GAME_VIDEO_SRC,
  NEW_ADVENTURE_CTA,
  VOICE_PROXY_URL,
  orbMoods,
  sagaGames,
  skyIslands
} from "../src/v2/skyIslandsData.js";
import { sagaWorlds, getLevelById } from "../src/v2/sagaWorldData.js";
import { v2AssetManifest } from "../src/v2/assets/assetManifest.js";

const errors = [];
const ids = new Set();
const rootDir = process.cwd();

for (const level of levels) {
  if (!level.id) errors.push("Level missing id");
  if (ids.has(level.id)) errors.push(`Duplicate level id: ${level.id}`);
  ids.add(level.id);

  if (!level.title) errors.push(`${level.id}: missing title`);
  if (!level.topic) errors.push(`${level.id}: missing topic`);
  if (!level.microTarget) errors.push(`${level.id}: missing microTarget`);

  if (!Array.isArray(level.quiz) || level.quiz.length < 6) errors.push(`${level.id}: needs at least 6 quiz questions`);
  for (const [i, q] of (level.quiz || []).entries()) {
    if (!q.prompt || !q.correct || !Array.isArray(q.options) || q.options.length < 3) {
      errors.push(`${level.id}: quiz question ${i + 1} malformed`);
    }
    if (q.options && !q.options.includes(q.correct)) {
      errors.push(`${level.id}: quiz question ${i + 1} correct answer not in options`);
    }
  }

  if (!Array.isArray(level.memoryPairs) || level.memoryPairs.length < 6) errors.push(`${level.id}: needs at least 6 memory pairs`);
  if (!Array.isArray(level.speakPrompts) || level.speakPrompts.length < 3) errors.push(`${level.id}: needs at least 3 speak prompts`);
  if (!Array.isArray(level.buildSentences) || level.buildSentences.length < 3) errors.push(`${level.id}: needs at least 3 build sentences`);
  if (!Array.isArray(level.pictureItems) || level.pictureItems.length < 6) errors.push(`${level.id}: needs at least 6 picture match items`);
  for (const [i, item] of (level.pictureItems || []).entries()) {
    if (!item.emoji || !item.word || !item.support || !Array.isArray(item.options) || item.options.length < 3) {
      errors.push(`${level.id}: picture item ${i + 1} malformed`);
    }
    if (item.options && !item.options.includes(item.word)) {
      errors.push(`${level.id}: picture item ${i + 1} word not in options`);
    }
  }
}

const progress = createDefaultProgress();
const expectedMilestones = [
  [10, "Magic Egg"],
  [20, "Magic Feather"],
  [30, "Magic Potion"],
  [40, "Magic Wand"],
  [50, "Crown"]
];

if (!gameConfig.progression || gameConfig.progression.minimumModes < 2 || gameConfig.progression.minimumStars < 1) {
  errors.push("gameConfig: progression needs a sensible minimum mode and star rule");
}

if (!Array.isArray(rewardMilestones) || rewardMilestones.length !== expectedMilestones.length) {
  errors.push("rewardMilestones: expected 5 milestone rewards");
} else {
  for (const [index, [stars, title]] of expectedMilestones.entries()) {
    const reward = rewardMilestones[index];
    if (!reward || reward.stars !== stars || reward.title !== title || !reward.icon || !reward.description) {
      errors.push(`rewardMilestones: milestone ${stars} stars must be ${title}`);
    }
  }
}

if (!progress.settings || typeof progress.settings.soundEnabled !== "boolean" || typeof progress.settings.voiceEnabled !== "boolean") {
  errors.push("default progress missing sound settings");
}

if (progress.settings?.soundEnabled !== true || progress.settings?.voiceEnabled !== false) {
  errors.push("default progress should start with sound on and voice off");
}

if (!Array.isArray(progress.pendingRewardReveals)) {
  errors.push("default progress missing pendingRewardReveals array");
}

if (!progress.saga || progress.saga.version !== 2) {
  errors.push("default progress must include v2 saga progress");
}

if (progress.saga?.endVideoSeen !== false || progress.saga?.newAdventureUnlocked !== false) {
  errors.push("v2 saga should start locked until all v1 magic rewards are unlocked");
}

if (!Array.isArray(sagaGames) || sagaGames.length !== 3) {
  errors.push("v2 saga home must expose exactly 3 games");
} else {
  const [sky, crystal, portal] = sagaGames;
  if (sky.id !== "sky-islands" || sky.initialState !== "playable") {
    errors.push("Sky Islands Quest must be the first playable v2 game");
  }
  if (crystal.id !== "crystal-mystery" || crystal.initialState !== "locked") {
    errors.push("Crystal Mystery must be second and initially locked");
  }
  if (portal.id !== "time-portal-case" || portal.initialState !== "locked") {
    errors.push("Time Portal Case must be third and initially locked");
  }
}

if (!Array.isArray(sagaWorlds) || sagaWorlds.length !== 3) {
  errors.push("v2 saga source data must expose exactly 3 worlds");
} else {
  const expectedWorlds = ["sky-islands", "crystal-mystery", "time-portal-case"];
  expectedWorlds.forEach((worldId, index) => {
    const world = sagaWorlds[index];
    if (!world || world.id !== worldId) {
      errors.push(`v2 saga world ${index + 1} must be ${worldId}`);
      return;
    }
    if (!Array.isArray(world.levels) || world.levels.length !== 6) {
      errors.push(`${worldId}: source data must contain 6 levels`);
      return;
    }
    for (const level of world.levels) {
      if (!level.id || !level.title || !level.reward || !Array.isArray(level.tasks) || level.tasks.length !== 8) {
        errors.push(`${worldId}: ${level?.title || "level"} must include id, title, reward, and 8 tasks`);
        continue;
      }
      for (const task of level.tasks) {
        if (!task.id || !task.title) {
          errors.push(`${worldId}: ${level.title} contains a task without id or title`);
        }
      }
    }
  });
}

const playableCloudHarbor = getLevelById("sky-islands", "cloud-harbor");
if (!playableCloudHarbor || playableCloudHarbor.reward !== "Cloud Compass" || playableCloudHarbor.tasks?.length !== 8) {
  errors.push("Cloud Harbor must be the complete 8-task playable template with Cloud Compass reward");
} else {
  for (const [taskIndex, task] of playableCloudHarbor.tasks.entries()) {
    for (const requiredField of ["screenObject", "lumaLine", "expectedAnswer", "targetWords", "successAnimation", "gentleHint"]) {
      if (!task[requiredField] || (requiredField === "targetWords" && !Array.isArray(task.targetWords))) {
        errors.push(`Cloud Harbor task ${taskIndex + 1} missing playable field: ${requiredField}`);
      }
    }
  }
}

const playableBreakfastBreeze = getLevelById("sky-islands", "breakfast-breeze");
if (!playableBreakfastBreeze || playableBreakfastBreeze.reward !== "Sunberry Basket" || playableBreakfastBreeze.tasks?.length !== 8) {
  errors.push("Breakfast Breeze must be the second complete 8-task playable level with Sunberry Basket reward");
} else if (playableBreakfastBreeze.implementationStatus !== "playable") {
  errors.push("Breakfast Breeze must be marked playable");
} else {
  for (const [taskIndex, task] of playableBreakfastBreeze.tasks.entries()) {
    for (const requiredField of ["screenObject", "lumaLine", "expectedAnswer", "targetWords", "successAnimation", "gentleHint"]) {
      if (!task[requiredField] || (requiredField === "targetWords" && !Array.isArray(task.targetWords))) {
        errors.push(`Breakfast Breeze task ${taskIndex + 1} missing playable field: ${requiredField}`);
      }
    }
  }
}

if (!Array.isArray(skyIslands) || skyIslands.length !== 6) {
  errors.push("Sky Islands must contain six adventure chapters");
} else {
  const expectedIslandTitles = [
    "Cloud Harbor",
    "Breakfast Breeze",
    "School Star Observatory",
    "Rhythm Cloud Stage",
    "London Wind Gate",
    "Storm Crown Citadel"
  ];
  expectedIslandTitles.forEach((title, index) => {
    const island = skyIslands[index];
    if (!island || island.title !== title) {
      errors.push(`Sky Islands chapter ${index + 1} must be ${title}`);
    }
    if (!Array.isArray(island?.clues) || island.clues.length < 3) {
      errors.push(`${title}: needs at least 3 voice clue encounters`);
    }
    for (const [clueIndex, clue] of (island?.clues || []).entries()) {
      if (!clue.id || !clue.prompt || !clue.expected || !Array.isArray(clue.targetWords) || clue.targetWords.length < 2) {
        errors.push(`${title}: clue ${clueIndex + 1} is missing prompt, expected answer, or target words`);
      }
    }
  });
}

const requiredOrbMoods = ["happy", "sad", "scared", "surprised", "bored", "annoyed", "thinking", "listening", "proud"];
for (const mood of requiredOrbMoods) {
  if (!orbMoods[mood] || !orbMoods[mood].color || !orbMoods[mood].expression) {
    errors.push(`Orb mood missing expression config: ${mood}`);
  }
}

if (learnerProfile.displayName !== "Eli") {
  errors.push("learnerProfile.displayName must be Eli for visible UI");
}

if (learnerProfile.spokenName !== "Ellie") {
  errors.push("learnerProfile.spokenName must be Ellie for speech synthesis");
}

const expectedSoundAssets = {
  welcome: "/assets/sounds/startup-screen-sound.mp3",
  ui: "/assets/sounds/ui-click.mp3",
  level: "/assets/sounds/new-level-opened.mp3",
  award: "/assets/sounds/award-reveal.mp3",
  correct: "/assets/sounds/correct%20answer.mp3",
  rewardUnlock: "/assets/sounds/magic%20reward%20unlock.mp3",
  announcement: "/assets/sounds/announcement.mp3",
  star: "/assets/sounds/star-collected.mp3",
  wrong: "/assets/sounds/wrong-answer.mp3"
};

for (const [key, url] of Object.entries(expectedSoundAssets)) {
  if (soundAssets[key] !== url) {
    errors.push(`soundAssets.${key} must be ${url}`);
    continue;
  }
  const filePath = path.join(rootDir, "public", decodeURIComponent(url.replace(/^\/+/, "")));
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing sound asset: ${url}`);
  }
}

if (!fs.existsSync(path.join(rootDir, "public", "assets", "images", "eli.png"))) {
  errors.push("Missing Eli image asset: /assets/images/eli.png");
}

if (!fs.existsSync(path.join(rootDir, "public", "assets", "images", "eli_.icon"))) {
  errors.push("Missing Eli browser icon asset: /assets/images/eli_.icon");
}

if (END_GAME_VIDEO_SRC !== "/assets/videos/end_game_animation.mp4") {
  errors.push("v2 end-game video path must be /assets/videos/end_game_animation.mp4");
}

if (!fs.existsSync(path.join(rootDir, "public", "assets", "videos", "end_game_animation.mp4"))) {
  errors.push("Missing v2 end-game animation video asset");
}

const serviceWorker = fs.readFileSync(path.join(rootDir, "public", "sw.js"), "utf8");
if (!serviceWorker.includes("eli-english-quest-v3") || !serviceWorker.includes("networkFirstHtml")) {
  errors.push("Service worker must use the v3 network-first update strategy");
}

const mainSource = fs.readFileSync(path.join(rootDir, "src", "main.js"), "utf8");
const starEffectUses = mainSource.match(/playEffect\("star"\)/g) || [];
if (starEffectUses.length !== 1) {
  errors.push("Star sound should only play once in the mode-completion star accounting path");
}

if (!mainSource.includes(NEW_ADVENTURE_CTA)) {
  errors.push("Home screen must include the approved v2 new-adventure CTA text");
}

if (!mainSource.includes(END_GAME_VIDEO_SRC)) {
  errors.push("Home flow must reference the v2 end-game animation video");
}

if (!mainSource.includes("window.debugUnlockV2") || !mainSource.includes("import.meta.env.DEV")) {
  errors.push("V2 debug unlock hook must exist only behind the dev environment guard");
}

if (!mainSource.includes("sessionStorage.setItem(DEBUG_V2_UNLOCK_KEY")) {
  errors.push("V2 debug unlock must use sessionStorage rather than permanent progress");
}

if (VOICE_PROXY_URL !== "wss://lucky-dawn-d422.dallyzg.workers.dev") {
  errors.push("V2 voice proxy URL must use the current Cloudflare Worker WebSocket host");
}

const voiceGuideSource = fs.readFileSync(path.join(rootDir, "src", "v2", "voiceGuide.js"), "utf8");
for (const mood of ["happy", "thinking", "listening"]) {
  if (!voiceGuideSource.includes(`${mood}:`)) {
    errors.push(`Voice guide must include Gemini mood instruction for ${mood}`);
  }
}

if (!voiceGuideSource.includes("new WebSocket(VOICE_PROXY_URL)") || !voiceGuideSource.includes("setup:") || !voiceGuideSource.includes("clientContent:")) {
  errors.push("Voice guide must use Gemini Live WebSocket setup/clientContent messages");
}

if (!voiceGuideSource.includes("responseModalities: AUDIO_RESPONSE_MODALITIES")) {
  errors.push("Voice guide Live setup must include responseModalities: ['AUDIO']");
}

if (!voiceGuideSource.includes("serverContent") || !voiceGuideSource.includes("modelTurn") || !voiceGuideSource.includes("inlineData")) {
  errors.push("Voice guide must parse Gemini Live serverContent audio chunks");
}

for (const requiredSnippet of ["extractAudioChunksFromValue", "inlineData", "audioContent", "base64ToBytes", "pcm16BytesToFloat32", "enqueuePcm"]) {
  if (!voiceGuideSource.includes(requiredSnippet)) {
    errors.push(`Voice guide missing WebSocket audio playback piece: ${requiredSnippet}`);
  }
}

const skyCanvasSource = fs.readFileSync(path.join(rootDir, "src", "v2", "SkyIslandsCanvas.jsx"), "utf8");
for (const requiredSnippet of ["FloatingClouds", "BridgeSegment", "CloudHarborScene", "BreakfastBreezeScene", "CloudCompassReward", "onPointerMove", "data-voice-activity", "OrbParticle"]) {
  if (!skyCanvasSource.includes(requiredSnippet)) {
    errors.push(`Sky Islands 3D scene missing interactive/dynamic system: ${requiredSnippet}`);
  }
}

if (!fs.existsSync(path.join(rootDir, "public", "assets", "v2", "ATTRIBUTIONS.md"))) {
  errors.push("V2 asset attribution file must exist");
}

if (!v2AssetManifest || v2AssetManifest.strategy !== "procedural-first") {
  errors.push("V2 asset manifest must describe the procedural-first asset strategy");
}

for (const assetUrl of v2AssetManifest.reusedLocalAssets || []) {
  const assetPath = path.join(rootDir, "public", decodeURIComponent(assetUrl.replace(/^\/+/, "")));
  if (!fs.existsSync(assetPath)) {
    errors.push(`V2 asset manifest references a missing local asset: ${assetUrl}`);
  }
}

const runtimeSources = [
  fs.readFileSync(path.join(rootDir, "src", "v2", "SagaApp.jsx"), "utf8"),
  fs.readFileSync(path.join(rootDir, "src", "v2", "SkyIslandsCanvas.jsx"), "utf8"),
  fs.readFileSync(path.join(rootDir, "src", "v2", "sagaWorldData.js"), "utf8")
].join("\n");

if (/https?:\/\//.test(runtimeSources)) {
  errors.push("V2 runtime source must not hotlink public assets");
}

for (const level of levels) {
  const levelProgress = progress.levelProgress[level.id];
  if (!levelProgress || typeof levelProgress.pictureStars !== "number") {
    errors.push(`${level.id}: default progress missing pictureStars`);
  }
}

if (errors.length) {
  console.error("Content validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const v2Stats = sagaWorlds.reduce(
  (stats, world) => {
    stats.levels += world.levels.length;
    for (const level of world.levels) {
      stats.tasks += level.tasks.length;
      if (level.implementationStatus === "playable") {
        stats.playableLevels += 1;
      }
    }
    return stats;
  },
  { levels: 0, playableLevels: 0, tasks: 0 },
);

if (v2Stats.playableLevels !== 2) {
  errors.push(`V2 should currently expose exactly 2 playable levels, found ${v2Stats.playableLevels}`);
}

if (errors.length) {
  console.error("Content validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  [
    `Content validation passed: ${levels.length} v1 levels`,
    `${sagaWorlds.length} V2 worlds`,
    `${v2Stats.levels} V2 levels`,
    `${v2Stats.tasks} V2 tasks`,
    `${v2Stats.playableLevels} playable V2 levels`,
    `Cloud Harbor playable: ${playableCloudHarbor.implementationStatus === "playable" ? "yes" : "no"}`,
    `Breakfast Breeze playable: ${playableBreakfastBreeze.implementationStatus === "playable" ? "yes" : "no"}`,
  ].join("; ") + ".",
);
