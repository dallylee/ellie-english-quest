import fs from "node:fs";
import path from "node:path";

import { learnerProfile, gameConfig, levels, rewardMilestones } from "../src/data/curriculum.js";
import { soundAssets } from "../src/lib/sound.js";
import { createDefaultProgress } from "../src/lib/storage.js";
import {
  END_GAME_VIDEO_SRC,
  NEW_ADVENTURE_CTA,
  VOICE_PROXY_HEALTH_URL,
  VOICE_PROXY_URL,
  orbMoods,
  sagaGames,
  skyIslands
} from "../src/v2/skyIslandsData.js";
import { sagaWorlds, getLevelById, getWorldById } from "../src/v2/sagaWorldData.js";
import { v2AssetManifest } from "../src/v2/assets/assetManifest.js";

const errors = [];
const ids = new Set();
const rootDir = process.cwd();
const sourceTextExtensions = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".html", ".css", ".json", ".jsonc", ".md", ".svg"]);
const envFileNames = new Set([".env", ".env.local", ".env.production", ".env.development"]);

function collectTextFiles(directory) {
  const fullDirectory = path.join(rootDir, directory);
  if (!fs.existsSync(fullDirectory)) return [];

  return fs.readdirSync(fullDirectory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(fullDirectory, entry.name);
    if (entry.isDirectory()) return collectTextFiles(path.relative(rootDir, entryPath));
    if (!entry.isFile() || !sourceTextExtensions.has(path.extname(entry.name))) return [];
    return [entryPath];
  });
}

function collectSecretScanFiles(directory) {
  const fullDirectory = path.join(rootDir, directory);
  if (!fs.existsSync(fullDirectory)) return [];
  return fs.readdirSync(fullDirectory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(fullDirectory, entry.name);
    if (entry.isDirectory()) return collectSecretScanFiles(path.relative(rootDir, entryPath));
    if (!entry.isFile()) return [];
    if (sourceTextExtensions.has(path.extname(entry.name)) || envFileNames.has(entry.name)) return [entryPath];
    return [];
  });
}

const criticalSecretChecks = [
  { label: "Gemini Developer API key variable", regex: new RegExp(["GEMINI", "_API_KEY"].join(""), "i") },
  { label: "Google Generative Language API marker", regex: new RegExp(["GENERATIVE", "_LANGUAGE"].join(""), "i") },
  { label: "backend Google API key variable", regex: new RegExp(["GOOGLE", "_API_KEY"].join(""), "i") },
  { label: "service account private key", regex: /-----BEGIN PRIVATE KEY-----|["']private_key["']\s*:/i },
  { label: "service account email", regex: /["']client_email["']\s*:\s*["'][^"']+@[^"']+\.iam\.gserviceaccount\.com["']/i },
  { label: "Firebase Admin SDK credential", regex: /firebase-admin|service_account/i },
  { label: "Cloudflare secret variable", regex: new RegExp(["CLOUDFLARE", "(_API)?_(TOKEN|KEY|SECRET)"].join(""), "i") },
  { label: "FCM server key", regex: /AAAA[A-Za-z0-9_-]{20,}:[A-Za-z0-9_-]{20,}/ },
  { label: "OpenAI-style API key", regex: /sk-[A-Za-z0-9_-]{20,}/ }
];

const secretScanFiles = [
  "index.html",
  ...fs.readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && envFileNames.has(entry.name))
    .map((entry) => path.join(rootDir, entry.name)),
  ...collectSecretScanFiles("src"),
  ...collectSecretScanFiles("scripts"),
  ...collectSecretScanFiles("workers"),
  ...collectSecretScanFiles("public"),
  ...collectSecretScanFiles("reports"),
  ...collectSecretScanFiles("dist"),
  ...["wrangler.voice.jsonc"].filter((file) => fs.existsSync(path.join(rootDir, file)))
];

for (const sourceFile of secretScanFiles) {
  const sourcePath = path.isAbsolute(sourceFile) ? sourceFile : path.join(rootDir, sourceFile);
  if (!fs.existsSync(sourcePath)) continue;
  const relativeSourcePath = path.relative(rootDir, sourcePath);
  if (relativeSourcePath === path.join("scripts", "validate-content.mjs")) continue;
  const isWorkerSource = relativeSourcePath.startsWith(`workers${path.sep}`) || relativeSourcePath === "wrangler.voice.jsonc";
  const sourceText = fs.readFileSync(sourcePath, "utf8");
  for (const check of criticalSecretChecks) {
    if (isWorkerSource && check.label === "Gemini Developer API key variable") continue;
    if (check.regex.test(sourceText)) {
      errors.push(`Critical secret marker found in frontend/report/build file (${check.label}): ${relativeSourcePath}`);
    }
  }
  const googleKeyMatches = sourceText.match(/AIza[0-9A-Za-z_-]{20,}/g) || [];
  if (googleKeyMatches.length && !/firebase|firestore|authDomain|VITE_FIREBASE/i.test(sourceText)) {
    errors.push(`Possible non-Firebase Google API key in frontend/report/build file: ${relativeSourcePath}`);
  }
}

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

if (progress.settings?.soundEnabled !== true || progress.settings?.voiceEnabled !== true) {
  errors.push("default progress should start with sound on and Luma voice on");
}

if (progress.settings?.voicePreferenceSet !== false) {
  errors.push("default progress should not mark voice preference as user-set");
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

const schoolStarObservatory = getLevelById("sky-islands", "school-star-observatory");
const expectedSchoolStarTasks = [
  {
    title: "Open the Observatory Dome",
    objectKey: "observatory-dome",
    lumaLine: "The stars cannot come in. Say: Open the star roof, please.",
    expectedAnswer: "Open the star roof, please.",
    targetWords: ["open", "star", "roof", "please"],
    gentleHint: "Ask the star roof to open."
  },
  {
    title: "Wake the Blue Telescope",
    objectKey: "blue-telescope",
    lumaLine: "The telescope is looking the wrong way. Say: Telescope, find the English star.",
    expectedAnswer: "Telescope, find the English star.",
    targetWords: ["telescope", "English", "star"],
    gentleHint: "Say English star."
  },
  {
    title: "Set the Star Clock",
    objectKey: "star-clock",
    lumaLine: "The star clock is lost. Say: School starts at nine.",
    expectedAnswer: "School starts at nine.",
    targetWords: ["school", "starts", "nine"],
    gentleHint: "Use school, starts and nine."
  },
  {
    title: "Pack the Magic Bag",
    objectKey: "magic-bag",
    lumaLine: "The bag needs one book. Say: Put the book in my bag.",
    expectedAnswer: "Put the book in my bag.",
    targetWords: ["put", "book", "bag"],
    gentleHint: "Say book in my bag."
  },
  {
    title: "Find the Pencil Star",
    objectKey: "pencil-star",
    lumaLine: "Tell Luma where it is. Say: The pencil is behind the cloud.",
    expectedAnswer: "The pencil is behind the cloud.",
    targetWords: ["pencil", "behind", "cloud"],
    gentleHint: "Use behind the cloud."
  },
  {
    title: "Draw the Star Path",
    objectKey: "star-path-board",
    lumaLine: "Help me draw the path. Say: Draw a line to the star.",
    expectedAnswer: "Draw a line to the star.",
    targetWords: ["draw", "line", "star"],
    gentleHint: "Say draw a line."
  },
  {
    title: "Shine the Star Map Lens",
    objectKey: "star-map-lens",
    lumaLine: "Clean it with words. Say: The lens is shiny now.",
    expectedAnswer: "The lens is shiny now.",
    targetWords: ["lens", "shiny", "now"],
    gentleHint: "Say shiny lens."
  },
  {
    title: "Read the Star Clue",
    objectKey: "star-clue",
    lumaLine: "Read the clue with me. Say: The next island is singing.",
    expectedAnswer: "The next island is singing.",
    targetWords: ["next", "island", "singing"],
    gentleHint: "Say next island singing."
  }
];

if (!schoolStarObservatory || schoolStarObservatory.reward !== "Star Map Lens" || schoolStarObservatory.tasks?.length !== 8) {
  errors.push("School Star Observatory must be the third complete 8-task playable level with Star Map Lens reward");
} else if (schoolStarObservatory.implementationStatus !== "playable") {
  errors.push("School Star Observatory must be marked playable");
} else if (schoolStarObservatory.sceneType !== "star-observatory") {
  errors.push("School Star Observatory must use the star-observatory scene type");
} else {
  for (const [taskIndex, expectedTask] of expectedSchoolStarTasks.entries()) {
    const task = schoolStarObservatory.tasks[taskIndex];
    for (const requiredField of ["screenObject", "lumaLine", "expectedAnswer", "targetWords", "successAnimation", "gentleHint"]) {
      if (!task[requiredField] || (requiredField === "targetWords" && !Array.isArray(task.targetWords))) {
        errors.push(`School Star Observatory task ${taskIndex + 1} missing playable field: ${requiredField}`);
      }
    }
    for (const [field, expectedValue] of Object.entries(expectedTask)) {
      const actualValue = task[field];
      if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
        errors.push(`School Star Observatory task ${taskIndex + 1} ${field} must match the approved script`);
      }
    }
  }
}

const rhythmCloudStage = getLevelById("sky-islands", "rhythm-cloud-stage");
const expectedRhythmCloudStageTasks = [
  {
    title: "Turn On the Stage Lights",
    objectKey: "stage-lights",
    lumaLine: "The show needs light. Say: Lights on, please.",
    expectedAnswer: "Lights on, please.",
    targetWords: ["lights", "on", "please"],
    gentleHint: "Say lights on, please."
  },
  {
    title: "Wake the Microphone",
    objectKey: "glowing-microphone",
    lumaLine: "Tell the mic what you can do. Say: I can sing.",
    expectedAnswer: "I can sing.",
    targetWords: ["can", "sing"],
    gentleHint: "Say I can sing."
  },
  {
    title: "Clap the Cloud Beat",
    objectKey: "rhythm-pads",
    lumaLine: "Make a tiny beat. Say: I can clap the beat.",
    expectedAnswer: "I can clap the beat.",
    targetWords: ["can", "clap", "beat"],
    gentleHint: "Use clap and beat."
  },
  {
    title: "Find the Guitar Cloud",
    objectKey: "guitar-cloud",
    lumaLine: "Tell me the dance clue. Say: I like dancing.",
    expectedAnswer: "I like dancing.",
    targetWords: ["like", "dancing"],
    gentleHint: "Say I like dancing."
  },
  {
    title: "Help the Shy Thunder Puff",
    objectKey: "thunder-puff",
    lumaLine: "Make it feel safe. Say: You can join the show.",
    expectedAnswer: "You can join the show.",
    targetWords: ["join", "show"],
    gentleHint: "Say join the show."
  },
  {
    title: "Start the Tiny Show",
    objectKey: "curtain-star",
    lumaLine: "Start the show with kind words. Say: Welcome to my show.",
    expectedAnswer: "Welcome to my show.",
    targetWords: ["welcome", "show"],
    gentleHint: "Say welcome to my show."
  },
  {
    title: "Play the Thunder Drum",
    objectKey: "thunder-drum",
    lumaLine: "Play the magic drum. Say: Boom, boom, make a bridge.",
    expectedAnswer: "Boom, boom, make a bridge.",
    targetWords: ["boom", "make", "bridge"],
    gentleHint: "Say make a bridge."
  },
  {
    title: "Sing to the Wind Gate",
    objectKey: "musical-wind-gate",
    lumaLine: "One last line for the gate. Say: The song shows the way.",
    expectedAnswer: "The song shows the way.",
    targetWords: ["song", "shows", "way"],
    gentleHint: "Say song shows the way."
  }
];

if (!rhythmCloudStage || rhythmCloudStage.reward !== "Thunder Drum" || rhythmCloudStage.tasks?.length !== 8) {
  errors.push("Rhythm Cloud Stage must be the fourth complete 8-task playable level with Thunder Drum reward");
} else if (rhythmCloudStage.implementationStatus !== "playable") {
  errors.push("Rhythm Cloud Stage must be marked playable");
} else if (rhythmCloudStage.sceneType !== "cloud-stage") {
  errors.push("Rhythm Cloud Stage must use the cloud-stage scene type");
} else {
  for (const [taskIndex, expectedTask] of expectedRhythmCloudStageTasks.entries()) {
    const task = rhythmCloudStage.tasks[taskIndex];
    for (const requiredField of ["screenObject", "lumaLine", "expectedAnswer", "targetWords", "successAnimation", "gentleHint"]) {
      if (!task[requiredField] || (requiredField === "targetWords" && !Array.isArray(task.targetWords))) {
        errors.push(`Rhythm Cloud Stage task ${taskIndex + 1} missing playable field: ${requiredField}`);
      }
    }
    for (const [field, expectedValue] of Object.entries(expectedTask)) {
      const actualValue = task[field];
      if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
        errors.push(`Rhythm Cloud Stage task ${taskIndex + 1} ${field} must match the approved script`);
      }
    }
  }
}

const londonWindGate = getLevelById("sky-islands", "london-wind-gate");
const expectedLondonWindGateTasks = [
  {
    title: "Open the London Window",
    objectKey: "london-window",
    lumaLine: "The fog is hiding a place. Say: I can see London.",
    expectedAnswer: "I can see London.",
    targetWords: ["see", "London"],
    gentleHint: "Say I can see London."
  },
  {
    title: "Wake Big Ben",
    objectKey: "big-ben-tower",
    lumaLine: "Name the tower clue. Say: I can see Big Ben.",
    expectedAnswer: "I can see Big Ben.",
    targetWords: ["see", "Big", "Ben"],
    gentleHint: "Say Big Ben."
  },
  {
    title: "Fix the Red Bus Cloud",
    objectKey: "red-bus-cloud",
    lumaLine: "Tell the bus how we travel. Say: We can go by bus.",
    expectedAnswer: "We can go by bus.",
    targetWords: ["go", "bus"],
    gentleHint: "Say go by bus."
  },
  {
    title: "Find the Ticket Booth",
    objectKey: "ticket-booth",
    lumaLine: "Ask for a ticket kindly. Say: A ticket, please.",
    expectedAnswer: "A ticket, please.",
    targetWords: ["ticket", "please"],
    gentleHint: "Say ticket, please."
  },
  {
    title: "Turn Left at the Gate",
    objectKey: "wind-arrows",
    lumaLine: "Follow the arrow. Say: Turn left at the gate.",
    expectedAnswer: "Turn left at the gate.",
    targetWords: ["turn", "left", "gate"],
    gentleHint: "Use turn left."
  },
  {
    title: "Cross the River Ribbon",
    objectKey: "river-ribbon",
    lumaLine: "Tell Luma where to go. Say: Go over the river.",
    expectedAnswer: "Go over the river.",
    targetWords: ["go", "over", "river"],
    gentleHint: "Say over the river."
  },
  {
    title: "Stamp the Red Bus Ticket",
    objectKey: "ticket-stamp",
    lumaLine: "Make the ticket ready. Say: Stamp the ticket, please.",
    expectedAnswer: "Stamp the ticket, please.",
    targetWords: ["stamp", "ticket", "please"],
    gentleHint: "Say stamp the ticket."
  },
  {
    title: "Open the Wind Gate",
    objectKey: "london-wind-gate",
    lumaLine: "Use your travel spell. Say: London wind, open the way.",
    expectedAnswer: "London wind, open the way.",
    targetWords: ["London", "wind", "open", "way"],
    gentleHint: "Say London wind, open the way."
  }
];

if (!londonWindGate || londonWindGate.reward !== "Red Bus Ticket" || londonWindGate.tasks?.length !== 8) {
  errors.push("London Wind Gate must be the fifth complete 8-task playable level with Red Bus Ticket reward");
} else if (londonWindGate.implementationStatus !== "playable") {
  errors.push("London Wind Gate must be marked playable");
} else if (londonWindGate.sceneType !== "london-gate") {
  errors.push("London Wind Gate must use the london-gate scene type");
} else {
  for (const [taskIndex, expectedTask] of expectedLondonWindGateTasks.entries()) {
    const task = londonWindGate.tasks[taskIndex];
    for (const requiredField of ["screenObject", "lumaLine", "expectedAnswer", "targetWords", "successAnimation", "gentleHint"]) {
      if (!task[requiredField] || (requiredField === "targetWords" && !Array.isArray(task.targetWords))) {
        errors.push(`London Wind Gate task ${taskIndex + 1} missing playable field: ${requiredField}`);
      }
    }
    for (const [field, expectedValue] of Object.entries(expectedTask)) {
      const actualValue = task[field];
      if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
        errors.push(`London Wind Gate task ${taskIndex + 1} ${field} must match the approved script`);
      }
    }
  }
}

const stormCrownCitadel = getLevelById("sky-islands", "storm-crown-citadel");
const expectedStormCrownCitadelTasks = [
  {
    title: "Name the Storm Problem",
    objectKey: "storm-crystal",
    lumaLine: "Tell me the problem. Say: The storm is hiding the crown.",
    expectedAnswer: "The storm is hiding the crown.",
    targetWords: ["storm", "hiding", "crown"],
    gentleHint: "Use storm, hiding and crown."
  },
  {
    title: "Use the Cloud Compass",
    objectKey: "cloud-compass-pedestal",
    lumaLine: "The compass is confused. Say: Compass, show the way.",
    expectedAnswer: "Compass, show the way.",
    targetWords: ["compass", "show", "way"],
    gentleHint: "Say compass, show the way."
  },
  {
    title: "Share the Sunberry Basket",
    objectKey: "sunberry-basket-pedestal",
    lumaLine: "The puff needs kindness. Say: Here is a sunberry.",
    expectedAnswer: "Here is a sunberry.",
    targetWords: ["sunberry"],
    gentleHint: "Say sunberry."
  },
  {
    title: "Shine the Star Map Lens",
    objectKey: "star-lens-pedestal",
    lumaLine: "Aim the lens. Say: Shine on the door.",
    expectedAnswer: "Shine on the door.",
    targetWords: ["shine", "door"],
    gentleHint: "Say shine on the door."
  },
  {
    title: "Beat the Thunder Drum",
    objectKey: "thunder-drum-pedestal",
    lumaLine: "Make a brave beat. Say: The drum is strong.",
    expectedAnswer: "The drum is strong.",
    targetWords: ["drum", "strong"],
    gentleHint: "Say drum is strong."
  },
  {
    title: "Use the Red Bus Ticket",
    objectKey: "red-bus-route",
    lumaLine: "Tell the route what we will do. Say: We will go to the crown.",
    expectedAnswer: "We will go to the crown.",
    targetWords: ["will", "go", "crown"],
    gentleHint: "Use will, go and crown."
  },
  {
    title: "Pull the Golden Lever",
    objectKey: "golden-lever",
    lumaLine: "Tell me your plan. Say: I will find the last clue.",
    expectedAnswer: "I will find the last clue.",
    targetWords: ["will", "find", "clue"],
    gentleHint: "Say I will find the clue."
  },
  {
    title: "Open the Crown Door",
    objectKey: "crown-door",
    lumaLine: "Use your brave sentence. Say: I am brave and I can solve the mystery.",
    expectedAnswer: "I am brave and I can solve the mystery.",
    targetWords: ["brave", "can", "solve", "mystery"],
    gentleHint: "Say brave, solve mystery."
  }
];

if (!stormCrownCitadel || stormCrownCitadel.reward !== "Storm Crown Key" || stormCrownCitadel.tasks?.length !== 8) {
  errors.push("Storm Crown Citadel must remain present as the sixth 8-task future level with Storm Crown Key reward");
} else if (stormCrownCitadel.implementationStatus === "playable") {
  errors.push("Storm Crown Citadel must not be marked playable in this hotfix");
} else if (stormCrownCitadel.sceneType !== "storm-citadel") {
  errors.push("Storm Crown Citadel future data must keep the storm-citadel scene type");
} else {
  for (const [taskIndex, expectedTask] of expectedStormCrownCitadelTasks.entries()) {
    const task = stormCrownCitadel.tasks[taskIndex];
    for (const requiredField of ["screenObject", "lumaLine", "expectedAnswer", "targetWords", "successAnimation", "gentleHint"]) {
      if (!task[requiredField] || (requiredField === "targetWords" && !Array.isArray(task.targetWords))) {
        errors.push(`Storm Crown Citadel task ${taskIndex + 1} missing playable field: ${requiredField}`);
      }
    }
    for (const [field, expectedValue] of Object.entries(expectedTask)) {
      const actualValue = task[field];
      if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
        errors.push(`Storm Crown Citadel task ${taskIndex + 1} ${field} must match the approved script`);
      }
    }
  }
}

const skyIslandRewards = getWorldById("sky-islands").levels.map((level) => level.reward);
const expectedSkyIslandRewards = ["Cloud Compass", "Sunberry Basket", "Star Map Lens", "Thunder Drum", "Red Bus Ticket", "Storm Crown Key"];
if (JSON.stringify(skyIslandRewards) !== JSON.stringify(expectedSkyIslandRewards)) {
  errors.push("Sky Islands must expose all six rewards in order, ending with Storm Crown Key");
}

const crystalMysteryWorld = getWorldById("crystal-mystery");
if (crystalMysteryWorld.levels.some((level) => level.implementationStatus === "playable")) {
  errors.push("Crystal Mystery must not mark any gameplay levels playable yet");
}

if (progress.saga.sagaUnlocks?.crystalMystery !== false || progress.saga.sagaUnlocks?.timePortalCase !== false) {
  errors.push("Default saga progress must keep Crystal Mystery and Time Portal Case locked");
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

for (const requiredVideoSnippet of ["muted playsinline preload=\"auto\"", "endVideoPlay", "Tap to play magic movie", "video.play()"]) {
  if (!mainSource.includes(requiredVideoSnippet)) {
    errors.push(`End-game video fallback missing required piece: ${requiredVideoSnippet}`);
  }
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

if (VOICE_PROXY_HEALTH_URL !== "https://lucky-dawn-d422.dallyzg.workers.dev/health") {
  errors.push("V2 voice proxy health URL must use the current Cloudflare Worker health endpoint");
}

const voiceGuideSource = fs.readFileSync(path.join(rootDir, "src", "v2", "voiceGuide.js"), "utf8");
const sagaAppSource = fs.readFileSync(path.join(rootDir, "src", "v2", "SagaApp.jsx"), "utf8");
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

for (const requiredSnippet of ["gemini-3.1-flash-live-preview", "GEMINI_CONNECT_TIMEOUT_MS", "refreshWorkerHealthIfDebug", "sanitizeDiagnosticError", "voiceMode"]) {
  if (!voiceGuideSource.includes(requiredSnippet)) {
    errors.push(`Voice guide missing Gemini repair diagnostic/fallback piece: ${requiredSnippet}`);
  }
}

if (!voiceGuideSource.includes("serverContent") || !voiceGuideSource.includes("modelTurn") || !voiceGuideSource.includes("inlineData")) {
  errors.push("Voice guide must parse Gemini Live serverContent audio chunks");
}

for (const requiredSnippet of ["extractAudioChunksFromValue", "inlineData", "audioContent", "base64ToBytes", "pcm16BytesToFloat32", "enqueuePcm"]) {
  if (!voiceGuideSource.includes(requiredSnippet)) {
    errors.push(`Voice guide missing WebSocket audio playback piece: ${requiredSnippet}`);
  }
}

for (const requiredSnippet of ["QUIET_VOICE_MESSAGE", "activeListeningLock", "recognitionStartCount", "lastRecognitionStopReason", "permissionRequestAttempted", "speechRecognitionInvoked", "quietFallbackUsed"]) {
  if (!voiceGuideSource.includes(requiredSnippet)) {
    errors.push(`Voice guide missing hotfix diagnostic/quiet-mode piece: ${requiredSnippet}`);
  }
}

for (const debugLabel of ["speech synthesis:", "voice mode:", "gemini status:", "worker:", "worker websocket:", "gemini key:", "gemini chunks:", "browser tts fallback:", "quiet fallback:", "last tts error:", "last stt error:"]) {
  if (!sagaAppSource.includes(debugLabel)) {
    errors.push(`debugVoice panel missing ${debugLabel}`);
  }
}

const workerSourcePath = path.join(rootDir, "workers", "gemini-voice-proxy.js");
if (!fs.existsSync(workerSourcePath)) {
  errors.push("Gemini voice proxy Worker source must be present");
} else {
  const workerSource = fs.readFileSync(workerSourcePath, "utf8");
  for (const requiredSnippet of ["https://generativelanguage.googleapis.com/ws/", "Upgrade: \"websocket\"", "WebSocketPair", "GEMINI_API_KEY", "sanitizeError", "/health"]) {
    if (!workerSource.includes(requiredSnippet)) {
      errors.push(`Gemini voice proxy Worker missing required piece: ${requiredSnippet}`);
    }
  }
  if (/wss:\/\/generativelanguage\.googleapis\.com/.test(workerSource)) {
    errors.push("Gemini voice proxy Worker must not fetch a wss:// upstream URL in Cloudflare");
  }
  if (/AIza[0-9A-Za-z_-]{20,}/.test(workerSource)) {
    errors.push("Gemini voice proxy Worker source must not contain a real Gemini API key");
  }
}

const loginScreenSource = fs.readFileSync(path.join(rootDir, "src", "v2", "LoginScreen.jsx"), "utf8");
for (const requiredSnippet of ["Create Eli PIN", "Enter Eli's PIN", "Reset Eli PIN", "Parent password reset email sent"]) {
  if (!loginScreenSource.includes(requiredSnippet)) {
    errors.push(`PIN flow missing required copy/state: ${requiredSnippet}`);
  }
}
if (/PIN (sent|emailed)|check your email for Eli PIN/i.test(loginScreenSource)) {
  errors.push("PIN flow must not imply Eli PIN is sent by email");
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

if (v2Stats.playableLevels !== 5) {
  errors.push(`V2 should expose exactly 5 playable levels during the hotfix, found ${v2Stats.playableLevels}`);
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
    `School Star Observatory playable: ${schoolStarObservatory.implementationStatus === "playable" ? "yes" : "no"}`,
    `Rhythm Cloud Stage playable: ${rhythmCloudStage.implementationStatus === "playable" ? "yes" : "no"}`,
    `London Wind Gate playable: ${londonWindGate.implementationStatus === "playable" ? "yes" : "no"}`,
    `Storm Crown Citadel playable: ${stormCrownCitadel.implementationStatus === "playable" ? "yes" : "no"}`,
  ].join("; ") + ".",
);
