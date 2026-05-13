function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function outlineTasks(titles) {
  return titles.map((title, index) => ({
    id: `${String(index + 1).padStart(2, "0")}-${slugify(title)}`,
    title,
    implementationStatus: "outline"
  }));
}

export const skyIslandPositions = [
  [-4.8, 0, 0],
  [-2.9, 0.35, -1.35],
  [-1, 0.8, -2.1],
  [1.15, 0.65, -1.75],
  [3.05, 0.4, -0.8],
  [4.85, 0.8, 0.4]
];

const cloudHarborTasks = [
  {
    id: "wake-lumas-harbour-memory",
    title: "Wake Luma's Harbour Memory",
    screenObject: "Luma memory glow beside the dock",
    objectKey: "luma-memory",
    lumaLine: "This harbour remembers my first light. Say: Hello Luma, I am Eli.",
    expectedAnswer: "Hello Luma, I am Eli.",
    targetWords: ["hello", "Luma", "Eli"],
    successAnimation: "Luma's harbour memory wakes, smiles, glows and settles beside Eli.",
    gentleHint: "Say hello to Luma.",
    supportInteraction: "Tap Luma once only if the first audio gesture is required.",
    mood: "happy",
    rewardEvent: "memory-light"
  },
  {
    id: "light-the-sky-lantern",
    title: "Light the Sky Lantern",
    screenObject: "A small lantern is dark on the dock.",
    objectKey: "lantern",
    lumaLine: "The harbour is sleepy. Say: Light the lantern, please.",
    expectedAnswer: "Light the lantern, please.",
    targetWords: ["light", "lantern", "please"],
    successAnimation: "Lantern turns on and warm yellow glow spreads across the dock.",
    gentleHint: "Use light, lantern and please.",
    supportInteraction: "Lantern can pulse when tapped, but speech solves it.",
    mood: "thinking",
    rewardEvent: "lantern-light"
  },
  {
    id: "raise-the-cloud-flag",
    title: "Raise the Cloud Flag",
    screenObject: "A cute flag is folded down on a tiny pole.",
    objectKey: "flag",
    lumaLine: "The flag wants a happy wind. Say: I am happy today.",
    expectedAnswer: "I am happy today.",
    targetWords: ["happy", "today"],
    successAnimation: "Flag rises, waves and tiny cloud puffs clap.",
    gentleHint: "Say happy today.",
    supportInteraction: "",
    mood: "happy",
    rewardEvent: "flag-wind"
  },
  {
    id: "find-the-silver-key",
    title: "Find the Silver Key",
    screenObject: "Three cloud puffs float above the dock, one hides a key.",
    objectKey: "silver-key",
    lumaLine: "I see something shiny. Say: I can see the silver key.",
    expectedAnswer: "I can see the silver key.",
    targetWords: ["see", "silver", "key"],
    successAnimation: "The puffs pop away and the silver key floats into Eli's collection.",
    gentleHint: "Use see, silver and key.",
    supportInteraction: "Eli may tap the shining puff after speaking.",
    mood: "surprised",
    rewardEvent: "silver-key"
  },
  {
    id: "mix-the-breeze-potion",
    title: "Mix the Breeze Potion",
    screenObject: "A tiny potion bowl bubbles with blue drops and star dust.",
    objectKey: "potion",
    lumaLine: "The wind needs a potion. Say: Add blue rain, please.",
    expectedAnswer: "Add blue rain, please.",
    targetWords: ["add", "blue", "rain", "please"],
    successAnimation: "Potion turns bright blue and sends sparkles upward.",
    gentleHint: "Use blue rain, please.",
    supportInteraction: "Blue droplet can be dragged over the bowl after the line is spoken.",
    mood: "thinking",
    rewardEvent: "blue-potion"
  },
  {
    id: "ask-the-tiny-gate",
    title: "Ask the Tiny Gate",
    screenObject: "A small cloud gate blocks the dock path.",
    objectKey: "gate",
    lumaLine: "Ask the gate kindly. Say: Open the gate, please.",
    expectedAnswer: "Open the gate, please.",
    targetWords: ["open", "gate", "please"],
    successAnimation: "Gate opens with a soft cloud swirl.",
    gentleHint: "Say open gate, please.",
    supportInteraction: "",
    mood: "happy",
    rewardEvent: "gate-open"
  },
  {
    id: "cast-the-cloud-spell",
    title: "Cast the Cloud Spell",
    screenObject: "A glowing spell circle appears on the dock floor.",
    objectKey: "spell-circle",
    lumaLine: "Now use a magic sentence. Say: Clouds, show the way.",
    expectedAnswer: "Clouds, show the way.",
    targetWords: ["clouds", "show", "way"],
    successAnimation: "The spell circle spins and a glowing route appears in the sky.",
    gentleHint: "Say clouds, show the way.",
    supportInteraction: "",
    mood: "surprised",
    rewardEvent: "route-spell"
  },
  {
    id: "open-the-first-bridge",
    title: "Open the First Bridge",
    screenObject: "Broken bridge pieces float near the edge of the dock.",
    objectKey: "bridge-pieces",
    lumaLine: "One brave sentence will help the bridge. Say: I am ready for the next island.",
    expectedAnswer: "I am ready for the next island.",
    targetWords: ["ready", "next", "island"],
    successAnimation: "Bridge pieces shake, glow and prepare for the map bridge animation.",
    gentleHint: "Say ready for the next island.",
    supportInteraction: "",
    mood: "proud",
    rewardEvent: "bridge-ready"
  }
];

const breakfastBreezeTasks = [
  {
    id: "open-the-picnic-cloud",
    title: "Open the Picnic Cloud",
    screenObject: "closed picnic cloud with sun-shaped latch",
    objectKey: "picnic-cloud",
    lumaLine: "The picnic cloud is closed. Say: Open the picnic, please.",
    expectedAnswer: "Open the picnic, please.",
    targetWords: ["open", "picnic", "please"],
    successAnimation: "The cloud opens like a soft lunchbox.",
    gentleHint: "Ask the picnic to open.",
    mood: "thinking",
    rewardEvent: "picnic-open"
  },
  {
    id: "wake-the-cereal-cloud",
    title: "Wake the Cereal Cloud",
    screenObject: "bowl-shaped cloud full of sleepy cereal stars",
    objectKey: "cereal-cloud",
    lumaLine: "The cereal stars are sleeping. Say: I like cereal.",
    expectedAnswer: "I like cereal.",
    targetWords: ["like", "cereal"],
    successAnimation: "The cereal stars wake and spin around the bowl.",
    gentleHint: "Say I like cereal.",
    mood: "happy",
    rewardEvent: "cereal-stars"
  },
  {
    id: "count-the-toast-boats",
    title: "Count the Toast Boats",
    screenObject: "three tiny toast boats floating in a milk river",
    objectKey: "toast-boats",
    lumaLine: "Count the toast boats. Say: There are three toast boats.",
    expectedAnswer: "There are three toast boats.",
    targetWords: ["three", "toast", "boats"],
    successAnimation: "The three boats line up and toot softly.",
    gentleHint: "Use three and toast boats.",
    mood: "thinking",
    rewardEvent: "toast-boats"
  },
  {
    id: "pour-the-orange-juice",
    title: "Pour the Orange Juice",
    screenObject: "juice kite with an empty cup below it",
    objectKey: "orange-juice",
    lumaLine: "The cup is empty. Say: Orange juice, please.",
    expectedAnswer: "Orange juice, please.",
    targetWords: ["orange", "juice", "please"],
    successAnimation: "The kite pours glowing orange juice into the cup.",
    gentleHint: "Say orange juice, please.",
    mood: "surprised",
    rewardEvent: "orange-juice"
  },
  {
    id: "feed-the-wind-bird",
    title: "Feed the Wind Bird",
    screenObject: "tiny wind bird waiting beside crumbs",
    objectKey: "wind-bird",
    lumaLine: "The bird is hungry. Say: Here is some toast.",
    expectedAnswer: "Here is some toast.",
    targetWords: ["here", "toast"],
    successAnimation: "Toast crumbs fly to the bird and it chirps a breeze note.",
    gentleHint: "Use here and toast.",
    mood: "happy",
    rewardEvent: "wind-bird-fed"
  },
  {
    id: "find-the-sunberry-basket",
    title: "Find the Sunberry Basket",
    screenObject: "basket hidden behind a jam jar",
    objectKey: "jam-basket",
    lumaLine: "I found something. Say: The basket is behind the jam.",
    expectedAnswer: "The basket is behind the jam.",
    targetWords: ["basket", "behind", "jam"],
    successAnimation: "The jam jar wiggles aside and the Sunberry Basket appears.",
    gentleHint: "Say basket behind the jam.",
    mood: "surprised",
    rewardEvent: "basket-found"
  },
  {
    id: "fill-the-basket",
    title: "Fill the Basket",
    screenObject: "sunberries floating above the picnic table",
    objectKey: "sunberries",
    lumaLine: "Help me fill it. Say: Put sunberries in the basket.",
    expectedAnswer: "Put sunberries in the basket.",
    targetWords: ["put", "sunberries", "basket"],
    successAnimation: "Sunberries bounce into the basket one by one.",
    gentleHint: "Say sunberries in the basket.",
    mood: "thinking",
    rewardEvent: "basket-filled"
  },
  {
    id: "call-the-warm-breeze",
    title: "Call the Warm Breeze",
    screenObject: "warm breeze gate at the island edge",
    objectKey: "breeze-gate",
    lumaLine: "The bridge needs wind. Say: Warm breeze, show the way.",
    expectedAnswer: "Warm breeze, show the way.",
    targetWords: ["warm", "breeze", "show", "way"],
    successAnimation: "A warm wind ribbon flies back to the map route.",
    gentleHint: "Say warm breeze, show the way.",
    mood: "proud",
    rewardEvent: "warm-breeze"
  }
];

const skyLevels = [
  {
    id: "cloud-harbor",
    order: 1,
    title: "Cloud Harbor",
    shortTitle: "Harbor",
    reward: "Cloud Compass",
    sceneType: "sky-dock",
    implementationStatus: "playable",
    color: "#6fd2ff",
    position: skyIslandPositions[0],
    intro: "Luma and Eli wake the floating harbour and open the first sky bridge.",
    tasks: cloudHarborTasks
  },
  {
    id: "breakfast-breeze",
    order: 2,
    title: "Breakfast Breeze",
    shortTitle: "Breakfast",
    reward: "Sunberry Basket",
    sceneType: "picnic-island",
    implementationStatus: "playable",
    color: "#ffcf6d",
    position: skyIslandPositions[1],
    intro: "A warm breakfast island is full of sleepy food clouds. Help Luma feed the kind breeze.",
    tasks: breakfastBreezeTasks
  },
  {
    id: "school-star-observatory",
    order: 3,
    title: "School Star Observatory",
    shortTitle: "School Stars",
    reward: "Star Map Lens",
    sceneType: "star-observatory",
    implementationStatus: "locked-outline",
    color: "#8a8dff",
    position: skyIslandPositions[2],
    intro: "The school stars are asleep inside a glass observatory.",
    tasks: outlineTasks([
      "Open the Observatory Dome",
      "Wake the Blue Telescope",
      "Set the Star Clock",
      "Pack the Magic Bag",
      "Find the Pencil Star",
      "Draw the Star Path",
      "Shine the Star Map Lens",
      "Read the Star Clue"
    ])
  },
  {
    id: "rhythm-cloud-stage",
    order: 4,
    title: "Rhythm Cloud Stage",
    shortTitle: "Rhythm",
    reward: "Thunder Drum",
    sceneType: "cloud-stage",
    implementationStatus: "locked-outline",
    color: "#ff83c6",
    position: skyIslandPositions[3],
    intro: "The clouds have forgotten their song.",
    tasks: outlineTasks([
      "Turn On the Stage Lights",
      "Wake the Microphone",
      "Clap the Cloud Beat",
      "Find the Guitar Cloud",
      "Help the Shy Thunder Puff",
      "Start the Tiny Show",
      "Play the Thunder Drum",
      "Sing to the Wind Gate"
    ])
  },
  {
    id: "london-wind-gate",
    order: 5,
    title: "London Wind Gate",
    shortTitle: "London Gate",
    reward: "Red Bus Ticket",
    sceneType: "london-gate",
    implementationStatus: "locked-outline",
    color: "#61d394",
    position: skyIslandPositions[4],
    intro: "A magical London gate spins in the clouds.",
    tasks: outlineTasks([
      "Open the London Window",
      "Wake Big Ben",
      "Fix the Red Bus Cloud",
      "Find the Ticket Booth",
      "Turn Left at the Gate",
      "Cross the River Ribbon",
      "Stamp the Red Bus Ticket",
      "Open the Wind Gate"
    ])
  },
  {
    id: "storm-crown-citadel",
    order: 6,
    title: "Storm Crown Citadel",
    shortTitle: "Citadel",
    reward: "Storm Crown Key",
    sceneType: "storm-citadel",
    implementationStatus: "locked-outline",
    color: "#b180ff",
    position: skyIslandPositions[5],
    intro: "The soft storm is hiding the Crown Door.",
    tasks: outlineTasks([
      "Name the Storm Problem",
      "Use the Cloud Compass",
      "Share the Sunberry Basket",
      "Shine the Star Map Lens",
      "Beat the Thunder Drum",
      "Use the Red Bus Ticket",
      "Pull the Golden Lever",
      "Open the Crown Door"
    ])
  }
];

const crystalLevels = [
  ["prism-cave-entrance", "Prism Cave Entrance", "Red Prism Spark", ["Wake the Cave Door", "Find the Red Crystal", "Touch the Blue Light", "Choose Yellow Dust", "Open the Green Shelf", "Describe the Prism", "Catch the Crystal Moth", "Repair the First Colour"]],
  ["gem-garden", "Gem Garden", "Emerald Leaf Shard", ["Water the Gem Flowers", "Find the Green Seed", "Move the Pink Gem", "Help the Snail Miner", "Open the Garden Gate", "Describe the Big Flower", "Find the Hidden Bee Gem", "Grow the Emerald Leaf"]],
  ["mirror-lake", "Mirror Lake", "Mirror Drop Lens", ["Wake the Mirror Lake", "Find the Real Star", "Compare Two Statues", "Turn the Left Lily", "Name the Shiny Fish", "Choose Same or Different", "Open the Reflection Door", "Catch the Mirror Drop"]],
  ["crystal-workshop", "Crystal Workshop", "Prism Hammer", ["Wake the Robot Helper", "Pick the Small Crystal", "Choose the Round Gem", "Make the Blue Beam", "Use the Prism Hammer", "Compare Two Gems", "Clean the Tool Shelf", "Build the Prism Key"]],
  ["shadow-crystal-maze", "Shadow Crystal Maze", "Moon Thread Map", ["Ask the Maze to Glow", "Follow the Right Arrow", "Find the Near Crystal", "Look Inside the Box", "Open the Mist Curtain", "Find the Footprints", "Ask Where the Door Is", "Guide Luma Out"]],
  ["rainbow-heart-vault", "Rainbow Heart Vault", "Rainbow Heart Badge", ["Place the Red Spark", "Place the Emerald Leaf", "Use the Mirror Drop", "Lift the Prism Hammer", "Follow the Moon Thread", "Name All the Colours", "Say What You Think", "Restore the Rainbow Heart"]]
].map(([id, title, reward, tasks], index) => ({
  id,
  order: index + 1,
  title,
  shortTitle: title,
  reward,
  sceneType: "crystal-cave",
  implementationStatus: "future-outline",
  color: "#a76dff",
  tasks: outlineTasks(tasks)
}));

const timeLevels = [
  ["clock-tower-office", "Clock Tower Office", "Detective Clock Badge", ["Open the Case Board", "Find Today's Card", "Ask the Clock", "Open the Old Drawer", "Use the Magnifying Glass", "Name Tomorrow's Door", "Remember Yesterday", "Open the First Portal"]],
  ["morning-market-mix-up", "Morning Market Mix-up", "Morning Tick Token", ["Wake the Sun Stall", "Move the Moon Lamp", "Buy the Apple Clue", "Set the Market Clock", "Find the First Basket", "Call the Delivery Bird", "Put the Bread on the Stall", "Collect the Morning Tick"]],
  ["old-forest-footprints", "Old Forest Footprints", "Clock Feather", ["Look at the Footprints", "Name the Old Tree", "Find the Feather", "Say What Happened", "Open the Hollow Door", "Choose the Next Path", "Help the Forest Clock", "Collect the Forest Tick"]],
  ["tomorrow-station", "Tomorrow Station", "Future Ticket Star", ["Wake the Route Board", "Ask the Robot Conductor", "Choose the Hover Bus", "Open the Ticket Gate", "Find Platform Two", "Pack the Future Bag", "Catch the Fast Star", "Collect the Future Tick"]],
  ["school-day-memory", "School Day Memory", "Memory Page", ["Wake the Memory Book", "Choose the First Card", "Find the Book Card", "Place the Lunch Cloud", "Fix the Playground Slide", "Set the Home Clock", "Read the Memory Page", "Collect the Memory Tick"]],
  ["midnight-time-vault", "Midnight Time Vault", "Golden Time Key", ["Place the Detective Badge", "Place the Morning Tick", "Place the Clock Feather", "Use the Future Ticket Star", "Read the Memory Page", "Ask the Midnight Bell", "Repair the Clock", "Open the Future Bridge"]]
].map(([id, title, reward, tasks], index) => ({
  id,
  order: index + 1,
  title,
  shortTitle: title,
  reward,
  sceneType: "time-portal",
  implementationStatus: "future-outline",
  color: "#ffb94a",
  tasks: outlineTasks(tasks)
}));

export const sagaWorlds = [
  {
    id: "sky-islands",
    title: "Sky Islands Quest",
    subtitle: "Repair floating bridges with Luma and spoken magic.",
    mapTitle: "Sky Islands",
    accent: "#42b9ff",
    mapType: "floating-islands",
    firstLevelId: "cloud-harbor",
    introLine: "Hello Eli. I am Luma. The sky bridges are sleepy. Let us wake Cloud Harbor together.",
    progressionAnimation: "sky-bridge-build",
    rewardRoomName: "Sky Trophy Shelf",
    levels: skyLevels
  },
  {
    id: "crystal-mystery",
    title: "Crystal Mystery",
    subtitle: "A glowing cave case waits behind the sky route.",
    mapTitle: "Crystal Caves",
    accent: "#a76dff",
    mapType: "crystal-cave-network",
    unlockAfterWorldId: "sky-islands",
    firstLevelId: "prism-cave-entrance",
    introLine: "The Rainbow Heart is grey. We will find the colours.",
    progressionAnimation: "cave-colour-return",
    rewardRoomName: "Crystal Shelf",
    levels: crystalLevels
  },
  {
    id: "time-portal-case",
    title: "Time Portal Case",
    subtitle: "A clock tower detective story for later.",
    mapTitle: "Time Portal Hub",
    accent: "#ffb94a",
    mapType: "portal-clock-hub",
    unlockAfterWorldId: "crystal-mystery",
    firstLevelId: "clock-tower-office",
    introLine: "The Great Clock lost its Time Tick. We will solve the case.",
    progressionAnimation: "portal-door-light",
    rewardRoomName: "Time Case Shelf",
    levels: timeLevels
  }
];

export function getWorldById(worldId) {
  return sagaWorlds.find((world) => world.id === worldId) || sagaWorlds[0];
}

export function getLevelById(worldId, levelId) {
  const world = getWorldById(worldId);
  return world.levels.find((level) => level.id === levelId) || world.levels[0];
}

export function getNextLevel(worldId, levelId) {
  const world = getWorldById(worldId);
  const index = world.levels.findIndex((level) => level.id === levelId);
  return index >= 0 ? world.levels[index + 1] || null : null;
}

export function isPlayableLevel(level) {
  return level?.implementationStatus === "playable";
}
