# Eli's English Quest 2.0: Sky Islands Quest World Bible

This document is a storyline and implementation bible for Codex. It is source content, not loose inspiration. The game may use Gemini or browser speech to voice Luma, but the story beats, level order, rewards, task objects, target words and progression should remain deterministic unless Dali changes this document.

Dialogue rule: Luma's dialogue must serve the scene and puzzle. Do not force generic classroom questions such as "what is your favourite subject?" unless the current scene specifically needs that idea. The English must stay at Eli's level: warm A1+ to early A2, short sentences, familiar words, clear repetition and forgiving target-word matching.

Voice rule: Luma speaks automatically after a single player gesture starts the scene if required by browser audio policy. After Luma speaks, the game opens a listening window. There must be no primary child-facing Ask Orb, Speak Answer or Tap Helper buttons. A small fallback may appear only when speech recognition or microphone access fails.

Visual rule: every level is a real 3D game scene using Three.js through React Three Fiber where possible. Static generated images, SVGs or public permissively licensed assets may be used as backgrounds, skyboxes, trophy shelves, textures, UI stickers or non-interactive set dressing when they make the game more beautiful and improve performance. Interactive puzzle objects should normally be Three.js/R3F objects unless a 2D asset is clearly better.


## World identity

Sky Islands Quest is the first V2 saga and should feel like a soft magical rescue mission across floating islands. Eli is repairing broken sky bridges with her English voice, helping Luma remember who she is and collecting magical rewards that unlock the Storm Crown Citadel.

## Core fantasy

- The Sky Bridges have been broken by a gentle magical storm.
- Luma, the glowing sphere companion, has lost pieces of her sky memory.
- Each island is a 3D animated level with eight small puzzles.
- Speech is the main power: words light lanterns, open gates, mix potions, move clouds, repair bridges and calm storms.
- After an island is completed, the game returns to the world map and plays a bridge-building animation to the next island.

## Map and level loop

- World map first: floating route of six islands, locked islands fogged, completed islands glowing.
- First entry: Luma appears centre screen, introduces herself, then flies to the top-left companion position.
- Eli taps the current unlocked island to enter its level.
- Each level scene shows only essential HUD: Luma top-left, speech bubble, island name, eight gem progress dots and tiny fallback only when needed.
- After eight tasks, show reward pop-in, celebration, return to map, build bridge and unlock next island.

## Art and asset direction

- Use React Three Fiber and Three.js as the main scene engine.
- Use procedural low-poly objects first for islands, docks, clouds, bridges, gates, keys, potions and reward pedestals.
- Generated images or SVGs may be used as sky backdrops, far scenery, trophy shelf art, reward icons and soft UI stickers.
- Public assets may be used only if permissively licensed, locally hosted, optimised and recorded in an attribution file.
- The goal is cute, vibrant, animated and toy-like, not placeholder geometry or dashboard panels.

## Sound direction

- Soft wind bed on the map.
- Island-specific ambient loops: dock bells, breakfast breeze, observatory twinkles, stage rhythm, London gate wind, citadel storm hum.
- Short success chimes for each task.
- Reward fanfare after eight tasks.
- Bridge-building sound: soft stones, cloud puffs and magic shimmer.

## Rewards

- Cloud Compass.
- Sunberry Basket.
- Star Map Lens.
- Thunder Drum.
- Red Bus Ticket.
- Storm Crown Key.

## Level designs

## 1. Cloud Harbor

**Story purpose:** Luma wakes beside a tiny floating dock. The sky bridges are broken, and Eli must use her English voice to wake the harbour, find the first key and open the route to Breakfast Breeze.

**3D scene:** A floating sky dock with soft blue clouds, a tiny harbour, sleepy lantern, folded flag, silver key puffs, bubbling breeze potion, small cloud gate, spell circle and broken bridge pieces.

**Core mechanic:** Voice-led object activation. Eli speaks simple magic lines to wake each object. Objects glow, wiggle and animate when active.

**English focus:** Hello, name, feelings, polite requests, seeing objects, simple magic imperatives.

**Reward:** Cloud Compass.

**Eight task sequence:**

### 1. Wake Luma
- **Screen object:** Luma appears sleepy in the centre of the map-level transition.
- **Luma line:** Say hello to me. Say: Hello Luma, I am Eli.
- **Eli target line:** Hello Luma, I am Eli.
- **Target words:** hello, Luma, Eli
- **Success animation:** Luma wakes, smiles, glows and flies to the top-left companion position.
- **Gentle hint:** Say hello to Luma.
- **Support interaction:** Tap Luma once only if the first audio gesture is required.

### 2. Light the Sky Lantern
- **Screen object:** A small lantern is dark on the dock.
- **Luma line:** The harbour is sleepy. Say: Light the lantern, please.
- **Eli target line:** Light the lantern, please.
- **Target words:** light, lantern, please
- **Success animation:** Lantern turns on and warm yellow glow spreads across the dock.
- **Gentle hint:** Use light, lantern and please.
- **Support interaction:** Lantern can pulse when tapped, but speech solves it.

### 3. Raise the Cloud Flag
- **Screen object:** A cute flag is folded down on a tiny pole.
- **Luma line:** The flag wants a happy wind. Say: I am happy today.
- **Eli target line:** I am happy today.
- **Target words:** happy, today
- **Success animation:** Flag rises, waves and tiny cloud puffs clap.
- **Gentle hint:** Say happy today.

### 4. Find the Silver Key
- **Screen object:** Three cloud puffs float above the dock, one hides a key.
- **Luma line:** I see something shiny. Say: I can see the silver key.
- **Eli target line:** I can see the silver key.
- **Target words:** see, silver, key
- **Success animation:** The puffs pop away and the silver key floats into Eli's collection.
- **Gentle hint:** Use see, silver and key.
- **Support interaction:** Eli may tap the shining puff after speaking.

### 5. Mix the Breeze Potion
- **Screen object:** A tiny potion bowl bubbles with blue drops and star dust.
- **Luma line:** The wind needs a potion. Say: Add blue rain, please.
- **Eli target line:** Add blue rain, please.
- **Target words:** add, blue, rain, please
- **Success animation:** Potion turns bright blue and sends sparkles upward.
- **Gentle hint:** Use blue rain, please.
- **Support interaction:** Blue droplet can be dragged over the bowl after the line is spoken.

### 6. Ask the Tiny Gate
- **Screen object:** A small cloud gate blocks the dock path.
- **Luma line:** Ask the gate kindly. Say: Open the gate, please.
- **Eli target line:** Open the gate, please.
- **Target words:** open, gate, please
- **Success animation:** Gate opens with a soft cloud swirl.
- **Gentle hint:** Say open gate, please.

### 7. Cast the Cloud Spell
- **Screen object:** A glowing spell circle appears on the dock floor.
- **Luma line:** Now use a magic sentence. Say: Clouds, show the way.
- **Eli target line:** Clouds, show the way.
- **Target words:** clouds, show, way
- **Success animation:** The spell circle spins and a glowing route appears in the sky.
- **Gentle hint:** Say clouds, show the way.

### 8. Open the First Bridge
- **Screen object:** Broken bridge pieces float near the edge of the dock.
- **Luma line:** One brave sentence will help the bridge. Say: I am ready for the next island.
- **Eli target line:** I am ready for the next island.
- **Target words:** ready, next, island
- **Success animation:** Bridge pieces shake, glow and prepare for the map bridge animation.
- **Gentle hint:** Say ready for the next island.

## 2. Breakfast Breeze

**Story purpose:** A warm breakfast island is full of sleepy food clouds. The Sunberry Basket has rolled away, and Eli must feed the kind breeze so it can carry the bridge onward.

**3D scene:** A picnic-style floating island with a sunberry table, cereal cloud, toast boats, orange juice kite, tiny hungry wind bird, jam jar, basket nest and warm breeze gate.

**Core mechanic:** Choosing, counting and moving food objects with short spoken lines. Food props bounce and travel to the correct place.

**English focus:** Food, drink, likes, quantities, polite choices and simple directions.

**Reward:** Sunberry Basket.

**Eight task sequence:**

### 1. Open the Picnic Cloud
- **Screen object:** A closed picnic cloud with a sun-shaped latch.
- **Luma line:** The picnic cloud is closed. Say: Open the picnic, please.
- **Eli target line:** Open the picnic, please.
- **Target words:** open, picnic, please
- **Success animation:** The cloud opens like a soft lunchbox.
- **Gentle hint:** Ask the picnic to open.

### 2. Wake the Cereal Cloud
- **Screen object:** A bowl-shaped cloud full of sleepy cereal stars.
- **Luma line:** The cereal stars are sleeping. Say: I like cereal.
- **Eli target line:** I like cereal.
- **Target words:** like, cereal
- **Success animation:** Cereal stars wake and spin around the bowl.
- **Gentle hint:** Say I like cereal.

### 3. Count the Toast Boats
- **Screen object:** Three tiny toast boats float in a milk river.
- **Luma line:** Count the toast boats. Say: There are three toast boats.
- **Eli target line:** There are three toast boats.
- **Target words:** three, toast, boats
- **Success animation:** The three boats line up and toot softly.
- **Gentle hint:** Use three and toast boats.

### 4. Pour the Orange Juice
- **Screen object:** A juice kite with an empty cup below it.
- **Luma line:** The cup is empty. Say: Orange juice, please.
- **Eli target line:** Orange juice, please.
- **Target words:** orange, juice, please
- **Success animation:** The kite pours glowing orange juice into the cup.
- **Gentle hint:** Say orange juice, please.

### 5. Feed the Wind Bird
- **Screen object:** A tiny wind bird waits beside crumbs.
- **Luma line:** The bird is hungry. Say: Here is some toast.
- **Eli target line:** Here is some toast.
- **Target words:** here, toast
- **Success animation:** Toast crumbs fly to the bird and it chirps a breeze note.
- **Gentle hint:** Use here and toast.

### 6. Find the Sunberry Basket
- **Screen object:** A basket is hidden behind a jam jar.
- **Luma line:** I found something. Say: The basket is behind the jam.
- **Eli target line:** The basket is behind the jam.
- **Target words:** basket, behind, jam
- **Success animation:** Jam jar wiggles aside and the Sunberry Basket appears.
- **Gentle hint:** Say basket behind the jam.

### 7. Fill the Basket
- **Screen object:** Sunberries float above the picnic table.
- **Luma line:** Help me fill it. Say: Put sunberries in the basket.
- **Eli target line:** Put sunberries in the basket.
- **Target words:** put, sunberries, basket
- **Success animation:** Sunberries bounce into the basket one by one.
- **Gentle hint:** Say sunberries in the basket.

### 8. Call the Warm Breeze
- **Screen object:** A warm breeze gate waits at the island edge.
- **Luma line:** The bridge needs wind. Say: Warm breeze, show the way.
- **Eli target line:** Warm breeze, show the way.
- **Target words:** warm, breeze, show, way
- **Success animation:** A warm wind ribbon flies back to the map route.
- **Gentle hint:** Say warm breeze, show the way.

## 3. School Star Observatory

**Story purpose:** The school stars are asleep inside a glass observatory. Eli repairs the Star Map Lens by speaking to objects that float like constellations.

**3D scene:** A round floating observatory with a giant telescope, star clock, book constellations, floating bag, pencil star, cloud desk and sky blackboard.

**Core mechanic:** Tapping glowing star objects, aligning telescope parts and speaking short story-useful school phrases.

**English focus:** School objects, time phrases, possession, location and action words. Keep it story-led, not a classroom quiz.

**Reward:** Star Map Lens.

**Eight task sequence:**

### 1. Open the Observatory Dome
- **Screen object:** Closed dome roof with moon latch.
- **Luma line:** The stars cannot come in. Say: Open the star roof, please.
- **Eli target line:** Open the star roof, please.
- **Target words:** open, star, roof, please
- **Success animation:** Dome petals open and stars drift in.
- **Gentle hint:** Ask the star roof to open.

### 2. Wake the Blue Telescope
- **Screen object:** Large blue telescope looking down.
- **Luma line:** The telescope is looking the wrong way. Say: Telescope, find the English star.
- **Eli target line:** Telescope, find the English star.
- **Target words:** telescope, English, star
- **Success animation:** Telescope turns toward a bright English star.
- **Gentle hint:** Say English star.

### 3. Set the Star Clock
- **Screen object:** Floating clock with missing number nine.
- **Luma line:** The star clock is lost. Say: School starts at nine.
- **Eli target line:** School starts at nine.
- **Target words:** school, starts, nine
- **Success animation:** Number nine pops into the clock and bells sparkle.
- **Gentle hint:** Use school, starts and nine.

### 4. Pack the Magic Bag
- **Screen object:** Open school bag with book, pencil and star.
- **Luma line:** The bag needs one book. Say: Put the book in my bag.
- **Eli target line:** Put the book in my bag.
- **Target words:** put, book, bag
- **Success animation:** Book jumps into the bag and the bag grows tiny wings.
- **Gentle hint:** Say book in my bag.

### 5. Find the Pencil Star
- **Screen object:** Pencil-shaped star hiding behind a cloud desk.
- **Luma line:** Tell Luma where it is. Say: The pencil is behind the cloud.
- **Eli target line:** The pencil is behind the cloud.
- **Target words:** pencil, behind, cloud
- **Success animation:** Cloud desk moves aside and pencil star flies to the board.
- **Gentle hint:** Use behind the cloud.

### 6. Draw the Star Path
- **Screen object:** Sky blackboard with dotted route.
- **Luma line:** Help me draw the path. Say: Draw a line to the star.
- **Eli target line:** Draw a line to the star.
- **Target words:** draw, line, star
- **Success animation:** A glowing line draws itself across the board.
- **Gentle hint:** Say draw a line.

### 7. Shine the Star Map Lens
- **Screen object:** Lens covered in grey dust.
- **Luma line:** Clean it with words. Say: The lens is shiny now.
- **Eli target line:** The lens is shiny now.
- **Target words:** lens, shiny, now
- **Success animation:** Dust blows away and the lens sends a beam to the sky.
- **Gentle hint:** Say shiny lens.

### 8. Read the Star Clue
- **Screen object:** Star clue floating above the telescope.
- **Luma line:** Read the clue with me. Say: The next island is singing.
- **Eli target line:** The next island is singing.
- **Target words:** next, island, singing
- **Success animation:** Star clue turns into a music note bridge signal.
- **Gentle hint:** Say next island singing.

## 4. Rhythm Cloud Stage

**Story purpose:** The clouds have forgotten their song. Eli uses simple performance words to wake the stage and calm the thunder drums.

**3D scene:** A cloud concert stage with bouncing speakers, glowing microphone, guitar clouds, curtain stars, rhythm pads and friendly thunder puffs.

**Core mechanic:** Call-and-response performance, rhythm pad taps and spoken stage spells.

**English focus:** Can, hobbies, performance phrases and short confidence sentences.

**Reward:** Thunder Drum.

**Eight task sequence:**

### 1. Turn On the Stage Lights
- **Screen object:** Four sleepy stage lights.
- **Luma line:** The show needs light. Say: Lights on, please.
- **Eli target line:** Lights on, please.
- **Target words:** lights, on, please
- **Success animation:** Lights pop on one at a time.
- **Gentle hint:** Say lights on, please.

### 2. Wake the Microphone
- **Screen object:** Glowing microphone with closed eyes.
- **Luma line:** Tell the mic what you can do. Say: I can sing.
- **Eli target line:** I can sing.
- **Target words:** can, sing
- **Success animation:** Microphone wakes and sends a sound ripple.
- **Gentle hint:** Say I can sing.

### 3. Clap the Cloud Beat
- **Screen object:** Three rhythm pads on the floor.
- **Luma line:** Make a tiny beat. Say: I can clap the beat.
- **Eli target line:** I can clap the beat.
- **Target words:** can, clap, beat
- **Success animation:** Rhythm pads bounce in sequence.
- **Gentle hint:** Use clap and beat.

### 4. Find the Guitar Cloud
- **Screen object:** Guitar-shaped cloud hiding behind curtains.
- **Luma line:** Tell me the dance clue. Say: I like dancing.
- **Eli target line:** I like dancing.
- **Target words:** like, dancing
- **Success animation:** Curtain opens and guitar cloud strums itself.
- **Gentle hint:** Say I like dancing.

### 5. Help the Shy Thunder Puff
- **Screen object:** Small purple thunder puff behind a speaker.
- **Luma line:** Make it feel safe. Say: You can join the show.
- **Eli target line:** You can join the show.
- **Target words:** join, show
- **Success animation:** Thunder puff smiles and joins the stage.
- **Gentle hint:** Say join the show.

### 6. Start the Tiny Show
- **Screen object:** Curtain star waiting above the stage.
- **Luma line:** Start the show with kind words. Say: Welcome to my show.
- **Eli target line:** Welcome to my show.
- **Target words:** welcome, show
- **Success animation:** Curtain star bursts into confetti.
- **Gentle hint:** Say welcome to my show.

### 7. Play the Thunder Drum
- **Screen object:** Round drum with cloud bolts.
- **Luma line:** Play the magic drum. Say: Boom, boom, make a bridge.
- **Eli target line:** Boom, boom, make a bridge.
- **Target words:** boom, make, bridge
- **Success animation:** Drum beats create bridge-shaped sound waves.
- **Gentle hint:** Say make a bridge.

### 8. Sing to the Wind Gate
- **Screen object:** Musical wind gate at the back of the stage.
- **Luma line:** One last line for the gate. Say: The song shows the way.
- **Eli target line:** The song shows the way.
- **Target words:** song, shows, way
- **Success animation:** Music notes fly into the map route.
- **Gentle hint:** Say song shows the way.

## 5. London Wind Gate

**Story purpose:** A magical London gate spins in the clouds. Eli follows travel clues to get the Red Bus Ticket and open the route to the citadel.

**3D scene:** A floating London-inspired gate with a clock tower, red bus cloud, wind arrows, tiny bridge, river ribbon and ticket booth.

**Core mechanic:** Directional puzzle and travel object repair.

**English focus:** Places, transport, simple directions, seeing and going.

**Reward:** Red Bus Ticket.

**Eight task sequence:**

### 1. Open the London Window
- **Screen object:** Round window filled with fog.
- **Luma line:** The fog is hiding a place. Say: I can see London.
- **Eli target line:** I can see London.
- **Target words:** see, London
- **Success animation:** Fog clears and the skyline appears.
- **Gentle hint:** Say I can see London.

### 2. Wake Big Ben
- **Screen object:** Cute clock tower with sleepy clock face.
- **Luma line:** Name the tower clue. Say: I can see Big Ben.
- **Eli target line:** I can see Big Ben.
- **Target words:** see, Big, Ben
- **Success animation:** Clock hands spin and ring softly.
- **Gentle hint:** Say Big Ben.

### 3. Fix the Red Bus Cloud
- **Screen object:** Red bus with one missing wheel cloud.
- **Luma line:** Tell the bus how we travel. Say: We can go by bus.
- **Eli target line:** We can go by bus.
- **Target words:** go, bus
- **Success animation:** Missing wheel cloud pops back on.
- **Gentle hint:** Say go by bus.

### 4. Find the Ticket Booth
- **Screen object:** Tiny ticket booth behind a wind swirl.
- **Luma line:** Ask for a ticket kindly. Say: A ticket, please.
- **Eli target line:** A ticket, please.
- **Target words:** ticket, please
- **Success animation:** Ticket booth opens and a red ticket glows.
- **Gentle hint:** Say ticket, please.

### 5. Turn Left at the Gate
- **Screen object:** Wind arrow pointing left and right.
- **Luma line:** Follow the arrow. Say: Turn left at the gate.
- **Eli target line:** Turn left at the gate.
- **Target words:** turn, left, gate
- **Success animation:** Left arrow lights and the path rotates.
- **Gentle hint:** Use turn left.

### 6. Cross the River Ribbon
- **Screen object:** Blue river ribbon between clouds.
- **Luma line:** Tell Luma where to go. Say: Go over the river.
- **Eli target line:** Go over the river.
- **Target words:** go, over, river
- **Success animation:** Small cloud bridge crosses the river ribbon.
- **Gentle hint:** Say over the river.

### 7. Stamp the Red Bus Ticket
- **Screen object:** Ticket stamp machine with star stamp.
- **Luma line:** Make the ticket ready. Say: Stamp the ticket, please.
- **Eli target line:** Stamp the ticket, please.
- **Target words:** stamp, ticket, please
- **Success animation:** Star stamp lands on the ticket with sparkles.
- **Gentle hint:** Say stamp the ticket.

### 8. Open the Wind Gate
- **Screen object:** Tall gate with London wind symbols.
- **Luma line:** Use your travel spell. Say: London wind, open the way.
- **Eli target line:** London wind, open the way.
- **Target words:** London, wind, open, way
- **Success animation:** Gate opens and shows the storm citadel far away.
- **Gentle hint:** Say London wind, open the way.

## 6. Storm Crown Citadel

**Story purpose:** The soft storm is hiding the Crown Door. Eli uses all collected rewards to restore the sky bridges and find Luma's missing memory.

**3D scene:** A safe but dramatic floating citadel with purple clouds, crown door, storm crystal, golden lever, reward pedestals and a glowing final bridge.

**Core mechanic:** Final multi-step restoration using previous rewards and longer brave sentences.

**English focus:** Problem statements, simple future with will, confidence sentences and review of key adventure words.

**Reward:** Storm Crown Key and Sky Islands completion.

**Eight task sequence:**

### 1. Name the Storm Problem
- **Screen object:** Storm crystal covering the crown symbol.
- **Luma line:** Tell me the problem. Say: The storm is hiding the crown.
- **Eli target line:** The storm is hiding the crown.
- **Target words:** storm, hiding, crown
- **Success animation:** Storm crystal shakes and becomes transparent.
- **Gentle hint:** Use storm, hiding and crown.

### 2. Use the Cloud Compass
- **Screen object:** Cloud Compass pedestal spinning wildly.
- **Luma line:** The compass is confused. Say: Compass, show the way.
- **Eli target line:** Compass, show the way.
- **Target words:** compass, show, way
- **Success animation:** Compass points to the crown door.
- **Gentle hint:** Say compass, show the way.

### 3. Share the Sunberry Basket
- **Screen object:** Basket pedestal beside a hungry storm puff.
- **Luma line:** The puff needs kindness. Say: Here is a sunberry.
- **Eli target line:** Here is a sunberry.
- **Target words:** sunberry
- **Success animation:** Storm puff eats and changes from grey to gold.
- **Gentle hint:** Say sunberry.

### 4. Shine the Star Map Lens
- **Screen object:** Star lens aimed at the wrong wall.
- **Luma line:** Aim the lens. Say: Shine on the door.
- **Eli target line:** Shine on the door.
- **Target words:** shine, door
- **Success animation:** Lens beam reveals crown runes.
- **Gentle hint:** Say shine on the door.

### 5. Beat the Thunder Drum
- **Screen object:** Thunder drum waiting on a floating stone.
- **Luma line:** Make a brave beat. Say: The drum is strong.
- **Eli target line:** The drum is strong.
- **Target words:** drum, strong
- **Success animation:** Drum pulse clears dark clouds.
- **Gentle hint:** Say drum is strong.

### 6. Use the Red Bus Ticket
- **Screen object:** Tiny red bus route across the storm.
- **Luma line:** Tell the route what we will do. Say: We will go to the crown.
- **Eli target line:** We will go to the crown.
- **Target words:** will, go, crown
- **Success animation:** Bus route lights and carries a sparkle to the door.
- **Gentle hint:** Use will, go and crown.

### 7. Pull the Golden Lever
- **Screen object:** Golden lever beside the Crown Door.
- **Luma line:** Tell me your plan. Say: I will find the last clue.
- **Eli target line:** I will find the last clue.
- **Target words:** will, find, clue
- **Success animation:** Lever lowers and Luma's memory star appears.
- **Gentle hint:** Say I will find the clue.

### 8. Open the Crown Door
- **Screen object:** Huge Crown Door with all rewards glowing.
- **Luma line:** Use your brave sentence. Say: I am brave and I can solve the mystery.
- **Eli target line:** I am brave and I can solve the mystery.
- **Target words:** brave, can, solve, mystery
- **Success animation:** Door opens, bridge network glows and Sky Islands celebration begins.
- **Gentle hint:** Say brave, solve mystery.

## Data implementation guidance

Represent these levels as structured data, not hard-coded scattered UI text. A task should include id, title, screenObject, lumaLine, expectedAnswer, targetWords, successAnimation, gentleHint, supportInteraction, soundCue and rewardEvent. Dialogue should be story-specific and should not fall back to generic classroom prompts unless the level story requires it.