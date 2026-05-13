import { createRoot } from "react-dom/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LoginScreen } from "./LoginScreen.jsx";
import { SkyIslandsCanvas } from "./SkyIslandsCanvas.jsx";
import { VoiceInterface } from "./VoiceInterface.jsx";
import { orbMoods, sagaGames } from "./skyIslandsData.js";
import { createVoiceGuide, getVoiceCompatibilityNote, getVoiceGuideDiagnostics, primeVoice, QUIET_VOICE_MESSAGE } from "./voiceGuide.js";
import { saveRemoteSaga } from "./firebaseClient.js";
import { getRewardVisual } from "./assets/assetManifest.js";
import { getLevelById, getNextLevel, getWorldById, isPlayableLevel, sagaWorlds } from "./sagaWorldData.js";
import {
  canEnterLevel,
  completeTask,
  getActiveTask,
  getCollectedRewards,
  getCompletedTaskIds,
  getUnlockedLevelIds,
  hasSeenWorldIntro,
  isLevelUnlocked,
  markWorldIntroSeen,
  normaliseSaga
} from "./sagaProgress.js";

const SKY_WORLD_ID = "sky-islands";
const CLOUD_HARBOR_ID = "cloud-harbor";

function getRewardEventType(rewardName) {
  if (rewardName === "Sunberry Basket") return "sunberry-basket";
  if (rewardName === "Star Map Lens") return "star-map-lens";
  if (rewardName === "Thunder Drum") return "thunder-drum";
  if (rewardName === "Red Bus Ticket") return "red-bus-ticket";
  return "compass";
}

function getFutureLevelMessage(level) {
  if (level?.id === "rhythm-cloud-stage") return "This music island is waking up soon.";
  if (level?.id === "london-wind-gate") return "This London gate is waking up soon.";
  if (level?.id === "storm-crown-citadel") return "The storm citadel is waking up soon.";
  if (level?.id === "school-star-observatory") return "This star island is waking up soon.";
  return `${level?.title || "This island"} is waking up soon.`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeRemoteSaga(localProgress, remoteSaga) {
  const next = clone(localProgress);
  const mergedSaga = normaliseSaga({
    ...next.saga,
    skyIslands: {
      ...next.saga.skyIslands,
      ...(remoteSaga?.skyIslands || {})
    },
    sagaUnlocks: {
      ...next.saga.sagaUnlocks,
      ...(remoteSaga?.sagaUnlocks || {})
    }
  });

  next.saga = mergedSaga;
  if (remoteSaga?.settings) {
    next.settings = {
      ...next.settings,
      ...remoteSaga.settings
    };
  }
  return next;
}

function gameState(progress, game) {
  if (game.id === SKY_WORLD_ID) return "playable";
  if (game.id === "crystal-mystery") return "locked";
  if (game.id === "time-portal-case") return "locked";
  return game.initialState;
}

function LumaFace({ mood = "happy" }) {
  const moodConfig = orbMoods[mood] || orbMoods.happy;
  return (
    <div
      className="orb-avatar mini luma-hud-orb"
      style={{
        "--orb-color": moodConfig.color,
        "--orb-glow": moodConfig.glow,
        "--orb-scale": moodConfig.scale
      }}
      aria-hidden="true"
    >
      <span className={`orb-brow left ${moodConfig.expression?.brow || ""}`} />
      <span className={`orb-brow right ${moodConfig.expression?.brow || ""}`} />
      <span className={`orb-eye left ${moodConfig.expression?.eyes || ""}`} />
      <span className={`orb-eye right ${moodConfig.expression?.eyes || ""}`} />
      <span className={`orb-mouth ${moodConfig.expression?.mouth || "smile"}`} />
      <span className="orb-pulse" />
    </div>
  );
}

function LumaCompanion({ mood, caption, hidden = false }) {
  if (hidden) return null;
  return (
    <div className="luma-companion">
      <LumaFace mood={mood} />
      <div className="luma-caption">{caption}</div>
    </div>
  );
}

function GameMenu({ view, open, onToggle, onClose, onReturnToMap, onRewards, onSagaHome, onExit }) {
  const inLevel = view === "levelIntro" || view === "levelTask" || view === "levelSuccess" || view === "levelComplete";
  return (
    <div className={`game-menu-shell ${open ? "open" : ""}`}>
      <button
        className="game-menu-toggle"
        type="button"
        aria-label={open ? "Close game menu" : "Open game menu"}
        aria-expanded={open}
        onClick={onToggle}
      >
        <span aria-hidden="true">✦</span>
      </button>
      {open ? (
        <>
          <button className="game-menu-backdrop" type="button" aria-label="Close menu" onClick={onClose} />
          <nav className="game-menu-panel" aria-label="Game menu">
            <p className="eyebrow">Luma menu</p>
            {inLevel ? (
              <button type="button" onClick={onReturnToMap}>Map</button>
            ) : null}
            <button type="button" onClick={onRewards}>Shelf</button>
            <button type="button" onClick={onSagaHome}>Saga</button>
            <button type="button" onClick={onExit}>Home</button>
          </nav>
        </>
      ) : null}
    </div>
  );
}

function VoiceDebugPanel({ activeTaskId, voiceActivity }) {
  const enabled = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debugVoice") === "1";
  const [diagnostics, setDiagnostics] = useState(() => getVoiceGuideDiagnostics());

  useEffect(() => {
    if (!enabled) return undefined;
    const update = () => setDiagnostics(getVoiceGuideDiagnostics());
    update();
    const timer = window.setInterval(update, 500);
    return () => window.clearInterval(timer);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <aside className="voice-debug-panel" aria-label="Voice diagnostics">
      <strong>Voice debug</strong>
      <span>task: {activeTaskId || diagnostics.currentTaskId || "none"}</span>
      <span>activity: {voiceActivity}</span>
      <span>speech synthesis: {diagnostics.speechSynthesisSupported ? "supported" : "unsupported"}</span>
      <span>tts: {diagnostics.lastTtsProvider || "none"} / {diagnostics.lastTtsSpoken ? "played" : diagnostics.lastTtsError || "pending"}</span>
      <span>voice mode: {diagnostics.voiceMode || "none"}</span>
      <span>browser tts fallback: {diagnostics.browserTtsFallbackUsed ? "used" : "not used"}</span>
      <span>quiet fallback: {diagnostics.quietFallbackUsed ? "shown" : "no"}</span>
      <span>last tts error: {diagnostics.lastTtsError || "none"}</span>
      <span>speech recognition: {diagnostics.speechRecognitionSupported ? "supported" : "unsupported"}</span>
      <span>lock: {diagnostics.activeListeningLock ? "active" : "idle"}</span>
      <span>starts: {diagnostics.recognitionStartCount || 0}</span>
      <span>stop: {diagnostics.lastRecognitionStopReason || "none"}</span>
      <span>last stt error: {diagnostics.lastSttError || "none"}</span>
      <span>permission: {diagnostics.permissionRequestAttempted ? "attempted" : "not yet"}</span>
      <span>getUserMedia: {diagnostics.getUserMediaInvoked ? "yes" : "no"}</span>
      <span>recognition: {diagnostics.speechRecognitionInvoked ? "yes" : "no"}</span>
      <span>gemini status: {diagnostics.geminiStatus || "not attempted"}</span>
      <span>gemini: {diagnostics.geminiConnected ? "connected" : diagnostics.lastGeminiError || "not connected"}</span>
      <span>worker: {diagnostics.geminiWorkerReachable === null ? "unknown" : diagnostics.geminiWorkerReachable ? "reachable" : "not reachable"} / {diagnostics.geminiWorkerStatus || "none"}</span>
      <span>worker websocket: {diagnostics.geminiWorkerWebSocketAvailable === null ? "unknown" : diagnostics.geminiWorkerWebSocketAvailable ? "available" : "unavailable"}</span>
      <span>gemini key: {diagnostics.geminiKeyConfigured === null ? "unknown" : diagnostics.geminiKeyConfigured ? "configured" : "missing"}</span>
      <span>gemini chunks: {diagnostics.lastGeminiAudioChunks || 0}</span>
      <span>audio: {diagnostics.audioContextUnlocked ? "unlocked" : "unknown"}</span>
    </aside>
  );
}

function SagaHome({ progress, onOpenWorld, onOpenRewards, onExit }) {
  return (
    <main className="saga-home adventure-home">
      <header className="adventure-home-top">
        <div>
          <p className="eyebrow">Adventure saga</p>
          <h1>Eli's next quests</h1>
        </div>
        <button className="secondary" type="button" onClick={onExit}>Home</button>
      </header>

      <section className="world-portal-grid" aria-label="Adventure games">
        {sagaGames.map((game) => {
          const state = gameState(progress, game);
          const playable = state === "playable";
          return (
            <button
              className={`world-portal ${playable ? "playable" : "locked"}`}
              type="button"
              key={game.id}
              disabled={!playable}
              style={{ "--game-accent": game.accent }}
              onClick={() => onOpenWorld(game.id)}
            >
              <span className="world-portal-glow" aria-hidden="true" />
              <span className="world-portal-title">{game.title}</span>
              <span className="world-portal-subtitle">{game.subtitle}</span>
              <span className="world-portal-state">{playable ? "Open" : "Locked"}</span>
            </button>
          );
        })}
      </section>

      <button className="reward-room-button" type="button" onClick={onOpenRewards}>
        Trophy shelf
      </button>
    </main>
  );
}

function RewardIcon({ reward, collected }) {
  const visual = getRewardVisual(reward.title);
  return (
    <span className={`reward-icon-v2 ${collected ? "collected" : "locked"}`} style={{ "--reward-color": visual.color }} aria-hidden="true">
      <svg viewBox="0 0 100 100" focusable="false">
        <use href={visual.href} />
      </svg>
    </span>
  );
}

function RewardRoom({ progress, onBack }) {
  const saga = normaliseSaga(progress.saga);
  const rewardGroups = sagaWorlds.map((world) => {
    const collected = new Set(getCollectedRewards(saga, world.id));
    return {
      worldId: world.id,
      worldTitle: world.title,
      accent: world.accent,
      rewards: world.levels.map((level) => ({
        worldId: world.id,
        worldTitle: world.title,
        title: level.reward,
        collected: collected.has(level.reward),
        color: level.color || world.accent,
        order: level.order
      }))
    };
  });

  return (
    <main className="reward-room-v2">
      <div className="reward-room-art" aria-hidden="true" />
      <header className="reward-room-hud">
        <div>
          <p className="eyebrow">Rewards</p>
          <h1>Luma's trophy shelf</h1>
        </div>
        <button className="game-menu-toggle inline" type="button" onClick={onBack} aria-label="Back to saga">✦</button>
      </header>
      <section className="v2-trophy-shelf" aria-label="V2 trophy shelf">
        {rewardGroups.map((group) => (
          <section className="reward-world-row" key={group.worldId} style={{ "--world-accent": group.accent }} aria-label={`${group.worldTitle} rewards`}>
            <h2>{group.worldTitle}</h2>
            <div className="reward-world-items">
              {group.rewards.map((reward) => (
                <div
                  className={`v2-trophy ${reward.collected ? "collected" : "locked"}`}
                  key={`${reward.worldId}-${reward.title}`}
                  style={{ "--trophy-color": reward.color }}
                >
                  <RewardIcon reward={reward} collected={reward.collected} />
                  <strong>{reward.title}</strong>
                </div>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}

function MapHud({ world, view, activeLevel }) {
  const sceneName = view === "levelIntro" || view === "levelTask" || view === "levelSuccess" || view === "levelComplete"
    ? activeLevel?.title
    : view === "mapProgressionAnimation"
      ? "Bridge waking"
      : world.mapTitle;
  return (
    <div className="map-hud">
      <div>
        <p className="eyebrow">{world.title}</p>
        <h1>{sceneName}</h1>
      </div>
    </div>
  );
}

function TaskProgressGems({ total, completedCount }) {
  return (
    <div className="task-gems" aria-label={`${completedCount} of ${total} tasks complete`}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={index < completedCount ? "done" : ""} />
      ))}
    </div>
  );
}

function SkyWorldView({
  progress,
  world,
  view,
  activeLevel,
  activeTask,
  completedTaskIds,
  unlockedLevelIds,
  completedLevelIds,
  lumaMood,
  voiceActivity,
  caption,
  introStage,
  introBusy,
  rewardEvent,
  progressionAnimation,
  onStartIntro,
  onSelectLevel,
  onReturnToMap,
  onBack,
  onRewards,
  onExit,
  children
}) {
  const introComplete = view !== "worldMapIntro";
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <main className={`sky-adventure state-${view}`}>
      <MapHud world={world} view={view} activeLevel={activeLevel} />
      <GameMenu
        view={view}
        open={menuOpen}
        onToggle={() => setMenuOpen((current) => !current)}
        onClose={closeMenu}
        onReturnToMap={() => {
          closeMenu();
          onReturnToMap();
        }}
        onRewards={() => {
          closeMenu();
          onRewards();
        }}
        onSagaHome={() => {
          closeMenu();
          onBack();
        }}
        onExit={() => {
          closeMenu();
          onExit();
        }}
      />
      <SkyIslandsCanvas
        mode={view === "levelIntro" || view === "levelTask" || view === "levelSuccess" || view === "levelComplete" ? "level" : "map"}
        world={world}
        activeLevel={activeLevel}
        activeTask={activeTask}
        completedTaskIds={completedTaskIds}
        unlockedLevelIds={unlockedLevelIds}
        completedLevelIds={completedLevelIds}
        introComplete={introComplete}
        introStage={introStage}
        lumaMood={lumaMood}
        voiceActivity={voiceActivity}
        rewardEvent={rewardEvent}
        progressionAnimation={progressionAnimation}
        onSelectLevel={onSelectLevel}
      />
      <LumaCompanion mood={lumaMood} caption={caption} hidden={view === "worldMapIntro" && introStage === "center"} />
      {view === "worldMapIntro" ? (
        <div className="start-adventure-layer">
          <div className="start-adventure-prompt">
            <LumaFace mood="happy" />
            <p>{progress.saga.skyIslands?.mapIntroSeen ? "Luma is ready." : "Luma is waiting on the sky map."}</p>
            <button className="primary" type="button" onClick={onStartIntro} disabled={introBusy}>
              {introBusy ? "Luma is speaking..." : "Start adventure"}
            </button>
          </div>
        </div>
      ) : null}
      {view === "worldMap" || view === "mapProgressionAnimation" ? (
        <p className="map-status-line">
          {view === "mapProgressionAnimation"
            ? `Watch the sky bridge build to ${activeLevel?.title || "the next island"}.`
            : "Choose a glowing island."}
        </p>
      ) : null}
      {view === "levelIntro" || view === "levelTask" || view === "levelSuccess" || view === "levelComplete" ? (
        <div className="level-hud">
          <div>
            <p className="eyebrow">Current island</p>
            <h2>{activeLevel.title}</h2>
          </div>
          <TaskProgressGems total={activeLevel.tasks.length} completedCount={completedTaskIds.length} />
        </div>
      ) : null}
      {children}
      <VoiceDebugPanel activeTaskId={activeTask?.id} voiceActivity={voiceActivity} />
    </main>
  );
}

function SagaApp({ initialProgress, debugMode = false, onProgressChange, onExit, playEffect }) {
  const [progress, setProgress] = useState(() => ({
    ...initialProgress,
    saga: normaliseSaga(initialProgress.saga)
  }));
  const [parentUser, setParentUser] = useState(null);
  const [view, setView] = useState("login");
  const [selectedWorldId, setSelectedWorldId] = useState(SKY_WORLD_ID);
  const [activeLevelId, setActiveLevelId] = useState(CLOUD_HARBOR_ID);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [successTaskId, setSuccessTaskId] = useState(null);
  const [lumaMood, setLumaMood] = useState("happy");
  const [voiceActivity, setVoiceActivity] = useState("idle");
  const [caption, setCaption] = useState("Luma is ready.");
  const [introStage, setIntroStage] = useState("center");
  const [introBusy, setIntroBusy] = useState(false);
  const [rewardEvent, setRewardEvent] = useState(null);
  const [progressionAnimation, setProgressionAnimation] = useState(null);
  const mapVoiceGuide = useMemo(() => createVoiceGuide({ voiceEnabled: progress.settings?.voiceEnabled !== false }), [progress.settings?.voiceEnabled]);

  const saga = useMemo(() => normaliseSaga(progress.saga), [progress.saga]);
  const selectedWorld = getWorldById(selectedWorldId);
  const activeLevel = getLevelById(selectedWorldId, activeLevelId);
  const activeTask = activeTaskId
    ? activeLevel.tasks.find((task) => task.id === activeTaskId) || null
    : getActiveTask(saga, selectedWorldId, activeLevelId);
  const displayTask = view === "levelSuccess"
    ? activeLevel.tasks.find((task) => task.id === successTaskId) || activeTask
    : activeTask;
  const completedTaskIds = getCompletedTaskIds(saga, selectedWorldId, activeLevelId);
  const unlockedLevelIds = getUnlockedLevelIds(saga, selectedWorldId);
  const completedLevelIds = saga.completedLevelIdsByWorld?.[selectedWorldId] || [];

  const updateProgress = useCallback((nextProgress) => {
    setProgress(nextProgress);
    onProgressChange?.(nextProgress);
  }, [onProgressChange]);

  const commitSaga = useCallback(async (nextSaga) => {
    const nextProgress = {
      ...clone(progress),
      saga: normaliseSaga(nextSaga)
    };
    updateProgress(nextProgress);
    if (!debugMode && parentUser?.uid) {
      try {
        await saveRemoteSaga(parentUser.uid, nextProgress.saga, nextProgress.settings || {});
      } catch {
        setCaption("Saved here. Cloud sync can try again later.");
      }
    }
  }, [debugMode, parentUser?.uid, progress, updateProgress]);

  function handleLoginReady({ user, remoteSaga }) {
    const merged = mergeRemoteSaga(progress, remoteSaga);
    merged.saga.parentAuth = {
      status: "signed-in",
      uid: user.uid,
      email: user.email,
      lastSyncedAt: new Date().toISOString()
    };
    merged.saga.profile = {
      ...merged.saga.profile,
      eliPinSet: true,
      eliPinVerifiedAt: new Date().toISOString()
    };
    setParentUser(user);
    updateProgress(merged);
    setView("sagaHome");
  }

  function handleLocalOnly() {
    primeVoice("local-only");
    const next = clone(progress);
    next.saga = normaliseSaga({
      ...next.saga,
      parentAuth: {
        ...next.saga.parentAuth,
        status: "local"
      }
    });
    updateProgress(next);
    setView("sagaHome");
  }

  function openWorld(worldId) {
    const world = getWorldById(worldId);
    if (gameState(progress, { id: worldId, initialState: "locked" }) !== "playable") return;
    if (worldId !== SKY_WORLD_ID) {
      return;
    }
    setSelectedWorldId(worldId);
    setActiveLevelId(world.firstLevelId);
    setActiveTaskId(null);
    setRewardEvent(null);
    setLumaMood("happy");
    if (worldId === SKY_WORLD_ID && !hasSeenWorldIntro(saga, worldId)) {
      setIntroStage("center");
      setCaption("Tap Start adventure and meet Luma.");
      setView("worldMapIntro");
      return;
    }
    setCaption(`${world.mapTitle} is ready.`);
    setView("worldMap");
  }

  async function startWorldIntro() {
    if (introBusy) return;
    primeVoice("start-adventure");
    setIntroBusy(true);
    setLumaMood("happy");
    setVoiceActivity("orb-speaking");
    setCaption(selectedWorld.introLine);
    await mapVoiceGuide.startSession({
      world: selectedWorld,
      level: selectedWorld.levels[0],
      task: null,
      mood: "happy",
      recentEvent: "world-map-intro"
    });
    const introVoice = await mapVoiceGuide.playGuidePrompt(selectedWorld.introLine, { mood: "happy" });
    if (!introVoice.spoken) {
      const compatibilityNote = getVoiceCompatibilityNote();
      setCaption(compatibilityNote ? `${QUIET_VOICE_MESSAGE} ${compatibilityNote}` : QUIET_VOICE_MESSAGE);
      await new Promise((resolve) => window.setTimeout(resolve, 850));
    }
    setIntroStage("flying");
    await new Promise((resolve) => window.setTimeout(resolve, 950));
    const nextSaga = markWorldIntroSeen(progress.saga, selectedWorldId);
    await commitSaga(nextSaga);
    setVoiceActivity("idle");
    setIntroBusy(false);
    setCaption("Cloud Harbor is glowing. Tap it to begin.");
    setView("worldMap");
  }

  function selectLevel(levelId) {
    if (view === "worldMapIntro") return;
    const level = getLevelById(selectedWorldId, levelId);
    if (!isLevelUnlocked(saga, selectedWorldId, levelId)) {
      setLumaMood("annoyed");
      setCaption("That path is still sleepy.");
      return;
    }
    if (!isPlayableLevel(level)) {
      setLumaMood("thinking");
      setCaption(getFutureLevelMessage(level));
      return;
    }
    if (!canEnterLevel(saga, selectedWorldId, levelId)) return;
    primeVoice("island-entry");
    setActiveLevelId(levelId);
    const firstTask = getActiveTask(saga, selectedWorldId, levelId);
    setActiveTaskId(firstTask?.id || null);
    setSuccessTaskId(null);
    setRewardEvent(null);
    setLumaMood("thinking");
    setCaption(level.intro);
    setView("levelIntro");
  }

  useEffect(() => {
    if (view !== "levelIntro") return undefined;
    const timer = window.setTimeout(() => {
      setView("levelTask");
    }, 650);
    return () => window.clearTimeout(timer);
  }, [view]);

  const handleVoiceCorrect = useCallback(async () => {
    const task = activeTask;
    if (!task) return;
    playEffect?.("correct");
    const result = completeTask(progress.saga, selectedWorldId, activeLevelId, task.id);
    await commitSaga(result.saga);
    setSuccessTaskId(task.id);
    setCaption(task.successAnimation);
    setLumaMood(result.levelComplete ? "proud" : "happy");
    setVoiceActivity("reward");

    if (result.levelComplete) {
      setRewardEvent({
        id: `${activeLevelId}-${Date.now()}`,
        label: result.rewardEarned,
        type: getRewardEventType(result.rewardEarned)
      });
      setView("levelComplete");
    } else {
      setView("levelSuccess");
      const nextTask = getActiveTask(result.saga, selectedWorldId, activeLevelId);
      window.setTimeout(() => {
        setActiveTaskId(nextTask?.id || null);
        setCaption(nextTask?.lumaLine || "The harbour is ready.");
        setVoiceActivity("idle");
        setView("levelTask");
      }, 1050);
    }
  }, [activeLevelId, activeTask, commitSaga, playEffect, progress.saga, selectedWorldId]);

  const handleGentleMiss = useCallback(() => {
    playEffect?.("wrong");
  }, [playEffect]);

  const returnToWorldMap = useCallback(() => {
    setRewardEvent(null);
    setProgressionAnimation(null);
    setSuccessTaskId(null);
    setActiveTaskId(null);
    setVoiceActivity("idle");
    setLumaMood("happy");
    setCaption(`${selectedWorld.mapTitle} is ready.`);
    setView("worldMap");
  }, [selectedWorld.mapTitle]);

  useEffect(() => {
    if (view !== "levelComplete") return undefined;
    const completedLevelId = activeLevelId;
    const nextLevel = getNextLevel(selectedWorldId, completedLevelId);
    const completionPauseMs = ["school-star-observatory", "rhythm-cloud-stage", "london-wind-gate"].includes(completedLevelId)
        ? 4300
        : 2700;
    const timer = window.setTimeout(() => {
      if (!nextLevel) {
        setRewardEvent(null);
        setProgressionAnimation(null);
        setCaption(`${selectedWorld.mapTitle} is shining.`);
        setView("worldMap");
        return;
      }
      setView("mapProgressionAnimation");
      setProgressionAnimation(`${completedLevelId}-to-${nextLevel.id}`);
      setActiveLevelId(nextLevel.id);
      setCaption(`The bridge to ${nextLevel.title} is waking.`);
      setRewardEvent(null);
    }, completionPauseMs);
    return () => window.clearTimeout(timer);
  }, [activeLevelId, selectedWorld.mapTitle, selectedWorldId, view]);

  useEffect(() => {
    if (view !== "mapProgressionAnimation") return undefined;
    const nextLevel = activeLevel;
    const timer = window.setTimeout(() => {
      setProgressionAnimation(null);
      setVoiceActivity("idle");
      setCaption(isPlayableLevel(nextLevel) ? `${nextLevel.title} is ready.` : getFutureLevelMessage(nextLevel));
      setView("worldMap");
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [activeLevel, view]);

  if (view === "login") {
    return (
      <div className="saga-root">
        <LoginScreen onReady={handleLoginReady} onLocalOnly={handleLocalOnly} />
      </div>
    );
  }

  if (view === "sagaHome") {
    return (
      <div className="saga-root">
        <SagaHome
          progress={progress}
          onOpenWorld={openWorld}
          onOpenRewards={() => setView("rewardRoom")}
          onExit={onExit}
        />
      </div>
    );
  }

  if (view === "rewardRoom") {
    return (
      <div className="saga-root">
        <RewardRoom progress={progress} onBack={() => setView("sagaHome")} />
      </div>
    );
  }

  return (
    <div className="saga-root">
      <SkyWorldView
        progress={progress}
        world={selectedWorld}
        view={view}
        activeLevel={activeLevel}
        activeTask={displayTask}
        completedTaskIds={completedTaskIds}
        unlockedLevelIds={unlockedLevelIds}
        completedLevelIds={completedLevelIds}
        lumaMood={lumaMood}
        voiceActivity={voiceActivity}
        caption={caption}
        introStage={introStage}
        introBusy={introBusy}
        rewardEvent={rewardEvent}
        progressionAnimation={progressionAnimation}
        onStartIntro={startWorldIntro}
        onSelectLevel={selectLevel}
        onReturnToMap={returnToWorldMap}
        onBack={() => setView("sagaHome")}
        onRewards={() => setView("rewardRoom")}
        onExit={onExit}
      >
        <VoiceInterface
          active={view === "levelTask" && Boolean(activeTask)}
          world={selectedWorld}
          level={activeLevel}
          task={activeTask}
          voiceEnabled={progress.settings?.voiceEnabled !== false}
          onMoodChange={setLumaMood}
          onVoiceActivityChange={setVoiceActivity}
          onCaptionChange={setCaption}
          onCorrect={handleVoiceCorrect}
          onGentleMiss={handleGentleMiss}
        />
      </SkyWorldView>
    </div>
  );
}

export function mountSagaApp(container, props) {
  const root = createRoot(container);
  root.render(<SagaApp {...props} />);
  return () => root.unmount();
}
