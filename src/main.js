import "./styles.css";
import { learnerProfile, gameConfig, levels, bonusIdeas } from "./data/curriculum.js";
import { speak, getSpeechRecognition, normaliseSpeech, stopSpeaking } from "./lib/speech.js";
import { playSound } from "./lib/sound.js";
import { loadProgress, saveProgress, resetProgress, recalcAndUnlock, starsFromScore } from "./lib/storage.js";

const app = document.getElementById("app");

let progress = loadProgress();
let ui = {
  screen: "home",
  levelId: progress.lastPlayedLevelId || levels[0].id,
  mode: null,
  quizIndex: 0,
  quizCorrect: 0,
  quizFeedback: "",
  pictureIndex: 0,
  pictureCorrect: 0,
  pictureFeedback: "",
  memoryCards: [],
  memoryOpen: [],
  memoryMatched: [],
  speakIndex: 0,
  speechResult: "",
  buildIndex: 0,
  buildChosen: [],
  buildFeedback: ""
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

function page(title, body) {
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <button class="brand" data-action="home" aria-label="Go home">
          <span class="brand-icon">✨</span>
          <span>${gameConfig.title}</span>
        </button>
        <div class="score-pill" title="Total stars">⭐ ${progress.totalStars}</div>
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
    <div class="shell">
      <header class="topbar">
        <div class="brand"><span class="brand-icon">✨</span><span>${gameConfig.title}</span></div>
        <div class="score-pill">⭐ ${progress.totalStars}</div>
      </header>
      <main>
        <section class="hero">
          <div class="hero-card">
            <p class="eyebrow">Bok, ${learnerProfile.spokenName}.</p>
            <h1>Ready for a tiny English adventure?</h1>
            <p class="lead">Play short games. Collect stars. Practise easy English words.</p>
            <div class="hero-actions">
              <button class="primary" id="startBtn">Start Quest</button>
              <button class="secondary" id="trophyBtn">Trophy Room</button>
            </div>
          </div>
          <div class="mascot" aria-hidden="true">
            <div class="moon">🌙</div>
            <div class="spark">⭐</div>
            <div class="avatar">🧚</div>
          </div>
        </section>

        <section class="card">
          <h2>Today’s friendly words</h2>
          <div class="chips">
            <span>subject = predmet</span>
            <span>blanket = dekica</span>
            <span>juhica = grandma’s soup</span>
          </div>
        </section>
      </main>
    </div>
  `;

  document.getElementById("startBtn").addEventListener("click", () => {
    playSound("star");
    speak(`Hi ${learnerProfile.spokenName}. Choose a little world.`);
    ui.screen = "map";
    render();
  });
  document.getElementById("trophyBtn").addEventListener("click", () => {
    ui.screen = "trophies";
    render();
  });
}

function renderMap() {
  const cards = levels.map((level) => {
    const lp = levelProgress(level.id);
    const locked = !lp.unlocked;
    const total = (lp.quizStars || 0) + (lp.memoryStars || 0) + (lp.pictureStars || 0) + (lp.speakStars || 0) + (lp.buildStars || 0);
    return `
      <button class="level-node ${locked ? "locked" : ""}" data-level="${level.id}" ${locked ? "disabled" : ""}>
        <span class="level-order">${level.order}</span>
        <span class="level-icon">${locked ? "🔒" : level.icon}</span>
        <strong>${level.title}</strong>
        <small>${locked ? level.unlockHint : level.topic}</small>
        <span class="mini-stars">${starCount(total)}</span>
      </button>
    `;
  }).join("");

  page("Quest Map", `
    <section class="map-grid">${cards}</section>
    <section class="card">
      <h2>Bonus ideas</h2>
      <p class="muted">Codex can later turn these into full unlockable worlds.</p>
      <ul class="bonus-list">
        ${bonusIdeas.map((b) => `<li><strong>${b.title}</strong> unlocks at ${b.unlockStars} stars: ${b.idea}</li>`).join("")}
      </ul>
    </section>
  `);

  document.querySelectorAll("[data-level]").forEach((btn) => {
    btn.addEventListener("click", () => {
      ui.levelId = btn.dataset.level;
      progress.lastPlayedLevelId = ui.levelId;
      progress = saveProgress(progress);
      ui.screen = "level";
      speak(`${getLevel().title}. Choose a game.`);
      render();
    });
  });
}

function renderLevel() {
  const level = getLevel();
  const lp = levelProgress(level.id);
  page(`${level.icon} ${level.title}`, `
    <section class="card level-intro">
      <p class="eyebrow">${level.topic}</p>
      <h2>${level.microTarget}</h2>
      <p>${level.personalHook}</p>
      <div class="mode-grid">
        <button class="mode-card" data-mode="quiz">❓<strong>Quiz</strong><span>${stars(lp.quizStars)}</span></button>
        <button class="mode-card" data-mode="picture">🖼️<strong>Picture Match</strong><span>${stars(lp.pictureStars)}</span></button>
        <button class="mode-card" data-mode="memory">🧠<strong>Memory</strong><span>${stars(lp.memoryStars)}</span></button>
        <button class="mode-card" data-mode="speak">🎙️<strong>Listen & Say</strong><span>${stars(lp.speakStars)}</span></button>
        <button class="mode-card" data-mode="build">🧩<strong>Build Sentence</strong><span>${stars(lp.buildStars)}</span></button>
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
}

function startMode(mode) {
  ui.mode = mode;
  ui.quizIndex = 0;
  ui.quizCorrect = 0;
  ui.quizFeedback = "";
  ui.pictureIndex = 0;
  ui.pictureCorrect = 0;
  ui.pictureFeedback = "";
  ui.speakIndex = 0;
  ui.speechResult = "";
  ui.buildIndex = 0;
  ui.buildChosen = [];
  ui.buildFeedback = "";

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
        ${q.options.map((opt) => `<button class="answer-btn" data-answer="${escapeAttr(opt)}">${opt}</button>`).join("")}
      </div>
      ${ui.quizFeedback ? `<p class="feedback">${ui.quizFeedback}</p>` : ""}
      <button class="secondary" id="readQuestion">Read question</button>
    </section>
  `);

  document.getElementById("readQuestion").addEventListener("click", () => speak(q.prompt));
  document.querySelectorAll("[data-answer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.dataset.answer;
      const correct = answer === q.correct;
      if (correct) {
        ui.quizCorrect += 1;
        playSound("correct");
        ui.quizFeedback = `Nice! ${q.explain}`;
        speak(`Nice. ${q.explain}`);
      } else {
        playSound("wrong");
        ui.quizFeedback = `Good try. ${q.explain}`;
        speak(`Good try. ${q.explain}`);
      }
      setTimeout(() => {
        ui.quizIndex += 1;
        ui.quizFeedback = "";
        render();
      }, 900);
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
        ${options.map((opt) => `<button class="answer-btn picture-answer" data-picture-answer="${escapeAttr(opt)}">${opt}</button>`).join("")}
      </div>
      ${ui.pictureFeedback ? `<p class="feedback">${ui.pictureFeedback}</p>` : ""}
    </section>
  `);

  document.querySelectorAll("[data-picture-answer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (ui.pictureFeedback) return;
      const answer = btn.dataset.pictureAnswer;
      const correct = answer === item.word;
      if (correct) {
        ui.pictureCorrect += 1;
        ui.pictureFeedback = `Nice! ${item.word}.`;
        playSound("correct");
        speak(`Nice. ${item.word}.`);
      } else {
        ui.pictureFeedback = `Good try. It is ${item.word}.`;
        playSound("wrong");
        speak(`Good try. It is ${item.word}.`);
      }
      setTimeout(() => {
        ui.pictureIndex += 1;
        ui.pictureFeedback = "";
        render();
      }, 900);
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
  playSound("star");

  if (ui.memoryOpen.length === 2) {
    const [aId, bId] = ui.memoryOpen;
    const a = ui.memoryCards.find((c) => c.id === aId);
    const b = ui.memoryCards.find((c) => c.id === bId);
    if (a && b && a.pairId === b.pairId) {
      ui.memoryMatched.push(aId, bId);
      ui.memoryOpen = [];
      speak(`Good match. ${a.label}.`);
      playSound("correct");
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
      <div class="hero-actions">
        <button class="primary" id="listenBtn">Listen</button>
        <button class="primary" id="speakBtn">${hasRecognition ? "I will say it" : "I said it"}</button>
      </div>
      <p class="muted">${hasRecognition ? "The browser will try to hear your words." : "Speech recognition is not available here. Tap after saying it out loud."}</p>
      ${ui.speechResult ? `<p class="feedback">${ui.speechResult}</p>` : ""}
    </section>
  `);

  document.getElementById("listenBtn").addEventListener("click", () => speak(prompt.say));
  document.getElementById("speakBtn").addEventListener("click", () => {
    const recognition = getSpeechRecognition();
    if (!recognition) {
      playSound("correct");
      ui.speechResult = "Nice speaking. Great try!";
      setTimeout(() => {
        ui.speakIndex += 1;
        ui.speechResult = "";
        render();
      }, 800);
      render();
      return;
    }

    ui.speechResult = "Listening...";
    render();

    recognition.onresult = (event) => {
      const heard = event.results?.[0]?.[0]?.transcript || "";
      const normalised = normaliseSpeech(heard);
      const found = prompt.targetWords.filter((w) => normalised.includes(normaliseSpeech(w))).length;
      if (found >= Math.max(1, Math.ceil(prompt.targetWords.length / 2))) {
        playSound("correct");
        ui.speechResult = `I heard: “${heard}”. Nice!`;
      } else {
        playSound("star");
        ui.speechResult = `I heard: “${heard}”. Good try. Let’s keep going.`;
      }
      setTimeout(() => {
        ui.speakIndex += 1;
        ui.speechResult = "";
        render();
      }, 1000);
      render();
    };

    recognition.onerror = () => {
      playSound("star");
      ui.speechResult = "Good try. The browser did not hear clearly, but that is OK.";
      setTimeout(() => {
        ui.speakIndex += 1;
        ui.speechResult = "";
        render();
      }, 1000);
      render();
    };

    recognition.start();
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
        ${shuffledRemaining.map((item) => `<button class="word-tile" data-word="${escapeAttr(item.word)}">${item.word}</button>`).join("")}
      </div>
      ${ui.buildFeedback ? `<p class="feedback">${ui.buildFeedback}</p>` : ""}
      <button class="secondary" id="clearBuild">Clear</button>
    </section>
  `);

  document.querySelectorAll("[data-word]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const word = btn.dataset.word;
      const nextIndex = ui.buildChosen.length;
      if (sentence[nextIndex] === word) {
        ui.buildChosen.push({ word, index: nextIndex });
        playSound("star");
        if (ui.buildChosen.length === sentence.length) {
          playSound("correct");
          speak(`Great sentence. ${sentence.join(" ")}.`);
          setTimeout(() => {
            ui.buildIndex += 1;
            ui.buildChosen = [];
            ui.buildFeedback = "";
            render();
          }, 900);
        }
      } else {
        playSound("wrong");
        ui.buildFeedback = "Good try. Try another word.";
      }
      render();
    });
  });

  document.getElementById("clearBuild").addEventListener("click", () => {
    ui.buildChosen = [];
    ui.buildFeedback = "";
    render();
  });
}

function finishMode(mode, correct, total) {
  const level = getLevel();
  const earned = starsFromScore(correct, total);
  const lp = levelProgress(level.id);
  const key = `${mode}Stars`;
  lp[key] = Math.max(lp[key] || 0, earned);
  lp.attempts = (lp.attempts || 0) + 1;
  progress.levelProgress[level.id] = lp;
  progress = recalcAndUnlock(progress);

  playSound("level");
  page("Stars collected!", `
    <section class="game-card celebration">
      <div class="big-stars">${stars(earned)}</div>
      <h2>${correct} out of ${total}</h2>
      <p>${earned >= 2 ? "Amazing work, Eli." : "Good try, Eli. Guessing helps you learn."}</p>
      <div class="hero-actions">
        <button class="primary" id="againBtn">Play again</button>
        <button class="secondary" id="levelBtn">Back to level</button>
        <button class="secondary" id="mapBtn">Map</button>
      </div>
    </section>
  `);

  speak(`You collected ${earned} stars. Great work ${learnerProfile.spokenName}.`);

  document.getElementById("againBtn").addEventListener("click", () => startMode(mode));
  document.getElementById("levelBtn").addEventListener("click", () => {
    ui.screen = "level";
    render();
  });
  document.getElementById("mapBtn").addEventListener("click", () => {
    ui.screen = "map";
    render();
  });
}

function renderTrophies() {
  const trophyItems = progress.trophies.length ? progress.trophies : ["No trophies yet. Play to collect stars!"];
  page("Trophy Room", `
    <section class="card">
      <h2>Total stars: ${progress.totalStars}</h2>
      <div class="trophy-grid">
        ${trophyItems.map((item) => `<div class="trophy">🏆<strong>${item}</strong></div>`).join("")}
      </div>
    </section>
    <section class="card danger-zone">
      <h2>Reset progress</h2>
      <p class="muted">Use only if you want to start from the beginning.</p>
      <button class="danger" id="resetBtn">Reset saved progress</button>
    </section>
  `);

  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("Reset Eli's saved progress?")) {
      progress = resetProgress();
      ui.screen = "home";
      render();
    }
  });
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
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

render();
