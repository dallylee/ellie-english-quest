# Eli's English Quest 2.0: Crystal Mystery World Bible

This document is a storyline and implementation bible for Codex. It is source content, not loose inspiration. The game may use Gemini or browser speech to voice Luma, but the story beats, level order, rewards, task objects, target words and progression should remain deterministic unless Dali changes this document.

Dialogue rule: Luma's dialogue must serve the scene and puzzle. Do not force generic classroom questions such as "what is your favourite subject?" unless the current scene specifically needs that idea. The English must stay at Eli's level: warm A1+ to early A2, short sentences, familiar words, clear repetition and forgiving target-word matching.

Voice rule: Luma speaks automatically after a single player gesture starts the scene if required by browser audio policy. After Luma speaks, the game opens a listening window. There must be no primary child-facing Ask Orb, Speak Answer or Tap Helper buttons. A small fallback may appear only when speech recognition or microphone access fails.

Visual rule: every level is a real 3D game scene using Three.js through React Three Fiber where possible. Static generated images, SVGs or public permissively licensed assets may be used as backgrounds, skyboxes, trophy shelves, textures, UI stickers or non-interactive set dressing when they make the game more beautiful and improve performance. Interactive puzzle objects should normally be Three.js/R3F objects unless a 2D asset is clearly better.


## World identity

Crystal Mystery is the second saga. It should feel like a gentle investigation inside a glowing crystal cave system. The gameplay shifts away from bridge repair and into clue finding, light beams, colour restoration, hidden objects and simple detective thinking.

## Core fantasy

- The Rainbow Heart of the crystal caves has gone grey.
- A sleepy Grey Mist has hidden the colours, not out of evil but because it forgot how colours work.
- Eli and Luma investigate each cave, describe clues, place crystals and restore colour beams.
- The mystery progresses through colour, position, shape and comparison puzzles.
- At the end, the Rainbow Heart shines again and opens the Time Portal Case.

## How it differs from Sky Islands

- Sky Islands is route repair and bridge building. Crystal Mystery is investigation and light logic.
- The map is a cave network, not an island route.
- Progress animations should show colour returning to the cave walls, not bridge construction.
- The central mechanic is guiding light through crystals, finding hidden clues and describing what Eli sees.
- Luma should sound curious and detective-like: Where is it? What colour is it? Is it real or a reflection?

## Art and asset direction

- Use Three.js/R3F glowing crystal clusters, translucent maze walls, mirror planes, soft light beams and gem flowers.
- Generated images may be used for cave backplates, shimmering wall textures, crystal shelf art and soft colour wash overlays.
- Avoid heavy refraction shaders initially. Use emissive materials, particles and bloom-like CSS or canvas glow where available.
- Grey Mist should be soft and sleepy, never frightening.
- Rewards appear as rotating crystal objects with tiny light beams.

## Sound direction

- Soft cave hum and water drops.
- Crystal chimes for colour matches.
- Low gentle whoosh when mist moves.
- Mirror ripple sound at Mirror Lake.
- Final rainbow fanfare in the vault.

## Rewards

- Red Prism Spark.
- Emerald Leaf Shard.
- Mirror Drop Lens.
- Prism Hammer.
- Moon Thread Map.
- Rainbow Heart Badge.

## Level designs

## 1. Prism Cave Entrance

**Story purpose:** The Rainbow Heart has lost its first colour. Eli and Luma enter a crystal cave where every crystal remembers a different colour word.

**3D scene:** A glowing cave mouth with red, blue, yellow and green crystals, a sleeping prism door and tiny crystal moths.

**Core mechanic:** Colour identification and light matching.

**English focus:** Colours, polite requests and simple object descriptions.

**Reward:** Red Prism Spark.

**Eight task sequence:**

### 1. Wake the Cave Door
- **Screen object:** Prism door with closed crystal eyes.
- **Luma line:** The cave door is asleep. Say: Hello crystal cave.
- **Eli target line:** Hello crystal cave.
- **Target words:** hello, crystal, cave
- **Success animation:** Door eyes open and red light appears.
- **Gentle hint:** Say hello crystal cave.

### 2. Find the Red Crystal
- **Screen object:** Four colour crystals in a semicircle.
- **Luma line:** The first clue is red. Say: I can see the red crystal.
- **Eli target line:** I can see the red crystal.
- **Target words:** see, red, crystal
- **Success animation:** Red crystal rises and glows.
- **Gentle hint:** Say red crystal.

### 3. Touch the Blue Light
- **Screen object:** Blue beam crossing the cave floor.
- **Luma line:** Point to the blue light with words. Say: The blue light is here.
- **Eli target line:** The blue light is here.
- **Target words:** blue, light, here
- **Success animation:** Blue beam bends into the prism.
- **Gentle hint:** Say blue light is here.

### 4. Choose Yellow Dust
- **Screen object:** Three dust jars, red, yellow and green.
- **Luma line:** Choose the dust. Say: I need yellow dust, please.
- **Eli target line:** I need yellow dust, please.
- **Target words:** yellow, dust, please
- **Success animation:** Yellow dust swirls around Luma.
- **Gentle hint:** Say yellow dust, please.

### 5. Open the Green Shelf
- **Screen object:** Green shelf with a tiny locked gem box.
- **Luma line:** Ask the shelf kindly. Say: Open the green shelf, please.
- **Eli target line:** Open the green shelf, please.
- **Target words:** open, green, shelf, please
- **Success animation:** Shelf slides open and a gem box appears.
- **Gentle hint:** Say open green shelf.

### 6. Describe the Prism
- **Screen object:** Small prism floating in Luma's light.
- **Luma line:** Tell me what it is. Say: It is shiny and small.
- **Eli target line:** It is shiny and small.
- **Target words:** shiny, small
- **Success animation:** Prism spins and reflects tiny rainbows.
- **Gentle hint:** Use shiny and small.

### 7. Catch the Crystal Moth
- **Screen object:** Friendly moth carrying a red sparkle.
- **Luma line:** The moth has our clue. Say: Come here, little moth.
- **Eli target line:** Come here, little moth.
- **Target words:** come, here, moth
- **Success animation:** Moth lands on Luma's glow and drops the sparkle.
- **Gentle hint:** Say come here, moth.

### 8. Repair the First Colour
- **Screen object:** Rainbow Heart shard missing red.
- **Luma line:** Put back the red magic. Say: Red light, come back.
- **Eli target line:** Red light, come back.
- **Target words:** red, light, back
- **Success animation:** Red colour returns to the Rainbow Heart shard.
- **Gentle hint:** Say red light, come back.

## 2. Gem Garden

**Story purpose:** Crystals grow like flowers, but the garden has forgotten where each gem belongs. Eli restores colour and position clues.

**3D scene:** A garden inside a cave with gem flowers, leaf platforms, a small watering cloud, a snail miner and a hidden emerald seed.

**Core mechanic:** Finding objects by position and gently arranging gem flowers.

**English focus:** Location words: under, behind, next to, on. Nature and colours.

**Reward:** Emerald Leaf Shard.

**Eight task sequence:**

### 1. Water the Gem Flowers
- **Screen object:** Small watering cloud above dry gem flowers.
- **Luma line:** The flowers need water. Say: Rain on the flowers, please.
- **Eli target line:** Rain on the flowers, please.
- **Target words:** rain, flowers, please
- **Success animation:** Water cloud rains sparkles and flowers stand up.
- **Gentle hint:** Say rain on the flowers.

### 2. Find the Green Seed
- **Screen object:** Emerald seed under a crystal leaf.
- **Luma line:** Tell me where it is. Say: The seed is under the leaf.
- **Eli target line:** The seed is under the leaf.
- **Target words:** seed, under, leaf
- **Success animation:** Leaf lifts and seed jumps into a pot.
- **Gentle hint:** Say under the leaf.

### 3. Move the Pink Gem
- **Screen object:** Pink gem beside a small stone.
- **Luma line:** The pink gem is in the wrong place. Say: Put it next to the flower.
- **Eli target line:** Put it next to the flower.
- **Target words:** put, next, flower
- **Success animation:** Gem slides next to the flower and glows.
- **Gentle hint:** Say next to the flower.

### 4. Help the Snail Miner
- **Screen object:** Tiny snail miner carrying a lantern.
- **Luma line:** Ask the snail for help. Say: Can you help me, please?
- **Eli target line:** Can you help me, please?
- **Target words:** help, please
- **Success animation:** Snail smiles and lights the hidden path.
- **Gentle hint:** Say help me, please.

### 5. Open the Garden Gate
- **Screen object:** Leaf gate with two crystal buttons.
- **Luma line:** The gate needs a colour. Say: Press the green button.
- **Eli target line:** Press the green button.
- **Target words:** press, green, button
- **Success animation:** Green button sinks and the leaf gate opens.
- **Gentle hint:** Say green button.

### 6. Describe the Big Flower
- **Screen object:** Large blue gem flower beside small flowers.
- **Luma line:** Tell me about this flower. Say: The blue flower is big.
- **Eli target line:** The blue flower is big.
- **Target words:** blue, flower, big
- **Success animation:** Big flower opens and releases blue pollen sparkles.
- **Gentle hint:** Say blue flower is big.

### 7. Find the Hidden Bee Gem
- **Screen object:** Bee-shaped gem behind a mushroom crystal.
- **Luma line:** Where is the bee gem? Say: It is behind the mushroom.
- **Eli target line:** It is behind the mushroom.
- **Target words:** behind, mushroom
- **Success animation:** Mushroom tilts and the bee gem flies out.
- **Gentle hint:** Say behind the mushroom.

### 8. Grow the Emerald Leaf
- **Screen object:** Empty vine pedestal.
- **Luma line:** Grow the garden clue. Say: Green leaf, grow high.
- **Eli target line:** Green leaf, grow high.
- **Target words:** green, leaf, grow
- **Success animation:** Emerald leaf grows into a bridge vine.
- **Gentle hint:** Say green leaf, grow.

## 3. Mirror Lake

**Story purpose:** A still underground lake shows true clues and false reflections. Eli helps Luma describe what is real.

**3D scene:** Crystal lake with mirror surface, floating lily gems, reflection doors and two nearly identical crystal statues.

**Core mechanic:** Compare reflection and real object using simple descriptions.

**English focus:** Describing objects, same and different, left and right, real and fake.

**Reward:** Mirror Drop Lens.

**Eight task sequence:**

### 1. Wake the Mirror Lake
- **Screen object:** Still lake with sleeping ripples.
- **Luma line:** The lake is quiet. Say: Hello mirror lake.
- **Eli target line:** Hello mirror lake.
- **Target words:** hello, mirror, lake
- **Success animation:** Ripples spread and the reflection appears.
- **Gentle hint:** Say mirror lake.

### 2. Find the Real Star
- **Screen object:** One real star gem and one reflection star.
- **Luma line:** The real star is above us. Say: The star is in the sky.
- **Eli target line:** The star is in the sky.
- **Target words:** star, sky
- **Success animation:** Real star gem shines while reflection fades.
- **Gentle hint:** Say star in the sky.

### 3. Compare Two Statues
- **Screen object:** Two statues, one tall and one small.
- **Luma line:** Tell me the difference. Say: This statue is tall.
- **Eli target line:** This statue is tall.
- **Target words:** statue, tall
- **Success animation:** Tall statue bows and opens a drawer.
- **Gentle hint:** Say statue is tall.

### 4. Turn the Left Lily
- **Screen object:** Left and right lily gems on water.
- **Luma line:** Turn the left lily. Say: Turn the left flower.
- **Eli target line:** Turn the left flower.
- **Target words:** turn, left, flower
- **Success animation:** Left lily rotates and sends a light ripple.
- **Gentle hint:** Say left flower.

### 5. Name the Shiny Fish
- **Screen object:** Small crystal fish under the water.
- **Luma line:** Tell me what you see. Say: I can see a shiny fish.
- **Eli target line:** I can see a shiny fish.
- **Target words:** see, shiny, fish
- **Success animation:** Fish jumps and drops a mirror scale.
- **Gentle hint:** Say shiny fish.

### 6. Choose Same or Different
- **Screen object:** Two gem cards, one pair same colour, one different.
- **Luma line:** These two are not the same. Say: They are different.
- **Eli target line:** They are different.
- **Target words:** different
- **Success animation:** Different card flips and reveals a clue mark.
- **Gentle hint:** Say they are different.

### 7. Open the Reflection Door
- **Screen object:** Door in the reflection, handle above water.
- **Luma line:** The door needs truth words. Say: This is the real door.
- **Eli target line:** This is the real door.
- **Target words:** real, door
- **Success animation:** Reflection door dissolves and real door opens.
- **Gentle hint:** Say real door.

### 8. Catch the Mirror Drop
- **Screen object:** Silver drop floating above the lake.
- **Luma line:** Catch the lake clue. Say: Mirror drop, come to me.
- **Eli target line:** Mirror drop, come to me.
- **Target words:** mirror, drop, come
- **Success animation:** Drop flies into the reward lens.
- **Gentle hint:** Say mirror drop.

## 4. Crystal Workshop

**Story purpose:** The prism machines are broken. Eli repairs simple tools and learns how crystals change size, shape and light.

**3D scene:** A cosy workshop with gem hammer, prism wheel, size sorter, light beam pipe, tool shelf and tiny robot helper.

**Core mechanic:** Rotating, sorting and assembling crystals.

**English focus:** Big and small, round and square, bigger and smaller, tool words and action verbs.

**Reward:** Prism Hammer.

**Eight task sequence:**

### 1. Wake the Robot Helper
- **Screen object:** Tiny crystal robot with dark eyes.
- **Luma line:** Our helper is asleep. Say: Wake up, little robot.
- **Eli target line:** Wake up, little robot.
- **Target words:** wake, robot
- **Success animation:** Robot eyes light up and waves.
- **Gentle hint:** Say wake up robot.

### 2. Pick the Small Crystal
- **Screen object:** Big crystal and small crystal on sorter.
- **Luma line:** Choose the small one. Say: I need the small crystal.
- **Eli target line:** I need the small crystal.
- **Target words:** small, crystal
- **Success animation:** Small crystal slides into a machine slot.
- **Gentle hint:** Say small crystal.

### 3. Choose the Round Gem
- **Screen object:** Round, square and triangle gems.
- **Luma line:** The machine needs a round gem. Say: Put in the round gem.
- **Eli target line:** Put in the round gem.
- **Target words:** put, round, gem
- **Success animation:** Round gem rolls into place.
- **Gentle hint:** Say round gem.

### 4. Make the Blue Beam
- **Screen object:** Broken light pipe with blue lever.
- **Luma line:** Start the blue beam. Say: Blue light, go through.
- **Eli target line:** Blue light, go through.
- **Target words:** blue, light, go
- **Success animation:** Beam travels through the pipe.
- **Gentle hint:** Say blue light.

### 5. Use the Prism Hammer
- **Screen object:** Gem hammer floating above workbench.
- **Luma line:** Tap the magic tool with words. Say: Hammer, fix the crystal.
- **Eli target line:** Hammer, fix the crystal.
- **Target words:** hammer, fix, crystal
- **Success animation:** Hammer taps gently and crack lines vanish.
- **Gentle hint:** Say fix the crystal.

### 6. Compare Two Gems
- **Screen object:** Two gems, one bigger.
- **Luma line:** Tell me which one is bigger. Say: The purple gem is bigger.
- **Eli target line:** The purple gem is bigger.
- **Target words:** purple, gem, bigger
- **Success animation:** Bigger gem grows a sparkle crown.
- **Gentle hint:** Say purple gem is bigger.

### 7. Clean the Tool Shelf
- **Screen object:** Dusty shelf with missing star tool.
- **Luma line:** The shelf is dusty. Say: Clean the shelf, please.
- **Eli target line:** Clean the shelf, please.
- **Target words:** clean, shelf, please
- **Success animation:** Dust puff clears and the star tool appears.
- **Gentle hint:** Say clean shelf, please.

### 8. Build the Prism Key
- **Screen object:** Three gem parts floating over the bench.
- **Luma line:** Put the parts together. Say: Make a prism key.
- **Eli target line:** Make a prism key.
- **Target words:** make, prism, key
- **Success animation:** Parts snap into a glowing key.
- **Gentle hint:** Say make prism key.

## 5. Shadow Crystal Maze

**Story purpose:** A soft grey mist hides the path. Eli follows crystal signs and uses directions to guide Luma safely through the maze.

**3D scene:** A friendly low-risk maze made of translucent crystals, mist curtains, arrow stones and glowing footprints.

**Core mechanic:** Direction choices, path revealing and clue collection.

**English focus:** Directions, near and far, inside and outside, where questions.

**Reward:** Moon Thread Map.

**Eight task sequence:**

### 1. Ask the Maze to Glow
- **Screen object:** Dark maze entrance with moon thread symbol.
- **Luma line:** The path is sleepy. Say: Maze, show the path.
- **Eli target line:** Maze, show the path.
- **Target words:** maze, show, path
- **Success animation:** First path segment lights up.
- **Gentle hint:** Say show the path.

### 2. Follow the Right Arrow
- **Screen object:** Two arrow stones, left and right.
- **Luma line:** The bright arrow points right. Say: Turn right.
- **Eli target line:** Turn right.
- **Target words:** turn, right
- **Success animation:** Right path opens and left mist fades.
- **Gentle hint:** Say turn right.

### 3. Find the Near Crystal
- **Screen object:** One crystal near Luma, one far away.
- **Luma line:** Choose the close clue. Say: The crystal is near.
- **Eli target line:** The crystal is near.
- **Target words:** crystal, near
- **Success animation:** Near crystal rises with a chime.
- **Gentle hint:** Say crystal is near.

### 4. Look Inside the Box
- **Screen object:** Transparent crystal box with tiny key inside.
- **Luma line:** Tell me where the key is. Say: The key is inside the box.
- **Eli target line:** The key is inside the box.
- **Target words:** key, inside, box
- **Success animation:** Box opens and key floats out.
- **Gentle hint:** Say inside the box.

### 5. Open the Mist Curtain
- **Screen object:** Soft grey curtain blocking route.
- **Luma line:** Move the mist kindly. Say: Mist, move away, please.
- **Eli target line:** Mist, move away, please.
- **Target words:** mist, move, away, please
- **Success animation:** Mist curls away like sleepy smoke.
- **Gentle hint:** Say move away, please.

### 6. Find the Footprints
- **Screen object:** Glowing footprints crossing the floor.
- **Luma line:** Tell me what you found. Say: I found footprints.
- **Eli target line:** I found footprints.
- **Target words:** found, footprints
- **Success animation:** Footprints animate toward the exit.
- **Gentle hint:** Say found footprints.

### 7. Ask Where the Door Is
- **Screen object:** Hidden exit door behind crystal wall.
- **Luma line:** Ask a clear question. Say: Where is the door?
- **Eli target line:** Where is the door?
- **Target words:** where, door
- **Success animation:** Door outline appears in the wall.
- **Gentle hint:** Say where is the door.

### 8. Guide Luma Out
- **Screen object:** Exit portal with moon thread lock.
- **Luma line:** Give Luma the way out. Say: Go straight to the light.
- **Eli target line:** Go straight to the light.
- **Target words:** go, straight, light
- **Success animation:** Moon thread draws the exit route.
- **Gentle hint:** Say straight to the light.

## 6. Rainbow Heart Vault

**Story purpose:** The Rainbow Heart is almost whole. Eli combines every crystal reward and speaks the final colour spell to restore the cave.

**3D scene:** A circular vault with six reward pedestals, Rainbow Heart core, colour beams, final door and friendly crystal moth choir.

**Core mechanic:** Final colour restoration and review of descriptive clue language.

**English focus:** Review colours, positions, descriptions and simple opinion sentence.

**Reward:** Rainbow Heart Badge and Crystal Mystery completion.

**Eight task sequence:**

### 1. Place the Red Spark
- **Screen object:** Red pedestal beside the Rainbow Heart.
- **Luma line:** Put back the red light. Say: Red light is ready.
- **Eli target line:** Red light is ready.
- **Target words:** red, light, ready
- **Success animation:** Red beam connects to the Heart.
- **Gentle hint:** Say red light ready.

### 2. Place the Emerald Leaf
- **Screen object:** Green leaf pedestal.
- **Luma line:** Give the Heart green magic. Say: Green leaf, help the heart.
- **Eli target line:** Green leaf, help the heart.
- **Target words:** green, leaf, heart
- **Success animation:** Green beam grows vines around the Heart.
- **Gentle hint:** Say green leaf heart.

### 3. Use the Mirror Drop
- **Screen object:** Silver drop pedestal.
- **Luma line:** Tell the truth clue. Say: The mirror is clear.
- **Eli target line:** The mirror is clear.
- **Target words:** mirror, clear
- **Success animation:** Silver beam clears grey cracks.
- **Gentle hint:** Say mirror is clear.

### 4. Lift the Prism Hammer
- **Screen object:** Hammer pedestal with cracked gem.
- **Luma line:** Fix the last crack. Say: Hammer, fix the heart.
- **Eli target line:** Hammer, fix the heart.
- **Target words:** hammer, fix, heart
- **Success animation:** Crack disappears with a soft chime.
- **Gentle hint:** Say fix the heart.

### 5. Follow the Moon Thread
- **Screen object:** Moon thread path around the vault.
- **Luma line:** Trace the safe way. Say: The path goes around.
- **Eli target line:** The path goes around.
- **Target words:** path, around
- **Success animation:** Thread circles the Heart and unlocks final ring.
- **Gentle hint:** Say path goes around.

### 6. Name All the Colours
- **Screen object:** Six colour beams faintly pulsing.
- **Luma line:** Wake the colours. Say: Red, blue, yellow and green.
- **Eli target line:** Red, blue, yellow and green.
- **Target words:** red, blue, yellow, green
- **Success animation:** Beams brighten and crystal moths dance.
- **Gentle hint:** Say the colour words.

### 7. Say What You Think
- **Screen object:** Heart asks with a glowing question mark.
- **Luma line:** Tell me your idea. Say: I think it is magic.
- **Eli target line:** I think it is magic.
- **Target words:** think, magic
- **Success animation:** Heart pulse responds to Eli's idea.
- **Gentle hint:** Say I think it is magic.

### 8. Restore the Rainbow Heart
- **Screen object:** Complete Heart core in the vault centre.
- **Luma line:** Use the final spell. Say: Rainbow Heart, shine again.
- **Eli target line:** Rainbow Heart, shine again.
- **Target words:** rainbow, heart, shine
- **Success animation:** Rainbow wave fills the cave and unlocks Time Portal Case.
- **Gentle hint:** Say Rainbow Heart, shine again.

## Data implementation guidance

Crystal Mystery should use the same task engine as Sky Islands, but with a different world skin, map type, reward set and puzzle objects. Codex should not copy Sky Islands bridge language into this world. The progression animation is colour returning to the cave network.