import { gameConfig, levels, rewardMilestones } from "../data/curriculum.js";
import { sagaWorlds } from "../v2/sagaWorldData.js";

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
  progress.pendingRewardReveals = Array.isArray(progress.pendingRewardReveals)
    ? progress.pendingRewardReveals
    : [];

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
      if (!progress.pendingRewardReveals.includes(reward.title)) {
        progress.pendingRewardReveals.push(reward.title);
      }
    }
  }

  return progress;
}

function createEmptyWorldProgressMap() {
  return sagaWorlds.reduce((map, world) => {
    map[world.id] = [];
    return map;
  }, {});
}

function createDefaultUnlockedLevelMap() {
  return sagaWorlds.reduce((map, world) => {
    map[world.id] = world.id === "sky-islands" ? [world.firstLevelId] : [];
    return map;
  }, {});
}

function createDefaultTaskProgressMap() {
  return sagaWorlds.reduce((map, world) => {
    map[world.id] = {};
    return map;
  }, {});
}

function mergeArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

function mergeObject(value, fallback = {}) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
}

export function createDefaultSagaProgress() {
  const unlockedLevelIdsByWorld = createDefaultUnlockedLevelMap();
  const completedTaskIdsByLevel = createDefaultTaskProgressMap();
  const completedLevelIdsByWorld = createEmptyWorldProgressMap();
  const collectedRewardsByWorld = createEmptyWorldProgressMap();

  return {
    version: 2,
    endVideoSeen: false,
    newAdventureUnlocked: false,
    selectedGameId: "sky-islands",
    currentWorldId: "sky-islands",
    currentLevelId: "cloud-harbor",
    unlockedWorldIds: ["sky-islands"],
    unlockedLevelIdsByWorld,
    completedTaskIdsByLevel,
    completedLevelIdsByWorld,
    collectedRewardsByWorld,
    taskProgress: completedTaskIdsByLevel,
    mapIntroSeenByWorld: {},
    progressionAnimationState: null,
    parentAuth: {
      status: "local",
      uid: null,
      email: null,
      lastSyncedAt: null
    },
    profile: {
      activeProfileId: "eli",
      eliPinSet: false,
      eliPinVerifiedAt: null
    },
    sagaUnlocks: {
      skyIslands: true,
      crystalMystery: false,
      timePortalCase: false
    },
    skyIslands: {
      currentIslandId: "cloud-harbor",
      currentLevelId: "cloud-harbor",
      unlockedLevelIds: ["cloud-harbor"],
      completedIslandIds: [],
      completedLevelIds: [],
      collectedRewards: [],
      clueProgress: {},
      taskProgress: {},
      completedTaskIdsByLevel: {},
      mapIntroSeen: false,
      lastPromptAt: null,
      updatedAt: null
    }
  };
}

function mergeSagaProgress(defaultSaga, parsedSaga = {}) {
  const parsedSky = mergeObject(parsedSaga.skyIslands);
  const unlockedLevelIdsByWorld = {
    ...defaultSaga.unlockedLevelIdsByWorld,
    ...mergeObject(parsedSaga.unlockedLevelIdsByWorld)
  };
  const completedTaskIdsByLevel = {
    ...defaultSaga.completedTaskIdsByLevel,
    ...mergeObject(parsedSaga.completedTaskIdsByLevel || parsedSaga.taskProgress)
  };
  const completedLevelIdsByWorld = {
    ...defaultSaga.completedLevelIdsByWorld,
    ...mergeObject(parsedSaga.completedLevelIdsByWorld)
  };
  const collectedRewardsByWorld = {
    ...defaultSaga.collectedRewardsByWorld,
    ...mergeObject(parsedSaga.collectedRewardsByWorld)
  };

  if (parsedSky.completedTaskIdsByLevel || parsedSky.taskProgress) {
    completedTaskIdsByLevel["sky-islands"] = {
      ...completedTaskIdsByLevel["sky-islands"],
      ...mergeObject(parsedSky.completedTaskIdsByLevel || parsedSky.taskProgress)
    };
  }
  if (parsedSky.completedLevelIds) {
    completedLevelIdsByWorld["sky-islands"] = mergeArray(parsedSky.completedLevelIds);
  }
  if (parsedSky.collectedRewards) {
    collectedRewardsByWorld["sky-islands"] = mergeArray(parsedSky.collectedRewards);
  }
  if (parsedSky.unlockedLevelIds) {
    unlockedLevelIdsByWorld["sky-islands"] = mergeArray(parsedSky.unlockedLevelIds, unlockedLevelIdsByWorld["sky-islands"]);
  }

  return {
    ...defaultSaga,
    ...parsedSaga,
    currentWorldId: parsedSaga.currentWorldId || defaultSaga.currentWorldId,
    currentLevelId: parsedSaga.currentLevelId || parsedSky.currentLevelId || parsedSky.currentIslandId || defaultSaga.currentLevelId,
    unlockedWorldIds: mergeArray(parsedSaga.unlockedWorldIds, defaultSaga.unlockedWorldIds),
    unlockedLevelIdsByWorld,
    completedTaskIdsByLevel,
    completedLevelIdsByWorld,
    collectedRewardsByWorld,
    taskProgress: completedTaskIdsByLevel,
    mapIntroSeenByWorld: {
      ...defaultSaga.mapIntroSeenByWorld,
      ...mergeObject(parsedSaga.mapIntroSeenByWorld)
    },
    parentAuth: {
      ...defaultSaga.parentAuth,
      ...(parsedSaga.parentAuth || {})
    },
    profile: {
      ...defaultSaga.profile,
      ...(parsedSaga.profile || {})
    },
    sagaUnlocks: {
      ...defaultSaga.sagaUnlocks,
      ...(parsedSaga.sagaUnlocks || {})
    },
    skyIslands: {
      ...defaultSaga.skyIslands,
      ...parsedSky,
      currentLevelId: parsedSky.currentLevelId || parsedSky.currentIslandId || defaultSaga.skyIslands.currentLevelId,
      unlockedLevelIds: mergeArray(parsedSky.unlockedLevelIds, unlockedLevelIdsByWorld["sky-islands"]),
      completedIslandIds: mergeArray(parsedSky.completedIslandIds),
      completedLevelIds: mergeArray(parsedSky.completedLevelIds, completedLevelIdsByWorld["sky-islands"]),
      completed: Boolean(parsedSky.completed),
      collectedRewards: mergeArray(parsedSky.collectedRewards, collectedRewardsByWorld["sky-islands"]),
      clueProgress: mergeObject(parsedSky.clueProgress),
      taskProgress: mergeObject(parsedSky.taskProgress, completedTaskIdsByLevel["sky-islands"]),
      completedTaskIdsByLevel: mergeObject(parsedSky.completedTaskIdsByLevel, completedTaskIdsByLevel["sky-islands"]),
      mapIntroSeen: Boolean(parsedSky.mapIntroSeen)
    }
  };
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
    pendingRewardReveals: [],
    saga: createDefaultSagaProgress(),
    settings: {
      soundEnabled: true,
      voiceEnabled: true,
      voicePreferenceSet: false
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
    const parsedSettings = parsed.settings || {};
    const mergedSettings = {
      ...defaults.settings,
      ...parsedSettings
    };
    if (parsedSettings.voicePreferenceSet !== true) {
      mergedSettings.voiceEnabled = true;
    }

    const mergedProgress = {
      ...defaults,
      ...parsed,
      settings: mergedSettings,
      saga: mergeSagaProgress(defaults.saga, parsed.saga || {}),
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
  const defaults = createDefaultProgress();
  const updated = {
    ...defaults,
    ...progress,
    saga: mergeSagaProgress(defaults.saga, progress.saga || {}),
    updatedAt: new Date().toISOString()
  };
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
