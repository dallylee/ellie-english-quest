export const END_GAME_VIDEO_SRC = "/assets/videos/end_game_animation.mp4";
export const NEW_ADVENTURE_CTA = "ELI, ARE YOU READY FOR NEW ADVENTURE - CLICK HERE";
export const VOICE_PROXY_URL = "wss://lucky-dawn-d422.dallyzg.workers.dev";

export const sagaGames = [
  {
    id: "sky-islands",
    title: "Sky Islands Quest",
    subtitle: "A floating adventure with the talking orb.",
    initialState: "playable",
    accent: "#42b9ff"
  },
  {
    id: "crystal-mystery",
    title: "Crystal Mystery",
    subtitle: "A shiny case hidden behind the cloud gates.",
    initialState: "locked",
    accent: "#a76dff"
  },
  {
    id: "time-portal-case",
    title: "Time Portal Case",
    subtitle: "A future investigation waiting for a brave speaker.",
    initialState: "locked",
    accent: "#ffb94a"
  }
];

export const orbMoods = {
  happy: {
    color: "#52e6ff",
    glow: "#baf6ff",
    scale: 1.03,
    expression: { eyes: "soft", brow: "lifted", mouth: "smile" },
    voiceTone: "bright"
  },
  sad: {
    color: "#7ba8ff",
    glow: "#c9ddff",
    scale: 0.96,
    expression: { eyes: "droop", brow: "kind-sad", mouth: "small-frown" },
    voiceTone: "gentle"
  },
  scared: {
    color: "#b48cff",
    glow: "#eadcff",
    scale: 1.06,
    expression: { eyes: "wide", brow: "worried", mouth: "open" },
    voiceTone: "whisper"
  },
  surprised: {
    color: "#ffe05f",
    glow: "#fff2ad",
    scale: 1.08,
    expression: { eyes: "wide", brow: "high", mouth: "round" },
    voiceTone: "curious"
  },
  bored: {
    color: "#88d6c3",
    glow: "#d4fff4",
    scale: 0.98,
    expression: { eyes: "half", brow: "flat", mouth: "flat" },
    voiceTone: "playful"
  },
  annoyed: {
    color: "#ff9a7b",
    glow: "#ffd7c9",
    scale: 1,
    expression: { eyes: "side", brow: "tilted", mouth: "wobble" },
    voiceTone: "teasing"
  },
  thinking: {
    color: "#6cf2b8",
    glow: "#c2ffe7",
    scale: 1,
    expression: { eyes: "look-up", brow: "thinking", mouth: "tiny" },
    voiceTone: "thoughtful"
  },
  listening: {
    color: "#ff75c8",
    glow: "#ffd0ed",
    scale: 1.12,
    expression: { eyes: "focus", brow: "raised", mouth: "tiny-open" },
    voiceTone: "quiet"
  },
  proud: {
    color: "#ffd05a",
    glow: "#fff0b8",
    scale: 1.14,
    expression: { eyes: "sparkle", brow: "proud", mouth: "big-smile" },
    voiceTone: "celebrating"
  }
};

export const skyIslands = [
  {
    id: "cloud-harbor",
    order: 1,
    title: "Cloud Harbor",
    shortTitle: "Harbor",
    theme: "Introductions",
    reward: "Cloud Compass",
    color: "#6fd2ff",
    position: [-4.8, 0, 0],
    intro: "The orb wakes up beside a tiny sky dock. It needs Eli's voice to open the first bridge.",
    bridgeHint: "Say who you are and where you are going.",
    clues: [
      {
        id: "harbor-name",
        object: "silver bell",
        prompt: "Hello, Eli. Say: My name is Eli and I am ready.",
        expected: "My name is Eli and I am ready.",
        targetWords: ["name", "Eli", "ready"],
        fallbackChoice: "My name is Eli and I am ready.",
        orbMood: "happy"
      },
      {
        id: "harbor-feeling",
        object: "cloud flag",
        prompt: "The wind is asking a question. How are you today?",
        expected: "I am happy today.",
        targetWords: ["happy", "today"],
        fallbackChoice: "I am happy today.",
        orbMood: "thinking"
      },
      {
        id: "harbor-bridge",
        object: "tiny bridge",
        prompt: "Ask the bridge to open. Say: Open the bridge, please.",
        expected: "Open the bridge, please.",
        targetWords: ["open", "bridge", "please"],
        fallbackChoice: "Open the bridge, please.",
        orbMood: "surprised"
      }
    ]
  },
  {
    id: "breakfast-breeze",
    order: 2,
    title: "Breakfast Breeze",
    shortTitle: "Breakfast",
    theme: "Food, likes, quantities",
    reward: "Sunberry Basket",
    color: "#ffcf6d",
    position: [-2.9, 0.35, -1.35],
    intro: "Warm wind carries breakfast clues around a picnic island.",
    bridgeHint: "Find food words and make clear choices.",
    clues: [
      {
        id: "breakfast-like",
        object: "sunberry bowl",
        prompt: "Tell the orb one food you like for breakfast.",
        expected: "I like cereal for breakfast.",
        targetWords: ["like", "breakfast"],
        fallbackChoice: "I like cereal for breakfast.",
        orbMood: "happy"
      },
      {
        id: "breakfast-quantity",
        object: "toast stack",
        prompt: "Count the toast. Say: There are three pieces of toast.",
        expected: "There are three pieces of toast.",
        targetWords: ["three", "toast"],
        fallbackChoice: "There are three pieces of toast.",
        orbMood: "thinking"
      },
      {
        id: "breakfast-choice",
        object: "juice kite",
        prompt: "Choose a drink. Say: I would like orange juice, please.",
        expected: "I would like orange juice, please.",
        targetWords: ["orange", "juice", "please"],
        fallbackChoice: "I would like orange juice, please.",
        orbMood: "proud"
      }
    ]
  },
  {
    id: "school-star-observatory",
    order: 3,
    title: "School Star Observatory",
    shortTitle: "School Stars",
    theme: "School subjects and timetable clues",
    reward: "Star Map Lens",
    color: "#8a8dff",
    position: [-1, 0.8, -2.1],
    intro: "A telescope points at school stars. Each star needs a sentence to shine.",
    bridgeHint: "Use school subject words and simple time phrases.",
    clues: [
      {
        id: "school-subject",
        object: "blue telescope",
        prompt: "What subject do you like? Say a full sentence.",
        expected: "I like English.",
        targetWords: ["like", "English"],
        fallbackChoice: "I like English.",
        orbMood: "happy"
      },
      {
        id: "school-time",
        object: "star clock",
        prompt: "Tell me when school starts. Say: School starts at nine o'clock.",
        expected: "School starts at nine o'clock.",
        targetWords: ["school", "starts", "nine"],
        fallbackChoice: "School starts at nine o'clock.",
        orbMood: "thinking"
      },
      {
        id: "school-bag",
        object: "floating school bag",
        prompt: "What is in your school bag?",
        expected: "I have a book in my bag.",
        targetWords: ["have", "book", "bag"],
        fallbackChoice: "I have a book in my bag.",
        orbMood: "surprised"
      }
    ]
  },
  {
    id: "rhythm-cloud-stage",
    order: 4,
    title: "Rhythm Cloud Stage",
    shortTitle: "Rhythm",
    theme: "Music, hobbies, performance phrases",
    reward: "Thunder Drum",
    color: "#ff83c6",
    position: [1.15, 0.65, -1.75],
    intro: "A stage made from clouds waits for a short performance.",
    bridgeHint: "Use can, like, and short performance phrases.",
    clues: [
      {
        id: "rhythm-can",
        object: "glowing microphone",
        prompt: "Tell the stage something you can do.",
        expected: "I can sing and dance.",
        targetWords: ["can", "sing", "dance"],
        fallbackChoice: "I can sing and dance.",
        orbMood: "proud"
      },
      {
        id: "rhythm-hobby",
        object: "cloud guitar",
        prompt: "Say one hobby you like.",
        expected: "I like dancing.",
        targetWords: ["like", "dancing"],
        fallbackChoice: "I like dancing.",
        orbMood: "happy"
      },
      {
        id: "rhythm-performance",
        object: "curtain star",
        prompt: "Start the show. Say: Welcome to my show.",
        expected: "Welcome to my show.",
        targetWords: ["welcome", "show"],
        fallbackChoice: "Welcome to my show.",
        orbMood: "surprised"
      }
    ]
  },
  {
    id: "london-wind-gate",
    order: 5,
    title: "London Wind Gate",
    shortTitle: "London Gate",
    theme: "Places, directions, transport",
    reward: "Red Bus Ticket",
    color: "#61d394",
    position: [3.05, 0.4, -0.8],
    intro: "A London gate turns slowly in the clouds, waiting for travel words.",
    bridgeHint: "Use place names, directions, and transport phrases.",
    clues: [
      {
        id: "london-place",
        object: "clock tower",
        prompt: "Name a place in London. Say: I can see Big Ben.",
        expected: "I can see Big Ben.",
        targetWords: ["see", "Big", "Ben"],
        fallbackChoice: "I can see Big Ben.",
        orbMood: "happy"
      },
      {
        id: "london-transport",
        object: "red bus cloud",
        prompt: "How can we travel? Say: We can go by bus.",
        expected: "We can go by bus.",
        targetWords: ["go", "bus"],
        fallbackChoice: "We can go by bus.",
        orbMood: "thinking"
      },
      {
        id: "london-direction",
        object: "wind arrow",
        prompt: "Give a direction. Say: Turn left at the gate.",
        expected: "Turn left at the gate.",
        targetWords: ["turn", "left", "gate"],
        fallbackChoice: "Turn left at the gate.",
        orbMood: "proud"
      }
    ]
  },
  {
    id: "storm-crown-citadel",
    order: 6,
    title: "Storm Crown Citadel",
    shortTitle: "Citadel",
    theme: "Final mystery and longer spoken answers",
    reward: "Storm Crown Key",
    color: "#b180ff",
    position: [4.85, 0.8, 0.4],
    intro: "The final island is loud and windy. The orb needs brave full sentences.",
    bridgeHint: "Use longer answers to solve the final mystery.",
    clues: [
      {
        id: "storm-problem",
        object: "storm crystal",
        prompt: "What is the problem? Say: The storm is hiding the crown.",
        expected: "The storm is hiding the crown.",
        targetWords: ["storm", "hiding", "crown"],
        fallbackChoice: "The storm is hiding the crown.",
        orbMood: "scared"
      },
      {
        id: "storm-plan",
        object: "golden lever",
        prompt: "Tell the orb your plan. Say: I will find three clues.",
        expected: "I will find three clues.",
        targetWords: ["will", "find", "clues"],
        fallbackChoice: "I will find three clues.",
        orbMood: "thinking"
      },
      {
        id: "storm-finale",
        object: "crown door",
        prompt: "Open the crown door with a brave sentence.",
        expected: "I am brave and I can solve the mystery.",
        targetWords: ["brave", "solve", "mystery"],
        fallbackChoice: "I am brave and I can solve the mystery.",
        orbMood: "proud"
      }
    ]
  }
];
