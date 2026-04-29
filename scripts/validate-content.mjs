import fs from "node:fs";
import path from "node:path";

import { learnerProfile, gameConfig, levels, rewardMilestones } from "../src/data/curriculum.js";
import { soundAssets } from "../src/lib/sound.js";
import { createDefaultProgress } from "../src/lib/storage.js";

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
  announcement: "/assets/sounds/announcement.mp3",
  star: "/assets/sounds/star-collected.mp3",
  wrong: "/assets/sounds/wrong-answer.mp3"
};

for (const [key, url] of Object.entries(expectedSoundAssets)) {
  if (soundAssets[key] !== url) {
    errors.push(`soundAssets.${key} must be ${url}`);
    continue;
  }
  const filePath = path.join(rootDir, "public", url.replace(/^\/+/, ""));
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

const serviceWorker = fs.readFileSync(path.join(rootDir, "public", "sw.js"), "utf8");
if (!serviceWorker.includes("eli-english-quest-v3") || !serviceWorker.includes("networkFirstHtml")) {
  errors.push("Service worker must use the v3 network-first update strategy");
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

console.log(`Content validation passed for ${levels.length} levels.`);
