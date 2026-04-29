import { gameConfig, levels, rewardMilestones } from "../data/curriculum.js";

const modeStarKeys = ["quizStars", "pictureStars", "memoryStars", "speakStars", "buildStars"];

function getLevelStars(levelProgress) {
  return modeStarKeys.reduce((sum, key) => sum + Math.max(levelProgress[key] || 0, 0), 0);
}

function getCompletedModeCount(levelProgress) {
  return modeStarKeys.filter((key) => Math.max(levelProgress[key] || 0, 0) > 0).length;
}

function applyProgression(progress) {
  let totalStars = 0;
  let previousLevelReady = true;
  progress.trophies = Array.isArray(progress.trophies) ? progress.trophies : [];

  levels.forEach((level, index) => {
    const lp = progress.levelProgress[level.id];
    if (!lp) return;

    const levelStars = getLevelStars(lp);
    const completedModes = getCompletedModeCount(lp);
    const questReady = levelStars >= gameConfig.progression.minimumStars
      && completedModes >= gameConfig.progression.minimumModes;

    lp.unlocked = index === 0 || previousLevelReady;
    lp.completed = questReady;
    totalStars += levelStars;
    previousLevelReady = questReady;
  });

  progress.totalStars = totalStars;

  for (const reward of rewardMilestones) {
    if (totalStars >= reward.stars && !progress.trophies.includes(reward.title)) {
      progress.trophies.push(reward.title);
    }
  }

  return progress;
}

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
    settings: {
      soundEnabled: true,
      voiceEnabled: false
    },
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
      settings: {
        ...defaults.settings,
        ...(parsed.settings || {})
      },
      levelProgress: { ...defaults.levelProgress }
    };

    for (const level of levels) {
      mergedProgress.levelProgress[level.id] = {
        ...defaults.levelProgress[level.id],
        ...((parsed.levelProgress || {})[level.id] || {})
      };
    }

    return applyProgression(mergedProgress);
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
  return saveProgress(applyProgression(progress));
}

export function starsFromScore(correct, total) {
  if (total <= 0) return 0;
  const ratio = correct / total;
  if (ratio >= gameConfig.starThresholds.three) return 3;
  if (ratio >= gameConfig.starThresholds.two) return 2;
  if (ratio >= gameConfig.starThresholds.one) return 1;
  return 0;
}
