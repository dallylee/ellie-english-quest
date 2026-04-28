import { levels } from "../src/data/curriculum.js";
import { createDefaultProgress } from "../src/lib/storage.js";

const errors = [];
const ids = new Set();

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
