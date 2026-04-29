export const learnerProfile = {
  learnerName: "Eli",
  displayName: "Eli",
  spokenName: "Ellie",
  age: 10,
  city: "Zagreb",
  country: "Croatia",
  l1: "Croatian",
  level: "CEFR A1 moving toward A1+",
  keyPeople: [
    { label: "Mum", name: "Mia", pronunciation: "MEE-ya" },
    { label: "Uncle", name: "Dali", pronunciation: "DAH-lee" }
  ],
  interests: ["singing", "hip hop dancing", "London", "Bjelovar", "Maths", "Music", "Informatics"],
  favouriteFoods: ["lasagne", "pizza", "juhica", "cake"],
  pronunciationNotes: {
    Eli: "Eli",
    Ellie: "ELL-ee",
    Zagreb: "ZAH-greb",
    Bjelovar: "BYEH-lo-var",
    juhica: "YOO-hee-tsa, grandma’s soup"
  },
  safetyNotes: [
    "Do not mention family separation.",
    "Do not tease about crushes.",
    "Keep feedback warm, light, and confidence-building."
  ]
};

export const gameConfig = {
  title: "Eli’s English Quest",
  subtitle: "A magic English quest with stars, games, and happy guesses.",
  starThresholds: {
    one: 0.45,
    two: 0.7,
    three: 0.9
  },
  progression: {
    minimumModes: 3,
    minimumStars: 8
  },
  storageKey: "ellie-english-quest-progress-v1"
};

export const rewardMilestones = [
  {
    stars: 10,
    title: "Magic Egg",
    icon: "🥚",
    description: "A little magic starts here."
  },
  {
    stars: 20,
    title: "Magic Feather",
    icon: "🪶",
    description: "Light as a brave word."
  },
  {
    stars: 30,
    title: "Magic Potion",
    icon: "🧪",
    description: "A sip of smart English."
  },
  {
    stars: 40,
    title: "Magic Wand",
    icon: "🪄",
    description: "Tap, say, and shine."
  },
  {
    stars: 50,
    title: "Crown",
    icon: "👑",
    description: "Quest queen energy."
  }
];

export const levels = [
  {
    id: "room-castle",
    order: 1,
    icon: "🏰",
    title: "Room Castle",
    topic: "My room and house",
    personalHook: "Help Eli decorate a cosy room.",
    microTarget: "Use there is / there are with room words.",
    unlockHint: "Start here.",
    vocabulary: [
      ["bed", "krevet"],
      ["blanket", "dekica"],
      ["pillow", "jastuk"],
      ["door", "vrata"],
      ["window", "prozor"],
      ["chair", "stolica"],
      ["lamp", "lampa"],
      ["wardrobe", "ormar"]
    ],
    quiz: [
      { prompt: "What is a blanket?", options: ["dekica", "prozor", "stolica"], correct: "dekica", explain: "Blanket means dekica." },
      { prompt: "Choose the best sentence.", options: ["There is a bed.", "There are a bed.", "A bed there."], correct: "There is a bed.", explain: "One bed: There is a bed." },
      { prompt: "Where can a pillow be?", options: ["on the bed", "in the sky", "under the school"], correct: "on the bed", explain: "A pillow is usually on the bed." },
      { prompt: "What is window in Croatian?", options: ["prozor", "ormar", "vrata"], correct: "prozor", explain: "Window means prozor." },
      { prompt: "Choose the correct word: There ___ two chairs.", options: ["is", "are", "am"], correct: "are", explain: "Two chairs: There are." },
      { prompt: "Which thing gives light?", options: ["lamp", "blanket", "door"], correct: "lamp", explain: "A lamp gives light." }
    ],
    memoryPairs: [
      { english: "bed", croatian: "krevet" },
      { english: "blanket", croatian: "dekica" },
      { english: "window", croatian: "prozor" },
      { english: "chair", croatian: "stolica" },
      { english: "door", croatian: "vrata" },
      { english: "wardrobe", croatian: "ormar" }
    ],
    pictureItems: [
      { emoji: "🛏️", word: "bed", support: "krevet", options: ["bed", "lamp", "door"] },
      { emoji: "🧺", word: "blanket", support: "dekica", options: ["blanket", "chair", "window"] },
      { emoji: "🪟", word: "window", support: "prozor", options: ["window", "pillow", "wardrobe"] },
      { emoji: "🪑", word: "chair", support: "stolica", options: ["chair", "bed", "lamp"] },
      { emoji: "🚪", word: "door", support: "vrata", options: ["door", "blanket", "window"] },
      { emoji: "💡", word: "lamp", support: "lampa", options: ["lamp", "chair", "pillow"] }
    ],
    speakPrompts: [
      { say: "There is a blanket on my bed.", targetWords: ["blanket", "bed"] },
      { say: "There is a window in my room.", targetWords: ["window", "room"] },
      { say: "There are two chairs.", targetWords: ["two", "chairs"] }
    ],
    buildSentences: [
      ["There", "is", "a", "bed"],
      ["There", "is", "a", "blanket"],
      ["There", "are", "two", "chairs"]
    ]
  },
  {
    id: "breakfast-cafe",
    order: 2,
    icon: "🥐",
    title: "Breakfast Café",
    topic: "Food and breakfast",
    personalHook: "Make breakfast for Eli, Mum Mia, and Uncle Dali.",
    microTarget: "Use I like / I don’t like and For breakfast I have.",
    unlockHint: "Earn stars in Room Castle.",
    vocabulary: [
      ["eggs", "jaja"],
      ["bread", "kruh"],
      ["cheese", "sir"],
      ["milk", "mlijeko"],
      ["juice", "sok"],
      ["cereal", "pahuljice"],
      ["juhica", "grandma’s soup"],
      ["cake", "kolač"]
    ],
    quiz: [
      { prompt: "What can you drink?", options: ["milk", "chair", "window"], correct: "milk", explain: "Milk is a drink." },
      { prompt: "Choose the best sentence.", options: ["For breakfast I have eggs.", "For breakfast I has eggs.", "Breakfast eggs I."], correct: "For breakfast I have eggs.", explain: "Good A1 sentence." },
      { prompt: "What is cereal?", options: ["pahuljice", "vrata", "predmet"], correct: "pahuljice", explain: "Cereal means pahuljice." },
      { prompt: "Which food does Eli like?", options: ["pizza", "wardrobe", "tram"], correct: "pizza", explain: "Pizza is a food." },
      { prompt: "What is juhica?", options: ["grandma’s soup", "a school bag", "a train"], correct: "grandma’s soup", explain: "Juhica is grandma’s soup." },
      { prompt: "Choose the correct sentence.", options: ["I like cake.", "I likes cake.", "Cake like I."], correct: "I like cake.", explain: "Say: I like cake." }
    ],
    memoryPairs: [
      { english: "eggs", croatian: "jaja" },
      { english: "bread", croatian: "kruh" },
      { english: "cheese", croatian: "sir" },
      { english: "milk", croatian: "mlijeko" },
      { english: "juice", croatian: "sok" },
      { english: "cereal", croatian: "pahuljice" }
    ],
    pictureItems: [
      { emoji: "🥚", word: "eggs", support: "jaja", options: ["eggs", "juice", "cake"] },
      { emoji: "🍞", word: "bread", support: "kruh", options: ["bread", "milk", "cheese"] },
      { emoji: "🧀", word: "cheese", support: "sir", options: ["cheese", "cereal", "eggs"] },
      { emoji: "🥛", word: "milk", support: "mlijeko", options: ["milk", "bread", "cake"] },
      { emoji: "🧃", word: "juice", support: "sok", options: ["juice", "cheese", "juhica"] },
      { emoji: "🥣", word: "cereal", support: "pahuljice", options: ["cereal", "milk", "bread"] }
    ],
    speakPrompts: [
      { say: "For breakfast I have bread.", targetWords: ["breakfast", "bread"] },
      { say: "I like pizza.", targetWords: ["like", "pizza"] },
      { say: "I drink milk.", targetWords: ["drink", "milk"] }
    ],
    buildSentences: [
      ["I", "like", "pizza"],
      ["For", "breakfast", "I", "have", "eggs"],
      ["I", "drink", "milk"]
    ]
  },
  {
    id: "school-stars",
    order: 3,
    icon: "📚",
    title: "School Stars",
    topic: "School and subjects",
    personalHook: "Practise favourite subjects: Maths, Music, and Informatics.",
    microTarget: "Understand subject = predmet; use My favourite subject is.",
    unlockHint: "Earn stars in Breakfast Café.",
    vocabulary: [
      ["subject", "predmet"],
      ["maths", "matematika"],
      ["music", "glazbeni"],
      ["informatics", "informatika"],
      ["teacher", "učiteljica"],
      ["classroom", "učionica"],
      ["desk", "klupa"],
      ["board", "ploča"]
    ],
    quiz: [
      { prompt: "What is a subject?", options: ["a class at school", "a food", "a blanket"], correct: "a class at school", explain: "Subject means predmet." },
      { prompt: "Which is a school subject?", options: ["Maths", "pizza", "lamp"], correct: "Maths", explain: "Maths is a subject." },
      { prompt: "Choose the best sentence.", options: ["My favourite subject is Music.", "My subject favourite is Music.", "Music favourite my."], correct: "My favourite subject is Music.", explain: "Good sentence." },
      { prompt: "Informatics is about…", options: ["computers", "blankets", "bread"], correct: "computers", explain: "Informatics is computer class." },
      { prompt: "What does teacher mean?", options: ["učiteljica", "prozor", "pahuljice"], correct: "učiteljica", explain: "Teacher means učiteljica." },
      { prompt: "Choose the correct day sentence.", options: ["I have English on Monday.", "I have English in Monday.", "I English Monday."], correct: "I have English on Monday.", explain: "Say: on Monday." }
    ],
    memoryPairs: [
      { english: "subject", croatian: "predmet" },
      { english: "maths", croatian: "matematika" },
      { english: "music", croatian: "glazbeni" },
      { english: "informatics", croatian: "informatika" },
      { english: "teacher", croatian: "učiteljica" },
      { english: "classroom", croatian: "učionica" }
    ],
    pictureItems: [
      { emoji: "📘", word: "subject", support: "predmet", options: ["subject", "teacher", "desk"] },
      { emoji: "➕", word: "maths", support: "matematika", options: ["maths", "music", "board"] },
      { emoji: "🎶", word: "music", support: "glazbeni", options: ["music", "classroom", "subject"] },
      { emoji: "💻", word: "informatics", support: "informatika", options: ["informatics", "teacher", "maths"] },
      { emoji: "👩‍🏫", word: "teacher", support: "učiteljica", options: ["teacher", "desk", "music"] },
      { emoji: "🏫", word: "classroom", support: "učionica", options: ["classroom", "board", "subject"] }
    ],
    speakPrompts: [
      { say: "My favourite subject is Music.", targetWords: ["favourite", "subject", "music"] },
      { say: "I have English on Monday.", targetWords: ["English", "Monday"] },
      { say: "I like Informatics.", targetWords: ["like", "informatics"] }
    ],
    buildSentences: [
      ["My", "favourite", "subject", "is", "Music"],
      ["I", "have", "English", "on", "Monday"],
      ["I", "like", "Maths"]
    ]
  },
  {
    id: "time-tower",
    order: 4,
    icon: "🕰️",
    title: "Time Tower",
    topic: "Daily routine and time",
    personalHook: "Help Eli plan a happy school day.",
    microTarget: "Use routine verbs and o’clock / half past.",
    unlockHint: "Earn stars in School Stars.",
    vocabulary: [
      ["get up", "ustati"],
      ["breakfast", "doručak"],
      ["school", "škola"],
      ["lunch", "ručak"],
      ["homework", "zadaća"],
      ["bed", "krevet"],
      ["o’clock", "puni sat"],
      ["half past", "i pol"]
    ],
    quiz: [
      { prompt: "What do you do first in the morning?", options: ["get up", "go to bed", "watch stars"], correct: "get up", explain: "First, you get up." },
      { prompt: "Half past seven means…", options: ["7:30", "7:00", "7:15"], correct: "7:30", explain: "Half past seven is 7:30." },
      { prompt: "Choose the best sentence.", options: ["I get up at seven o’clock.", "I get up in seven o’clock.", "I up get seven."], correct: "I get up at seven o’clock.", explain: "Say: at seven o’clock." },
      { prompt: "What is homework?", options: ["zadaća", "mlijeko", "vlak"], correct: "zadaća", explain: "Homework means zadaća." },
      { prompt: "What do you do at night?", options: ["go to bed", "have breakfast", "go to school by tram"], correct: "go to bed", explain: "At night, you go to bed." },
      { prompt: "8:00 is…", options: ["eight o’clock", "half past eight", "quarter to eight"], correct: "eight o’clock", explain: "8:00 is eight o’clock." }
    ],
    memoryPairs: [
      { english: "get up", croatian: "ustati" },
      { english: "breakfast", croatian: "doručak" },
      { english: "school", croatian: "škola" },
      { english: "lunch", croatian: "ručak" },
      { english: "homework", croatian: "zadaća" },
      { english: "half past", croatian: "i pol" }
    ],
    pictureItems: [
      { emoji: "⏰", word: "get up", support: "ustati", options: ["get up", "lunch", "homework"] },
      { emoji: "🥣", word: "breakfast", support: "doručak", options: ["breakfast", "school", "bed"] },
      { emoji: "🏫", word: "school", support: "škola", options: ["school", "lunch", "o’clock"] },
      { emoji: "🍽️", word: "lunch", support: "ručak", options: ["lunch", "get up", "homework"] },
      { emoji: "📓", word: "homework", support: "zadaća", options: ["homework", "breakfast", "bed"] },
      { emoji: "🛏️", word: "bed", support: "krevet", options: ["bed", "school", "half past"] }
    ],
    speakPrompts: [
      { say: "I get up at seven o’clock.", targetWords: ["get", "up", "seven"] },
      { say: "I have breakfast at half past seven.", targetWords: ["breakfast", "half", "past"] },
      { say: "I go to bed at nine o’clock.", targetWords: ["bed", "nine"] }
    ],
    buildSentences: [
      ["I", "get", "up", "at", "seven"],
      ["I", "do", "homework"],
      ["I", "go", "to", "bed"]
    ]
  },
  {
    id: "tram-trail",
    order: 5,
    icon: "🚋",
    title: "Tram Trail",
    topic: "Transport and going to school",
    personalHook: "Travel around Zagreb with Eli.",
    microTarget: "Use I go to school by… and on foot.",
    unlockHint: "Earn stars in Time Tower.",
    vocabulary: [
      ["tram", "tramvaj"],
      ["bus", "autobus"],
      ["car", "auto"],
      ["train", "vlak"],
      ["on foot", "pješice"],
      ["school", "škola"],
      ["Zagreb", "Zagreb"],
      ["London", "London"]
    ],
    quiz: [
      { prompt: "How do you say tram in Croatian?", options: ["tramvaj", "kruh", "ormar"], correct: "tramvaj", explain: "Tram means tramvaj." },
      { prompt: "On foot means…", options: ["walking", "driving", "eating"], correct: "walking", explain: "On foot means walking." },
      { prompt: "Choose the best sentence.", options: ["I go to school by tram.", "I go school tram.", "I go to school on tram."], correct: "I go to school by tram.", explain: "Say: by tram." },
      { prompt: "Which is transport?", options: ["bus", "cake", "pillow"], correct: "bus", explain: "A bus is transport." },
      { prompt: "Where does Eli live?", options: ["Zagreb", "Paris", "New York"], correct: "Zagreb", explain: "Eli lives in Zagreb." },
      { prompt: "Choose the correct sentence.", options: ["I go by car.", "I goes by car.", "By car I go school no."], correct: "I go by car.", explain: "Say: I go by car." }
    ],
    memoryPairs: [
      { english: "tram", croatian: "tramvaj" },
      { english: "bus", croatian: "autobus" },
      { english: "car", croatian: "auto" },
      { english: "train", croatian: "vlak" },
      { english: "on foot", croatian: "pješice" },
      { english: "school", croatian: "škola" }
    ],
    pictureItems: [
      { emoji: "🚋", word: "tram", support: "tramvaj", options: ["tram", "bus", "train"] },
      { emoji: "🚌", word: "bus", support: "autobus", options: ["bus", "car", "school"] },
      { emoji: "🚗", word: "car", support: "auto", options: ["car", "tram", "London"] },
      { emoji: "🚆", word: "train", support: "vlak", options: ["train", "on foot", "bus"] },
      { emoji: "👟", word: "on foot", support: "pješice", options: ["on foot", "car", "tram"] },
      { emoji: "🏫", word: "school", support: "škola", options: ["school", "train", "London"] }
    ],
    speakPrompts: [
      { say: "I go to school by tram.", targetWords: ["school", "tram"] },
      { say: "I go on foot.", targetWords: ["foot"] },
      { say: "I live in Zagreb.", targetWords: ["live", "Zagreb"] }
    ],
    buildSentences: [
      ["I", "go", "to", "school", "by", "tram"],
      ["I", "go", "on", "foot"],
      ["I", "live", "in", "Zagreb"]
    ]
  },
  {
    id: "family-garden",
    order: 6,
    icon: "🌷",
    title: "Family Garden",
    topic: "Family and friends",
    personalHook: "Say kind sentences about Mum Mia and Uncle Dali.",
    microTarget: "Use This is my… and I have got…",
    unlockHint: "Earn stars in Tram Trail.",
    vocabulary: [
      ["mum", "mama"],
      ["dad", "tata"],
      ["uncle", "ujak"],
      ["grandma", "baka"],
      ["grandad", "djed"],
      ["friend", "prijatelj"],
      ["cousin", "bratić/sestrična"],
      ["family", "obitelj"]
    ],
    quiz: [
      { prompt: "Who is Mia?", options: ["Mum", "a tram", "a subject"], correct: "Mum", explain: "Mia is Mum." },
      { prompt: "Who is Uncle Dali?", options: ["uncle", "teacher", "food"], correct: "uncle", explain: "Dali is an uncle." },
      { prompt: "Choose the best sentence.", options: ["This is my mum.", "This my mum is.", "Mum this my."], correct: "This is my mum.", explain: "Good sentence." },
      { prompt: "What is grandma?", options: ["baka", "mlijeko", "prozor"], correct: "baka", explain: "Grandma means baka." },
      { prompt: "Choose the correct sentence.", options: ["I have got a friend.", "I has got a friend.", "I friend got."], correct: "I have got a friend.", explain: "Say: I have got." },
      { prompt: "Family means…", options: ["obitelj", "doručak", "stolica"], correct: "obitelj", explain: "Family means obitelj." }
    ],
    memoryPairs: [
      { english: "mum", croatian: "mama" },
      { english: "dad", croatian: "tata" },
      { english: "uncle", croatian: "ujak" },
      { english: "grandma", croatian: "baka" },
      { english: "friend", croatian: "prijatelj" },
      { english: "family", croatian: "obitelj" }
    ],
    pictureItems: [
      { emoji: "👩", word: "mum", support: "mama", options: ["mum", "uncle", "friend"] },
      { emoji: "👨", word: "dad", support: "tata", options: ["dad", "grandma", "family"] },
      { emoji: "🧑", word: "uncle", support: "ujak", options: ["uncle", "mum", "cousin"] },
      { emoji: "👵", word: "grandma", support: "baka", options: ["grandma", "friend", "dad"] },
      { emoji: "🙂", word: "friend", support: "prijatelj", options: ["friend", "family", "uncle"] },
      { emoji: "👨‍👩‍👧", word: "family", support: "obitelj", options: ["family", "mum", "grandad"] }
    ],
    speakPrompts: [
      { say: "This is my mum.", targetWords: ["mum"] },
      { say: "This is my uncle.", targetWords: ["uncle"] },
      { say: "I have got a friend.", targetWords: ["friend"] }
    ],
    buildSentences: [
      ["This", "is", "my", "mum"],
      ["This", "is", "my", "uncle"],
      ["I", "have", "got", "a", "friend"]
    ]
  },
  {
    id: "dance-stage",
    order: 7,
    icon: "🎤",
    title: "Dance Stage",
    topic: "Free time and hobbies",
    personalHook: "Sing, dance, and collect music stars.",
    microTarget: "Use I like… and On Saturday I…",
    unlockHint: "Earn stars in Family Garden.",
    vocabulary: [
      ["sing", "pjevati"],
      ["dance", "plesati"],
      ["hip hop", "hip hop"],
      ["music", "glazba"],
      ["draw", "crtati"],
      ["swim", "plivati"],
      ["read", "čitati"],
      ["games", "igre"]
    ],
    quiz: [
      { prompt: "What does sing mean?", options: ["pjevati", "spavati", "voziti"], correct: "pjevati", explain: "Sing means pjevati." },
      { prompt: "What does dance mean?", options: ["plesati", "jesti", "učiti"], correct: "plesati", explain: "Dance means plesati." },
      { prompt: "Choose the best sentence.", options: ["I like dancing.", "I likes dancing.", "Dancing like I."], correct: "I like dancing.", explain: "Say: I like dancing." },
      { prompt: "What kind of dance does Eli like?", options: ["hip hop", "train", "juhica"], correct: "hip hop", explain: "Eli likes hip hop." },
      { prompt: "Choose the correct sentence.", options: ["On Saturday I sing.", "In Saturday I sing.", "Saturday sing I."], correct: "On Saturday I sing.", explain: "Say: on Saturday." },
      { prompt: "Which is a hobby?", options: ["drawing", "window", "milk"], correct: "drawing", explain: "Drawing is a hobby." }
    ],
    memoryPairs: [
      { english: "sing", croatian: "pjevati" },
      { english: "dance", croatian: "plesati" },
      { english: "music", croatian: "glazba" },
      { english: "draw", croatian: "crtati" },
      { english: "swim", croatian: "plivati" },
      { english: "games", croatian: "igre" }
    ],
    pictureItems: [
      { emoji: "🎤", word: "sing", support: "pjevati", options: ["sing", "dance", "read"] },
      { emoji: "💃", word: "dance", support: "plesati", options: ["dance", "draw", "swim"] },
      { emoji: "🎵", word: "music", support: "glazba", options: ["music", "games", "sing"] },
      { emoji: "🎨", word: "draw", support: "crtati", options: ["draw", "dance", "read"] },
      { emoji: "🏊", word: "swim", support: "plivati", options: ["swim", "music", "games"] },
      { emoji: "🎮", word: "games", support: "igre", options: ["games", "sing", "draw"] }
    ],
    speakPrompts: [
      { say: "I like dancing.", targetWords: ["like", "dancing"] },
      { say: "I like singing.", targetWords: ["like", "singing"] },
      { say: "On Saturday I dance.", targetWords: ["Saturday", "dance"] }
    ],
    buildSentences: [
      ["I", "like", "dancing"],
      ["I", "like", "singing"],
      ["On", "Saturday", "I", "dance"]
    ]
  },
  {
    id: "weekend-adventure",
    order: 8,
    icon: "🌍",
    title: "Weekend Adventure",
    topic: "Last weekend and past time",
    personalHook: "Visit Bjelovar or London in a tiny story.",
    microTarget: "Use went, played, watched, had, visited.",
    unlockHint: "Earn stars in Dance Stage.",
    vocabulary: [
      ["went", "išla/sam išla"],
      ["played", "igrala"],
      ["watched", "gledala"],
      ["had", "imala/jela"],
      ["visited", "posjetila"],
      ["London", "London"],
      ["Bjelovar", "Bjelovar"],
      ["weekend", "vikend"]
    ],
    quiz: [
      { prompt: "Yesterday I ___ to London.", options: ["went", "go", "going"], correct: "went", explain: "Past word: went." },
      { prompt: "Last weekend I ___ games.", options: ["played", "play", "playing"], correct: "played", explain: "Past word: played." },
      { prompt: "Choose the best sentence.", options: ["Yesterday I watched TV.", "Yesterday I watch TV.", "Yesterday TV watched I."], correct: "Yesterday I watched TV.", explain: "Past: watched." },
      { prompt: "What is visited?", options: ["posjetila", "mlijeko", "prozor"], correct: "posjetila", explain: "Visited means posjetila." },
      { prompt: "Choose the correct sentence.", options: ["Last weekend I went to Bjelovar.", "Last weekend I go to Bjelovar.", "Last weekend went I."], correct: "Last weekend I went to Bjelovar.", explain: "Past: went." },
      { prompt: "Which is a past word?", options: ["had", "have now", "will"], correct: "had", explain: "Had is a past word." }
    ],
    memoryPairs: [
      { english: "went", croatian: "išla" },
      { english: "played", croatian: "igrala" },
      { english: "watched", croatian: "gledala" },
      { english: "had", croatian: "imala/jela" },
      { english: "visited", croatian: "posjetila" },
      { english: "weekend", croatian: "vikend" }
    ],
    pictureItems: [
      { emoji: "🧳", word: "went", support: "išla", options: ["went", "played", "had"] },
      { emoji: "🎮", word: "played", support: "igrala", options: ["played", "visited", "watched"] },
      { emoji: "📺", word: "watched", support: "gledala", options: ["watched", "went", "weekend"] },
      { emoji: "🍰", word: "had", support: "imala/jela", options: ["had", "played", "visited"] },
      { emoji: "🏙️", word: "visited", support: "posjetila", options: ["visited", "watched", "went"] },
      { emoji: "🌤️", word: "weekend", support: "vikend", options: ["weekend", "had", "London"] }
    ],
    speakPrompts: [
      { say: "Yesterday I went to Bjelovar.", targetWords: ["yesterday", "went"] },
      { say: "Last weekend I played games.", targetWords: ["weekend", "played"] },
      { say: "I visited London.", targetWords: ["visited", "London"] }
    ],
    buildSentences: [
      ["Yesterday", "I", "went", "to", "Bjelovar"],
      ["Last", "weekend", "I", "played", "games"],
      ["I", "visited", "London"]
    ]
  }
];

export const bonusIdeas = [
  {
    id: "london-bonus",
    title: "London Bonus",
    unlockStars: 18,
    idea: "A bonus map level about Uncle Dali, London, travelling, and simple city words."
  },
  {
    id: "juhica-bonus",
    title: "Grandma’s Juhica Bonus",
    unlockStars: 24,
    idea: "A food story level about grandma’s soup, breakfast, and polite sentences."
  }
];
