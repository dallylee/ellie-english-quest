import { gameConfig, levels } from "../data/curriculum.js";

export function createDefaultProgress() {
  const levelProgress = {};
  for (const level of levels) {
    levelProgress[level.id] = {
      unlocked: level.order === 1,
      quizStars: 0,
      memoryStars: 0,
      pictureStars: 0,
      speakStars: 0,
      buildStars: 0,
      completed: false,
      attempts: 0
    };
  }
  return {
    version: 1,
    playerName: "Eli",
    totalStars: 0,
    levelProgress,
    trophies: [],
    lastPlayedLevelId: levels[0]?.id || null,
    updatedAt: new Date().toISOString()
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(gameConfig.storageKey);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw);
    const defaults = createDefaultProgress();

    // Merge safely so new levels added later do not break old saves.
    const mergedProgress = {
      ...defaults,
      ...parsed,
      levelProgress: { ...defaults.levelProgress }
    };

    for (const level of levels) {
      mergedProgress.levelProgress[level.id] = {
        ...defaults.levelProgress[level.id],
        ...((parsed.levelProgress || {})[level.id] || {})
      };
    }

    return mergedProgress;
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(progress) {
  const updated = { ...progress, updatedAt: new Date().toISOString() };
  localStorage.setItem(gameConfig.storageKey, JSON.stringify(updated));
  return updated;
}

export function resetProgress() {
  const fresh = createDefaultProgress();
  saveProgress(fresh);
  return fresh;
}

export function recalcAndUnlock(progress) {
  let totalStars = 0;
  levels.forEach((level, index) => {
    const lp = progress.levelProgress[level.id];
    if (!lp) return;

    const levelStars = Math.max(lp.quizStars || 0, 0)
      + Math.max(lp.memoryStars || 0, 0)
      + Math.max(lp.pictureStars || 0, 0)
      + Math.max(lp.speakStars || 0, 0)
      + Math.max(lp.buildStars || 0, 0);

    if (levelStars >= 3) lp.completed = true;
    totalStars += levelStars;

    const next = levels[index + 1];
    if (next && levelStars >= 2) {
      progress.levelProgress[next.id].unlocked = true;
    }
  });
  progress.totalStars = totalStars;

  if (totalStars >= 12 && !progress.trophies.includes("First dozen stars")) {
    progress.trophies.push("First dozen stars");
  }
  if (totalStars >= 24 && !progress.trophies.includes("Brave English Explorer")) {
    progress.trophies.push("Brave English Explorer");
  }

  return saveProgress(progress);
}

export function starsFromScore(correct, total) {
  if (total <= 0) return 0;
  const ratio = correct / total;
  if (ratio >= gameConfig.starThresholds.three) return 3;
  if (ratio >= gameConfig.starThresholds.two) return 2;
  if (ratio >= gameConfig.starThresholds.one) return 1;
  return 0;
}
