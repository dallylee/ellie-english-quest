import { getLevelById, getNextLevel, getWorldById, isPlayableLevel } from "./sagaWorldData.js";

function clone(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function unique(items) {
  return [...new Set((items || []).filter(Boolean))];
}

const CLOUD_HARBOR_TASK_ID_MIGRATION = {
  "wake-lumas-harbour-memory": "wake-the-dock",
  "light-the-sky-lantern": "light-the-lantern",
  "raise-the-cloud-flag": "choose-blue-wind",
  "find-the-silver-key": "find-silver-key",
  "mix-the-breeze-potion": "mix-breeze-potion",
  "ask-the-tiny-gate": "open-cloud-gate",
  "cast-the-cloud-spell": "open-cloud-gate",
  "cast-cloud-path-spell": "open-cloud-gate",
  "open-the-first-bridge": "build-first-bridge"
};

const CLOUD_HARBOR_DIRECTOR_TASK_IDS = [
  "wake-the-dock",
  "light-the-lantern",
  "choose-blue-wind",
  "read-flag-clue",
  "find-silver-key",
  "mix-breeze-potion",
  "open-cloud-gate",
  "build-first-bridge"
];

function migrateCloudHarborTaskProgress(saga) {
  const skyTasks = saga.skyIslands?.completedTaskIdsByLevel || saga.completedTaskIdsByLevel?.["sky-islands"];
  const taskIds = skyTasks?.["cloud-harbor"];
  if (!Array.isArray(taskIds) || !taskIds.length) return;

  let changed = false;
  const migrated = taskIds.map((taskId) => {
    const nextTaskId = CLOUD_HARBOR_TASK_ID_MIGRATION[taskId] || taskId;
    if (nextTaskId !== taskId) changed = true;
    return nextTaskId;
  });
  const completedSet = new Set(migrated);

  if (completedSet.has("find-silver-key") && !completedSet.has("read-flag-clue")) {
    completedSet.add("read-flag-clue");
    changed = true;
  }

  const canonicalCompleted = CLOUD_HARBOR_DIRECTOR_TASK_IDS.filter((taskId) => completedSet.has(taskId));
  if (JSON.stringify(canonicalCompleted) !== JSON.stringify(taskIds)) changed = true;
  if (!changed) return;
  skyTasks["cloud-harbor"] = unique(canonicalCompleted);
  saga.completedTaskIdsByLevel["sky-islands"] = skyTasks;
  if (saga.skyIslands) {
    saga.skyIslands.completedTaskIdsByLevel = skyTasks;
    saga.skyIslands.taskProgress = skyTasks;
  }
  saga.migrations = {
    ...(saga.migrations || {}),
    cloudHarborBibleV1TaskIds: true,
    cloudHarborDirectorTaskIds: true
  };
}

function ensureWorldMaps(saga) {
  saga.unlockedWorldIds = unique(saga.unlockedWorldIds || ["sky-islands"]);
  saga.unlockedLevelIdsByWorld = saga.unlockedLevelIdsByWorld || {};
  saga.completedTaskIdsByLevel = saga.completedTaskIdsByLevel || saga.taskProgress || {};
  saga.completedLevelIdsByWorld = saga.completedLevelIdsByWorld || {};
  saga.collectedRewardsByWorld = saga.collectedRewardsByWorld || {};
  saga.taskProgress = saga.completedTaskIdsByLevel;
  saga.mapIntroSeenByWorld = saga.mapIntroSeenByWorld || {};

  for (const world of ["sky-islands", "crystal-mystery", "time-portal-case"]) {
    saga.unlockedLevelIdsByWorld[world] = unique(saga.unlockedLevelIdsByWorld[world] || []);
    saga.completedTaskIdsByLevel[world] = saga.completedTaskIdsByLevel[world] || {};
    saga.completedLevelIdsByWorld[world] = unique(saga.completedLevelIdsByWorld[world] || []);
    saga.collectedRewardsByWorld[world] = unique(saga.collectedRewardsByWorld[world] || []);
  }

  if (!saga.unlockedLevelIdsByWorld["sky-islands"].length) {
    saga.unlockedLevelIdsByWorld["sky-islands"] = ["cloud-harbor"];
  }

  saga.skyIslands = {
    currentIslandId: "cloud-harbor",
    currentLevelId: "cloud-harbor",
    unlockedLevelIds: saga.unlockedLevelIdsByWorld["sky-islands"],
    completedIslandIds: saga.completedLevelIdsByWorld["sky-islands"],
    completedLevelIds: saga.completedLevelIdsByWorld["sky-islands"],
    collectedRewards: saga.collectedRewardsByWorld["sky-islands"],
    clueProgress: {},
    taskProgress: saga.completedTaskIdsByLevel["sky-islands"],
    completedTaskIdsByLevel: saga.completedTaskIdsByLevel["sky-islands"],
    mapIntroSeen: Boolean(saga.mapIntroSeenByWorld["sky-islands"]),
    ...(saga.skyIslands || {})
  };

  saga.skyIslands.unlockedLevelIds = unique(saga.skyIslands.unlockedLevelIds || saga.unlockedLevelIdsByWorld["sky-islands"]);
  saga.skyIslands.completedLevelIds = unique(saga.skyIslands.completedLevelIds);
  saga.skyIslands.completedIslandIds = unique(saga.skyIslands.completedIslandIds || saga.skyIslands.completedLevelIds);
  saga.skyIslands.collectedRewards = unique(saga.skyIslands.collectedRewards);
  saga.skyIslands.completedTaskIdsByLevel = {
    ...(saga.completedTaskIdsByLevel["sky-islands"] || {}),
    ...(saga.skyIslands.completedTaskIdsByLevel || saga.skyIslands.taskProgress || {})
  };
  saga.skyIslands.taskProgress = saga.skyIslands.completedTaskIdsByLevel;
  if (saga.skyIslands.mapIntroSeen) {
    saga.mapIntroSeenByWorld["sky-islands"] = true;
  }

  migrateCloudHarborTaskProgress(saga);

  saga.unlockedLevelIdsByWorld["sky-islands"] = saga.skyIslands.unlockedLevelIds;
  saga.completedLevelIdsByWorld["sky-islands"] = saga.skyIslands.completedLevelIds;
  saga.collectedRewardsByWorld["sky-islands"] = saga.skyIslands.collectedRewards;
  saga.completedTaskIdsByLevel["sky-islands"] = saga.skyIslands.completedTaskIdsByLevel;
  saga.taskProgress = saga.completedTaskIdsByLevel;

  return saga;
}

export function normaliseSaga(saga) {
  return ensureWorldMaps(clone(saga));
}

export function hasSeenWorldIntro(saga, worldId) {
  const safeSaga = ensureWorldMaps(clone(saga));
  return Boolean(safeSaga.mapIntroSeenByWorld?.[worldId]);
}

export function markWorldIntroSeen(saga, worldId) {
  const nextSaga = normaliseSaga(saga);
  nextSaga.mapIntroSeenByWorld[worldId] = true;
  if (worldId === "sky-islands") {
    nextSaga.skyIslands.mapIntroSeen = true;
  }
  return stamp(nextSaga);
}

export function getUnlockedLevelIds(saga, worldId) {
  const safeSaga = ensureWorldMaps(clone(saga));
  return safeSaga.unlockedLevelIdsByWorld[worldId] || [];
}

export function isLevelUnlocked(saga, worldId, levelId) {
  return getUnlockedLevelIds(saga, worldId).includes(levelId);
}

export function getCompletedTaskIds(saga, worldId, levelId) {
  const safeSaga = ensureWorldMaps(clone(saga));
  return safeSaga.completedTaskIdsByLevel?.[worldId]?.[levelId] || [];
}

export function getActiveTask(saga, worldId, levelId) {
  const level = getLevelById(worldId, levelId);
  const completed = new Set(getCompletedTaskIds(saga, worldId, levelId));
  return level.tasks.find((task) => !completed.has(task.id)) || null;
}

export function isLevelComplete(saga, worldId, levelId) {
  const level = getLevelById(worldId, levelId);
  const completed = new Set(getCompletedTaskIds(saga, worldId, levelId));
  return level.tasks.every((task) => completed.has(task.id));
}

export function getCollectedRewards(saga, worldId) {
  const safeSaga = ensureWorldMaps(clone(saga));
  return safeSaga.collectedRewardsByWorld?.[worldId] || [];
}

export function canEnterLevel(saga, worldId, levelId) {
  const level = getLevelById(worldId, levelId);
  return isPlayableLevel(level) && isLevelUnlocked(saga, worldId, levelId);
}

function stamp(saga) {
  const now = new Date().toISOString();
  saga.skyIslands.updatedAt = now;
  return saga;
}

export function completeTask(saga, worldId, levelId, taskId) {
  const nextSaga = normaliseSaga(saga);
  const world = getWorldById(worldId);
  const level = getLevelById(worldId, levelId);
  const taskIds = unique(nextSaga.completedTaskIdsByLevel[worldId][levelId] || []);
  taskIds.push(taskId);
  nextSaga.completedTaskIdsByLevel[worldId][levelId] = unique(taskIds);

  const levelComplete = level.tasks.every((task) => nextSaga.completedTaskIdsByLevel[worldId][levelId].includes(task.id));
  let unlockedNextLevel = null;
  let rewardEarned = null;

  if (levelComplete) {
    nextSaga.completedLevelIdsByWorld[worldId] = unique([...nextSaga.completedLevelIdsByWorld[worldId], levelId]);
    nextSaga.collectedRewardsByWorld[worldId] = unique([...nextSaga.collectedRewardsByWorld[worldId], level.reward]);
    rewardEarned = level.reward;

    const nextLevel = getNextLevel(worldId, levelId);
    if (nextLevel) {
      nextSaga.unlockedLevelIdsByWorld[worldId] = unique([...nextSaga.unlockedLevelIdsByWorld[worldId], nextLevel.id]);
      nextSaga.currentLevelId = nextLevel.id;
      unlockedNextLevel = nextLevel;
    } else if (world.id === "crystal-mystery") {
      nextSaga.sagaUnlocks = { ...(nextSaga.sagaUnlocks || {}), timePortalCase: true };
      nextSaga.unlockedWorldIds = unique([...nextSaga.unlockedWorldIds, "time-portal-case"]);
    }
  }

  if (worldId === "sky-islands") {
    nextSaga.skyIslands.completedTaskIdsByLevel = nextSaga.completedTaskIdsByLevel["sky-islands"];
    nextSaga.skyIslands.taskProgress = nextSaga.completedTaskIdsByLevel["sky-islands"];
    nextSaga.skyIslands.completedLevelIds = nextSaga.completedLevelIdsByWorld["sky-islands"];
    nextSaga.skyIslands.completedIslandIds = nextSaga.completedLevelIdsByWorld["sky-islands"];
    nextSaga.skyIslands.collectedRewards = nextSaga.collectedRewardsByWorld["sky-islands"];
    nextSaga.skyIslands.unlockedLevelIds = nextSaga.unlockedLevelIdsByWorld["sky-islands"];
    nextSaga.skyIslands.currentLevelId = nextSaga.currentLevelId;
    nextSaga.skyIslands.currentIslandId = nextSaga.currentLevelId;
  }

  return {
    saga: stamp(nextSaga),
    levelComplete,
    rewardEarned,
    unlockedNextLevel
  };
}
