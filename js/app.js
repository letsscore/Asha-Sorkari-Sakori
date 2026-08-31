import {
  firebaseEnabled,
  onAuthStateChanged,
  dbGet,
  dbSet,
  dbPush
} from "./firebase.js";
import { EXAMS, DEMO_TESTS } from "./data.js";
import { header, footer, esc } from "./ui.js";

header();
footer();
const $ = id => document.getElementById(id);

function renderExamCards() {
  const el = $("exam-grid");
  if (!el) return;
  el.innerHTML = EXAMS.map(e => `
    <article class="card exam-card">
      <span class="pill">${esc(e.tag)}</span>
      <h3>${esc(e.name)}</h3>
      <p>${esc(e.desc)}</p>
      <a class="btn small" href="exam-details.html?exam=${encodeURIComponent(e.id)}">Explore</a>
    </article>
  `).join("");
}
renderExamCards();

function firebaseNotice() {
  if (firebaseEnabled) return "";
  return `<div class="empty" style="margin-bottom:18px"><strong>Student system setup pending</strong><br>The public website is ready. Accounts, live tests, results, jobs and admin data will activate after a dedicated Firebase project for Asha-Sorkari-Sakori is connected.</div>`;
}

async function renderTests() {
  const el = $("tests-grid");
  if (!el) return;
  let tests = [...DEMO_TESTS];
  if (firebaseEnabled) {
    try {
      const snap = await dbGet("tests");
      if (snap.exists()) tests = Object.entries(snap.val()).map(([id, value]) => ({ ...value, id })).concat(DEMO_TESTS);
    } catch (error) {
      console.error(error);
    }
  }
  el.innerHTML = firebaseNotice() + tests.map(t => `
    <article class="card">
      <span class="pill">${esc(EXAMS.find(e => e.id === t.examId)?.name || t.examId)}</span>
      <h3>${esc(t.title)}</h3>
      <p>${t.questions?.length || 0} questions • ${t.duration || 0} minutes</p>
      <a class="btn small" href="test.html?test=${encodeURIComponent(t.id)}">Start Test</a>
    </article>
  `).join("");
}
renderTests();

const examId = new URLSearchParams(location.search).get("exam");
if ($("exam-details")) {
  const exam = EXAMS.find(e => e.id === examId);
  $("exam-details").innerHTML = exam ? `
    <span class="pill">${esc(exam.tag)}</span>
    <h1>${esc(exam.name)}</h1>
    <p>${esc(exam.desc)}</p>
    <h2>Preparation Areas</h2>
    <div class="grid">
      <div class="card"><h3>Practice</h3><p>Topic-wise questions, previous-style practice and examination-focused mock tests.</p></div>
      <div class="card"><h3>Revision</h3><p>Current affairs, Assam-specific knowledge and subject-focused revision resources.</p></div>
      <div class="card"><h3>Performance</h3><p>Attempt tests, submit answers and track your performance after Firebase is connected.</p></div>
    </div>
    <br><a class="btn" href="mock-tests.html">View Mock Tests</a>
  ` : `<div class="empty">Exam not found.</div>`;
}

async function runTest() {
  const root = $("test-root");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("test");
  let test = DEMO_TESTS.find(x => x.id === id);

  if (firebaseEnabled) {
    try {
      const snap = await dbGet("tests/" + id);
      if (snap.exists()) test = { ...snap.val(), id };
    } catch (error) {
      console.error(error);
    }
  }

  if (!test) { root.innerHTML = '<div class="empty">Test not found.</div>'; return; }

  if (!firebaseEnabled) {
    root.innerHTML = `<div class="details-card"><div class="eyebrow">${esc(test.title)}</div><h1>Test system ready</h1><p>This practice test is included in the new platform. Student login and result submission will be activated after the dedicated Firebase project is connected.</p><a class="btn" href="register.html">Create Student Account</a></div>`;
    return;
  }

  onAuthStateChanged(user => {
    if (!user) {
      root.innerHTML = `<div class="details-card"><h1>${esc(test.title)}</h1><p>Please login to attempt this test.</p><a class="btn" href="login.html">Login</a></div>`;
      return;
    }

    root.innerHTML = `
      <div class="page-head"><div class="eyebrow">MOCK TEST</div><h1>${esc(test.title)}</h1><p>${test.questions.length} questions • ${test.duration} minutes</p></div>
      <div class="timer" id="timer"></div>
      <form id="test-form">
        ${test.questions.map((q, i) => `<div class="test-question"><h3>${i + 1}. ${esc(q.text)}</h3>${q.options.map((o, j) => `<label class="option"><input type="radio" name="q${i}" value="${j}" required>${esc(o)}</label>`).join("")}</div>`).join("")}
        <button class="btn" type="submit">Submit Test</button>
        <p id="test-msg" class="message"></p>
      </form>`;

    let seconds = (test.duration || 20) * 60;
    const timer = $("timer");
    const form = $("test-form");
    const interval = setInterval(() => {
      timer.textContent = `Time left: ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
      if (seconds-- <= 0) { clearInterval(interval); form.requestSubmit(); }
    }, 1000);

    form.addEventListener("submit", async event => {
      event.preventDefault();
      clearInterval(interval);
      form.querySelector("button[type=submit]").disabled = true;
      const data = new FormData(form);
      let score = 0;
      const answers = {};
      test.questions.forEach((q, i) => {
        const answer = Number(data.get("q" + i));
        answers[q.id] = answer;
        if (answer === q.answer) score++;
      });
      try {
        const resultRef = await dbPush("results");
        await dbSet("results/" + resultRef.key, {
          testId: test.id,
          testTitle: test.title,
          userId: user.uid,
          score,
          total: test.questions.length,
          percentage: Math.round(score / test.questions.length * 100),
          answers,
          submittedAt: Date.now()
        });
        location.href = "result.html?id=" + resultRef.key;
      } catch (error) {
        $("test-msg").textContent = error.message;
        form.querySelector("button[type=submit]").disabled = false;
      }
    });
  });
}
runTest();

async function renderResult() {
  const root = $("result-root");
  if (!root) return;
  if (!firebaseEnabled) { root.innerHTML = '<div class="empty">Results will be available after the dedicated Firebase project is connected.</div>'; return; }
  const id = new URLSearchParams(location.search).get("id");
  try {
    const snap = await dbGet("results/" + id);
    if (!snap.exists()) { root.innerHTML = '<div class="empty">Result not found.</div>'; return; }
    const r = snap.val();
    root.innerHTML = `<div class="details-card"><div class="eyebrow">TEST RESULT</div><h1>${esc(r.testTitle)}</h1><div class="result-score">${r.score}/${r.total}</div><h2 style="text-align:center">${r.percentage}%</h2><p style="text-align:center">Submitted successfully.</p><div style="text-align:center"><a class="btn" href="mock-tests.html">More Tests</a></div></div>`;
  } catch (error) { root.innerHTML = `<div class="empty">${esc(error.message)}</div>`; }
}
renderResult();

function renderDashboard() {
  const nameEl = $("student-name");
  if (!nameEl) return;
  onAuthStateChanged(async user => {
    if (!user) { location.href = "login.html"; return; }
    nameEl.textContent = user.displayName || user.email.split("@")[0];
    const list = $("results-list");
    try {
      const snap = await dbGet("results");
      const rows = [];
      if (snap.exists()) Object.values(snap.val()).forEach(r => { if (r.userId === user.uid) rows.push(r); });
      rows.sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));
      list.innerHTML = rows.map(r => `<div class="list-item"><b>${esc(r.testTitle)}</b><br>${r.score}/${r.total} (${r.percentage}%)</div>`).join("") || '<div class="empty">No results yet.</div>';
    } catch { list.innerHTML = '<div class="empty">Could not load results.</div>'; }
  });
}
renderDashboard();

if ($("affairs-list")) {
  $("affairs-list").innerHTML = `
    <article class="card"><h3>Assam & India Current Affairs</h3><p>Use this section for exam-oriented current affairs, important appointments, schemes, awards, sports, national events and Assam-specific developments.</p></article>
    <article class="card"><h3>Revision Format</h3><p>Current-affairs content will be organised into daily, weekly and monthly revision sets as the platform develops.</p></article>`;
}

if ($("study-list")) {
  $("study-list").innerHTML = EXAMS.map(e => `<article class="card"><span class="pill">${esc(e.name)}</span><h3>Study Resources</h3><p>${esc(e.desc)}</p><a class="btn small" href="exam-details.html?exam=${encodeURIComponent(e.id)}">Open</a></article>`).join("");
}

async function renderJobs() {
  const el = $("jobs-list");
  if (!el) return;
  if (!firebaseEnabled) { el.innerHTML = `${firebaseNotice()}<div class="empty">No live job listings yet.</div>`; return; }
  let jobs = [];
  try { const snap = await dbGet("jobs"); if (snap.exists()) jobs = Object.entries(snap.val()).map(([id, value]) => ({ ...value, id })); } catch (error) { console.error(error); }
  el.innerHTML = jobs.map(j => `<article class="card"><h3>${esc(j.title)}</h3><p>${esc(j.organization || "")}</p><a class="btn small" href="job-details.html?id=${encodeURIComponent(j.id)}">View Details</a></article>`).join("") || '<div class="empty">No job listings have been published yet.</div>';
}
renderJobs();

async function renderJobDetails() {
  const el = $("job-details");
  if (!el) return;
  if (!firebaseEnabled) { el.innerHTML = '<div class="empty">Live job details will be enabled with the dedicated Firebase project.</div>'; return; }
  const id = new URLSearchParams(location.search).get("id");
  try {
    const snap = await dbGet("jobs/" + id);
    if (snap.exists()) {
      const j = snap.val();
      el.innerHTML = `<div class="eyebrow">GOVERNMENT JOB</div><h1>${esc(j.title)}</h1><p>${esc(j.organization || "")}</p><p>${esc(j.description || "")}</p>${j.applyUrl ? `<a class="btn" target="_blank" rel="noopener" href="${esc(j.applyUrl)}">Official Apply Link</a>` : ""}`;
      return;
    }
  } catch (error) { console.error(error); }
  el.innerHTML = '<div class="empty">Job not found.</div>';
}
renderJobDetails();

async function renderAdminData() {
  if (!firebaseEnabled) return;
  for (const key of ["users", "tests", "questions", "jobs"]) {
    const el = $("admin-" + key);
    if (!el) continue;
    try {
      const snap = await dbGet(key);
      el.innerHTML = snap.exists() ? `<div class="table-wrap"><table class="admin-table"><tr><th>ID</th><th>Data</th></tr>${Object.entries(snap.val()).map(([id, value]) => `<tr><td>${esc(id)}</td><td><pre>${esc(JSON.stringify(value, null, 2))}</pre></td></tr>`).join("")}</table></div>` : `<div class="empty">No ${key} data.</div>`;
    } catch { el.innerHTML = '<div class="empty">Check Firebase configuration and rules.</div>'; }
  }
}
renderAdminData();

onAuthStateChanged(user => {
  const link = $("auth-link");
  if (link && user) { link.textContent = "Dashboard"; link.href = "dashboard.html"; }
});
