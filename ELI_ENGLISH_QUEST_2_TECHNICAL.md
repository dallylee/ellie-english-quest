# Eli's English Quest 2.0 Technical Design

## 1. Purpose

Eli's English Quest 2.0 extends the original browser game with a new voice-oriented adventure saga that opens after Eli completes the first game. The technical goal is to preserve all existing v1 behavior while adding a richer React and React Three Fiber adventure layer, cross-device progress support, and a Gemini voice gateway that can use native audio when the Cloudflare Worker WebSocket proxy is available.

The implementation is intentionally layered:

- The original v1 mini-game app remains the stable base.
- V2 is mounted only when unlocked or when a dev-only debug hook is used.
- V2 progress is stored in a separate `saga` branch of the existing progress object.
- Firebase sync is optional and gated behind parent login plus Eli PIN.
- Gemini native voice is attempted through the Cloudflare WebSocket proxy, with browser TTS/STT and tap fallback always available.

## 2. Current Stack

- Vite for local development and production build.
- Vanilla JavaScript for the original v1 app shell.
- React for the v2 saga application.
- React DOM for mounting the saga inside the existing app root.
- Three.js, React Three Fiber, and Drei for the Sky Islands 3D scene.
- Firebase Auth and Firestore for parent login, Eli profile gate, and cross-browser progress sync.
- Cloudflare Worker WebSocket proxy for Gemini Multimodal Live API access.
- Browser Speech Synthesis and Speech Recognition as fallback voice systems.
- LocalStorage for existing v1 progress and local v2 fallback progress.
- SessionStorage for dev-only v2 unlock testing.

## 3. Key Source Areas

The main implementation areas are:

- `src/main.js`: original app entry, v1 routing, v2 unlock flow, end-game video, CTA, and dev unlock hook.
- `src/lib/storage.js`: default progress shape, v1 progression, and v2 `saga` progress branch.
- `src/v2/SagaApp.jsx`: React v2 root, login/local mode, saga home, Sky Islands game state.
- `src/v2/LoginScreen.jsx`: parent email/password login and Eli PIN gate.
- `src/v2/firebaseClient.js`: Firebase Auth and Firestore read/write helpers.
- `src/v2/skyIslandsData.js`: v2 constants, proxy URL, saga game list, orb mood definitions, Sky Islands content.
- `src/v2/voiceGuide.js`: Gemini Live WebSocket client, browser speech fallback, speech evaluation.
- `src/v2/VoiceInterface.jsx`: player-facing voice prompt UI and voice-state coordination.
- `src/v2/SkyIslandsCanvas.jsx`: R3F Sky Islands world, orb animation, clouds, speech ripples, 3D rewards.
- `src/v2/sagaProgress.js`: v2 Sky Islands progress helpers.
- `src/styles.css`: v1 styles plus v2 saga, orb, canvas, and responsive UI styles.
- `firestore.rules`: intended Firestore access boundary.
- `scripts/validate-content.mjs`: content and architectural validation checks.

## 4. Unlock Flow

V2 is gated behind v1 completion.

The normal unlock requirement is that all magic reward milestones are unlocked:

- Magic Egg at 10 stars.
- Magic Feather at 20 stars.
- Magic Potion at 30 stars.
- Magic Wand at 40 stars.
- Crown at 50 stars.

When the condition is met:

1. `src/main.js` detects that all magic rewards are unlocked.
2. If the v2 end-game video has not been seen, it renders a video screen.
3. The video source is `/assets/videos/end_game_animation.mp4`.
4. When the video ends or the Continue button is pressed, v2 is marked ready in local progress.
5. The home screen shows the CTA:

   `ELI, ARE YOU READY FOR NEW ADVENTURE - CLICK HERE`

6. Clicking the CTA dynamically imports and mounts `src/v2/SagaApp.jsx`.

This dynamic import keeps the heavy v2 dependencies out of the initial v1 bundle until the new adventure is opened.

## 5. Dev-Only Unlock Hook

For testing, development builds expose:

```js
window.debugUnlockV2()
```

This function:

- Is available only when `import.meta.env.DEV` is true.
- Sets `sessionStorage.debug_v2_unlocked = "true"`.
- Immediately renders the same end-game video sequence.
- Shows the New Adventure CTA after the video continue action.
- Allows the saga to mount while the flag exists.
- Does not grant stars.
- Does not add trophies.
- Does not persist v2 unlock to localStorage.
- Does not write to Firestore.
- Is absent from the production bundle.

This lets development testing reach the v2 game without altering Eli's permanent progress.

## 6. Progress Model

The original progress structure remains intact and now includes a `saga` branch.

The v2 branch includes:

```js
saga: {
  version: 2,
  endVideoSeen: false,
  newAdventureUnlocked: false,
  selectedGameId: "sky-islands",
  parentAuth: {
    status: "local",
    uid: null,
    email: null,
    lastSyncedAt: null
  },
  profile: {
    activeProfileId: "eli",
    eliPinSet: false,
    eliPinVerifiedAt: null
  },
  sagaUnlocks: {
    skyIslands: true,
    crystalMystery: false,
    timePortalCase: false
  },
  skyIslands: {
    currentIslandId: "cloud-harbor",
    completedIslandIds: [],
    collectedRewards: [],
    clueProgress: {},
    lastPromptAt: null,
    updatedAt: null
  }
}
```

The v2 data is merged safely when old saves are loaded. This avoids breaking existing v1 progress if a browser already has an older save format.

## 7. Firebase Integration

Firebase is used for parent-managed cross-device progress.

The configured Firebase project is:

- Project ID: `eliv2-52f56`
- Auth domain: `eliv2-52f56.firebaseapp.com`
- Auth mode expected: Email/password.
- Firestore mode expected: should move out of Test Mode before production use.

The login flow is:

1. Parent signs in with email/password or creates a login.
2. Eli enters a child-friendly PIN.
3. The PIN is hashed with Web Crypto before storing/verifying.
4. The app loads remote saga progress from Firestore.
5. Remote saga progress is merged with local saga progress.
6. During normal play, v2 progress can sync back to Firestore.

The Eli PIN is a profile gate, not the main security boundary. Firebase Auth is the security boundary.

## 8. Firestore Data Layout

The intended Firestore paths are:

- `users/{uid}/profiles/eli`
- `users/{uid}/progress/sky-islands`
- `users/{uid}/progress/sagaUnlocks`
- `users/{uid}/settings/eli`
- `users/{uid}/rewards/saga`

The current Firestore rule scaffold is:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This means only the signed-in Firebase user can read or write their own user subtree.

## 9. Privacy Rules

The game should not store Eli's audio or transcripts.

The implementation stores:

- Progress state.
- Island state.
- Completed clue IDs.
- Rewards.
- Settings.
- Timestamps.
- Firebase parent/profile metadata.

The implementation does not store:

- Audio recordings.
- Gemini audio responses.
- Speech Recognition transcripts.
- Long conversation history.

Voice transcripts may exist briefly in React state for feedback, but they are not written to localStorage or Firestore.

## 10. Voice Architecture

The voice system is implemented through `createVoiceGuide()` in `src/v2/voiceGuide.js`.

It provides the client-facing interface:

- `startSession`
- `stopSession`
- `playGuidePrompt`
- `listenForAnswer`
- `evaluateAnswer`
- `fallbackToTap`

The voice layer attempts Gemini native audio first. If that fails, it falls back to browser speech.

## 11. Gemini Live WebSocket Proxy

The current proxy URL is:

```js
wss://lucky-dawn-d422.dallyzg.workers.dev
```

The intended connection is:

```js
new WebSocket("wss://lucky-dawn-d422.dallyzg.workers.dev")
```

The Worker is expected to securely connect to Gemini's Multimodal Live API and inject the Gemini API key server-side. The browser never receives the Gemini API key.

The client sends a Live API setup message first:

```js
{
  setup: {
    model: "models/gemini-2.0-flash-exp",
    generationConfig: {
      responseModalities: ["AUDIO"]
    },
    systemInstruction: {
      parts: [
        {
          text: "Patient teacher and orb mood instructions..."
        }
      ]
    }
  }
}
```

After `setupComplete`, the client sends a prompt turn:

```js
{
  clientContent: {
    turns: [
      {
        role: "user",
        parts: [
          {
            text: "Orb mood, scene, clue, and exact prompt..."
          }
        ]
      }
    ],
    turnComplete: true
  }
}
```

## 12. Native Audio Playback

Gemini Live audio is expected as streamed PCM audio chunks, usually inside `serverContent.modelTurn.parts[].inlineData`.

The frontend parser searches recursively for audio in these shapes:

- `inlineData.data` with `mimeType` beginning with `audio/`
- `inline_data.data`
- `audio`
- `audioContent`
- nested arrays/objects under `serverContent`

For PCM audio:

- Base64 is decoded.
- Bytes are interpreted as little-endian 16-bit PCM.
- Samples are converted to `Float32Array`.
- Audio is scheduled through the Web Audio API.
- Output sample rate defaults to 24 kHz unless the MIME type includes a rate.

If Live audio fails, browser speech synthesis reads the same guide prompt.

## 13. Browser Speech Fallback

Fallback voice behavior uses:

- Browser Speech Synthesis for the orb prompt.
- Browser Speech Recognition when available for Eli's spoken answer.
- Tap helper when speech recognition is unavailable or unreliable.

Answer evaluation is lightweight:

- The transcript is normalized.
- Target words are matched.
- A clue is accepted when enough target words are found.
- Mistakes produce gentle feedback, not failure language.

## 14. React Three Fiber Scene

The Sky Islands game uses R3F as an active gameplay surface, not a static background.

The scene includes:

- Low-poly floating islands.
- A mood-responsive expressive orb.
- Orb particles.
- Floating clouds.
- Speech ripples.
- Dynamic lights.
- Interactive 3D rewards.
- HTML island labels positioned in 3D.

The scene consumes explicit state from React:

- `mood`
- `voiceActivity`
- `rewardEvent`
- `activeIslandId`
- `skyProgress`

High-frequency animation stays inside `useFrame` rather than being pushed into React state every frame.

## 15. Expressive Orb Technical Behavior

The orb changes according to the current mood:

- Color.
- Emissive glow.
- Light intensity.
- Scale.
- Particle orbit intensity.
- Face expression through DOM overlay attached in 3D.
- Floating rhythm.

Important moods currently used in the core loop:

- `happy`: bright, encouraging idle/success mood.
- `thinking`: clue/exploration mood.
- `listening`: high-pulse listening state.
- `proud`: reward state.
- `sad`: gentle miss state.
- `annoyed`: playful locked-bridge state.

The 3D orb and the DOM orb avatar share the same mood configuration from `orbMoods`.

## 16. Interactive 3D Rewards

Correct answers create a `rewardEvent`.

Reward event shape:

```js
{
  id,
  type: "star" | "trophy",
  label,
  color,
  islandId
}
```

The R3F scene renders:

- A Magic Star for regular clue completion.
- A trophy-style object for island completion.

The reward:

- Pops into the 3D scene.
- Floats and rotates.
- Has a point light.
- Shows a "Drag to spin" label.
- Can be rotated with mouse or touch pointer movement.

## 17. Dynamic Environment

The Sky Islands environment responds to voice state.

Voice activity states include:

- `idle`
- `orb-speaking`
- `waiting`
- `listening`
- `miss`
- `reward`

Scene reactions:

- Clouds drift faster while Eli is answering.
- Clouds lift and move more energetically on reward.
- Speech ripple rings appear near the orb during speaking/listening moments.
- Canvas glow changes during listening/reward states.
- Orb pulse intensifies while listening.

## 18. UI Layout

The v2 UI combines:

- A large 3D playfield.
- A compact status notice.
- A small island status panel.
- A voice interaction panel.
- A sync state chip.

The canvas is kept prominent so the game reads as a playable 3D scene rather than a dashboard.

Responsive rules:

- Desktop uses a two-column control area below the canvas.
- Mobile collapses panels into a single column.
- The canvas keeps a stable height and avoids horizontal overflow.

## 19. Testing and Validation

The current validation script checks:

- v1 content integrity.
- v1 reward milestones.
- sound asset paths.
- service worker strategy.
- v2 saga progress shape.
- saga game count and lock states.
- six Sky Islands chapters.
- clue content requirements.
- orb mood configuration.
- video asset path.
- debug hook dev-only guard.
- voice proxy host.
- WebSocket Live message structure.
- audio parser pieces.
- R3F scene systems.

Regular verification commands:

```bash
npm test
npm run build
```

Browser QA has also been performed through Playwright for:

- Video-to-CTA flow.
- Dev unlock hook.
- Saga login/local mode.
- Sky Islands scene load.
- 3D canvas nonblank screenshots.
- Voice waiting state.
- Tap fallback.
- 3D reward display.
- Mobile overflow.

## 20. Deployment Notes

The app is intended for deployment at:

```text
https://ellie-english-quest.vercel.app/
```

Deployment requirements:

- Vite build output must deploy correctly.
- Firebase config must remain valid.
- Firestore rules should be deployed before real use.
- Cloudflare Worker must accept the production origin.
- Cloudflare Worker must support WebSocket upgrade.
- Worker must proxy Gemini Live traffic and keep the API key secret.
- The end-game video must exist at `/assets/videos/end_game_animation.mp4`.

## 21. Current Technical Risks

Known or likely risks:

- The saga chunk is large because Firebase and Three/R3F are loaded in the v2 bundle.
- The Cloudflare WebSocket worker must complete a valid WebSocket handshake; earlier probes returned HTTP 500.
- Native audio depends on the Worker correctly bridging to Gemini Live.
- Browser autoplay/audio policies mean audio playback must be initiated from a user gesture.
- Speech Recognition support varies by browser and device.
- Firestore is currently described as being in Test Mode and should be locked down before real use.

## 22. Future Technical Improvements

Recommended next improvements:

- Split Firebase auth and R3F scene into separate chunks.
- Add reconnect/retry logic for WebSocket sessions.
- Add explicit Worker health endpoint for voice diagnostics.
- Add better Live model fallback selection.
- Add parent-facing sync status and conflict resolution.
- Add unit tests for progress helpers.
- Add automated Playwright tests inside the project rather than using external cached tooling.
- Add asset pipeline for optimized GLB/texture assets.
- Add production Firestore rule deployment instructions.
- Add monitoring for Worker failures and quota exhaustion.
