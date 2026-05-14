export const v2AssetPaths = {
  backgrounds: {
    cloudHarborSleepingDockMobile: "/assets/v2/backgrounds/cloud-harbor-sleeping-dock-mobile.webp",
    trophyShelfRoom: "/assets/v2/backgrounds/luma-trophy-shelf-room.webp",
    trophyShelfRoomMobile: "/assets/v2/backgrounds/luma-trophy-shelf-room-mobile.webp",
    skyHarborAurora: "/assets/v2/ui/sky-harbor-aurora.svg"
  },
  rewardSymbols: "/assets/v2/rewards/reward-symbols.svg"
};

export const rewardVisuals = {
  "Cloud Compass": { symbol: "cloud-compass", color: "#52e6ff" },
  "Sunberry Basket": { symbol: "sunberry-basket", color: "#ffcf6d" },
  "Star Map Lens": { symbol: "star-map-lens", color: "#8a8dff" },
  "Thunder Drum": { symbol: "thunder-drum", color: "#ff83c6" },
  "Red Bus Ticket": { symbol: "red-bus-ticket", color: "#ff6b6b" },
  "Storm Crown Key": { symbol: "storm-crown-key", color: "#b180ff" },
  "Red Prism Spark": { symbol: "red-prism-spark", color: "#ff5f8f" },
  "Emerald Leaf Shard": { symbol: "emerald-leaf-shard", color: "#61d394" },
  "Mirror Drop Lens": { symbol: "mirror-drop-lens", color: "#79e8ff" },
  "Prism Hammer": { symbol: "prism-hammer", color: "#a76dff" },
  "Moon Thread Map": { symbol: "moon-thread-map", color: "#c6b7ff" },
  "Rainbow Heart Badge": { symbol: "rainbow-heart-badge", color: "#ff83c6" },
  "Detective Clock Badge": { symbol: "detective-clock-badge", color: "#ffb94a" },
  "Morning Tick Token": { symbol: "morning-tick-token", color: "#ffd45c" },
  "Clock Feather": { symbol: "clock-feather", color: "#baf6ff" },
  "Future Ticket Star": { symbol: "future-ticket-star", color: "#7ba8ff" },
  "Memory Page": { symbol: "memory-page", color: "#fff0a8" },
  "Golden Time Key": { symbol: "golden-time-key", color: "#ffcf6d" }
};

export function getRewardVisual(rewardName) {
  const visual = rewardVisuals[rewardName] || { symbol: "cloud-compass", color: "#52e6ff" };
  return {
    ...visual,
    href: `${v2AssetPaths.rewardSymbols}#${visual.symbol}`
  };
}

export const v2AssetManifest = {
  strategy: "hybrid-local-art-and-procedural-overlays",
  publicAssets: [],
  generatedAssets: [
    {
      path: v2AssetPaths.backgrounds.cloudHarborSleepingDockMobile,
      purpose: "Mobile-first illustrated Cloud Harbor scenic background plate for The Sleeping Dock",
      origin: "Original generated local project art",
      license: "Original project asset for Eli's English Quest 2.0"
    },
    {
      path: v2AssetPaths.backgrounds.trophyShelfRoom,
      purpose: "Magical reward room backdrop for Luma's trophy shelf",
      origin: "Original generated local project art",
      license: "Original project asset for Eli's English Quest 2.0"
    },
    {
      path: v2AssetPaths.backgrounds.trophyShelfRoomMobile,
      purpose: "Mobile-first portrait reward room backdrop for Luma's trophy shelf",
      origin: "Original generated local project art",
      license: "Original project asset for Eli's English Quest 2.0"
    }
  ],
  originalLocalAssets: [
    {
      path: v2AssetPaths.rewardSymbols,
      purpose: "SVG symbol atlas for V2 reward objects",
      origin: "Original procedural SVG project art",
      license: "Original project asset for Eli's English Quest 2.0"
    },
    {
      path: v2AssetPaths.backgrounds.skyHarborAurora,
      purpose: "Lightweight magical sky overlay for fullscreen V2 scenes",
      origin: "Original procedural SVG project art",
      license: "Original project asset for Eli's English Quest 2.0"
    }
  ],
  reusedLocalAssets: [
    "/assets/sounds/startup-screen-sound.mp3",
    "/assets/sounds/ui-click.mp3",
    "/assets/sounds/new-level-opened.mp3",
    "/assets/sounds/award-reveal.mp3",
    "/assets/sounds/correct%20answer.mp3",
    "/assets/sounds/magic%20reward%20unlock.mp3",
    "/assets/sounds/announcement.mp3",
    "/assets/sounds/star-collected.mp3",
    "/assets/sounds/wrong-answer.mp3"
  ],
  proceduralSystems: [
    "Sky Islands world map",
    "Animated sky bridges",
    "Expressive Luma orb",
    "Cloud Harbor animated overlay effects, task hotspots, listening cue and reward objects",
    "Breakfast Breeze picnic island and task objects",
    "School Star Observatory dome, telescope, clock, school props, constellations and task objects",
    "Rhythm Cloud Stage concert stage, microphone, rhythm pads, thunder puff, music notes and task objects",
    "London Wind Gate travel scene, red bus cloud, clock tower, ticket booth, river bridge and task objects",
    "Storm Crown Citadel locked future map marker and reward symbol metadata",
    "Cloud Compass, Sunberry Basket, Star Map Lens, Thunder Drum, Red Bus Ticket and locked Storm Crown Key reward metadata",
    "Fullscreen game HUD and menu surfaces"
  ]
};
