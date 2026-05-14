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

export const displayLearnerName = "ELI";
export const spokenLearnerName = "Ellie";

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
    id: "wake-the-dock",
    title: "Wake the Dock",
    storyBeat: "luma-introduction",
    storyPurpose: "ELI chooses to help Luma wake the sleepy harbor.",
    visibleProblem: "The floating dock is dim and still after the sky storm.",
    visualFocus: "Luma glow beside the dim dock",
    activeObject: "luma-memory",
    screenObject: "Luma glow beside the sleepy dock",
    objectKey: "luma-memory",
    answerType: "choice",
    lumaLine: "Will you help me wake it?",
    spokenLine: "Will you help me wake it?",
    displayPrompt: "Will you help me wake it?",
    spokenPrompt: "Will you help me wake it?",
    suggestedDisplayLine: "Yes, Luma.",
    suggestedSpokenLine: "Yes, Luma.",
    expectedAnswer: "Yes, Luma.",
    expectedSpokenAnswer: "Yes, Luma.",
    acceptedMeanings: ["yes", "yes luma", "i can help", "help", "eli", "ellie"],
    targetWords: ["yes", "help", "eli", "ellie"],
    successAnimation: "Luma smiles, the harbor shimmers and the first progress gem lights.",
    successLine: "Thank you, ELI. Let's look for the first clue.",
    successSpokenLine: "Thank you, Ellie. Let's look for the first clue.",
    gentleHint: "I heard you trying. You can say yes or help.",
    gentleClarifications: [
      "I heard you trying. You can say yes or help.",
      "Let's start together. Try yes, Luma."
    ],
    gentleClarificationsSpoken: [
      "I heard you trying. You can say yes or help.",
      "Let's start together. Try yes, Luma."
    ],
    supportInteraction: "Luma glows if the first audio gesture is required.",
    mood: "happy",
    rewardEvent: "dock-sparkle-wake",
    successAnimationKey: "harbor-shimmer"
  },
  {
    id: "light-the-lantern",
    title: "Light the Lantern",
    storyBeat: "sleepy-lantern",
    storyPurpose: "The lantern wakes and shows the blue clue.",
    visibleProblem: "The lantern is dark and its small clue mark is hidden.",
    visualFocus: "Sleepy lantern on the left side of the dock",
    activeObject: "lantern",
    screenObject: "A sleepy lantern on the dock",
    objectKey: "lantern",
    answerType: "problem-solving",
    lumaLine: "The lantern is asleep. It can show us the first clue. What should we do?",
    spokenLine: "The lantern is asleep. It can show us the first clue. What should we do?",
    displayPrompt: "The lantern is asleep. It can show us the first clue. What should we do?",
    spokenPrompt: "The lantern is asleep. It can show us the first clue. What should we do?",
    suggestedDisplayLine: "Light the lantern, please.",
    suggestedSpokenLine: "Light the lantern, please.",
    expectedAnswer: "Light the lantern.",
    targetWords: ["light", "lantern"],
    acceptedMeanings: ["light", "light lantern", "light the lantern", "open light please", "wake lantern", "wake the lantern"],
    bonusWords: ["please", "wake"],
    successAnimation: "The lantern glows warm gold and a blue symbol appears.",
    successLine: "The lantern shows blue. Remember blue, ELI.",
    successSpokenLine: "The lantern shows blue. Remember blue, Ellie.",
    gentleHint: "I heard you trying. Let's use the word light. Can you say light?",
    gentleClarifications: [
      "I heard you trying. Let's use the word light. Can you say light?",
      "The lantern needs light. Try light."
    ],
    gentleClarificationsSpoken: [
      "I heard you trying. Let's use the word light. Can you say light?",
      "The lantern needs light. Try light."
    ],
    supportInteraction: "Lantern pulses while it listens for light.",
    mood: "thinking",
    rewardEvent: "lantern-light",
    memorySet: { lanternColour: "blue" },
    successAnimationKey: "lantern-blue-symbol"
  },
  {
    id: "choose-blue-wind",
    title: "Choose Blue Wind",
    storyBeat: "choose-wind-colour",
    storyPurpose: "ELI uses the lantern clue to choose the wind color for the flag.",
    visibleProblem: "Three wind wisps appear, but only one matches the lantern clue.",
    visualFocus: "Folded flag and blue, red and yellow wind wisps",
    activeObject: "wind-wisps",
    screenObject: "Folded flag with blue, red and yellow wind ribbons",
    objectKey: "flag",
    answerType: "choice",
    lumaLine: "The lantern showed blue. Which wind should we use?",
    spokenLine: "The lantern showed blue. Which wind should we use?",
    displayPrompt: "The lantern showed blue. Which wind should we use?",
    spokenPrompt: "The lantern showed blue. Which wind should we use?",
    expectedAnswer: "Blue wind.",
    targetWords: ["blue"],
    acceptedMeanings: ["blue", "blue wind", "use blue", "the blue wind"],
    redirectMeanings: [
      {
        meaning: "red",
        displayLine: "That is a colour, yes. But the lantern showed blue. Let's choose blue.",
        spokenLine: "That is a colour, yes. But the lantern showed blue. Let's choose blue."
      },
      {
        meaning: "yellow",
        displayLine: "That is a colour, yes. But the lantern showed blue. Let's choose blue.",
        spokenLine: "That is a colour, yes. But the lantern showed blue. Let's choose blue."
      }
    ],
    successAnimation: "The blue wind flies to the flag, red and yellow fade, and the flag begins to wake.",
    successLine: "Blue wind! The flag is waking up.",
    successSpokenLine: "Blue wind! The flag is waking up.",
    gentleHint: "Let's look at the blue clue. Try blue.",
    gentleClarifications: [
      "Let's look at the blue clue. Try blue.",
      "The lantern showed blue. Which wind?"
    ],
    gentleClarificationsSpoken: [
      "Let's look at the blue clue. Try blue.",
      "The lantern showed blue. Which wind?"
    ],
    supportInteraction: "Blue, red and yellow wisps stay visible while ELI chooses.",
    mood: "thinking",
    rewardEvent: "flag-wind",
    memoryRead: "lanternColour",
    memorySet: { bridgeWindColour: "blue" },
    successAnimationKey: "blue-wind-to-flag"
  },
  {
    id: "read-flag-clue",
    title: "Read the Flag Clue",
    storyBeat: "flag-cloud-clue",
    storyPurpose: "The woken flag points ELI toward the cloud puffs.",
    visibleProblem: "The flag rises and points at three quiet cloud puffs.",
    visualFocus: "Raised flag pointing toward three cloud puffs",
    activeObject: "cloud-puffs",
    screenObject: "The flag points toward three cloud puffs.",
    objectKey: "cloud-puffs",
    answerType: "observation",
    lumaLine: "The flag is pointing at the clouds. What do you see?",
    spokenLine: "The flag is pointing at the clouds. What do you see?",
    displayPrompt: "The flag is pointing at the clouds. What do you see?",
    spokenPrompt: "The flag is pointing at the clouds. What do you see?",
    suggestedDisplayLine: "I see clouds.",
    suggestedSpokenLine: "I see clouds.",
    expectedAnswer: "I see clouds.",
    targetWords: ["clouds"],
    acceptedMeanings: ["clouds", "three clouds", "cloud puffs", "i see clouds", "three cloud puffs"],
    bonusWords: ["three", "see", "puffs"],
    successAnimation: "The cloud puffs wiggle and one cloud sparkles silver.",
    successLine: "One cloud is shiny. Maybe something is hiding there.",
    successSpokenLine: "One cloud is shiny. Maybe something is hiding there.",
    gentleHint: "Look where the flag points. Try clouds.",
    gentleClarifications: [
      "Look where the flag points. Try clouds.",
      "I see three cloud puffs. Can you say clouds?"
    ],
    gentleClarificationsSpoken: [
      "Look where the flag points. Try clouds.",
      "I see three cloud puffs. Can you say clouds?"
    ],
    supportInteraction: "Cloud puffs wiggle after ELI notices them.",
    mood: "surprised",
    rewardEvent: "cloud-puffs-wiggle",
    successAnimationKey: "silver-cloud-sparkle"
  },
  {
    id: "find-silver-key",
    title: "Find the Silver Key",
    storyBeat: "find-silver-key",
    storyPurpose: "ELI uses the silver sparkle clue to find the hidden key.",
    visibleProblem: "Three cloud puffs are visible and one cloud sparkles silver.",
    visualFocus: "Three cloud puffs with one silver sparkle",
    activeObject: "shiny-cloud",
    screenObject: "Three cloud puffs float above the dock; one shiny cloud hides a key.",
    objectKey: "silver-key",
    answerType: "choice",
    lumaLine: "Which cloud has the key?",
    spokenLine: "Which cloud has the key?",
    displayPrompt: "Which cloud has the key?",
    spokenPrompt: "Which cloud has the key?",
    suggestedDisplayLine: "The shiny cloud.",
    suggestedSpokenLine: "The shiny cloud.",
    expectedAnswer: "The shiny cloud.",
    targetWords: ["shiny", "key"],
    acceptedMeanings: ["silver", "shiny", "silver cloud", "the shiny cloud", "key", "shiny cloud"],
    bonusWords: ["cloud"],
    successAnimation: "The silver key appears and floats to the gate.",
    successLine: "We found the silver key. Now the gate can listen.",
    successSpokenLine: "We found the silver key. Now the gate can listen.",
    gentleHint: "Look for the shiny cloud. Try shiny.",
    gentleClarifications: [
      "Look for the shiny cloud. Try shiny.",
      "One cloud is silver. Which cloud has the key?"
    ],
    gentleClarificationsSpoken: [
      "Look for the shiny cloud. Try shiny.",
      "One cloud is silver. Which cloud has the key?"
    ],
    supportInteraction: "ELI may tap the shiny cloud after or during the answer.",
    supportTap: true,
    mood: "thinking",
    rewardEvent: "silver-key",
    memorySet: { gateKey: "silver" },
    successAnimationKey: "key-to-gate"
  },
  {
    id: "mix-breeze-potion",
    title: "Mix the Breeze Potion",
    storyBeat: "mix-breeze-potion",
    storyPurpose: "ELI remembers the blue clue and mixes the breeze potion.",
    visibleProblem: "The potion bowl waits beside blue, red and yellow drops.",
    visualFocus: "Potion bowl with blue, red and yellow droplets",
    activeObject: "potion",
    screenObject: "A tiny potion bowl with blue rain, red fire and yellow sun drops",
    objectKey: "potion",
    answerType: "memory",
    lumaLine: "The potion needs the colour from the lantern. Do you remember the colour?",
    spokenLine: "The potion needs the colour from the lantern. Do you remember the colour?",
    displayPrompt: "The potion needs the colour from the lantern. Do you remember the colour?",
    spokenPrompt: "The potion needs the colour from the lantern. Do you remember the colour?",
    expectedAnswer: "Blue.",
    targetWords: ["blue"],
    acceptedMeanings: ["blue", "blue drop", "blue rain", "the blue drop"],
    bonusWords: ["drop", "rain"],
    successAnimation: "The blue drop falls into the bowl and the potion glows blue.",
    successLine: "Yes, blue again. The breeze potion is ready.",
    successSpokenLine: "Yes, blue again. The breeze potion is ready.",
    gentleHint: "The lantern showed blue. Try blue.",
    gentleClarifications: [
      "The lantern showed blue. Try blue.",
      "Remember the lantern clue. It was blue."
    ],
    gentleClarificationsSpoken: [
      "The lantern showed blue. Try blue.",
      "Remember the lantern clue. It was blue."
    ],
    supportInteraction: "Blue, red and yellow drops remain visible while ELI remembers.",
    mood: "thinking",
    rewardEvent: "blue-potion",
    memoryRead: "bridgeWindColour",
    memoryRequired: { bridgeWindColour: "blue" },
    successAnimationKey: "blue-drop-potion"
  },
  {
    id: "open-cloud-gate",
    title: "Open the Cloud Gate",
    storyBeat: "open-cloud-gate",
    storyPurpose: "ELI uses the ready key and potion to open the cloud gate.",
    visibleProblem: "The cloud gate is closed, with the key and blue potion beside it.",
    visualFocus: "Cloud gate on the right with the silver key nearby",
    activeObject: "gate",
    screenObject: "A small cloud gate blocks the dock path.",
    objectKey: "gate",
    answerType: "choice",
    lumaLine: "The key is ready and the potion is ready. Should we open the gate?",
    spokenLine: "The key is ready and the potion is ready. Should we open the gate?",
    displayPrompt: "The key is ready and the potion is ready. Should we open the gate?",
    spokenPrompt: "The key is ready and the potion is ready. Should we open the gate?",
    expectedAnswer: "Open the gate.",
    targetWords: ["open", "gate"],
    acceptedMeanings: ["yes", "open gate", "open the gate", "please open", "open please"],
    bonusWords: ["please", "key", "silver"],
    successAnimation: "The key turns, the potion swirls and the cloud gate opens.",
    successLine: "The gate is open. I can feel the bridge.",
    successSpokenLine: "The gate is open. I can feel the bridge.",
    gentleHint: "I heard you trying. You can say yes or open gate.",
    gentleClarifications: [
      "I heard you trying. You can say yes or open gate.",
      "The key is ready. Try open the gate."
    ],
    gentleClarificationsSpoken: [
      "I heard you trying. You can say yes or open gate.",
      "The key is ready. Try open the gate."
    ],
    supportInteraction: "The key and potion glow beside the gate.",
    mood: "happy",
    rewardEvent: "gate-open",
    memoryRead: "gateKey",
    successAnimationKey: "gate-open-swirl"
  },
  {
    id: "build-first-bridge",
    title: "Build the First Bridge",
    storyBeat: "build-first-bridge",
    storyPurpose: "ELI asks the bridge to connect and opens the route to Breakfast Breeze.",
    visibleProblem: "Broken bridge pieces float beside a soft bridge outline.",
    visualFocus: "Broken bridge pieces, blue wind, lantern light and flag",
    activeObject: "bridge-pieces",
    screenObject: "Broken bridge pieces float near the edge of the dock.",
    objectKey: "bridge-pieces",
    answerType: "confidence",
    lumaLine: "The bridge needs brave words. Are you ready for the next island?",
    spokenLine: "The bridge needs brave words. Are you ready for the next island?",
    displayPrompt: "The bridge needs brave words. Are you ready for the next island?",
    spokenPrompt: "The bridge needs brave words. Are you ready for the next island?",
    expectedAnswer: "I am ready for the next island.",
    targetWords: ["ready", "next", "island"],
    acceptedMeanings: ["ready", "yes", "i am ready", "next island", "i am ready for the next island"],
    successAnimation: "Bridge pieces connect, the Cloud Compass appears and all progress gems glow.",
    successLine: "You did it, ELI. Cloud Harbor is awake.",
    successSpokenLine: "You did it, Ellie. Cloud Harbor is awake.",
    rewardDisplayLine: "ELI earned the Cloud Compass.",
    gentleHint: "The bridge needs ready. Try ready.",
    gentleClarifications: [
      "The bridge needs ready. Try ready.",
      "Are you ready for the next island?"
    ],
    gentleClarificationsSpoken: [
      "The bridge needs ready. Try ready.",
      "Are you ready for the next island?"
    ],
    supportInteraction: "The bridge outline brightens while ELI answers.",
    mood: "proud",
    rewardEvent: "bridge-ready",
    successAnimationKey: "bridge-build-compass"
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

const schoolStarObservatoryTasks = [
  {
    id: "open-the-observatory-dome",
    title: "Open the Observatory Dome",
    screenObject: "closed dome roof with moon latch",
    objectKey: "observatory-dome",
    lumaLine: "The stars cannot come in. Say: Open the star roof, please.",
    expectedAnswer: "Open the star roof, please.",
    targetWords: ["open", "star", "roof", "please"],
    successAnimation: "Dome petals open and stars drift in.",
    gentleHint: "Ask the star roof to open.",
    mood: "thinking",
    rewardEvent: "dome-open"
  },
  {
    id: "wake-the-blue-telescope",
    title: "Wake the Blue Telescope",
    screenObject: "large blue telescope looking down",
    objectKey: "blue-telescope",
    lumaLine: "The telescope is looking the wrong way. Say: Telescope, find the English star.",
    expectedAnswer: "Telescope, find the English star.",
    targetWords: ["telescope", "English", "star"],
    successAnimation: "Telescope turns toward a bright English star.",
    gentleHint: "Say English star.",
    mood: "happy",
    rewardEvent: "telescope-wake"
  },
  {
    id: "set-the-star-clock",
    title: "Set the Star Clock",
    screenObject: "floating clock with missing number nine",
    objectKey: "star-clock",
    lumaLine: "The star clock is lost. Say: School starts at nine.",
    expectedAnswer: "School starts at nine.",
    targetWords: ["school", "starts", "nine"],
    successAnimation: "Number nine pops into the clock and bells sparkle.",
    gentleHint: "Use school, starts and nine.",
    mood: "thinking",
    rewardEvent: "clock-nine"
  },
  {
    id: "pack-the-magic-bag",
    title: "Pack the Magic Bag",
    screenObject: "open school bag with book, pencil and star",
    objectKey: "magic-bag",
    lumaLine: "The bag needs one book. Say: Put the book in my bag.",
    expectedAnswer: "Put the book in my bag.",
    targetWords: ["put", "book", "bag"],
    successAnimation: "Book jumps into the bag and the bag grows tiny wings.",
    gentleHint: "Say book in my bag.",
    mood: "surprised",
    rewardEvent: "book-packed"
  },
  {
    id: "find-the-pencil-star",
    title: "Find the Pencil Star",
    screenObject: "pencil-shaped star hiding behind a cloud desk",
    objectKey: "pencil-star",
    lumaLine: "Tell Luma where it is. Say: The pencil is behind the cloud.",
    expectedAnswer: "The pencil is behind the cloud.",
    targetWords: ["pencil", "behind", "cloud"],
    successAnimation: "Cloud desk moves aside and pencil star flies to the board.",
    gentleHint: "Use behind the cloud.",
    mood: "thinking",
    rewardEvent: "pencil-found"
  },
  {
    id: "draw-the-star-path",
    title: "Draw the Star Path",
    screenObject: "sky blackboard with dotted route",
    objectKey: "star-path-board",
    lumaLine: "Help me draw the path. Say: Draw a line to the star.",
    expectedAnswer: "Draw a line to the star.",
    targetWords: ["draw", "line", "star"],
    successAnimation: "Glowing line draws itself across the board.",
    gentleHint: "Say draw a line.",
    mood: "happy",
    rewardEvent: "path-drawn"
  },
  {
    id: "shine-the-star-map-lens",
    title: "Shine the Star Map Lens",
    screenObject: "lens covered in grey dust",
    objectKey: "star-map-lens",
    lumaLine: "Clean it with words. Say: The lens is shiny now.",
    expectedAnswer: "The lens is shiny now.",
    targetWords: ["lens", "shiny", "now"],
    successAnimation: "Dust blows away and the lens sends a beam to the sky.",
    gentleHint: "Say shiny lens.",
    mood: "surprised",
    rewardEvent: "lens-shine"
  },
  {
    id: "read-the-star-clue",
    title: "Read the Star Clue",
    screenObject: "star clue floating above the telescope",
    objectKey: "star-clue",
    lumaLine: "Read the clue with me. Say: The next island is singing.",
    expectedAnswer: "The next island is singing.",
    targetWords: ["next", "island", "singing"],
    successAnimation: "Star clue turns into a music note bridge signal.",
    gentleHint: "Say next island singing.",
    mood: "proud",
    rewardEvent: "music-bridge-signal"
  }
];

const rhythmCloudStageTasks = [
  {
    id: "turn-on-the-stage-lights",
    title: "Turn On the Stage Lights",
    screenObject: "four sleepy stage lights",
    objectKey: "stage-lights",
    lumaLine: "The show needs light. Say: Lights on, please.",
    expectedAnswer: "Lights on, please.",
    targetWords: ["lights", "on", "please"],
    successAnimation: "Lights pop on one at a time.",
    gentleHint: "Say lights on, please.",
    mood: "thinking",
    rewardEvent: "stage-lights-on"
  },
  {
    id: "wake-the-microphone",
    title: "Wake the Microphone",
    screenObject: "glowing microphone with closed eyes",
    objectKey: "glowing-microphone",
    lumaLine: "Tell the mic what you can do. Say: I can sing.",
    expectedAnswer: "I can sing.",
    targetWords: ["can", "sing"],
    successAnimation: "Microphone wakes and sends a sound ripple.",
    gentleHint: "Say I can sing.",
    mood: "happy",
    rewardEvent: "microphone-awake"
  },
  {
    id: "clap-the-cloud-beat",
    title: "Clap the Cloud Beat",
    screenObject: "three rhythm pads on the floor",
    objectKey: "rhythm-pads",
    lumaLine: "Make a tiny beat. Say: I can clap the beat.",
    expectedAnswer: "I can clap the beat.",
    targetWords: ["can", "clap", "beat"],
    successAnimation: "Rhythm pads bounce in sequence.",
    gentleHint: "Use clap and beat.",
    mood: "happy",
    rewardEvent: "cloud-beat"
  },
  {
    id: "find-the-guitar-cloud",
    title: "Find the Guitar Cloud",
    screenObject: "guitar-shaped cloud hiding behind curtains",
    objectKey: "guitar-cloud",
    lumaLine: "Tell me the dance clue. Say: I like dancing.",
    expectedAnswer: "I like dancing.",
    targetWords: ["like", "dancing"],
    successAnimation: "Curtain opens and guitar cloud strums itself.",
    gentleHint: "Say I like dancing.",
    mood: "surprised",
    rewardEvent: "guitar-cloud-found"
  },
  {
    id: "help-the-shy-thunder-puff",
    title: "Help the Shy Thunder Puff",
    screenObject: "small purple thunder puff behind a speaker",
    objectKey: "thunder-puff",
    lumaLine: "Make it feel safe. Say: You can join the show.",
    expectedAnswer: "You can join the show.",
    targetWords: ["join", "show"],
    successAnimation: "Thunder puff smiles and joins the stage.",
    gentleHint: "Say join the show.",
    mood: "thinking",
    rewardEvent: "thunder-puff-joins"
  },
  {
    id: "start-the-tiny-show",
    title: "Start the Tiny Show",
    screenObject: "curtain star waiting above the stage",
    objectKey: "curtain-star",
    lumaLine: "Start the show with kind words. Say: Welcome to my show.",
    expectedAnswer: "Welcome to my show.",
    targetWords: ["welcome", "show"],
    successAnimation: "Curtain star bursts into confetti.",
    gentleHint: "Say welcome to my show.",
    mood: "proud",
    rewardEvent: "tiny-show-start"
  },
  {
    id: "play-the-thunder-drum",
    title: "Play the Thunder Drum",
    screenObject: "round drum with cloud bolts",
    objectKey: "thunder-drum",
    lumaLine: "Play the magic drum. Say: Boom, boom, make a bridge.",
    expectedAnswer: "Boom, boom, make a bridge.",
    targetWords: ["boom", "make", "bridge"],
    successAnimation: "Drum beats create bridge-shaped sound waves.",
    gentleHint: "Say make a bridge.",
    mood: "surprised",
    rewardEvent: "thunder-drum-bridge"
  },
  {
    id: "sing-to-the-wind-gate",
    title: "Sing to the Wind Gate",
    screenObject: "musical wind gate at the back of the stage",
    objectKey: "musical-wind-gate",
    lumaLine: "One last line for the gate. Say: The song shows the way.",
    expectedAnswer: "The song shows the way.",
    targetWords: ["song", "shows", "way"],
    successAnimation: "Music notes fly into the map route.",
    gentleHint: "Say song shows the way.",
    mood: "proud",
    rewardEvent: "song-route"
  }
];

const londonWindGateTasks = [
  {
    id: "open-the-london-window",
    title: "Open the London Window",
    screenObject: "round window filled with fog",
    objectKey: "london-window",
    lumaLine: "The fog is hiding a place. Say: I can see London.",
    expectedAnswer: "I can see London.",
    targetWords: ["see", "London"],
    successAnimation: "Fog clears and the skyline appears.",
    gentleHint: "Say I can see London.",
    mood: "thinking",
    rewardEvent: "london-window-clear"
  },
  {
    id: "wake-big-ben",
    title: "Wake Big Ben",
    screenObject: "cute clock tower with sleepy clock face",
    objectKey: "big-ben-tower",
    lumaLine: "Name the tower clue. Say: I can see Big Ben.",
    expectedAnswer: "I can see Big Ben.",
    targetWords: ["see", "Big", "Ben"],
    successAnimation: "Clock hands spin and ring softly.",
    gentleHint: "Say Big Ben.",
    mood: "happy",
    rewardEvent: "big-ben-wake"
  },
  {
    id: "fix-the-red-bus-cloud",
    title: "Fix the Red Bus Cloud",
    screenObject: "red bus with one missing wheel cloud",
    objectKey: "red-bus-cloud",
    lumaLine: "Tell the bus how we travel. Say: We can go by bus.",
    expectedAnswer: "We can go by bus.",
    targetWords: ["go", "bus"],
    successAnimation: "Missing wheel cloud pops back on.",
    gentleHint: "Say go by bus.",
    mood: "thinking",
    rewardEvent: "red-bus-fixed"
  },
  {
    id: "find-the-ticket-booth",
    title: "Find the Ticket Booth",
    screenObject: "tiny ticket booth behind a wind swirl",
    objectKey: "ticket-booth",
    lumaLine: "Ask for a ticket kindly. Say: A ticket, please.",
    expectedAnswer: "A ticket, please.",
    targetWords: ["ticket", "please"],
    successAnimation: "Ticket booth opens and a red ticket glows.",
    gentleHint: "Say ticket, please.",
    mood: "happy",
    rewardEvent: "ticket-booth-open"
  },
  {
    id: "turn-left-at-the-gate",
    title: "Turn Left at the Gate",
    screenObject: "wind arrow pointing left and right",
    objectKey: "wind-arrows",
    lumaLine: "Follow the arrow. Say: Turn left at the gate.",
    expectedAnswer: "Turn left at the gate.",
    targetWords: ["turn", "left", "gate"],
    successAnimation: "Left arrow lights and the path rotates.",
    gentleHint: "Use turn left.",
    mood: "surprised",
    rewardEvent: "left-gate-turn"
  },
  {
    id: "cross-the-river-ribbon",
    title: "Cross the River Ribbon",
    screenObject: "blue river ribbon between clouds",
    objectKey: "river-ribbon",
    lumaLine: "Tell Luma where to go. Say: Go over the river.",
    expectedAnswer: "Go over the river.",
    targetWords: ["go", "over", "river"],
    successAnimation: "Small cloud bridge crosses the river ribbon.",
    gentleHint: "Say over the river.",
    mood: "thinking",
    rewardEvent: "river-bridge-cross"
  },
  {
    id: "stamp-the-red-bus-ticket",
    title: "Stamp the Red Bus Ticket",
    screenObject: "ticket stamp machine with star stamp",
    objectKey: "ticket-stamp",
    lumaLine: "Make the ticket ready. Say: Stamp the ticket, please.",
    expectedAnswer: "Stamp the ticket, please.",
    targetWords: ["stamp", "ticket", "please"],
    successAnimation: "Star stamp lands on the ticket with sparkles.",
    gentleHint: "Say stamp the ticket.",
    mood: "proud",
    rewardEvent: "red-ticket-stamped"
  },
  {
    id: "open-the-wind-gate",
    title: "Open the Wind Gate",
    screenObject: "tall gate with London wind symbols",
    objectKey: "london-wind-gate",
    lumaLine: "Use your travel spell. Say: London wind, open the way.",
    expectedAnswer: "London wind, open the way.",
    targetWords: ["London", "wind", "open", "way"],
    successAnimation: "Gate opens and shows the storm citadel far away.",
    gentleHint: "Say London wind, open the way.",
    mood: "proud",
    rewardEvent: "storm-route-open"
  }
];

const stormCrownCitadelTasks = [
  {
    id: "name-the-storm-problem",
    title: "Name the Storm Problem",
    screenObject: "Storm crystal covering the crown symbol",
    objectKey: "storm-crystal",
    lumaLine: "Tell me the problem. Say: The storm is hiding the crown.",
    expectedAnswer: "The storm is hiding the crown.",
    targetWords: ["storm", "hiding", "crown"],
    successAnimation: "Storm crystal shakes and becomes transparent.",
    gentleHint: "Use storm, hiding and crown.",
    mood: "thinking",
    rewardEvent: "storm-crystal-clear"
  },
  {
    id: "use-the-cloud-compass",
    title: "Use the Cloud Compass",
    screenObject: "Cloud Compass pedestal spinning wildly",
    objectKey: "cloud-compass-pedestal",
    lumaLine: "The compass is confused. Say: Compass, show the way.",
    expectedAnswer: "Compass, show the way.",
    targetWords: ["compass", "show", "way"],
    successAnimation: "Compass points to the crown door.",
    gentleHint: "Say compass, show the way.",
    mood: "thinking",
    rewardEvent: "compass-points"
  },
  {
    id: "share-the-sunberry-basket",
    title: "Share the Sunberry Basket",
    screenObject: "Basket pedestal beside a hungry storm puff",
    objectKey: "sunberry-basket-pedestal",
    lumaLine: "The puff needs kindness. Say: Here is a sunberry.",
    expectedAnswer: "Here is a sunberry.",
    targetWords: ["sunberry"],
    successAnimation: "Storm puff eats and changes from grey to gold.",
    gentleHint: "Say sunberry.",
    mood: "happy",
    rewardEvent: "sunberry-kindness"
  },
  {
    id: "shine-the-star-map-lens",
    title: "Shine the Star Map Lens",
    screenObject: "Star lens aimed at the wrong wall",
    objectKey: "star-lens-pedestal",
    lumaLine: "Aim the lens. Say: Shine on the door.",
    expectedAnswer: "Shine on the door.",
    targetWords: ["shine", "door"],
    successAnimation: "Lens beam reveals crown runes.",
    gentleHint: "Say shine on the door.",
    mood: "surprised",
    rewardEvent: "crown-runes"
  },
  {
    id: "beat-the-thunder-drum",
    title: "Beat the Thunder Drum",
    screenObject: "Thunder drum waiting on a floating stone",
    objectKey: "thunder-drum-pedestal",
    lumaLine: "Make a brave beat. Say: The drum is strong.",
    expectedAnswer: "The drum is strong.",
    targetWords: ["drum", "strong"],
    successAnimation: "Drum pulse clears dark clouds.",
    gentleHint: "Say drum is strong.",
    mood: "proud",
    rewardEvent: "drum-clears-clouds"
  },
  {
    id: "use-the-red-bus-ticket",
    title: "Use the Red Bus Ticket",
    screenObject: "Tiny red bus route across the storm",
    objectKey: "red-bus-route",
    lumaLine: "Tell the route what we will do. Say: We will go to the crown.",
    expectedAnswer: "We will go to the crown.",
    targetWords: ["will", "go", "crown"],
    successAnimation: "Bus route lights and carries a sparkle to the door.",
    gentleHint: "Use will, go and crown.",
    mood: "happy",
    rewardEvent: "bus-route-crown"
  },
  {
    id: "pull-the-golden-lever",
    title: "Pull the Golden Lever",
    screenObject: "Golden lever beside the Crown Door",
    objectKey: "golden-lever",
    lumaLine: "Tell me your plan. Say: I will find the last clue.",
    expectedAnswer: "I will find the last clue.",
    targetWords: ["will", "find", "clue"],
    successAnimation: "Lever lowers and Luma's memory star appears.",
    gentleHint: "Say I will find the clue.",
    mood: "thinking",
    rewardEvent: "memory-star"
  },
  {
    id: "open-the-crown-door",
    title: "Open the Crown Door",
    screenObject: "Huge Crown Door with all rewards glowing",
    objectKey: "crown-door",
    lumaLine: "Use your brave sentence. Say: I am brave and I can solve the mystery.",
    expectedAnswer: "I am brave and I can solve the mystery.",
    targetWords: ["brave", "can", "solve", "mystery"],
    successAnimation: "Door opens, bridge network glows and Sky Islands celebration begins.",
    gentleHint: "Say brave, solve mystery.",
    mood: "proud",
    rewardEvent: "sky-islands-complete"
  }
];

const skyLevels = [
  {
    id: "cloud-harbor",
    order: 1,
    title: "Cloud Harbor",
    subtitle: "The Sleeping Dock",
    shortTitle: "Harbor",
    reward: "Cloud Compass",
    sceneType: "sky-dock",
    implementationStatus: "playable",
    color: "#6fd2ff",
    position: skyIslandPositions[0],
    intro: "Luma and ELI wake the floating harbor and open the first sky bridge.",
    storyGoal: "Wake Cloud Harbor and open the first bridge.",
    storyIntro: {
      displayText: "Hello, ELI. I am Luma. I was sleeping in this little sky harbour. The storm hid the first bridge. Will you help me wake it?",
      spokenText: "Hello, Ellie. I am Luma. I was sleeping in this little sky harbour. The storm hid the first bridge. Will you help me wake it?",
      followUpDisplayText: "Your voice can wake the harbour. We will solve the dock clues in order.",
      followUpSpokenText: "Your voice can wake the harbour. We will solve the dock clues in order."
    },
    storyMemory: {
      lanternColour: null,
      gateKey: null,
      bridgeWindColour: null
    },
    backgroundPlate: "/assets/v2/backgrounds/cloud-harbor-sleeping-dock-mobile.webp",
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
    implementationStatus: "playable",
    color: "#8a8dff",
    position: skyIslandPositions[2],
    intro: "The school stars are asleep inside a glass observatory. Help Eli repair the Star Map Lens.",
    tasks: schoolStarObservatoryTasks
  },
  {
    id: "rhythm-cloud-stage",
    order: 4,
    title: "Rhythm Cloud Stage",
    shortTitle: "Rhythm",
    reward: "Thunder Drum",
    sceneType: "cloud-stage",
    implementationStatus: "playable",
    color: "#ff83c6",
    position: skyIslandPositions[3],
    intro: "The clouds have forgotten their song. Help Eli wake the cute cloud concert.",
    tasks: rhythmCloudStageTasks
  },
  {
    id: "london-wind-gate",
    order: 5,
    title: "London Wind Gate",
    shortTitle: "London Gate",
    reward: "Red Bus Ticket",
    sceneType: "london-gate",
    implementationStatus: "playable",
    color: "#ff6b6b",
    position: skyIslandPositions[4],
    intro: "A magical London gate spins in the clouds. Follow the travel clues to find the Red Bus Ticket.",
    tasks: londonWindGateTasks
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
    tasks: stormCrownCitadelTasks
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
