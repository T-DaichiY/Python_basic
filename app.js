// ---- State ----
let pyodide = null;
let editor = null;
let currentModuleIndex = 0;
let currentExerciseIndex = 0;
let currentStep = "lesson";      // "lesson" | "quiz" | "practice"
let hintLevel = 0;               // how many hints revealed for the current exercise
let saveTimer = null;

const $ = (id) => document.getElementById(id);
const modules = () => window.MODULES;
const currentModule = () => modules()[currentModuleIndex];
const currentExercise = () => currentModule().exercises[currentExerciseIndex];
const LETTERS = ["A", "B", "C", "D", "E", "F"];

// ---- Terminal-style Python syntax highlighting for static code samples ----
// (the Monaco editor already highlights itself; this is for the read-only
// Example / Starter / Model answer blocks, which are plain strings.)
const PY_KEYWORDS = "def return if elif else for while in import from class True False None and or not break continue pass is as with try except finally raise lambda global nonlocal yield".split(" ");
const PY_BUILTINS = "print input int float str bool len range open type round abs list dict set tuple".split(" ");
const PY_TOKEN_RE = new RegExp(
  "(#[^\\n]*)" +
  "|(\"\"\"[\\s\\S]*?\"\"\"|'''[\\s\\S]*?'''|\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')" +
  "|\\b(\\d+\\.?\\d*)\\b" +
  "|\\b(" + PY_KEYWORDS.join("|") + ")\\b" +
  "|\\b(" + PY_BUILTINS.join("|") + ")\\b",
  "g"
);
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function highlightPython(code) {
  return escapeHtml(code).replace(PY_TOKEN_RE, (m, comment, str, num, kw, builtin) => {
    if (comment) return `<span class="tok-com">${comment}</span>`;
    if (str) return `<span class="tok-str">${str}</span>`;
    if (num) return `<span class="tok-num">${num}</span>`;
    if (kw) return `<span class="tok-kw">${kw}</span>`;
    if (builtin) return `<span class="tok-bi">${builtin}</span>`;
    return m;
  });
}

// ---- localStorage helpers ----
const SOLVED_KEY = "py8_solved_v1";
const QUIZ_KEY = "py8_quiz_v1";
const codeKey = (id) => "py8_code_" + id;

function getSolved() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SOLVED_KEY) || "[]"));
  } catch {
    return new Set();
  }
}
function markSolved(id) {
  const s = getSolved();
  if (!s.has(id)) {
    s.add(id);
    localStorage.setItem(SOLVED_KEY, JSON.stringify([...s]));
    refreshExerciseTabs();
    updateProgress();
    queueCloudSync();
  }
}
function saveCode(id, code) {
  try { localStorage.setItem(codeKey(id), code); } catch {}
  queueCloudSync();
}
function loadCode(id) {
  try { return localStorage.getItem(codeKey(id)); } catch { return null; }
}
function getQuizAnswers() {
  try {
    return JSON.parse(localStorage.getItem(QUIZ_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveQuizAnswer(moduleId, qIndex, optionIndex) {
  const all = getQuizAnswers();
  all[moduleId] = all[moduleId] || {};
  all[moduleId][qIndex] = optionIndex;
  localStorage.setItem(QUIZ_KEY, JSON.stringify(all));
  queueCloudSync();
}

// ---- Cloud sync (Google sign-in via Firebase, see the inline module script
// in index.html). Everything here is optional — if the user never signs in,
// window._fbUser stays null and these are no-ops, so the app behaves exactly
// as it did with plain localStorage. ----
let cloudSyncTimer = null;
function getAllSavedCode() {
  const out = {};
  modules().forEach((m) =>
    m.exercises.forEach((ex) => {
      const c = loadCode(ex.id);
      if (c != null) out[ex.id] = c;
    })
  );
  return out;
}
function collectLocalProgress() {
  return { solved: [...getSolved()], quiz: getQuizAnswers(), code: getAllSavedCode() };
}
function queueCloudSync() {
  if (!window._fbUser || !window._fbSyncProgress) return;
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(() => window._fbSyncProgress(collectLocalProgress()), 800);
}
// Merge cloud progress into local on sign-in: union solved exercises, let
// local answers win over cloud on conflicting quiz questions (most recent
// device wins), and only fill in code for exercises untouched on this device.
function applyCloudProgress(cloud) {
  if (!cloud) return;

  const mergedSolved = new Set([...getSolved(), ...(cloud.solved || [])]);
  localStorage.setItem(SOLVED_KEY, JSON.stringify([...mergedSolved]));

  const localQuiz = getQuizAnswers();
  const cloudQuiz = cloud.quiz || {};
  const mergedQuiz = {};
  new Set([...Object.keys(cloudQuiz), ...Object.keys(localQuiz)]).forEach((mid) => {
    mergedQuiz[mid] = { ...(cloudQuiz[mid] || {}), ...(localQuiz[mid] || {}) };
  });
  localStorage.setItem(QUIZ_KEY, JSON.stringify(mergedQuiz));

  Object.entries(cloud.code || {}).forEach(([id, code]) => {
    if (loadCode(id) == null) saveCode(id, code);
  });

  updateProgress();
  refreshExerciseTabs();
  if (currentStep === "quiz") renderQuiz(currentModule());
  if (currentStep === "practice" && editor) {
    const ex = currentExercise();
    if (ex) editor.setValue(loadCode(ex.id) || ex.starter);
  }
}
window._collectLocalProgress = collectLocalProgress;
window._applyCloudProgress = applyCloudProgress;

// ---- Module solved-count helpers (drive home page + nav progress) ----
function totalExercises() {
  return modules().reduce((n, m) => n + m.exercises.length, 0);
}
function solvedCountIn(m) {
  const solved = getSolved();
  return m.exercises.filter((ex) => solved.has(ex.id)).length;
}
function updateProgress() {
  const solved = getSolved();
  const total = totalExercises();
  let n = 0;
  modules().forEach((m) => m.exercises.forEach((ex) => { if (solved.has(ex.id)) n++; }));
  $("navProgress").textContent = `${n} / ${total} solved`;
  $("homeProgressFill").style.width = total ? (n / total) * 100 + "%" : "0%";
  $("homeProgressText").textContent = `${n} / ${total} exercises solved`;
  refreshHomeCards();
  refreshNavTabs();
}

// ---- Boot Pyodide ----
async function initPyodide() {
  const btn = $("runBtn");
  setStatus("Loading Python runtime…");
  btn.textContent = "Loading Python…";
  try {
    if (typeof loadPyodide !== "function") {
      throw new Error("Pyodide script did not load (check your internet connection).");
    }
    pyodide = await loadPyodide();
    setStatus("Ready");
    btn.textContent = "▶ Run & Grade";
    btn.disabled = false;
    $("runOnlyBtn").disabled = false;
  } catch (e) {
    setStatus("Python failed to load");
    btn.textContent = "Python failed to load";
    $("results").innerHTML =
      '<div class="stderr">Could not load the Python runtime:\n\n' +
      String(e && e.message ? e.message : e) +
      "\n\nCheck your internet connection and reload the page.</div>";
  }
}

// ---- Boot Monaco ----
// Injected dynamically AFTER Pyodide so its global `define`/`require` never
// clashes with Pyodide's UMD bundle.
function initMonaco() {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js";
    s.onload = () => {
      require.config({
        paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs" },
      });
      require(["vs/editor/editor.main"], () => {
        editor = monaco.editor.create($("editor"), {
          value: "",
          language: "python",
          theme: "vs-dark",
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 4,
          insertSpaces: true,
        });
        editor.onDidChangeModelContent(() => {
          const ex = currentExercise();
          if (!ex) return;
          clearTimeout(saveTimer);
          const id = ex.id;
          const val = editor.getValue();
          saveTimer = setTimeout(() => saveCode(id, val), 400);
        });
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, runAndGrade);
        resolve();
      });
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ---- Home page ----
function renderHomeCards() {
  const wrap = $("homeCards");
  wrap.innerHTML = "";
  modules().forEach((m, i) => {
    const card = document.createElement("div");
    card.className = "hcard";
    card.style.setProperty("--c", m.hex);
    card.addEventListener("click", () => openModule(i));
    card.innerHTML = `
      <div class="hcard-ic">${m.icon}</div>
      <div class="hcard-label">${i + 1}. ${m.title}</div>
      <div class="hcard-n" id="hcard-n-${m.id}"></div>
      <div class="hcard-progress"><div class="hcard-progress-fill" id="hcard-fill-${m.id}"></div></div>
    `;
    wrap.appendChild(card);
  });
  refreshHomeCards();
}
function refreshHomeCards() {
  modules().forEach((m) => {
    const el = $(`hcard-n-${m.id}`);
    const fill = $(`hcard-fill-${m.id}`);
    if (!el || !fill) return;
    const n = solvedCountIn(m);
    el.textContent = `${n} / ${m.exercises.length} solved`;
    const pct = m.exercises.length ? (n / m.exercises.length) * 100 : 0;
    fill.style.width = pct + "%";
  });
}

// ---- Nav tabs ----
function renderNavTabs() {
  const wrap = $("navTabs");
  wrap.innerHTML = "";
  modules().forEach((m, i) => {
    const btn = document.createElement("button");
    btn.className = "ntab";
    btn.textContent = `${i + 1}. ${m.title}`;
    btn.style.setProperty("--c", m.hex);
    btn.addEventListener("click", () => openModule(i));
    wrap.appendChild(btn);
  });
  refreshNavTabs();
}
function refreshNavTabs() {
  const onHome = $("page-home").classList.contains("on");
  const tabs = $("navTabs").children;
  modules().forEach((m, i) => {
    const el = tabs[i];
    if (!el) return;
    el.classList.toggle("on", !onHome && i === currentModuleIndex);
  });
}

// ---- Fold/unfold sidebar ----
const NAV_FOLD_KEY = "pyPractice_navFolded";
function initNavFold() {
  let folded = false;
  try { folded = localStorage.getItem(NAV_FOLD_KEY) === "1"; } catch {}
  document.body.classList.toggle("nav-collapsed", folded);
  $("navToggle").addEventListener("click", () => {
    const isFolded = document.body.classList.toggle("nav-collapsed");
    try { localStorage.setItem(NAV_FOLD_KEY, isFolded ? "1" : "0"); } catch {}
  });
}

// ---- Page switching (home <-> module) ----
function showHome() {
  $("page-home").classList.add("on");
  $("page-mod").classList.remove("on");
  window.scrollTo(0, 0);
  refreshNavTabs();
}
function openModule(index) {
  index = Math.max(0, Math.min(modules().length - 1, index));
  currentModuleIndex = index;
  currentExerciseIndex = 0;
  loadModule(index);
  $("page-home").classList.remove("on");
  $("page-mod").classList.add("on");
  window.scrollTo(0, 0);
  refreshNavTabs();
}

function loadModule(index) {
  const m = modules()[index];
  hintLevel = 0;

  ["lBadge", "qBadge", "pBadge"].forEach((id) => {
    $(id).textContent = m.title;
    $(id).style.setProperty("--c", m.hex);
  });
  document.querySelectorAll("#lesson, #quiz, #main").forEach((el) => el.style.setProperty("--c", m.hex));

  // --- Lesson view ---
  $("lTitle").textContent = m.title;
  $("lConcept").innerHTML = m.lesson.concept.replace(/<p>/g, '<p class="sg-p">');
  $("lExample").innerHTML = highlightPython(m.lesson.example);
  const pts = $("lessonPoints");
  pts.innerHTML = "";
  m.lesson.keyPoints.forEach((k) => {
    const li = document.createElement("li");
    li.textContent = k;
    pts.appendChild(li);
  });

  // --- Quiz view ---
  $("qTitle").textContent = m.title + " — Quiz";
  renderQuiz(m);

  // --- Practice view ---
  renderExerciseTabs(m);
  loadExercise(0);

  showStep("lesson");
}

// ---- Step pills + step switching (lesson / quiz / practice) ----
function renderStepPills() {
  const m = currentModule();
  const wrap = $("modSteps");
  wrap.innerHTML = "";
  [
    { key: "lesson", label: "1. Lesson" },
    { key: "quiz", label: "2. Quiz" },
    { key: "practice", label: "3. Practice" },
  ].forEach((s) => {
    const pill = document.createElement("button");
    pill.className = "mod-step-pill";
    pill.style.setProperty("--c", m.hex);
    pill.textContent = s.label;
    pill.addEventListener("click", () => showStep(s.key));
    pill.dataset.step = s.key;
    wrap.appendChild(pill);
  });
  refreshStepPills();
}
function refreshStepPills() {
  const wrap = $("modSteps");
  [...wrap.children].forEach((pill) => {
    pill.classList.toggle("on", pill.dataset.step === currentStep);
  });
}
function showStep(step) {
  currentStep = step;
  $("lesson").style.display = step === "lesson" ? "block" : "none";
  $("quiz").style.display = step === "quiz" ? "block" : "none";
  $("main").style.display = step === "practice" ? "block" : "none";
  if (step === "practice" && editor) editor.layout();
  renderStepPills();
  window.scrollTo(0, 0);
}

// ---- Quiz engine ----
function renderQuiz(m) {
  const container = $("quizQuestions");
  container.innerHTML = "";
  const saved = getQuizAnswers()[m.id] || {};

  m.mcqs.forEach((mcq, qIndex) => {
    const qCard = document.createElement("div");
    qCard.className = "q-card";
    qCard.style.setProperty("--c", m.hex);

    const qText = document.createElement("div");
    qText.className = "q-text";
    qText.textContent = `${qIndex + 1}. ${mcq.q}`;
    qCard.appendChild(qText);

    const optsWrap = document.createElement("div");
    optsWrap.className = "q-opts";

    const feedback = document.createElement("div");
    feedback.className = "q-feedback";
    feedback.textContent = mcq.explain;

    mcq.options.forEach((optText, optIndex) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "q-opt";
      btn.innerHTML = `<span class="q-let">${LETTERS[optIndex]}</span><span>${optText}</span>`;
      btn.addEventListener("click", () => {
        saveQuizAnswer(m.id, qIndex, optIndex);
        applyQuizAnswer(qCard, mcq, optIndex);
        updateQuizScore(m);
      });
      optsWrap.appendChild(btn);
    });

    qCard.appendChild(optsWrap);
    qCard.appendChild(feedback);
    container.appendChild(qCard);

    if (saved[qIndex] !== undefined) {
      applyQuizAnswer(qCard, mcq, saved[qIndex]);
    }
  });

  updateQuizScore(m);
}
function applyQuizAnswer(qCard, mcq, chosenIndex) {
  const opts = qCard.querySelectorAll(".q-opt");
  opts.forEach((optEl, i) => {
    optEl.classList.remove("correct", "wrong");
    if (i === mcq.correct) optEl.classList.add("correct");
    else if (i === chosenIndex) optEl.classList.add("wrong");
  });
  const feedback = qCard.querySelector(".q-feedback");
  feedback.classList.add("show");
  feedback.classList.toggle("ok", chosenIndex === mcq.correct);
  feedback.classList.toggle("no", chosenIndex !== mcq.correct);
}
function updateQuizScore(m) {
  const saved = getQuizAnswers()[m.id] || {};
  let correct = 0;
  let answered = 0;
  m.mcqs.forEach((mcq, i) => {
    if (saved[i] !== undefined) answered++;
    if (saved[i] === mcq.correct) correct++;
  });
  $("quizScore").textContent = `Score: ${correct} / ${m.mcqs.length}`;
  const pct = m.mcqs.length ? (answered / m.mcqs.length) * 100 : 0;
  $("quizProgressFill").style.width = pct + "%";
}

// ---- Exercise tabs ----
function renderExerciseTabs(m) {
  const tabs = $("exerciseTabs");
  tabs.innerHTML = "";
  m.exercises.forEach((ex, i) => {
    const btn = document.createElement("button");
    btn.className = "exercise-tab";
    btn.style.setProperty("--c", m.hex);
    btn.textContent = `${i + 1}. ${ex.title}`;
    btn.addEventListener("click", () => loadExercise(i));
    tabs.appendChild(btn);
  });
  refreshExerciseTabs();
}
function refreshExerciseTabs() {
  const solved = getSolved();
  const m = currentModule();
  const tabs = $("exerciseTabs").children;
  m.exercises.forEach((ex, i) => {
    const el = tabs[i];
    if (!el) return;
    el.classList.toggle("active", i === currentExerciseIndex);
    el.classList.toggle("solved", solved.has(ex.id));
  });
}

function loadExercise(index) {
  const m = currentModule();
  index = Math.max(0, Math.min(m.exercises.length - 1, index));
  currentExerciseIndex = index;
  hintLevel = 0;
  const ex = m.exercises[index];

  $("pTitle").textContent = ex.title;
  $("pDesc").innerHTML = ex.description;
  $("pStarter").innerHTML = highlightPython(ex.starter);
  $("pInputsNote").textContent = ex.inputs
    ? `This exercise uses input() — sample values ${JSON.stringify(ex.inputs)} are fed in automatically when you Run.`
    : "";
  if (editor) editor.setValue(loadCode(ex.id) || ex.starter);
  resetResults();
  refreshExerciseTabs();
}

// ---- Run the student's code, capturing stdout. Returns {error, stdout}. ----
function runUserCode() {
  const ex = currentExercise();
  const userCode = editor.getValue();
  let error = null;
  let stdout = "";
  try {
    pyodide.runPython(`
import sys, io, builtins
__py8_stdout = io.StringIO()
__py8_old_stdout = sys.stdout
sys.stdout = __py8_stdout
`);
    if (ex.inputs && ex.inputs.length) {
      pyodide.globals.set("__py8_inputs", ex.inputs);
      pyodide.runPython(`
__py8_input_iter = iter(__py8_inputs)
__py8_old_input = builtins.input
def __py8_mock_input(prompt=""):
    try:
        return next(__py8_input_iter)
    except StopIteration:
        raise EOFError("No more sample input values left for this exercise.")
builtins.input = __py8_mock_input
`);
    }
    try {
      pyodide.runPython(userCode);
    } catch (e) {
      error = String(e.message || e);
    } finally {
      if (ex.inputs && ex.inputs.length) {
        pyodide.runPython(`builtins.input = __py8_old_input`);
      }
      stdout = pyodide.runPython(`
sys.stdout = __py8_old_stdout
__py8_stdout.getvalue()
`);
      pyodide.globals.set("__stdout", stdout);
    }
  } catch (e) {
    error = String(e.message || e);
  }
  return { error, stdout };
}

// ---- Run WITHOUT grading ----
async function runOnly() {
  if (!ready()) return;
  $("runOnlyBtn").disabled = true;
  setStatus("Running…");
  const results = $("results");
  results.innerHTML = "";
  const { error, stdout } = runUserCode();
  if (stdout && stdout.trim()) {
    const out = document.createElement("div");
    out.className = "stdout";
    out.textContent = "stdout:\n" + stdout;
    results.appendChild(out);
  }
  if (error) {
    const err = document.createElement("div");
    err.className = "stderr";
    err.textContent = error;
    results.appendChild(err);
  } else if (!stdout || !stdout.trim()) {
    results.innerHTML = '<div class="stdout">Code ran with no output. Add print(...) to see values, or use Run &amp; Grade.</div>';
  }
  setStatus("Ready");
  $("runOnlyBtn").disabled = false;
}

// ---- Run & grade ----
async function runAndGrade() {
  if (!ready()) return;
  $("runBtn").disabled = true;
  setStatus("Running…");

  const ex = currentExercise();
  const results = $("results");
  results.innerHTML = "";

  const { error: setupError, stdout } = runUserCode();

  if (stdout && stdout.trim()) {
    const out = document.createElement("div");
    out.className = "stdout";
    out.textContent = "stdout:\n" + stdout;
    results.appendChild(out);
  }

  if (setupError) {
    const err = document.createElement("div");
    err.className = "stderr";
    err.textContent = "Your code raised an error before tests could run:\n\n" + setupError;
    results.prepend(err);
    finishRun();
    return;
  }

  let passed = 0;
  const rows = [];
  for (const test of ex.tests) {
    let error = null;
    try {
      pyodide.runPython(test.code);
    } catch (e) {
      error = String(e.message || e);
    }
    const ok = !error;
    if (ok) passed++;
    rows.push({ name: test.name, ok, error });
  }

  const total = ex.tests.length;
  const allPass = passed === total;
  const summary = document.createElement("div");
  summary.className = "summary " + (allPass ? "ok" : "no");
  summary.textContent = allPass
    ? `✓ All ${total} tests passed! 🎉`
    : `${passed} / ${total} tests passed`;
  results.appendChild(summary);

  rows.forEach((r) => {
    const row = document.createElement("div");
    row.className = "test-row " + (r.ok ? "pass" : "fail");
    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = r.ok ? "✓" : "✗";
    const body = document.createElement("div");
    const name = document.createElement("div");
    name.textContent = r.name;
    body.appendChild(name);
    if (!r.ok && r.error) {
      const detail = document.createElement("div");
      detail.className = "detail";
      detail.textContent = cleanError(r.error);
      body.appendChild(detail);
    }
    row.appendChild(icon);
    row.appendChild(body);
    results.appendChild(row);
  });

  if (allPass) {
    markSolved(ex.id);
    launchConfetti();
  }

  finishRun();
}

// ---- Hints (PART 3 of the exercise, revealed one at a time) ----
function showHint() {
  const ex = currentExercise();
  const hints = ex.hints || [];
  if (hints.length === 0) return;
  if (hintLevel >= hints.length) {
    setStatus("No more hints");
    return;
  }
  hintLevel++;
  const results = $("results");
  const block = document.createElement("div");
  block.className = "hint-block";
  block.innerHTML = `<span class="title">💡 Hint ${hintLevel} of ${hints.length}</span>`;
  block.appendChild(document.createTextNode(hints[hintLevel - 1]));
  results.prepend(block);
}

// ---- Show answer (PART 4 of the exercise) ----
function showSolution() {
  const ex = currentExercise();
  if (!ex.solution) return;
  const results = $("results");
  const block = document.createElement("div");
  block.className = "solution-block";
  block.innerHTML = `
    <span class="title">Model answer</span>
    <div class="term">
      <div class="term-bar"><span class="term-dot r"></span><span class="term-dot y"></span><span class="term-dot g"></span><span class="term-label">answer.py</span></div>
      <pre class="term-body">${highlightPython(ex.solution)}</pre>
    </div>
  `;
  results.prepend(block);
}

// ---- Confetti (self-contained, no libraries) ----
function launchConfetti() {
  const canvas = $("confetti");
  const ctx = canvas.getContext("2d");
  const W = (canvas.width = window.innerWidth);
  const H = (canvas.height = window.innerHeight);
  const colors = ["#7c3aed", "#0891b2", "#16a34a", "#d97706", "#dc2626", "#111827"];
  const pieces = [];
  for (let i = 0; i < 140; i++) {
    pieces.push({
      x: Math.random() * W,
      y: -20 - Math.random() * H * 0.4,
      r: 4 + Math.random() * 6,
      c: colors[(Math.random() * colors.length) | 0],
      vx: -2 + Math.random() * 4,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      vr: -0.2 + Math.random() * 0.4,
    });
  }
  const start = performance.now();
  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, W, H);
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    });
    if (elapsed < 2600) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  }
  requestAnimationFrame(frame);
}

// ---- Small helpers ----
function ready() {
  if (!pyodide || !currentExercise()) return false;
  if (!editor) {
    setStatus("Editor still loading…");
    return false;
  }
  return true;
}
function cleanError(err) {
  const lines = err.split("\n").filter((l) => l.trim());
  const last = lines.slice(-2).join("\n");
  return last || err;
}
function finishRun() {
  $("runBtn").disabled = false;
  setStatus("Ready");
}
function resetResults() {
  $("results").innerHTML =
    '<div class="stdout">Test results will appear here after you run your code.</div>';
}
function setStatus(text) {
  $("status").textContent = text;
}

// ---- Wire up ----
window.addEventListener("DOMContentLoaded", () => {
  renderHomeCards();
  renderNavTabs();
  renderStepPills();
  updateProgress();
  loadModule(0);      // pre-load module 0's lesson/quiz/practice content, but stay on Home
  showHome();
  initNavFold();

  $("homeStartBtn").addEventListener("click", () => openModule(currentModuleIndex));
  $("goToQuiz").addEventListener("click", () => showStep("quiz"));
  $("goToPractice").addEventListener("click", () => showStep("practice"));

  $("runBtn").addEventListener("click", runAndGrade);
  $("runOnlyBtn").addEventListener("click", runOnly);
  $("hintBtn").addEventListener("click", showHint);
  $("solutionBtn").addEventListener("click", showSolution);
  $("resetBtn").addEventListener("click", () => {
    const ex = currentExercise();
    if (ex && editor) {
      editor.setValue(ex.starter);
      saveCode(ex.id, ex.starter);
    }
    resetResults();
  });

  // Pyodide first (clean scope), then Monaco.
  initPyodide().finally(() => {
    initMonaco()
      .then(() => {
        const ex = currentExercise();
        if (ex) editor.setValue(loadCode(ex.id) || ex.starter);
      })
      .catch(() => setStatus("Editor failed to load"));
  });
});
