# Eli's English Quest 2.0: Time Portal Case World Bible

This document is a storyline and implementation bible for Codex. It is source content, not loose inspiration. The game may use Gemini or browser speech to voice Luma, but the story beats, level order, rewards, task objects, target words and progression should remain deterministic unless Dali changes this document.

Dialogue rule: Luma's dialogue must serve the scene and puzzle. Do not force generic classroom questions such as "what is your favourite subject?" unless the current scene specifically needs that idea. The English must stay at Eli's level: warm A1+ to early A2, short sentences, familiar words, clear repetition and forgiving target-word matching.

Voice rule: Luma speaks automatically after a single player gesture starts the scene if required by browser audio policy. After Luma speaks, the game opens a listening window. There must be no primary child-facing Ask Orb, Speak Answer or Tap Helper buttons. A small fallback may appear only when speech recognition or microphone access fails.

Visual rule: every level is a real 3D game scene using Three.js through React Three Fiber where possible. Static generated images, SVGs or public permissively licensed assets may be used as backgrounds, skyboxes, trophy shelves, textures, UI stickers or non-interactive set dressing when they make the game more beautiful and improve performance. Interactive puzzle objects should normally be Three.js/R3F objects unless a 2D asset is clearly better.


## World identity

Time Portal Case is the third saga. It should feel like a child-friendly detective adventure through portals, clocks and memories. Eli and Luma solve a missing Time Tick case by putting events back in order.

## Core fantasy

- The Great Clock has lost its Time Tick.
- Without the tick, some moments are mixed up: morning objects appear at night, yesterday clues appear tomorrow, and memory cards are out of order.
- Eli becomes a time detective and follows portals to collect time rewards.
- Speech restores order: yesterday, today, tomorrow, first, next, then, will and found become gameplay powers.
- The final reward opens the future bridge and completes the V2 saga arc.

## How it differs from the first two sagas

- Sky Islands is magic route repair. Crystal Mystery is colour investigation. Time Portal Case is sequencing and temporal detective work.
- The map is a portal hub with six portal doors around a clock tower.
- Progress animations should show clock hands repairing, portal rings lighting and case board clues connecting.
- The core puzzle type is ordering events, choosing the correct time clue and using simple past/future sentences.
- Luma should sound like a playful detective companion: We found a clue. What happened first? What will we do next?

## Art and asset direction

- Use Three.js/R3F clock faces, portal rings, case board cards, floating calendars, soft trains, old forest props and classroom memory cards.
- Generated images may be used for portal backdrops, detective board illustrations, trophy shelf art, paper card textures and starry vault backgrounds.
- Portal transitions should be bright and magical, not disorienting.
- Use particles shaped like ticks, stars and tiny clock hands.
- Solved levels add tick tokens to a visible case board.

## Sound direction

- Soft ticking in the portal hub.
- Portal open sound: chime plus whoosh.
- Case clue sound: tiny camera click or sparkle pop.
- Clock repair sound: gentle tick-tock sequence.
- Final celebration with clock bells, still soft and child-safe.

## Rewards

- Detective Clock Badge.
- Morning Tick Token.
- Clock Feather.
- Future Ticket Star.
- Memory Page.
- Golden Time Key.

## Level designs

## 1. Clock Tower Office

**Story purpose:** Luma opens a tiny detective office inside a clock tower. The Time Tick has vanished and Eli becomes the time detective.

**3D scene:** Cosy clock tower room with case board, ticking clock, calendar cards, magnifying glass, old key and tiny portal door.

**Core mechanic:** Case setup, time word discovery and first portal activation.

**English focus:** Today, yesterday, tomorrow, time and simple questions.

**Reward:** Detective Clock Badge.

**Eight task sequence:**

### 1. Open the Case Board
- **Screen object:** Blank detective board with string stars.
- **Luma line:** We have a new case. Say: I am a time detective.
- **Eli target line:** I am a time detective.
- **Target words:** time, detective
- **Success animation:** Case board lights up with clue cards.
- **Gentle hint:** Say time detective.

### 2. Find Today's Card
- **Screen object:** Three cards: yesterday, today, tomorrow.
- **Luma line:** Pick the card for now. Say: Today is the clue.
- **Eli target line:** Today is the clue.
- **Target words:** today, clue
- **Success animation:** Today card jumps to the board.
- **Gentle hint:** Say today is the clue.

### 3. Ask the Clock
- **Screen object:** Clock face with missing tick mark.
- **Luma line:** Ask the clock a question. Say: Where is the tick?
- **Eli target line:** Where is the tick?
- **Target words:** where, tick
- **Success animation:** Clock points to a drawer.
- **Gentle hint:** Say where is the tick.

### 4. Open the Old Drawer
- **Screen object:** Small wooden drawer under the clock.
- **Luma line:** Ask kindly. Say: Open the drawer, please.
- **Eli target line:** Open the drawer, please.
- **Target words:** open, drawer, please
- **Success animation:** Drawer opens and a tiny key appears.
- **Gentle hint:** Say open drawer, please.

### 5. Use the Magnifying Glass
- **Screen object:** Magnifying glass on desk.
- **Luma line:** Look for clues. Say: I can see a small key.
- **Eli target line:** I can see a small key.
- **Target words:** see, small, key
- **Success animation:** Magnifying glass enlarges the key clue.
- **Gentle hint:** Say small key.

### 6. Name Tomorrow's Door
- **Screen object:** Portal door with tomorrow symbol.
- **Luma line:** The door is for later. Say: Tomorrow has a door.
- **Eli target line:** Tomorrow has a door.
- **Target words:** tomorrow, door
- **Success animation:** Portal door hums gently.
- **Gentle hint:** Say tomorrow door.

### 7. Remember Yesterday
- **Screen object:** Photo card from yesterday.
- **Luma line:** The past left a clue. Say: Yesterday I found a clue.
- **Eli target line:** Yesterday I found a clue.
- **Target words:** yesterday, found, clue
- **Success animation:** Photo card animates and reveals a tick sparkle.
- **Gentle hint:** Say yesterday found clue.

### 8. Open the First Portal
- **Screen object:** Tiny portal ring on the floor.
- **Luma line:** Start the case. Say: Time portal, open now.
- **Eli target line:** Time portal, open now.
- **Target words:** time, portal, open
- **Success animation:** Portal opens to the Morning Market.
- **Gentle hint:** Say time portal open.

## 2. Morning Market Mix-up

**Story purpose:** A cheerful market has mixed morning and evening objects. Eli sorts the scene so the first Time Tick can return.

**3D scene:** Bright market square with sun stall, moon stall, apple cart, clock tower, delivery bird and floating wrong-time objects.

**Core mechanic:** Sorting by time of day and naming objects.

**English focus:** Morning, evening, food objects, first and next.

**Reward:** Morning Tick Token.

**Eight task sequence:**

### 1. Wake the Sun Stall
- **Screen object:** Closed yellow stall with sleepy sun sign.
- **Luma line:** The morning stall is closed. Say: Good morning, sun stall.
- **Eli target line:** Good morning, sun stall.
- **Target words:** morning, sun, stall
- **Success animation:** Stall opens and sunbeams stretch.
- **Gentle hint:** Say good morning sun stall.

### 2. Move the Moon Lamp
- **Screen object:** Moon lamp sitting on morning table.
- **Luma line:** This belongs to night. Say: Put the moon lamp away.
- **Eli target line:** Put the moon lamp away.
- **Target words:** moon, lamp, away
- **Success animation:** Moon lamp floats to evening box.
- **Gentle hint:** Say moon lamp away.

### 3. Buy the Apple Clue
- **Screen object:** Apple cart with one glowing apple.
- **Luma line:** Ask for the clue kindly. Say: An apple, please.
- **Eli target line:** An apple, please.
- **Target words:** apple, please
- **Success animation:** Apple opens to show a tiny clock mark.
- **Gentle hint:** Say apple, please.

### 4. Set the Market Clock
- **Screen object:** Clock tower showing wrong time.
- **Luma line:** Set the morning time. Say: It is eight o'clock.
- **Eli target line:** It is eight o'clock.
- **Target words:** eight, clock
- **Success animation:** Clock hands move to eight and ring softly.
- **Gentle hint:** Say eight o'clock.

### 5. Find the First Basket
- **Screen object:** Three baskets labelled with simple icons.
- **Luma line:** Start the order. Say: First, take the basket.
- **Eli target line:** First, take the basket.
- **Target words:** first, basket
- **Success animation:** First basket glows and slides forward.
- **Gentle hint:** Say first basket.

### 6. Call the Delivery Bird
- **Screen object:** Bird carrying mixed parcels.
- **Luma line:** Call the bird. Say: Come here, little bird.
- **Eli target line:** Come here, little bird.
- **Target words:** come, here, bird
- **Success animation:** Bird lands and drops a parcel clue.
- **Gentle hint:** Say come here bird.

### 7. Put the Bread on the Stall
- **Screen object:** Bread floating above wrong shelf.
- **Luma line:** Tell me where it goes. Say: Put bread on the stall.
- **Eli target line:** Put bread on the stall.
- **Target words:** bread, stall
- **Success animation:** Bread lands and stall becomes complete.
- **Gentle hint:** Say bread on the stall.

### 8. Collect the Morning Tick
- **Screen object:** Golden tick hiding in sun stall.
- **Luma line:** The first tick is ready. Say: Morning tick, come back.
- **Eli target line:** Morning tick, come back.
- **Target words:** morning, tick, back
- **Success animation:** Tick token flies to Luma's case board.
- **Gentle hint:** Say morning tick back.

## 3. Old Forest Footprints

**Story purpose:** The portal opens to an old forest where footprints from yesterday point to a lost clock feather.

**3D scene:** Gentle old forest with tall trees, mossy clock stones, feather clue, animal footprints and a hollow tree door.

**Core mechanic:** Following footprint sequences and simple past-tense clue reporting.

**English focus:** Past clue phrases: I found, I saw, it was. Nature words.

**Reward:** Clock Feather.

**Eight task sequence:**

### 1. Look at the Footprints
- **Screen object:** Footprints glowing in soft mud.
- **Luma line:** Tell me what you found. Say: I found footprints.
- **Eli target line:** I found footprints.
- **Target words:** found, footprints
- **Success animation:** Footprints light one by one.
- **Gentle hint:** Say found footprints.

### 2. Name the Old Tree
- **Screen object:** Large hollow tree with clock rings.
- **Luma line:** Describe the tree. Say: The tree is old and big.
- **Eli target line:** The tree is old and big.
- **Target words:** tree, old, big
- **Success animation:** Tree opens one eye and smiles.
- **Gentle hint:** Say old and big.

### 3. Find the Feather
- **Screen object:** Blue feather behind a mossy stone.
- **Luma line:** Tell me what you see. Say: I can see a blue feather.
- **Eli target line:** I can see a blue feather.
- **Target words:** see, blue, feather
- **Success animation:** Feather floats out from behind the stone.
- **Gentle hint:** Say blue feather.

### 4. Say What Happened
- **Screen object:** Tiny replay sparkle above footprint path.
- **Luma line:** The past is showing us. Say: Yesterday, I saw a bird.
- **Eli target line:** Yesterday, I saw a bird.
- **Target words:** yesterday, saw, bird
- **Success animation:** Replay sparkle shows a friendly bird dropping the feather.
- **Gentle hint:** Say yesterday saw bird.

### 5. Open the Hollow Door
- **Screen object:** Door inside the tree trunk.
- **Luma line:** Ask the tree kindly. Say: Open the tree door, please.
- **Eli target line:** Open the tree door, please.
- **Target words:** open, tree, door, please
- **Success animation:** Tree door opens with leaf confetti.
- **Gentle hint:** Say open tree door.

### 6. Choose the Next Path
- **Screen object:** Two forest paths with arrows.
- **Luma line:** Follow the clue order. Say: Next, go to the light.
- **Eli target line:** Next, go to the light.
- **Target words:** next, go, light
- **Success animation:** Light path opens and dark path sleeps.
- **Gentle hint:** Say next go to the light.

### 7. Help the Forest Clock
- **Screen object:** Clock stone missing a feather hand.
- **Luma line:** Put back the feather. Say: Feather, fix the clock.
- **Eli target line:** Feather, fix the clock.
- **Target words:** feather, fix, clock
- **Success animation:** Feather becomes a clock hand.
- **Gentle hint:** Say fix the clock.

### 8. Collect the Forest Tick
- **Screen object:** Green tick inside the clock stone.
- **Luma line:** Bring back the second tick. Say: Forest tick, come back.
- **Eli target line:** Forest tick, come back.
- **Target words:** forest, tick, back
- **Success animation:** Tick token floats to the case board.
- **Gentle hint:** Say forest tick back.

## 4. Tomorrow Station

**Story purpose:** The next portal jumps to a friendly future station. Eli uses will sentences to plan the route to the missing tick.

**3D scene:** Bright future station with soft trains, hover bus, ticket gate, route board, robot conductor and glowing platform numbers.

**Core mechanic:** Route planning and future-tense spoken choices.

**English focus:** Will, transport, tickets and simple future plans.

**Reward:** Future Ticket Star.

**Eight task sequence:**

### 1. Wake the Route Board
- **Screen object:** Dark station board with moving stars.
- **Luma line:** The board needs a plan. Say: We will find the tick.
- **Eli target line:** We will find the tick.
- **Target words:** will, find, tick
- **Success animation:** Board lights and displays three route icons.
- **Gentle hint:** Say will find tick.

### 2. Ask the Robot Conductor
- **Screen object:** Small robot with conductor cap.
- **Luma line:** Ask for help. Say: Can you help us, please?
- **Eli target line:** Can you help us, please?
- **Target words:** help, please
- **Success animation:** Robot salutes and points to the ticket gate.
- **Gentle hint:** Say help us, please.

### 3. Choose the Hover Bus
- **Screen object:** Train, bus and boat icons.
- **Luma line:** Tell me the transport plan. Say: We will go by bus.
- **Eli target line:** We will go by bus.
- **Target words:** will, go, bus
- **Success animation:** Hover bus icon grows and bounces.
- **Gentle hint:** Say go by bus.

### 4. Open the Ticket Gate
- **Screen object:** Gate with star scanner.
- **Luma line:** Use polite travel words. Say: Open the gate, please.
- **Eli target line:** Open the gate, please.
- **Target words:** open, gate, please
- **Success animation:** Gate doors slide open.
- **Gentle hint:** Say open gate, please.

### 5. Find Platform Two
- **Screen object:** Number platforms one, two and three.
- **Luma line:** Find our platform. Say: Platform two is here.
- **Eli target line:** Platform two is here.
- **Target words:** platform, two, here
- **Success animation:** Platform two glows with blue light.
- **Gentle hint:** Say platform two.

### 6. Pack the Future Bag
- **Screen object:** Small travel bag with route map.
- **Luma line:** Tell Luma your plan. Say: I will take the map.
- **Eli target line:** I will take the map.
- **Target words:** will, take, map
- **Success animation:** Map folds itself into the bag.
- **Gentle hint:** Say take the map.

### 7. Catch the Fast Star
- **Screen object:** Fast tick-star flying around the station clock.
- **Luma line:** Call it gently. Say: Slow down, little star.
- **Eli target line:** Slow down, little star.
- **Target words:** slow, down, star
- **Success animation:** Star slows and lands on the board.
- **Gentle hint:** Say slow down star.

### 8. Collect the Future Tick
- **Screen object:** Tick hidden inside route board.
- **Luma line:** Bring back the tick from tomorrow. Say: Future tick, come back.
- **Eli target line:** Future tick, come back.
- **Target words:** future, tick, back
- **Success animation:** Tick token joins the case board.
- **Gentle hint:** Say future tick back.

## 5. School Day Memory

**Story purpose:** A portal opens into a memory of a school day. Events are out of order, and Eli puts them back using first, next and then.

**3D scene:** Floating memory classroom with desk islands, book portal, lunch cloud, playground slide and clock bubbles.

**Core mechanic:** Sequencing daily events and placing memory cards in order.

**English focus:** First, next, then, school day routine and simple memory phrases.

**Reward:** Memory Page.

**Eight task sequence:**

### 1. Wake the Memory Book
- **Screen object:** Closed book with sleepy clock bookmark.
- **Luma line:** The book remembers the day. Say: Open the memory book.
- **Eli target line:** Open the memory book.
- **Target words:** open, memory, book
- **Success animation:** Book opens and memory cards fly out.
- **Gentle hint:** Say open memory book.

### 2. Choose the First Card
- **Screen object:** Cards for school, lunch and home.
- **Luma line:** Start the day. Say: First, I go to school.
- **Eli target line:** First, I go to school.
- **Target words:** first, go, school
- **Success animation:** School card moves to first slot.
- **Gentle hint:** Say first go to school.

### 3. Find the Book Card
- **Screen object:** Book card hiding under desk.
- **Luma line:** Tell me what you found. Say: I found a book.
- **Eli target line:** I found a book.
- **Target words:** found, book
- **Success animation:** Book card flips and glows.
- **Gentle hint:** Say found a book.

### 4. Place the Lunch Cloud
- **Screen object:** Lunch cloud floating above wrong slot.
- **Luma line:** What happens next? Say: Next, I eat lunch.
- **Eli target line:** Next, I eat lunch.
- **Target words:** next, eat, lunch
- **Success animation:** Lunch cloud lands in second slot.
- **Gentle hint:** Say next eat lunch.

### 5. Fix the Playground Slide
- **Screen object:** Slide memory tilted sideways.
- **Luma line:** Tell the memory where to go. Say: Then, I play outside.
- **Eli target line:** Then, I play outside.
- **Target words:** then, play, outside
- **Success animation:** Slide straightens and star shapes bounce.
- **Gentle hint:** Say then play outside.

### 6. Set the Home Clock
- **Screen object:** Clock bubble with house icon.
- **Luma line:** End the day softly. Say: Then, I go home.
- **Eli target line:** Then, I go home.
- **Target words:** then, go, home
- **Success animation:** House icon lights and clock bubble settles.
- **Gentle hint:** Say then go home.

### 7. Read the Memory Page
- **Screen object:** Page with all cards in order.
- **Luma line:** Read the order. Say: First, next, then.
- **Eli target line:** First, next, then.
- **Target words:** first, next, then
- **Success animation:** Page stitches itself with gold thread.
- **Gentle hint:** Say first, next, then.

### 8. Collect the Memory Tick
- **Screen object:** Tick hiding in the book spine.
- **Luma line:** Bring back the school day tick. Say: Memory tick, come back.
- **Eli target line:** Memory tick, come back.
- **Target words:** memory, tick, back
- **Success animation:** Tick token joins the board and final portal opens.
- **Gentle hint:** Say memory tick back.

## 6. Midnight Time Vault

**Story purpose:** The final vault holds the missing Time Tick. Eli uses all case rewards to repair the clock and let the future bridge open safely.

**3D scene:** Starry vault with giant clock face, six reward pedestals, midnight bell, final tick slot and soft portal rings.

**Core mechanic:** Final sequence repair using collected rewards and longer confidence lines.

**English focus:** Review time words, past and future phrases, confidence sentence.

**Reward:** Golden Time Key and Time Portal Case completion.

**Eight task sequence:**

### 1. Place the Detective Badge
- **Screen object:** Badge pedestal on giant clock face.
- **Luma line:** Start the final case. Say: I am ready, Luma.
- **Eli target line:** I am ready, Luma.
- **Target words:** ready, Luma
- **Success animation:** Badge glows and case board appears.
- **Gentle hint:** Say ready Luma.

### 2. Place the Morning Tick
- **Screen object:** Morning tick slot near sun symbol.
- **Luma line:** Wake the morning. Say: Morning tick is here.
- **Eli target line:** Morning tick is here.
- **Target words:** morning, tick, here
- **Success animation:** Sun symbol lights.
- **Gentle hint:** Say morning tick here.

### 3. Place the Clock Feather
- **Screen object:** Feather hand slot on the clock.
- **Luma line:** Fix the past hand. Say: The feather helps the clock.
- **Eli target line:** The feather helps the clock.
- **Target words:** feather, helps, clock
- **Success animation:** Feather hand begins to move.
- **Gentle hint:** Say feather helps clock.

### 4. Use the Future Ticket Star
- **Screen object:** Ticket star pedestal by tomorrow portal.
- **Luma line:** Tell tomorrow our plan. Say: We will open the portal.
- **Eli target line:** We will open the portal.
- **Target words:** will, open, portal
- **Success animation:** Tomorrow portal brightens.
- **Gentle hint:** Say will open portal.

### 5. Read the Memory Page
- **Screen object:** Memory page hovering over order slots.
- **Luma line:** Put time in order. Say: First, next, then.
- **Eli target line:** First, next, then.
- **Target words:** first, next, then
- **Success animation:** Order slots lock into the clock ring.
- **Gentle hint:** Say first next then.

### 6. Ask the Midnight Bell
- **Screen object:** Bell above final tick slot.
- **Luma line:** Ask the bell where the tick is. Say: Where is the last tick?
- **Eli target line:** Where is the last tick?
- **Target words:** where, last, tick
- **Success animation:** Bell rings and reveals final tick.
- **Gentle hint:** Say where is the last tick.

### 7. Repair the Clock
- **Screen object:** Final tick floating near clock centre.
- **Luma line:** Tell me what happened. Say: I found the last tick.
- **Eli target line:** I found the last tick.
- **Target words:** found, last, tick
- **Success animation:** Tick slides into the clock and the hands align.
- **Gentle hint:** Say found last tick.

### 8. Open the Future Bridge
- **Screen object:** Golden Time Key and portal bridge.
- **Luma line:** Use your brave time spell. Say: I can solve the time case.
- **Eli target line:** I can solve the time case.
- **Target words:** can, solve, time, case
- **Success animation:** Golden Time Key appears, portal bridge opens and saga celebration begins.
- **Gentle hint:** Say solve the time case.

## Data implementation guidance

Time Portal Case should reuse the same automatic voice, task and reward engine, but the content, map and animations must be specific to time detective play. Do not use generic question-answer panels. The sequence mechanic should be visual: task cards move into first, next and then slots, clocks repair, and portal doors light up.