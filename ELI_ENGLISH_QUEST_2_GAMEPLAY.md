# Eli's English Quest 2.0 Gameplay Design

## 1. Game Vision

Eli's English Quest 2.0 is a voice-led adventure saga that opens after Eli completes the original magic reward journey. The new game should feel like a real adventure, not a collection of disconnected mini-levels. Eli explores floating worlds, follows clues, speaks English to solve problems, and is guided by a glowing expressive orb.

The design goal is:

- More story.
- More voice interaction.
- More visual reward.
- More continuous exploration.
- More replay value over several weeks.
- Warm A1+ to early A2 English practice.
- No shame or harsh failure states.

Eli should feel that she is talking to a magical guide and solving a mystery with her voice.

## 2. Unlocking the Saga

The original v1 game remains the first part of Eli's journey.

When Eli unlocks all five magic rewards:

- Magic Egg.
- Magic Feather.
- Magic Potion.
- Magic Wand.
- Crown.

The game plays:

```text
public/assets/videos/end_game_animation.mp4
```

After the video, the home screen shows:

```text
ELI, ARE YOU READY FOR NEW ADVENTURE - CLICK HERE
```

Clicking that button opens the new adventure saga.

## 3. Saga Structure

The v2 saga has three games visible from the saga home screen.

### 3.1 Sky Islands Quest

Status: playable first.

Theme: floating islands, bridges, voice clues, magical exploration.

Sky Islands Quest is the first fully playable v2 game. Eli explores a chain of floating islands with the expressive orb guide.

### 3.2 Crystal Mystery

Status: visible but locked.

Theme: future mystery game with crystals, hidden patterns, and investigation.

Crystal Mystery becomes the next major adventure after Sky Islands is completed. It is shown on the home screen so Eli can see that the saga continues.

### 3.3 Time Portal Case

Status: visible but locked.

Theme: future time-travel case with clues from different moments.

Time Portal Case becomes the third major adventure after Crystal Mystery. It is also visible from the beginning, but greyed out.

## 4. Core Gameplay Loop

Each Sky Islands chapter follows a simple adventure loop:

1. Eli enters or selects an island.
2. The orb reacts to the island mood.
3. Eli explores the 3D scene.
4. A clue object becomes the current objective.
5. The orb asks an audio question or gives a spoken prompt.
6. Eli answers verbally.
7. If the answer is close enough, the clue is solved.
8. If the browser cannot hear clearly, Eli can try again or use the tap helper.
9. A 3D Magic Star or trophy reward appears.
10. The next clue or next bridge opens.

This loop is designed to make speaking English the key action. Eli is not just tapping answers; she is helping the world respond to her voice.

## 5. Voice Interaction Design

The preferred interaction is:

- Orb speaks the prompt.
- Eli says the sentence or answer aloud.
- The game listens.
- The game checks important target words.
- The orb responds with encouragement.

The fallback interaction is:

- Orb speaks or displays the prompt.
- Eli says the answer out loud anyway.
- Eli taps the helper button if speech recognition is unavailable or unclear.
- The game continues without blocking progress.

This ensures the game remains playable on browsers or devices where speech recognition is inconsistent.

## 6. Learning Level

The language level is A1+ to early A2.

The game practices:

- Introductions.
- Feelings.
- Polite requests.
- Food and drink.
- Likes and choices.
- Quantities.
- School subjects.
- Time phrases.
- Hobbies.
- Performance phrases.
- Places in London.
- Directions.
- Transport.
- Simple future with "will".
- Longer confidence sentences.

The game uses warm scaffolding. Mistakes are treated as part of learning, not as failure.

## 7. Guide Character: The Expressive Orb

The guide is a glowing animated orb with:

- Eyes.
- Tiny mouth.
- Expressive eyebrows.
- Mood-based color.
- Glow.
- Scale changes.
- Floating movement.
- Particles.
- Speech ripples.
- Voice tone instructions.

The orb is technically easier than a fully animated character, but it can still feel alive and expressive.

## 8. Orb Mood States

The orb has these moods:

### Happy

Used when Eli is doing well or starting a friendly interaction.

Visual feel:

- Blue/cyan glow.
- Soft eyes.
- Lifted brows.
- Smile.
- Gentle floating pulse.

Voice feel:

- Bright.
- Encouraging.
- Warm.

### Thinking

Used when clues are being introduced or Eli needs time to process.

Visual feel:

- Green glow.
- Look-up eyes.
- Thinking brows.
- Tiny mouth.
- Slower, curious motion.

Voice feel:

- Thoughtful.
- Clear.
- Slightly slower.

### Listening

Used when the game is waiting for Eli's spoken answer.

Visual feel:

- Pink glow.
- Focused eyes.
- Raised brows.
- Stronger pulse.
- Faster particles.
- Speech ripples in the 3D scene.

Voice feel:

- Quiet.
- Attentive.
- Gives Eli space to answer.

### Proud

Used when Eli solves a clue or earns a reward.

Visual feel:

- Gold glow.
- Sparkle eyes.
- Proud brows.
- Big smile.
- Reward lighting.

Voice feel:

- Celebratory.
- Specific praise.

### Sad

Used for a gentle miss or unclear speech.

Visual feel:

- Soft blue.
- Drooping eyes.
- Kind sad eyebrows.
- Small frown.

Voice feel:

- Reassuring.
- Helpful.
- Never disappointed.

### Scared

Used for danger or mystery scenes.

Visual feel:

- Purple glow.
- Wide eyes.
- Worried brows.
- Open mouth.

Voice feel:

- Suspenseful but safe.

### Surprised

Used when a clue appears.

Visual feel:

- Yellow glow.
- Wide eyes.
- High brows.
- Round mouth.

Voice feel:

- Curious.
- Amazed.

### Bored

Used sparingly when the orb is waiting playfully.

Visual feel:

- Teal glow.
- Half eyes.
- Flat brows.
- Flat mouth.

Voice feel:

- Playfully impatient.

### Annoyed

Used when Eli tries a locked bridge or wrong path.

Visual feel:

- Warm orange glow.
- Side eyes.
- Tilted brows.
- Wobbly mouth.

Voice feel:

- Teasing.
- Friendly.
- Never harsh.

## 9. Sky Islands Quest Overview

Sky Islands Quest is a six-chapter floating-island adventure.

The chapters are:

1. Cloud Harbor.
2. Breakfast Breeze.
3. School Star Observatory.
4. Rhythm Cloud Stage.
5. London Wind Gate.
6. Storm Crown Citadel.

Each chapter has:

- A theme.
- A 3D island.
- Three voice clue encounters.
- A chapter reward.
- A bridge or path to the next island.

## 10. Chapter 1: Cloud Harbor

Theme: introductions.

Reward: Cloud Compass.

Story:

The orb wakes beside a tiny sky dock. It needs Eli's voice to open the first bridge.

Learning goals:

- Say name.
- Say feeling.
- Use a polite request.

Clues:

### Silver Bell

Orb prompt:

```text
Hello, Eli. Say: My name is Eli and I am ready.
```

Expected answer:

```text
My name is Eli and I am ready.
```

Target words:

- name
- Eli
- ready

### Cloud Flag

Orb prompt:

```text
The wind is asking a question. How are you today?
```

Expected answer:

```text
I am happy today.
```

Target words:

- happy
- today

### Tiny Bridge

Orb prompt:

```text
Ask the bridge to open. Say: Open the bridge, please.
```

Expected answer:

```text
Open the bridge, please.
```

Target words:

- open
- bridge
- please

Chapter completion:

The Cloud Compass is earned and the next island opens.

## 11. Chapter 2: Breakfast Breeze

Theme: food, likes, quantities, choices.

Reward: Sunberry Basket.

Story:

Warm wind carries breakfast clues around a picnic island.

Learning goals:

- Talk about breakfast.
- Say likes.
- Count food.
- Make a polite choice.

Clues:

### Sunberry Bowl

Orb prompt:

```text
Tell the orb one food you like for breakfast.
```

Expected answer:

```text
I like cereal for breakfast.
```

Target words:

- like
- breakfast

### Toast Stack

Orb prompt:

```text
Count the toast. Say: There are three pieces of toast.
```

Expected answer:

```text
There are three pieces of toast.
```

Target words:

- three
- toast

### Juice Kite

Orb prompt:

```text
Choose a drink. Say: I would like orange juice, please.
```

Expected answer:

```text
I would like orange juice, please.
```

Target words:

- orange
- juice
- please

Chapter completion:

The Sunberry Basket is earned.

## 12. Chapter 3: School Star Observatory

Theme: school subjects and timetable clues.

Reward: Star Map Lens.

Story:

A telescope points at school stars. Each star needs a sentence to shine.

Learning goals:

- Name school subjects.
- Use simple time phrases.
- Talk about school bag items.

Clues:

### Blue Telescope

Orb prompt:

```text
What subject do you like? Say a full sentence.
```

Expected answer:

```text
I like English.
```

Target words:

- like
- English

### Star Clock

Orb prompt:

```text
Tell me when school starts. Say: School starts at nine o'clock.
```

Expected answer:

```text
School starts at nine o'clock.
```

Target words:

- school
- starts
- nine

### Floating School Bag

Orb prompt:

```text
What is in your school bag?
```

Expected answer:

```text
I have a book in my bag.
```

Target words:

- have
- book
- bag

Chapter completion:

The Star Map Lens is earned.

## 13. Chapter 4: Rhythm Cloud Stage

Theme: music, hobbies, and performance phrases.

Reward: Thunder Drum.

Story:

A stage made from clouds waits for a short performance.

Learning goals:

- Use "can".
- Talk about hobbies.
- Use simple performance language.

Clues:

### Glowing Microphone

Orb prompt:

```text
Tell the stage something you can do.
```

Expected answer:

```text
I can sing and dance.
```

Target words:

- can
- sing
- dance

### Cloud Guitar

Orb prompt:

```text
Say one hobby you like.
```

Expected answer:

```text
I like dancing.
```

Target words:

- like
- dancing

### Curtain Star

Orb prompt:

```text
Start the show. Say: Welcome to my show.
```

Expected answer:

```text
Welcome to my show.
```

Target words:

- welcome
- show

Chapter completion:

The Thunder Drum is earned.

## 14. Chapter 5: London Wind Gate

Theme: places, directions, and transport.

Reward: Red Bus Ticket.

Story:

A London gate turns slowly in the clouds, waiting for travel words.

Learning goals:

- Name a London place.
- Talk about transport.
- Give a simple direction.

Clues:

### Clock Tower

Orb prompt:

```text
Name a place in London. Say: I can see Big Ben.
```

Expected answer:

```text
I can see Big Ben.
```

Target words:

- see
- Big
- Ben

### Red Bus Cloud

Orb prompt:

```text
How can we travel? Say: We can go by bus.
```

Expected answer:

```text
We can go by bus.
```

Target words:

- go
- bus

### Wind Arrow

Orb prompt:

```text
Give a direction. Say: Turn left at the gate.
```

Expected answer:

```text
Turn left at the gate.
```

Target words:

- turn
- left
- gate

Chapter completion:

The Red Bus Ticket is earned.

## 15. Chapter 6: Storm Crown Citadel

Theme: final mystery and longer spoken answers.

Reward: Storm Crown Key.

Story:

The final island is loud and windy. The orb needs brave full sentences.

Learning goals:

- Use longer spoken answers.
- Explain a problem.
- Make a plan.
- Use confidence language.

Clues:

### Storm Crystal

Orb prompt:

```text
What is the problem? Say: The storm is hiding the crown.
```

Expected answer:

```text
The storm is hiding the crown.
```

Target words:

- storm
- hiding
- crown

### Golden Lever

Orb prompt:

```text
Tell the orb your plan. Say: I will find three clues.
```

Expected answer:

```text
I will find three clues.
```

Target words:

- will
- find
- clues

### Crown Door

Orb prompt:

```text
Open the crown door with a brave sentence.
```

Expected answer:

```text
I am brave and I can solve the mystery.
```

Target words:

- brave
- solve
- mystery

Chapter completion:

The Storm Crown Key is earned. Sky Islands Quest is complete, and Crystal Mystery can become available in the saga progression.

## 16. Rewards

There are two layers of reward.

### 16.1 Clue Rewards

When Eli solves a clue:

- A 3D Magic Star appears.
- The orb becomes proud or happy.
- The environment reacts.
- The clue is marked solved.
- The next clue becomes available.

The Magic Star can be dragged/spun in the 3D scene.

### 16.2 Chapter Rewards

When Eli completes all three clues on an island, she earns the chapter reward:

1. Cloud Compass.
2. Sunberry Basket.
3. Star Map Lens.
4. Thunder Drum.
5. Red Bus Ticket.
6. Storm Crown Key.

Chapter rewards are collected into Sky Islands progress.

When a chapter is completed:

- A 3D trophy-style object appears.
- The orb enters a proud mood.
- The next island bridge opens.
- The reward is stored in progress.

## 17. World Interaction

The current interaction style is tap-to-select and voice-to-solve.

Eli can:

- Tap islands.
- Tap the current clue actions.
- Ask the orb to speak.
- Speak an answer.
- Use the tap helper if needed.
- Drag the 3D reward to rotate it.

Future versions can expand this with:

- Tap-to-move avatar movement.
- More clue objects per island.
- Hidden collectibles.
- Small environmental puzzles.
- More physical bridge-opening animations.

## 18. Dynamic 3D Environment

The Sky Islands are designed to feel alive.

Current 3D life includes:

- Floating island motion.
- Animated orb motion.
- Mood-based orb color.
- Mood-based orb particles.
- Floating clouds.
- Clouds that react to voice states.
- Speech ripple rings when the orb is speaking/listening.
- 3D reward objects.
- Dynamic lights.

The environment responds to:

- Orb mood.
- Whether the game is waiting for Eli.
- Whether Eli is speaking.
- Whether a clue has been solved.

## 19. Correct Answer Flow

When Eli answers correctly:

1. The game plays a correct sound effect if sound is enabled.
2. The orb mood changes to proud or happy.
3. The clue is saved as completed.
4. A 3D star or trophy appears.
5. The game updates the clue track.
6. The next clue or island becomes available.
7. If signed in and not in debug mode, progress can sync to Firestore.

## 20. Gentle Miss Flow

When Eli's answer is unclear or missing:

1. The orb changes to a sad/gentle mood.
2. The game gives supportive feedback.
3. The expected sentence is shown.
4. Eli can try again.
5. Eli can use the tap helper.
6. No shame language is used.

The design assumes that a child may be shy, noisy, or using a device with unreliable microphone support.

## 21. Tap Helper Philosophy

The tap helper is not a cheat in the child-facing sense. It is an accessibility and device support mechanism.

It exists because:

- Browser speech recognition can fail.
- Some mobile browsers limit microphone access.
- Accents and background noise can reduce recognition quality.
- Eli should still be encouraged to speak aloud even if the browser cannot verify perfectly.

The ideal use is:

1. Eli says the answer aloud.
2. If the device does not hear clearly, she taps the helper.
3. The adventure continues.

## 22. Parent Login and Eli PIN in Gameplay

Before entering the saga, the player sees a parent login screen.

Options:

- Parent signs in and unlocks Eli's profile with a PIN.
- Continue on this browser in local-only mode.

The gameplay reason for this is cross-device continuity:

- Eli can continue from another browser or phone.
- Parents control the account boundary.
- Eli has a child-friendly PIN gate.

The PIN is not meant to be adult-level security; Firebase Auth is the real security layer.

## 23. Save and Continue Experience

Progress should allow Eli to return later and continue.

Saved gameplay state includes:

- Current island.
- Completed island IDs.
- Completed clue IDs.
- Collected rewards.
- Saga unlocks.

The player should not need to replay the full adventure every time.

## 24. Future Game: Crystal Mystery

Crystal Mystery is the second planned saga game.

Suggested gameplay direction:

- Eli enters a crystal cave or floating crystal city.
- The orb helps her investigate missing crystal colors.
- English focus can include descriptions, colors, shapes, comparisons, and simple past clues.
- Gameplay can involve matching spoken clues to crystals.
- Rewards can be crystal shards or mystery badges.
- Completion unlocks Time Portal Case.

Possible learning targets:

- It is big/small.
- It is blue and shiny.
- I found a clue.
- The crystal is behind the door.
- I think it is the red crystal.

## 25. Future Game: Time Portal Case

Time Portal Case is the third planned saga game.

Suggested gameplay direction:

- Eli becomes a time detective.
- The orb opens portals to different times and places.
- Eli uses English to ask questions, describe events, and solve sequence puzzles.
- Gameplay can involve choosing the correct portal based on spoken clues.

Possible learning targets:

- Yesterday, today, tomorrow.
- First, next, then.
- I went to school.
- I will go to London.
- Where is the key?
- The clue is in the old clock.

## 26. Emotional Tone

The emotional tone should be:

- Magical.
- Warm.
- Patient.
- Curious.
- Slightly adventurous.
- Never scary for too long.
- Never punitive.

Storm Crown Citadel can feel exciting and mysterious, but not frightening.

The orb should feel like a companion that believes in Eli.

## 27. Session Length

Sky Islands is designed as a multi-session game.

A short session can be:

- One clue.
- One island.
- One reward.

A longer session can be:

- Multiple islands.
- A full chapter arc.

The game should not require completing everything in one sitting.

## 28. Success Criteria

The gameplay is successful if:

- Eli wants to speak to the orb.
- Eli understands what to do next.
- Eli can progress even with imperfect pronunciation.
- Rewards feel exciting.
- The 3D scene feels alive.
- The locked future games make the saga feel bigger.
- Parents can see that progress is saved.
- The game encourages English without pressure.

## 29. Current Gameplay Limitations

The current implementation is the first playable v2 slice.

Current limitations:

- Sky Islands has structured clue encounters but not yet full avatar movement.
- Crystal Mystery and Time Portal Case are visible but not implemented.
- Gemini native audio depends on the Cloudflare WebSocket worker working correctly.
- Browser speech fallback is still important.
- 3D assets are mostly procedural rather than fully curated GLB worlds.

## 30. Recommended Gameplay Next Steps

Recommended next gameplay improvements:

- Add a small player marker or avatar that moves between clue points.
- Add bridge-opening animations between islands.
- Add more hidden clue objects per island.
- Add island-specific ambient sounds.
- Add a quest journal that stays collapsed by default.
- Add end-of-island celebration scenes.
- Add replayable speaking challenges for earned rewards.
- Build Crystal Mystery after Sky Islands progression is stable.
- Add parent-facing progress summary outside the child play surface.
