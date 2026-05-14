# Eli’s English Quest 2.0: Cloud Harbor Story and Gameplay Bible v1

This document is source content for Codex. It defines the intended gameplay feel, story, visual direction, Luma behaviour and Cloud Harbor task sequence for the first Sky Islands level. It is not loose inspiration.

## 1. Design purpose

Cloud Harbor must become the gold-standard template for all future Sky Islands levels.

The current problem is that Cloud Harbor feels like a sequence of detached voice drills: “say this, say that”. The new version must feel like Luma and ELI are solving a magical problem together.

The level should teach English through action and cooperation:

- Luma notices a problem.
- ELI looks, thinks and speaks.
- The world reacts to ELI’s words.
- Luma responds warmly and specifically.
- A clue from one step helps the next step.
- The level ends with a clear resolution.

On screen, the child’s name is written as `ELI`. In spoken voice prompts, Luma should pronounce the name as `Ellie`.

## 2. Core story

### Title

**Cloud Harbor: The Sleeping Dock**

### Level premise

The Sky Islands used to be connected by tiny cloud bridges. A soft magical storm passed through the sky and made the first bridge fall asleep. Cloud Harbor is the first place on the route, but it has gone quiet: the lantern is dark, the flag is folded, the wind has forgotten the bridge song, and the Cloud Compass is hidden.

Luma remembers only one thing: ELI’s English voice can wake friendly sky magic.

### Main goal

ELI and Luma must wake Cloud Harbor, find the Silver Key, make a Breeze Potion, open the Cloud Gate and restore the first bridge to Breakfast Breeze.

### Emotional tone

Magical, curious and gentle. Nothing scary. Luma is surprised, playful, encouraging and occasionally confused. Luma should feel like a friend asking ELI to help, not a teacher testing ELI.

## 3. Luma character direction

Luma should feel alive.

### Always visible during level play

Luma stays in the top-left companion position, but she is not static. She should:

- bounce gently while idle;
- turn slightly towards the camera when speaking to ELI;
- look towards the active object when explaining a clue;
- show a small mouth that moves or pulses while speaking;
- smile when ELI succeeds;
- show a thinking face when deciding what to do next;
- show a listening ear cue when it is ELI’s turn.

### Listening cue

When Luma asks ELI to speak, show a clear listening state:

- Luma turns slightly sideways;
- a soft glowing ear icon appears beside Luma or grows from Luma’s side;
- the ear pulses slowly while listening;
- the speech bubble changes to “Your turn, ELI” or a short clue reminder;
- background sound/effects quiet down slightly;
- when listening ends, the ear shrinks/fades.

Do not make the ear silly or distracting. It should be cute and instantly understandable.

### Mouth animation

A simple animated mouth is enough. It can be:

- a small oval or smile shape;
- scale/pulse while Luma is speaking;
- closed when idle;
- round surprised shape for clue reveals;
- big smile for reward moments.

## 4. Visual direction

### Main presentation approach

Cloud Harbor should use a **beautiful illustrated background plate** as the main visual surface, with lightweight animated overlays on top.

Do not rely on crude procedural objects as the main look.

### Background plate target

Create a portrait-first Cloud Harbor background image, ideally with a desktop variant if feasible.

The image should show:

- a floating sky dock;
- warm wooden planks or soft cloud-stone platform;
- a dark sleepy lantern;
- a folded pink cloud flag;
- three soft cloud puffs that can hide the key;
- a tiny potion bowl area;
- a cloud gate on the right;
- broken bridge pieces or faint bridge path leading away;
- space in the top-left for Luma and speech bubble;
- dreamy blue sky, soft clouds, sparkles and depth.

### Overlay layer

Code overlays should add:

- active object glow;
- sparkle bursts;
- floating clouds;
- animated key reveal;
- potion shimmer;
- flag wave;
- gate glow;
- bridge-light trail;
- listening ear cue;
- progress gems;
- reward pop-in.

Interactive objects may be positioned as transparent hotspots over the illustration. Lightweight R3F/SVG/DOM overlays can be used for effects.

### Asset handling

Any generated image must be:

- original project art;
- stored locally in `public/assets/v2/backgrounds/` or similar;
- listed in `src/v2/assets/assetManifest.js`;
- documented in `public/assets/v2/ATTRIBUTIONS.md`;
- optimised for mobile;
- not hotlinked.

## 5. Gameplay philosophy

The level should not force exact parroting unless a magic phrase is explicitly part of the story.

There are three answer types:

### 1. Guided phrase

Used for a magic spell or polite request. The target is still flexible by keywords.

Example:

- Luma: “The lantern likes kind words. Can you ask it to wake up? Try: Light the lantern, please.”
- ELI may say: “Light the lantern please”, “Please light lantern”, or “light lantern”.

### 2. Choice answer

Used when ELI chooses an object.

Example:

- Luma: “Which key should we try, silver, blue or purple?”
- ELI may say: “silver”, “the silver key”, or “use silver key”.

### 3. Thinking answer

Used for simple story understanding.

Example:

- Luma: “The wind is stuck. What does it need, rain or fire?”
- ELI may say: “rain”, “blue rain”, “it needs rain”.

The evaluator should accept target words, not require perfect sentences. Luma can ask a gentle follow-up if the answer is unclear.

## 6. Level structure overview

Cloud Harbor has one intro and eight gameplay beats.

### Intro: Luma and the Sleeping Dock

Purpose: explain story and goal.

Luma appears top-left, looks at ELI, then at the dock.

Spoken line, use spoken name “Ellie”:

> “Hello, Ellie. I am Luma. This is Cloud Harbor. It should be bright and windy, but the sky storm made it sleepy. Can you help me wake it up?”

On-screen caption, use display name `ELI`:

> “Hello, ELI. I am Luma. Cloud Harbor is sleepy. Can you help me wake it up?”

Then Luma adds:

> “We need the lantern, the flag, the silver key and a tiny breeze potion. Then we can open the first bridge.”

Player goal displayed briefly:

> “Wake Cloud Harbor and open the first bridge.”

## 7. Eight gameplay beats

Each beat should include:

- story purpose;
- visual focus;
- Luma line;
- expected answer style;
- accepted target words;
- success animation;
- gentle follow-up if unclear;
- optional support interaction.

### Beat 1: Say hello to Luma and wake the dock

**Story purpose:** Luma needs ELI’s voice to start the harbor magic.

**Visual focus:** Luma glows softly; the dock is dim.

**Luma line:**

> “First, let the harbor hear your voice. Can you say hello to me?”

Then, if needed:

> “You can say: Hello Luma, I am ELI.”

**Expected answer style:** greeting / introduction.

**Accepted target words:** `hello`, `luma`, `eli` or `ellie`.

**Success animation:** Luma smiles, dock sparkles wake, first progress gem lights.

**Luma success line:**

> “I heard you, Ellie. The dock is waking up.”

**Gentle follow-up:**

> “I heard a little sound. Try hello Luma.”

### Beat 2: Light the sleepy lantern

**Story purpose:** The lantern shows the first clue path.

**Visual focus:** Dark lantern on the left side of the dock.

**Luma line:**

> “Look, the lantern is asleep. It only wakes up for kind words. What should we ask?”

If ELI pauses:

> “Try: Light the lantern, please.”

**Expected answer style:** polite request.

**Accepted target words:** `light`, `lantern`; `please` gives extra confidence but is not mandatory.

**Success animation:** Lantern glows warm gold; a small ring of light reveals marks on the dock.

**Luma success line:**

> “Yes. The lantern is awake. It is showing us tiny cloud marks.”

**Gentle follow-up:**

> “The lantern needs two words: light and lantern.”

### Beat 3: Choose the right wind colour for the flag

**Story purpose:** The flag tells which colour the bridge wind needs later.

**Visual focus:** Folded flag and three small wind ribbons: blue, red, yellow.

**Luma line:**

> “The flag is folded. I see three little winds: blue, red and yellow. The lantern showed a blue mark. Which wind should we use?”

**Expected answer style:** colour choice.

**Accepted target words:** `blue`.

**Success animation:** Blue ribbon flies into the flag; flag rises and waves.

**Luma success line:**

> “Blue wind. Good thinking. Let’s remember blue.”

**Gentle follow-up:**

> “Look at the lantern mark. It is blue. Which colour?”

**Memory flag:** Store or keep a transient level clue: `bridgeWindColour = blue`.

### Beat 4: Find the Silver Key hidden in the cloud puffs

**Story purpose:** ELI uses observation to find the key.

**Visual focus:** Three cloud puffs, with a silver sparkle under one.

**Luma line:**

> “Something is hiding in the clouds. I see a tiny sparkle. What can you see?”

If needed:

> “You can say: I can see the silver key.”

**Expected answer style:** observation.

**Accepted target words:** `see`, `silver`, `key`; accept `key`, `silver key`.

**Success animation:** Cloud puffs pop gently; silver key floats to Luma’s side.

**Luma success line:**

> “A silver key. Perfect. I think this key belongs to the little gate.”

**Gentle follow-up:**

> “Try silver key.”

### Beat 5: Decide what the breeze potion needs

**Story purpose:** ELI uses the remembered blue clue from the flag.

**Visual focus:** Potion bowl with three droplets: blue rain, red fire, yellow sun.

**Luma line:**

> “The bridge wind is too weak. We need a breeze potion. Remember the flag? Was our wind blue, red or yellow?”

**Expected answer style:** recall colour.

**Accepted target words:** `blue`; accept `blue rain`.

**Success animation:** Blue droplet hovers over the bowl.

**Luma follow-up line:**

> “Yes, blue. Now ask the potion kindly.”

Then prompt:

> “Can you say: Add blue rain, please?”

**Accepted target words for phrase:** `add`, `blue`, `rain`; `please` optional but preferred.

**Success animation:** Potion turns bright blue; bubbles rise into a wind spiral.

**Luma success line:**

> “The blue breeze potion is ready.”

**Gentle follow-up:**

> “We need blue rain. Say blue rain.”

### Beat 6: Open the tiny cloud gate with the silver key

**Story purpose:** Combine key + polite request.

**Visual focus:** Cloud gate on the right; silver key floats nearby.

**Luma line:**

> “Here is the little gate. We have the silver key. Should we try it?”

**Expected answer style:** yes / use key / open gate.

**Accepted target words:** `yes`, `key`, `open`, `gate`, `silver`.

Then Luma guides:

> “Let’s ask the gate kindly. Say: Open the gate, please.”

**Accepted target words for phrase:** `open`, `gate`; `please` preferred.

**Success animation:** Key turns; gate opens with a soft cloud swirl.

**Luma success line:**

> “The gate opened. The bridge pieces are listening now.”

**Gentle follow-up:**

> “Use open and gate.”

### Beat 7: Cast the cloud path spell

**Story purpose:** Use a magic phrase that makes the route visible.

**Visual focus:** Spell circle on the dock and faint bridge outline.

**Luma line:**

> “The bridge pieces are awake, but they do not know where to go. We need a cloud spell. Can you help me show the way?”

Then:

> “Say: Clouds, show the way.”

**Expected answer style:** magic phrase.

**Accepted target words:** `clouds`, `show`, `way`.

**Success animation:** Spell circle spins; glowing path appears between bridge pieces.

**Luma success line:**

> “The path is showing. One more brave voice, Ellie.”

**Gentle follow-up:**

> “Try clouds, show the way.”

### Beat 8: Build the first bridge

**Story purpose:** End resolution; bridge to Breakfast Breeze opens.

**Visual focus:** Broken bridge pieces, blue wind ribbon, lantern light and flag all combine.

**Luma line:**

> “The lantern is bright. The flag found blue wind. The key opened the gate. The potion woke the breeze. Now the bridge is ready.”

Then:

> “Can you say: I am ready for the next island?”

**Expected answer style:** confidence sentence.

**Accepted target words:** `ready`, `next`, `island`; accept close variants.

**Success animation:** Bridge pieces assemble; Cloud Compass appears; all progress gems glow; return-to-map bridge animation unlocks Breakfast Breeze.

**Luma success line:**

> “You did it, Ellie. Cloud Harbor is awake. We found the Cloud Compass.”

On-screen display:

> “ELI earned the Cloud Compass.”

## 8. Luma response model

Luma should respond dynamically but within safe boundaries.

### If answer is good

Use specific praise tied to the action:

- “Yes, blue. That matches the flag clue.”
- “I heard silver key. Let’s use it.”
- “That was kind. The lantern likes please.”

### If answer is partial

Acknowledge and scaffold:

- “I heard key. Can you say silver key?”
- “I heard blue. Good. Now say blue rain.”
- “I heard open. The gate needs open gate.”

### If unclear

Never shame. Keep story alive:

- “The cloud wind was noisy. Let’s try again.”
- “Luma’s ear is listening. Say blue.”
- “I did not catch it yet. You can say it with me.”

### If speech recognition fails

Show fallback chip:

> “Say it aloud, then tap to continue.”

This remains an accessibility/device fallback, not cheating.

## 9. Implementation data shape guidance

Cloud Harbor should be represented as story-aware structured data, not scattered strings.

Suggested fields:

```js
{
  id: 'cloud-harbor',
  title: 'Cloud Harbor',
  subtitle: 'The Sleeping Dock',
  storyGoal: 'Wake Cloud Harbor and open the first bridge.',
  intro: {
    displayText: 'Hello, ELI. I am Luma. Cloud Harbor is sleepy. Can you help me wake it up?',
    spokenText: 'Hello, Ellie. I am Luma. Cloud Harbor is sleepy. Can you help me wake it up?',
    followUpDisplayText: 'We need the lantern, the flag, the silver key and a tiny breeze potion.',
    followUpSpokenText: 'We need the lantern, the flag, the silver key and a tiny breeze potion.'
  },
  storyMemory: {
    bridgeWindColour: null
  },
  tasks: [
    {
      id: 'wake-the-dock',
      type: 'greeting',
      visualFocus: 'luma-dock-glow',
      lumaPromptDisplay: 'First, let the harbor hear your voice. Can you say hello to me?',
      lumaPromptSpoken: 'First, let the harbor hear your voice. Can you say hello to me?',
      suggestedDisplayLine: 'Hello Luma, I am ELI.',
      suggestedSpokenLine: 'Hello Luma, I am Ellie.',
      acceptedWords: ['hello', 'luma', 'eli', 'ellie'],
      successEvent: 'dock-sparkle-wake',
      memorySet: null
    }
  ]
}
```

Important: display text and spoken text can differ.

## 10. Gemini interaction guidance

Gemini should make Luma sound natural, but the game state remains deterministic.

Allowed Gemini flexibility:

- natural wording;
- warm encouragement;
- gentle clarification;
- short follow-up questions;
- child-friendly tone.

Not allowed:

- inventing new task order;
- changing the target clue;
- creating long unrelated conversation;
- storing conversation history;
- harsh correction;
- requiring exact grammar when target words are present.

For each turn, send Gemini context like:

```text
You are Luma, a warm magical orb helping ELI in Cloud Harbor. On screen her name is ELI, but when speaking pronounce it Ellie. Current task: choose the wind colour. Story clue: the lantern showed blue. Ask one short question. Keep A1/A2 English. Do not move to the next task.
```

## 11. Acceptance criteria for Cloud Harbor v2 story pass

This pass is acceptable only if:

- Luma gives a real intro and explains Cloud Harbor’s problem.
- ELI understands the level goal.
- The level no longer feels like detached “say this” drills.
- Each task has a story purpose.
- At least two tasks involve choice or recall, not just repetition.
- Luma speaks like a companion.
- A listening ear cue appears during ELI’s turn.
- Luma mouth/face/turning states are more expressive.
- Cloud Harbor uses a beautiful background plate with animated overlays.
- Browser TTS is suppressed after Gemini success.
- UI displays `ELI` while voice says `Ellie`.
- No audio, transcripts or long conversations are persisted.
- Five existing playable Sky Islands levels remain intact.
- Storm Crown Citadel remains non-playable.
- `npm test` and `npm run build` pass.
