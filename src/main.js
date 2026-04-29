import "./styles.css";
import { learnerProfile, gameConfig, levels, rewardMilestones } from "./data/curriculum.js";
import { speak, getSpeechRecognition, normaliseSpeech, stopSpeaking } from "./lib/speech.js";
import { playSound } from "./lib/sound.js";
import { loadProgress, saveProgress, resetProgress, recalcAndUnlock, starsFromScore } from "./lib/storage.js";

const app = document.getElementById("app");
const ELI_IMAGE = "/assets/images/eli.png";
const modeStarKeys = ["quizStars", "pictureStars", "memoryStars", "speakStars", "buildStars"];
const CORRECT_ADVANCE_DELAY = 1150;

let progress = loadProgress();
let ui = {
  screen: "home",
  levelId: progress.lastPlayedLevelId || levels[0].id,
  mode: null,
  quizIndex: 0,
  quizCorrect: 0,
  quizFeedback: null,
  quizReadStatus: null,
  pictureIndex: 0,
  pictureCorrect: 0,
  pictureFeedback: null,
  memoryCards: [],
  memoryOpen: [],
  memoryMatched: [],
  speakIndex: 0,
  speechResult: null,
  voiceNotice: null,
  buildIndex: 0,
  buildChosen: [],
  buildFeedback: null,
  levelBurst: null
};

function getLevel() {
  return levels.find((level) => level.id === ui.levelId) || levels[0];
}

function levelProgress(levelId) {
  return progress.levelProgress[levelId] || {};
}

function stars(n) {
  return "⭐".repeat(Math.max(0, n || 0)) || "☆";
}

function starCount(n) {
  return n > 0 ? `⭐ ${n}` : "☆";
}

function getLevelStars(levelProgress) {
  return modeStarKeys.reduce((sum, key) => sum + Math.max(levelProgress[key] || 0, 0), 0);
}

function getCompletedModeCount(levelProgress) {
  return modeStarKeys.filter((key) => Math.max(levelProgress[key] || 0, 0) > 0).length;
}

function getQuestReady(levelProgress) {
  return getLevelStars(levelProgress) >= gameConfig.progression.minimumStars
    && getCompletedModeCount(levelProgress) >= gameConfig.progression.minimumModes;
}

function playEffect(type) {
  if (progress.settings?.soundEnabled) playSound(type);
}

function speechNameText(text) {
  return String(text).replace(/\bEli\b/g, learnerProfile.spokenName);
}

function speakText(text, options) {
  if (!progress.settings?.voiceEnabled) return false;
  if (!("speechSynthesis" in window)) return false;
  return speak(speechNameText(text), options);
}

app.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  playEffect("ui");
});

function soundControls() {
  const soundOn = progress.settings?.soundEnabled !== false;
  const voiceOn = progress.settings?.voiceEnabled !== false;
  return `
    <div class="sound-controls" aria-label="Sound controls">
      <button class="sound-toggle ${soundOn ? "active" : ""}" data-setting="soundEnabled" aria-pressed="${soundOn}">
        <span aria-hidden="true">${soundOn ? "🔊" : "🔇"}</span><span>Sound</span>
      </button>
      <button class="sound-toggle ${voiceOn ? "active" : ""}" data-setting="voiceEnabled" aria-pressed="${voiceOn}">
        <span aria-hidden="true">${voiceOn ? "🗣️" : "🤫"}</span><span>Voice</span>
      </button>
    </div>
  `;
}

function magicDecor() {
  return `
    <div class="ambient-magic" aria-hidden="true">
      <span>✦</span>
      <span>✧</span>
      <span>🌸</span>
      <span>🦋</span>
      <span>✦</span>
    </div>
  `;
}

function feedbackHtml(feedback) {
  if (!feedback) return "";
  const tone = feedback.tone || "learn";
  return `
    <div class="feedback ${tone}">
      <strong>${feedback.title}</strong>
      <span>${feedback.text}</span>
      ${feedback.cue ? `<small>${feedback.cue}</small>` : ""}
    </div>
  `;
}

function nextButtonHtml(id, label = "Next") {
  return `<button class="primary next-action" id="${id}">${label}</button>`;
}

function answerLine(answer) {
  const text = String(answer);
  return /[.!?]$/.test(text) ? `Answer: ${text}` : `Answer: ${text}.`;
}

function autoAdvance(callback, delay = CORRECT_ADVANCE_DELAY) {
  window.setTimeout(callback, delay);
}

function page(title, body) {
  app.innerHTML = `
    <div class="shell">
      ${magicDecor()}
      <header class="topbar">
        <button class="brand" data-action="home" aria-label="Go home">
          <span class="brand-icon">✨</span>
          <span>${gameConfig.title}</span>
        </button>
        <div class="topbar-actions">
          ${soundControls()}
          <div class="score-pill" title="Total stars">⭐ ${progress.totalStars}</div>
        </div>
      </header>
      <main>
        <section class="hero compact">
          <h1>${title}</h1>
        </section>
        ${body}
      </main>
    </div>
  `;
  bindGlobalActions();
}

function bindGlobalActions() {
  document.querySelectorAll("[data-action='home']").forEach((btn) => {
    btn.addEventListener("click", () => {
      stopSpeaking();
      ui.screen = "home";
      render();
    });
  });

  document.querySelectorAll("[data-setting]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const setting = btn.dataset.setting;
      progress.settings = {
        soundEnabled: progress.settings?.soundEnabled !== false,
        voiceEnabled: progress.settings?.voiceEnabled !== false,
        ...(progress.settings || {})
      };
      const nextValue = !progress.settings[setting];
      if (setting === "voiceEnabled" && !nextValue && ui.screen === "speak") {
        progress.settings.voiceEnabled = true;
        ui.voiceNotice = "Voice stays on for this game.";
      } else {
        progress.settings[setting] = nextValue;
        if (setting === "voiceEnabled" && !nextValue) stopSpeaking();
        if (setting === "voiceEnabled") ui.voiceNotice = null;
      }
      progress = saveProgress(progress);
      render();
    });
  });
}

function render() {
  if (ui.screen === "home") return renderHome();
  if (ui.screen === "map") return renderMap();
  if (ui.screen === "level") return renderLevel();
  if (ui.screen === "quiz") return renderQuiz();
  if (ui.screen === "picture") return renderPicture();
  if (ui.screen === "memory") return renderMemory();
  if (ui.screen === "speak") return renderSpeak();
  if (ui.screen === "build") return renderBuild();
  if (ui.screen === "trophies") return renderTrophies();
}

function renderHome() {
  app.innerHTML = `
    <div class="welcome-screen">
      ${magicDecor()}
      <div class="welcome-sparkles" aria-hidden="true">
        <span>✦</span><span>✧</span><span>✦</span><span>✧</span>
      </div>
      <header class="welcome-top">
        <div class="brand"><span class="brand-icon">✨</span><span>${gameConfig.title}</span></div>
        ${soundControls()}
      </header>
      <main class="welcome-card">
        <div class="eli-glow">
          <img class="eli-hero" src="${ELI_IMAGE}" alt="Eli ready for English quest" />
        </div>
        <p class="eyebrow">Bok, ${learnerProfile.displayName}</p>
        <h1>Magic English starts here.</h1>
        <p class="lead">Play games. Learn words. Win magic rewards.</p>
        <button class="start-spell" id="startBtn">START</button>
        <button class="welcome-link" id="trophyBtn">Trophy Room</button>
      </main>
    </div>
  `;
  bindGlobalActions();

  document.getElementById("startBtn").addEventListener("click", () => {
    playEffect("welcome");
    speakText(`Hi ${learnerProfile.spokenName}. Choose a little world.`);
    ui.screen = "map";
    render();
  });
  document.getElementById("trophyBtn").addEventListener("click", () => {
    ui.screen = "trophies";
    render();
  });
}

function renderMap() {
  const activeQuestId = levels.find((level) => {
    const lp = levelProgress(level.id);
    return lp.unlocked && !lp.completed;
  })?.id;
  const cards = levels.map((level) => {
    const lp = levelProgress(level.id);
    const locked = !lp.unlocked;
    const activeQuest = !locked && level.id === activeQuestId;
    const total = getLevelStars(lp);
    const completedModes = getCompletedModeCount(lp);
    const questReady = getQuestReady(lp);
    return `
      <button class="level-node ${locked ? "locked" : ""} ${activeQuest ? "active-quest" : ""}" data-level="${level.id}" ${locked ? "disabled" : ""}>
        <span class="level-order">${level.order}</span>
        <span class="level-icon">${locked ? "🔒" : level.icon}</span>
        <strong>${level.title}</strong>
        <small>${locked ? level.unlockHint : level.topic}</small>
        <span class="mini-stars">${starCount(total)} · ${completedModes}/5 games ${questReady ? "· open" : ""}</span>
      </button>
    `;
  }).join("");

  page("Quest Map", `
    <section class="quest-guide card">
      <img src="${ELI_IMAGE}" alt="Eli" />
      <div>
        <p class="eyebrow">Quest rule</p>
        <h2>Win 8 stars in 3 games.</h2>
        <p class="muted">Then the next world opens.</p>
      </div>
    </section>
    <section class="map-grid">${cards}</section>
  `);

  document.querySelectorAll("[data-level]").forEach((btn) => {
    btn.addEventListener("click", () => {
      ui.levelId = btn.dataset.level;
      progress.lastPlayedLevelId = ui.levelId;
      progress = saveProgress(progress);
      ui.screen = "level";
      playEffect("level");
      speakText(`${getLevel().title}. Choose a game.`);
      render();
    });
  });
}

function renderLevel() {
  const level = getLevel();
  const lp = levelProgress(level.id);
  const levelStars = getLevelStars(lp);
  const completedModes = getCompletedModeCount(lp);
  const questReady = getQuestReady(lp);
  const burst = ui.levelBurst?.levelId === level.id ? ui.levelBurst : null;
  page(`${level.icon} ${level.title}`, `
    <section class="card level-intro">
      ${burst ? `
        <div class="level-burst" aria-hidden="true">
          <span>✦</span><span>✨</span><span>🌸</span><span>✧</span><span>✨</span>
        </div>
        <p class="return-note">${stars(burst.stars)} saved!</p>
      ` : ""}
      <p class="eyebrow">${level.topic}</p>
      <h2>${level.microTarget}</h2>
      <p>${level.personalHook}</p>
      <div class="quest-progress">
        <span>${starCount(levelStars)}</span>
        <span>${completedModes}/5 games</span>
        <strong>${questReady ? "Next world is open." : "Goal: 8 stars + 3 games."}</strong>
      </div>
      <div class="mode-grid">
        <button class="mode-card ${lp.quizStars ? "done" : ""} ${lp.quizStars >= 3 ? "mastered" : ""}" data-mode="quiz">❓<strong>Quiz</strong><span>${stars(lp.quizStars)}</span></button>
        <button class="mode-card ${lp.pictureStars ? "done" : ""} ${lp.pictureStars >= 3 ? "mastered" : ""}" data-mode="picture">🖼️<strong>Picture Match</strong><span>${stars(lp.pictureStars)}</span></button>
        <button class="mode-card ${lp.memoryStars ? "done" : ""} ${lp.memoryStars >= 3 ? "mastered" : ""}" data-mode="memory">🧠<strong>Memory</strong><span>${stars(lp.memoryStars)}</span></button>
        <button class="mode-card ${lp.speakStars ? "done" : ""} ${lp.speakStars >= 3 ? "mastered" : ""}" data-mode="speak">🎙️<strong>Listen & Say</strong><span>${stars(lp.speakStars)}</span></button>
        <button class="mode-card ${lp.buildStars ? "done" : ""} ${lp.buildStars >= 3 ? "mastered" : ""}" data-mode="build">🧩<strong>Build Sentence</strong><span>${stars(lp.buildStars)}</span></button>
      </div>
      <button class="secondary" id="backToMap">Back to map</button>
    </section>
  `);

  document.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => startMode(btn.dataset.mode));
  });
  document.getElementById("backToMap").addEventListener("click", () => {
    ui.screen = "map";
    render();
  });

  if (burst) {
    const burstId = burst.id;
    window.setTimeout(() => {
      if (ui.levelBurst?.id === burstId) {
        ui.levelBurst = null;
        render();
      }
    }, 2200);
  }
}

function ensureVoiceForMode(mode) {
  ui.voiceNotice = null;
  if (mode !== "speak") return;

  if (progress.settings?.voiceEnabled === false) {
    progress.settings = {
      soundEnabled: progress.settings?.soundEnabled !== false,
      ...(progress.settings || {}),
      voiceEnabled: true
    };
    progress = saveProgress(progress);
    ui.voiceNotice = "Voice is on for this game.";
  }
}

function startMode(mode) {
  ui.mode = mode;
  ui.quizIndex = 0;
  ui.quizCorrect = 0;
  ui.quizFeedback = null;
  ui.quizReadStatus = null;
  ui.pictureIndex = 0;
  ui.pictureCorrect = 0;
  ui.pictureFeedback = null;
  ui.speakIndex = 0;
  ui.speechResult = null;
  ui.voiceNotice = null;
  ui.buildIndex = 0;
  ui.buildChosen = [];
  ui.buildFeedback = null;
  ui.levelBurst = null;

  ensureVoiceForMode(mode);
  if (mode === "memory") setupMemory();

  ui.screen = mode;
  render();
}

function renderQuiz() {
  const level = getLevel();
  const q = level.quiz[ui.quizIndex];
  if (!q) return finishMode("quiz", ui.quizCorrect, level.quiz.length);

  page("Quiz", `
    <section class="game-card">
      <p class="progress-line">Question ${ui.quizIndex + 1} of ${level.quiz.length}</p>
      <h2>${q.prompt}</h2>
      <div class="answer-grid">
        ${q.options.map((opt) => `<button class="answer-btn" data-answer="${escapeAttr(opt)}" ${ui.quizFeedback ? "disabled" : ""}>${opt}</button>`).join("")}
      </div>
      ${feedbackHtml(ui.quizFeedback)}
      ${ui.quizFeedback?.needsContinue ? nextButtonHtml("quizNext") : ""}
      <button class="secondary" id="readQuestion">Read question</button>
      ${ui.quizReadStatus ? `<p class="read-status">${ui.quizReadStatus}</p>` : ""}
    </section>
  `);

  document.getElementById("readQuestion").addEventListener("click", () => {
    const didSpeak = speakText(q.prompt);
    ui.quizReadStatus = didSpeak
      ? "Reading..."
      : progress.settings?.voiceEnabled
        ? "Voice is not available here."
        : "Turn Voice on to read.";
    render();
  });
  if (ui.quizFeedback?.needsContinue) {
    document.getElementById("quizNext").addEventListener("click", () => {
      ui.quizIndex += 1;
      ui.quizFeedback = null;
      ui.quizReadStatus = null;
      render();
    });
  }
  document.querySelectorAll("[data-answer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (ui.quizFeedback) return;
      const answer = btn.dataset.answer;
      const correct = answer === q.correct;
      if (correct) {
        ui.quizCorrect += 1;
        playEffect("correct");
        ui.quizFeedback = {
          tone: "correct",
          title: "Nice!",
          text: q.explain
        };
        speakText(`Nice. ${q.explain}`);
        const answeredIndex = ui.quizIndex;
        autoAdvance(() => {
          if (ui.screen !== "quiz" || ui.quizIndex !== answeredIndex) return;
          ui.quizIndex += 1;
          ui.quizFeedback = null;
          ui.quizReadStatus = null;
          render();
        });
      } else {
        playEffect("wrong");
        ui.quizFeedback = {
          tone: "learn",
          title: "Good try.",
          text: answerLine(q.correct),
          cue: q.explain,
          needsContinue: true
        };
        speakText(`Good try. The answer is ${q.correct}.`);
      }
      render();
    });
  });
}

function renderPicture() {
  const level = getLevel();
  const item = level.pictureItems[ui.pictureIndex];
  if (!item) return finishMode("picture", ui.pictureCorrect, level.pictureItems.length);

  const options = shuffle(item.options);
  page("Picture Match", `
    <section class="game-card picture-game">
      <p class="progress-line">Picture ${ui.pictureIndex + 1} of ${level.pictureItems.length}</p>
      <div class="picture-cue" aria-hidden="true">${item.emoji}</div>
      <h2>What is this?</h2>
      <p class="support-word">${item.support}</p>
      <div class="answer-grid picture-options">
        ${options.map((opt) => `<button class="answer-btn picture-answer" data-picture-answer="${escapeAttr(opt)}" ${ui.pictureFeedback ? "disabled" : ""}>${opt}</button>`).join("")}
      </div>
      ${feedbackHtml(ui.pictureFeedback)}
      ${ui.pictureFeedback?.needsContinue ? nextButtonHtml("pictureNext") : ""}
    </section>
  `);

  if (ui.pictureFeedback?.needsContinue) {
    document.getElementById("pictureNext").addEventListener("click", () => {
      ui.pictureIndex += 1;
      ui.pictureFeedback = null;
      render();
    });
  }

  document.querySelectorAll("[data-picture-answer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (ui.pictureFeedback) return;
      const answer = btn.dataset.pictureAnswer;
      const correct = answer === item.word;
      if (correct) {
        ui.pictureCorrect += 1;
        ui.pictureFeedback = {
          tone: "correct",
          title: "Nice!",
          text: item.word
        };
        playEffect("correct");
        speakText(`Nice. ${item.word}.`);
        const answeredIndex = ui.pictureIndex;
        autoAdvance(() => {
          if (ui.screen !== "picture" || ui.pictureIndex !== answeredIndex) return;
          ui.pictureIndex += 1;
          ui.pictureFeedback = null;
          render();
        });
      } else {
        ui.pictureFeedback = {
          tone: "learn",
          title: "Good try.",
          text: answerLine(item.word),
          cue: `${item.word} = ${item.support}`,
          needsContinue: true
        };
        playEffect("wrong");
        speakText(`Good try. It is ${item.word}.`);
      }
      render();
    });
  });
}

function setupMemory() {
  const level = getLevel();
  const pairs = level.memoryPairs.slice(0, 6);
  const cards = [];
  pairs.forEach((pair, index) => {
    cards.push({ id: `${index}-en`, pairId: String(index), label: pair.english, type: "English" });
    cards.push({ id: `${index}-hr`, pairId: String(index), label: pair.croatian, type: "Croatian" });
  });
  ui.memoryCards = shuffle(cards);
  ui.memoryOpen = [];
  ui.memoryMatched = [];
}

function renderMemory() {
  const allMatched = ui.memoryMatched.length === ui.memoryCards.length;
  if (allMatched) return finishMode("memory", 6, 6);

  page("Memory Match", `
    <section class="game-card">
      <p class="progress-line">Match English and Croatian words.</p>
      <div class="memory-grid">
        ${ui.memoryCards.map((card) => {
          const open = ui.memoryOpen.includes(card.id) || ui.memoryMatched.includes(card.id);
          return `<button class="memory-card ${open ? "open" : ""}" data-card="${card.id}">
            ${open ? `<span>${card.label}</span><small>${card.type}</small>` : "<span>?</span>"}
          </button>`;
        }).join("")}
      </div>
      <button class="secondary" id="resetMemory">Shuffle again</button>
    </section>
  `);

  document.querySelectorAll("[data-card]").forEach((btn) => {
    btn.addEventListener("click", () => flipCard(btn.dataset.card));
  });
  document.getElementById("resetMemory").addEventListener("click", () => {
    setupMemory();
    render();
  });
}

function flipCard(cardId) {
  if (ui.memoryMatched.includes(cardId) || ui.memoryOpen.includes(cardId)) return;
  if (ui.memoryOpen.length >= 2) return;

  ui.memoryOpen.push(cardId);

  if (ui.memoryOpen.length === 2) {
    const [aId, bId] = ui.memoryOpen;
    const a = ui.memoryCards.find((c) => c.id === aId);
    const b = ui.memoryCards.find((c) => c.id === bId);
    if (a && b && a.pairId === b.pairId) {
      ui.memoryMatched.push(aId, bId);
      ui.memoryOpen = [];
      speakText(`Good match. ${a.label}.`);
    } else {
      setTimeout(() => {
        ui.memoryOpen = [];
        render();
      }, 650);
    }
  }
  render();
}

function renderSpeak() {
  const level = getLevel();
  const prompt = level.speakPrompts[ui.speakIndex];
  if (!prompt) return finishMode("speak", level.speakPrompts.length, level.speakPrompts.length);

  const hasRecognition = Boolean(getSpeechRecognition());
  page("Listen & Say", `
    <section class="game-card">
      <p class="progress-line">Sentence ${ui.speakIndex + 1} of ${level.speakPrompts.length}</p>
      <h2>Say this:</h2>
      <div class="say-box">${prompt.say}</div>
      ${ui.voiceNotice ? `<p class="voice-notice">${ui.voiceNotice}</p>` : ""}
      <div class="hero-actions">
        <button class="primary" id="listenBtn">Listen</button>
        <button class="primary" id="speakBtn" ${ui.speechResult?.tone === "listen" ? "disabled" : ""}>${hasRecognition ? "I will say it" : "I said it"}</button>
      </div>
      <p class="muted">${hasRecognition ? "The browser will try to hear your words." : "Speech recognition is not available here. Tap after saying it out loud."}</p>
      ${feedbackHtml(ui.speechResult)}
      ${ui.speechResult?.needsContinue ? nextButtonHtml("speakNext") : ""}
    </section>
  `);

  document.getElementById("listenBtn").addEventListener("click", () => speakText(prompt.say));
  if (ui.speechResult?.needsContinue) {
    document.getElementById("speakNext").addEventListener("click", () => {
      ui.speakIndex += 1;
      ui.speechResult = null;
      render();
    });
  }
  document.getElementById("speakBtn").addEventListener("click", () => {
    if (ui.speechResult?.needsContinue) return;
    const recognition = getSpeechRecognition();
    if (!recognition) {
      playEffect("correct");
      ui.speechResult = {
        tone: "correct",
        title: "Nice speaking!",
        text: "Great try."
      };
      setTimeout(() => {
        ui.speakIndex += 1;
        ui.speechResult = null;
        render();
      }, 800);
      render();
      return;
    }

    ui.speechResult = {
      tone: "listen",
      title: "Listening...",
      text: "Say it slowly."
    };
    render();

    recognition.onresult = (event) => {
      const heard = event.results?.[0]?.[0]?.transcript || "";
      const normalised = normaliseSpeech(heard);
      const found = prompt.targetWords.filter((w) => normalised.includes(normaliseSpeech(w))).length;
      if (found >= Math.max(1, Math.ceil(prompt.targetWords.length / 2))) {
        playEffect("correct");
        ui.speechResult = {
          tone: "correct",
          title: "Nice!",
          text: `I heard: “${heard}”.`
        };
        setTimeout(() => {
          ui.speakIndex += 1;
          ui.speechResult = null;
          render();
        }, 1000);
      } else {
        playEffect("wrong");
        ui.speechResult = {
          tone: "learn",
          title: "Good try.",
          text: `I heard: “${heard}”.`,
          cue: `Say: ${prompt.say}`,
          needsContinue: true
        };
      }
      render();
    };

    recognition.onerror = () => {
      playEffect("wrong");
      ui.speechResult = {
        tone: "learn",
        title: "Good try.",
        text: "The browser did not hear clearly.",
        cue: `Say: ${prompt.say}`,
        needsContinue: true
      };
      render();
    };

    try {
      recognition.start();
    } catch {
      playEffect("wrong");
      ui.speechResult = {
        tone: "learn",
        title: "Good try.",
        text: "The browser is not ready to listen.",
        cue: `Say: ${prompt.say}`,
        needsContinue: true
      };
      render();
    }
  });
}

function renderBuild() {
  const level = getLevel();
  const sentence = level.buildSentences[ui.buildIndex];
  if (!sentence) return finishMode("build", level.buildSentences.length, level.buildSentences.length);

  const chosen = ui.buildChosen;
  const remaining = sentence.filter((word, index) => !chosen.some((item) => item.index === index));
  const shuffledRemaining = shuffle(remaining.map((word) => ({ word, originalIndex: sentence.indexOf(word) })));

  page("Build Sentence", `
    <section class="game-card">
      <p class="progress-line">Sentence ${ui.buildIndex + 1} of ${level.buildSentences.length}</p>
      <h2>Tap the words in order.</h2>
      <div class="sentence-box">${chosen.map((item) => `<span>${item.word}</span>`).join("") || "<em>Start here…</em>"}</div>
      <div class="tile-grid">
        ${shuffledRemaining.map((item) => `<button class="word-tile" data-word="${escapeAttr(item.word)}" ${ui.buildFeedback ? "disabled" : ""}>${item.word}</button>`).join("")}
      </div>
      ${feedbackHtml(ui.buildFeedback)}
      ${ui.buildFeedback ? nextButtonHtml("buildOk", "OK") : ""}
      <button class="secondary" id="clearBuild">Clear</button>
    </section>
  `);

  if (ui.buildFeedback) {
    document.getElementById("buildOk").addEventListener("click", () => {
      ui.buildFeedback = null;
      render();
    });
  }

  document.querySelectorAll("[data-word]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (ui.buildFeedback) return;
      const word = btn.dataset.word;
      const nextIndex = ui.buildChosen.length;
      if (sentence[nextIndex] === word) {
        ui.buildChosen.push({ word, index: nextIndex });
        if (ui.buildChosen.length === sentence.length) {
          playEffect("correct");
          speakText(`Great sentence. ${sentence.join(" ")}.`);
          setTimeout(() => {
            ui.buildIndex += 1;
            ui.buildChosen = [];
            ui.buildFeedback = null;
            render();
          }, 900);
        }
      } else {
        playEffect("wrong");
        ui.buildFeedback = {
          tone: "learn",
          title: "Good try.",
          text: `Next word: ${sentence[nextIndex]}.`,
          cue: "Tap the words in order."
        };
      }
      render();
    });
  });

  document.getElementById("clearBuild").addEventListener("click", () => {
    ui.buildChosen = [];
    ui.buildFeedback = null;
    render();
  });
}

function finishMode(mode, correct, total) {
  const level = getLevel();
  const earned = starsFromScore(correct, total);
  const levelIndex = levels.findIndex((item) => item.id === level.id);
  const nextLevel = levels[levelIndex + 1];
  const nextWasUnlocked = nextLevel ? Boolean(levelProgress(nextLevel.id).unlocked) : false;
  const trophiesBefore = new Set(progress.trophies);
  const lp = levelProgress(level.id);
  const key = `${mode}Stars`;
  lp[key] = Math.max(lp[key] || 0, earned);
  lp.attempts = (lp.attempts || 0) + 1;
  progress.levelProgress[level.id] = lp;
  progress = recalcAndUnlock(progress);
  const nextUnlockedNow = nextLevel ? Boolean(levelProgress(nextLevel.id).unlocked) && !nextWasUnlocked : false;
  const newRewards = progress.trophies.filter((item) => !trophiesBefore.has(item));

  if (newRewards.length) {
    playEffect("rewardUnlock");
  } else if (nextUnlockedNow) {
    playEffect("level");
  } else {
    playEffect("star");
  }
  if (!newRewards.length && nextUnlockedNow) {
    setTimeout(() => playEffect("announcement"), 180);
  }

  speakText(`You collected ${earned} stars. Great work ${learnerProfile.spokenName}.`);
  ui.levelBurst = {
    id: `${level.id}-${Date.now()}`,
    levelId: level.id,
    stars: earned
  };
  ui.screen = "level";
  render();
}

function renderTrophies() {
  const legacyTrophies = progress.trophies.filter((item) => !rewardMilestones.some((reward) => reward.title === item));
  const pendingRewardSet = new Set(
    (progress.pendingRewardReveals || []).filter((title) => progress.trophies.includes(title))
  );
  const hasNewRewardReveal = pendingRewardSet.size > 0;
  page("Trophy Room", `
    <section class="card trophy-room ${hasNewRewardReveal ? "celebrating-reward" : ""}">
      ${hasNewRewardReveal ? `
        <div class="reward-confetti" aria-hidden="true">
          <span>✦</span><span>★</span><span>◆</span><span>✧</span><span>★</span><span>✦</span>
        </div>
      ` : ""}
      <p class="eyebrow">Magic rewards</p>
      <h2>Total stars: ${progress.totalStars}</h2>
      <p class="muted">Collect stars. Unlock magic things.</p>
      <div class="reward-grid">
        ${rewardMilestones.map((reward) => {
          const unlocked = progress.totalStars >= reward.stars;
          const newlyRevealed = pendingRewardSet.has(reward.title);
          return `
            <div class="reward-card ${unlocked ? "unlocked" : "locked"} ${newlyRevealed ? "newly-revealed" : ""}">
              <span class="reward-icon">${unlocked ? reward.icon : "🔒"}</span>
              <strong>${reward.title}</strong>
              <small>${reward.stars} stars</small>
              <p>${unlocked ? reward.description : "Keep questing."}</p>
            </div>
          `;
        }).join("")}
      </div>
    </section>
    ${legacyTrophies.length ? `
      <section class="card">
        <h2>Quest badges</h2>
        <div class="trophy-grid">
          ${legacyTrophies.map((item) => `<div class="trophy">🏆<strong>${item}</strong></div>`).join("")}
        </div>
      </section>
    ` : ""}
    <section class="card danger-zone">
      <h2>Reset progress</h2>
      <p class="muted">Use only if you want to start from the beginning.</p>
      <button class="danger" id="resetBtn">Reset saved progress</button>
    </section>
  `);

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm(`Reset ${learnerProfile.displayName}'s saved progress?`)) {
      progress = resetProgress();
      ui.screen = "home";
      render();
    }
  });

  if (hasNewRewardReveal) {
    playEffect("rewardUnlock");
    progress.pendingRewardReveals = (progress.pendingRewardReveals || []).filter(
      (title) => !pendingRewardSet.has(title)
    );
    progress = saveProgress(progress);
  }
}

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const hadController = Boolean(navigator.serviceWorker.controller);
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController) return;
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })
      .then((registration) => {
        registration.update().catch(() => {});
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      })
      .catch(() => {});
  });
}

render();
