// ── Data ─────────────────────────────────────────────────────────────────────
let VOCAB = [];
let CONJ = {};
let VERBS = [];

// ── State ─────────────────────────────────────────────────────────────────────
let mode = 'vocab';
let level = 'A1';
let topic = 'all';
let currentVerb = 'être';
let currentTense = 'present';

let pairs = [];
let matched = [];
let wrongTimer = null;
let selSide = null;
let selIdx = null;
let leftItems = [];
let rightItems = [];

let sessionCorrect = 0;
let sessionWrong = 0;
let sessionRounds = 0;
let roundMistakes = 0;

let soundOn = true;
let usedIds = {};

// ── SM-2 Storage ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'frenchPractice_progress';
const SETTINGS_KEY = 'frenchPractice_settings';
const STREAK_KEY = 'frenchPractice_streak';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}
function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch { return {}; }
}
function saveSettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch {}
}

function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  try {
    const s = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"lastDate":"","streak":0}');
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (s.lastDate === today) return s.streak;
    if (s.lastDate === yesterday) { s.streak++; } else { s.streak = 1; }
    s.lastDate = today;
    localStorage.setItem(STREAK_KEY, JSON.stringify(s));
    return s.streak;
  } catch { return 0; }
}

function getStreak() {
  try {
    const s = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"streak":0}');
    return s.streak || 0;
  } catch { return 0; }
}

function sm2Update(id, correct) {
  const p = loadProgress();
  const today = new Date().toISOString().split('T')[0];
  const entry = p[id] || { easeFactor: 2.5, interval: 1, repetitions: 0, nextReview: today, correctCount: 0, wrongCount: 0 };
  if (correct) {
    entry.correctCount++;
    entry.repetitions++;
    if (entry.repetitions === 1) entry.interval = 1;
    else if (entry.repetitions === 2) entry.interval = 6;
    else entry.interval = Math.round(entry.interval * entry.easeFactor);
    entry.easeFactor = Math.max(1.3, entry.easeFactor + 0.1);
  } else {
    entry.wrongCount++;
    entry.repetitions = 0;
    entry.interval = 1;
    entry.easeFactor = Math.max(1.3, entry.easeFactor - 0.2);
  }
  const next = new Date(Date.now() + entry.interval * 86400000);
  entry.nextReview = next.toISOString().split('T')[0];
  entry.lastSeen = today;
  p[id] = entry;
  saveProgress(p);
}

// ── Antonym pairs ─────────────────────────────────────────────────────────────
const ANTONYMS = [
  {a:'grand',b:'petit'},{a:'chaud',b:'froid'},{a:'rapide',b:'lent'},
  {a:'lourd',b:'léger'},{a:'plein',b:'vide'},{a:'beau',b:'laid'},
  {a:'doux',b:'dur'},{a:'ouvrir',b:'fermer'},{a:'rire',b:'pleurer'},
  {a:'vieux',b:'jeune'},{a:'propre',b:'sale'},{a:'fort',b:'faible'},
  {a:'riche',b:'pauvre'},{a:'heureux',b:'malheureux'},{a:'long',b:'court'},
  {a:'large',b:'étroit'},{a:'haut',b:'bas'},{a:'tôt',b:'tard'},
  {a:'toujours',b:'jamais'},{a:'beaucoup',b:'peu'},{a:'dedans',b:'dehors'},
  {a:'devant',b:'derrière'},{a:'monter',b:'descendre'},{a:'acheter',b:'vendre'},
  {a:'aimer',b:'détester'},{a:'gagner',b:'perdre'},{a:'commencer',b:'finir'},
  {a:'trouver',b:'chercher'},{a:'donner',b:'recevoir'},{a:'parler',b:'écouter'},
  {a:'apprendre',b:'oublier'},{a:'allumer',b:'éteindre'},{a:'entrer',b:'sortir'},
  {a:'noir',b:'blanc'},{a:'léger',b:'lourd'},{a:'proche',b:'loin'},
];

// ── Topic mapping ─────────────────────────────────────────────────────────────
const TOPIC_MAP = {
  all: null,
  everyday: ['daily','greetings','time','directions','social'],
  food: ['food','cooking','dining','drinks'],
  family: ['family','relationships','people'],
  travel: ['travel','transport','transportation','locations','places'],
  work: ['work','business','occupations','professional'],
  nature: ['nature','weather','geography','environment'],
  body: ['body','health','medical','medicine'],
  school: ['school','education'],
  shopping: ['shopping','clothing','colors'],
  animals: ['animals'],
  home: ['house','household','housing'],
};

// ── Level config ──────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  A1: { name: 'Beginner', count: 5 },
  A2: { name: 'Elementary', count: 8 },
  B1: { name: 'Intermediate', count: 12 },
  B2: { name: 'Advanced', count: 16 },
  C1: { name: 'Expert', count: 20 },
};

const MODE_DESC = {
  vocab: 'Match each French word to its English translation.',
  gender: 'Match each noun to its correct gender — le (masculine) or la (feminine).',
  antonyms: 'Match each French word to its French opposite.',
  conjugation: 'Match each pronoun to the correct verb form.',
};

// ── Utility ───────────────────────────────────────────────────────────────────
function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }

function getFilteredVocab() {
  const cats = TOPIC_MAP[topic];
  let pool = VOCAB.filter(w => w.level === level);
  if (cats) pool = pool.filter(w => cats.includes(w.category));
  if (pool.length < 4) pool = VOCAB.filter(w => w.level === level);
  return pool;
}

function pickWords(pool, count) {
  const used = usedIds[level + topic] || [];
  let available = pool.filter(w => !used.includes(w.id));
  if (available.length < count) {
    usedIds[level + topic] = [];
    available = pool;
  }
  const picked = shuffle(available).slice(0, count);
  usedIds[level + topic] = [...(usedIds[level + topic] || []), ...picked.map(w => w.id)];
  return picked;
}

// ── Build pairs ───────────────────────────────────────────────────────────────
function buildPairs() {
  const count = LEVEL_CONFIG[level]?.count || 5;

  if (mode === 'vocab') {
    const pool = getFilteredVocab();
    const words = pickWords(pool, count);
    return words.map(w => ({ left: w.fr, right: w.en, id: w.id }));
  }

  if (mode === 'gender') {
    const pool = VOCAB.filter(w => w.level === level && w.type === 'noun' && (w.gender === 'M' || w.gender === 'F'));
    if (pool.length < 3) return buildFallbackPairs(count);
    const words = pickWords(pool, Math.min(count, pool.length));
    return words.map(w => ({
      left: w.fr.replace(/^(le |la |les |l'|l')/i, ''),
      right: w.gender === 'M' ? 'le (m)' : 'la (f)',
      id: w.id,
      isGender: true,
    }));
  }

  if (mode === 'antonyms') {
    const used = usedIds['antonyms'] || [];
    let pool = ANTONYMS.filter(p => !used.includes(p.a));
    if (pool.length < count) { usedIds['antonyms'] = []; pool = ANTONYMS; }
    const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
    usedIds['antonyms'] = [...(usedIds['antonyms'] || []), ...picked.map(p => p.a)];
    return picked.map((p, i) => ({ left: p.a, right: p.b, id: 'anto_' + i }));
  }

  if (mode === 'conjugation') {
    const verbData = CONJ[currentVerb];
    if (!verbData || !verbData[currentTense]) return buildFallbackPairs(count);
    const tenseData = verbData[currentTense];
    const subjects = Object.keys(tenseData);
    return subjects.slice(0, Math.min(count, subjects.length)).map((subj, i) => ({
      left: subj,
      right: tenseData[subj],
      id: 'conj_' + i,
    }));
  }

  return buildFallbackPairs(count);
}

function buildFallbackPairs(count) {
  const words = shuffle(VOCAB).slice(0, count);
  return words.map(w => ({ left: w.fr, right: w.en, id: w.id }));
}

// ── Render ────────────────────────────────────────────────────────────────────
function startRound() {
  pairs = buildPairs();

  if (mode === 'gender') {
    startGenderRound();
    return;
  }

  matched = Array(pairs.length).fill(false);
  selSide = null; selIdx = null; wrongTimer = null; roundMistakes = 0;

  document.getElementById('prog').style.width = '0%';
  document.getElementById('round-end').style.display = 'none';
  setFb('', '');

  const count = pairs.length;
  const cols = count <= 5 ? 1 : count <= 8 ? 2 : 3;
  leftItems = pairs.map((_, i) => i);
  rightItems = shuffle(pairs.map((_, i) => i));

  const gl = document.getElementById('grid-l');
  const gr = document.getElementById('grid-r');
  gl.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  gr.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  gl.innerHTML = leftItems.map((pi, slot) => cellHTML('l', slot, pi)).join('');
  gr.innerHTML = rightItems.map((pi, slot) => cellHTML('r', slot, pi)).join('');

  updateColLabels();
}

function updateColLabels() {
  const ll = document.getElementById('label-l');
  const lr = document.getElementById('label-r');
  if (mode === 'conjugation') {
    ll.textContent = 'PRONOUN';
    lr.textContent = (currentVerb + ' — ' + currentTense).toUpperCase();
  } else if (mode === 'antonyms') {
    ll.textContent = 'MOT';
    lr.textContent = 'CONTRAIRE';
  } else if (mode === 'gender') {
    ll.textContent = 'NOM';
    lr.textContent = 'GENRE';
  } else {
    ll.textContent = 'FRANÇAIS';
    lr.textContent = 'ENGLISH';
  }
}

function cellHTML(side, slot, pi) {
  const text = side === 'l' ? pairs[pi].left : pairs[pi].right;
  const m = matched[pi];
  return `<div class="cell${m ? ' matched' : ''}" id="c-${side}-${slot}" onclick="onCell('${side}',${slot},${pi})">${text}</div>`;
}

function getSlot(side, pi) {
  return (side === 'l' ? leftItems : rightItems).indexOf(pi);
}

// ── Gender mode ───────────────────────────────────────────────────────────────
let genderNouns = [];
let genderMatched = [];
let genderSel = null;
let genderMistakes = 0;

function startGenderRound() {
  genderNouns = pairs;
  genderMatched = Array(genderNouns.length).fill(false);
  genderSel = null; genderMistakes = 0; roundMistakes = 0;
  wrongTimer = null;

  document.getElementById('prog').style.width = '0%';
  document.getElementById('round-end').style.display = 'none';
  setFb('', '');
  updateColLabels();

  const cols = genderNouns.length <= 5 ? 1 : genderNouns.length <= 8 ? 2 : 3;
  const gl = document.getElementById('grid-l');
  const gr = document.getElementById('grid-r');

  gl.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  gr.style.gridTemplateColumns = `repeat(${cols},1fr)`;

  const shuffledNouns = shuffle(genderNouns.map((_, i) => i));
  gl.innerHTML = shuffledNouns.map((pi, slot) => {
    const m = genderMatched[pi];
    return `<div class="cell gender-left${m ? ' matched' : ''}" id="gn-${slot}" data-pi="${pi}" onclick="onGenderNoun(${slot},${pi})">${genderNouns[pi].left}</div>`;
  }).join('');

  // Right side: le and la repeated
  const genders = shuffle(['le (m)', 'la (f)', 'le (m)', 'la (f)', 'le (m)', 'la (f)', 'le (m)', 'la (f)'].slice(0, Math.max(4, genderNouns.length)));
  gr.innerHTML = genders.map((g, i) =>
    `<div class="cell" id="gg-${i}" data-gender="${g}" onclick="onGenderLabel(${i},'${g}')">${g}</div>`
  ).join('');
}

function onGenderNoun(slot, pi) {
  if (genderMatched[pi] || wrongTimer) return;
  document.querySelectorAll('.cell.selected').forEach(e => e.classList.remove('selected'));
  genderSel = { slot, pi };
  document.getElementById(`gn-${slot}`).classList.add('selected');
}

function onGenderLabel(i, gender) {
  if (wrongTimer || !genderSel) return;
  const { slot, pi } = genderSel;
  const correct = genderNouns[pi].right === gender;
  if (correct) {
    genderMatched[pi] = true;
    document.getElementById(`gn-${slot}`).classList.remove('selected');
    document.getElementById(`gn-${slot}`).classList.add('matched');
    document.getElementById(`gn-${slot}`).onclick = null;
    sessionCorrect++;
    sm2Update(genderNouns[pi].id, true);
    speak(genderNouns[pi].left);
    setFb(`✓ ${genderNouns[pi].left} → ${genderNouns[pi].right}`, 'correct');
    updateSessionStats();
    const pct = Math.round(genderMatched.filter(Boolean).length / genderNouns.length * 100);
    document.getElementById('prog').style.width = pct + '%';
    genderSel = null;
    if (genderMatched.every(Boolean)) setTimeout(showRoundEnd, 500);
  } else {
    genderMistakes++; roundMistakes++; sessionWrong++;
    sm2Update(genderNouns[pi].id, false);
    const nounEl = document.getElementById(`gn-${slot}`);
    const lblEl = document.getElementById(`gg-${i}`);
    nounEl.classList.remove('selected');
    nounEl.classList.add('wrong');
    lblEl.classList.add('wrong');
    setFb('Not a match — try again!', 'wrong');
    wrongTimer = setTimeout(() => {
      wrongTimer = null;
      nounEl.classList.remove('wrong');
      lblEl.classList.remove('wrong');
      setFb('', '');
    }, 700);
    genderSel = null;
    updateSessionStats();
  }
}

// ── Match logic ───────────────────────────────────────────────────────────────
function onCell(side, slot, pi) {
  if (matched[pi] || wrongTimer) return;
  if (selSide === null) {
    selSide = side; selIdx = pi;
    document.getElementById(`c-${side}-${slot}`).classList.add('selected');
    return;
  }
  if (selSide === side) {
    document.querySelectorAll('.cell.selected').forEach(e => e.classList.remove('selected'));
    selSide = side; selIdx = pi;
    document.getElementById(`c-${side}-${slot}`).classList.add('selected');
    return;
  }
  if (pi === selIdx) {
    matched[pi] = true;
    document.querySelectorAll('.cell.selected').forEach(e => e.classList.remove('selected'));
    rerender('l', pi); rerender('r', pi);
    sessionCorrect++;
    sm2Update(pairs[pi].id, true);
    speak(pairs[pi].left);
    setFb(`✓ ${pairs[pi].left} → ${pairs[pi].right}`, 'correct');
    const pct = Math.round(matched.filter(Boolean).length / pairs.length * 100);
    document.getElementById('prog').style.width = pct + '%';
    selSide = null; selIdx = null;
    updateSessionStats();
    if (matched.every(Boolean)) setTimeout(showRoundEnd, 500);
  } else {
    roundMistakes++; sessionWrong++;
    const ps = selSide, pi2 = selIdx;
    document.querySelectorAll('.cell.selected').forEach(e => e.classList.remove('selected'));
    flash(side, pi); flash(ps, pi2);
    sm2Update(pairs[pi].id, false);
    sm2Update(pairs[pi2].id, false);
    setFb('Not a match — try again!', 'wrong');
    wrongTimer = setTimeout(() => {
      wrongTimer = null;
      unflash(side, pi); unflash(ps, pi2);
      setFb('', '');
    }, 700);
    selSide = null; selIdx = null;
    updateSessionStats();
  }
}

function rerender(side, pi) {
  const slot = getSlot(side, pi);
  const el = document.getElementById(`c-${side}-${slot}`);
  if (el) { el.className = 'cell matched'; el.onclick = null; }
}
function flash(side, pi) {
  const el = document.getElementById(`c-${side}-${getSlot(side, pi)}`);
  if (el) el.classList.add('wrong');
}
function unflash(side, pi) {
  const el = document.getElementById(`c-${side}-${getSlot(side, pi)}`);
  if (el) el.classList.remove('wrong');
}

// ── Feedback & stats ─────────────────────────────────────────────────────────
function setFb(msg, type) {
  const el = document.getElementById('fb');
  el.textContent = msg;
  el.className = 'feedback' + (type ? ' ' + type : '');
}

function updateSessionStats() {
  document.getElementById('stat-correct').textContent = sessionCorrect;
  document.getElementById('stat-wrong').textContent = sessionWrong;
}

// ── Round end ─────────────────────────────────────────────────────────────────
function showRoundEnd() {
  sessionRounds++;
  updateStreak();
  document.getElementById('round-score').textContent = (pairs.length || genderNouns.length) + '/' + (pairs.length || genderNouns.length);
  document.getElementById('round-sub').textContent = roundMistakes === 0 ? 'Perfect round!' : roundMistakes + ' mistake' + (roundMistakes !== 1 ? 's' : '');
  document.getElementById('round-end').style.display = 'block';
  setFb('', '');
}

function nextRound() {
  document.getElementById('round-end').style.display = 'none';
  startRound();
}

// ── Sound ─────────────────────────────────────────────────────────────────────
function speak(text) {
  if (!soundOn || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  // Chrome requires a brief pause after cancel() before speak() to avoid freezing
  setTimeout(() => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    u.rate = 0.9;
    speechSynthesis.speak(u);
  }, 50);
}

function toggleSound() {
  soundOn = !soundOn;
  const btn = document.getElementById('sound-btn');
  btn.textContent = soundOn ? '🔊' : '🔇';
  btn.classList.toggle('active', soundOn);
  const s = loadSettings();
  s.sound = soundOn;
  saveSettings(s);
}

// ── Progress dashboard ────────────────────────────────────────────────────────
function showDashboard() {
  const p = loadProgress();
  const ids = Object.keys(p);
  const mastered = ids.filter(id => p[id].repetitions >= 3 && p[id].easeFactor > 2.0).length;
  const today = new Date().toISOString().split('T')[0];
  const due = ids.filter(id => p[id].nextReview <= today).length;
  const streak = getStreak();

  document.getElementById('dash-total').textContent = ids.length;
  document.getElementById('dash-mastered').textContent = mastered;
  document.getElementById('dash-streak').textContent = streak + ' day' + (streak !== 1 ? 's' : '');
  document.getElementById('dash-due').textContent = due;

  // Category breakdown
  const catData = {};
  VOCAB.forEach(w => {
    const cat = w.category;
    if (!catData[cat]) catData[cat] = { total: 0, seen: 0 };
    catData[cat].total++;
    if (p[w.id]) catData[cat].seen++;
  });

  const topCats = Object.entries(catData).sort((a, b) => b[1].total - a[1].total).slice(0, 10);
  const catEl = document.getElementById('cat-breakdown');
  catEl.innerHTML = topCats.map(([cat, d]) => `
    <div class="cat-row">
      <div class="cat-name">${cat}</div>
      <div class="cat-bar-wrap"><div class="cat-bar" style="width:${Math.round(d.seen/d.total*100)}%"></div></div>
      <div class="cat-count">${d.seen}/${d.total}</div>
    </div>
  `).join('');

  document.getElementById('overlay').classList.remove('hidden');
}

function hideDashboard() {
  document.getElementById('overlay').classList.add('hidden');
}

function resetProgress() {
  if (!confirm('Reset all progress? This cannot be undone.')) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STREAK_KEY);
  usedIds = {};
  hideDashboard();
  startRound();
}

// ── UI event handlers ─────────────────────────────────────────────────────────
function setMode(m, el) {
  mode = m;
  document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('mode-desc').textContent = MODE_DESC[m];
  document.getElementById('verb-selector').style.display = m === 'conjugation' ? 'flex' : 'none';
  document.getElementById('topic-row').style.display = (m === 'vocab' || m === 'gender') ? 'flex' : 'none';
  usedIds = {};
  startRound();
}

function setLevel(l, el) {
  level = l;
  document.querySelectorAll('.level-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  usedIds = {};
  startRound();
}

function setTopic(t, el) {
  topic = t;
  document.querySelectorAll('.topic-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  usedIds = {};
  startRound();
}

function setVerb() {
  currentVerb = document.getElementById('verb-select').value;
  startRound();
}

function setTense() {
  currentTense = document.getElementById('tense-select').value;
  startRound();
}

function populateVerbSelect() {
  const sel = document.getElementById('verb-select');
  const tenseSel = document.getElementById('tense-select');
  sel.innerHTML = VERBS.map(v => `<option value="${v.verb}">${v.verb} (${v.en})</option>`).join('');
  const allTenses = ['present','imparfait','passé composé','futur','conditionnel'];
  tenseSel.innerHTML = allTenses.map(t => `<option value="${t}">${t}</option>`).join('');
}

// ── Keyboard ──────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.cell.selected').forEach(el => el.classList.remove('selected'));
    selSide = null; selIdx = null; genderSel = null;
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
  // Data embedded directly — no file loading needed
  VOCAB = [{"id":"v-177","fr":"pantalon","en":"pants","level":"A1","category":"clothing","difficulty":1,"type":"noun","gender":"M"},{"id":"v-176","fr":"chemise","en":"shirt","level":"A1","category":"clothing","difficulty":1,"type":"noun","gender":"F"},{"id":"v-178","fr":"robe","en":"dress","level":"A1","category":"clothing","difficulty":1,"type":"noun","gender":"F"},{"id":"v-182","fr":"chaussures","en":"shoes","level":"A1","category":"clothing","difficulty":1,"type":"noun","gender":""},{"id":"v-183","fr":"chaussettes","en":"socks","level":"A1","category":"clothing","difficulty":1,"type":"noun","gender":""},{"id":"v-261","fr":"temps","en":"weather","level":"A1","category":"weather","difficulty":1,"type":"noun","gender":""},{"id":"v-265","fr":"vent","en":"wind","level":"A1","category":"weather","difficulty":1,"type":"noun","gender":"M"},{"id":"v-262","fr":"soleil","en":"sun","level":"A1","category":"weather","difficulty":1,"type":"noun","gender":"M"},{"id":"v-267","fr":"orage","en":"storm","level":"A1","category":"weather","difficulty":1,"type":"noun","gender":"M"},{"id":"v-264","fr":"neige","en":"snow","level":"A1","category":"weather","difficulty":1,"type":"noun","gender":"F"},{"id":"v-164","fr":"salle de bain","en":"bathroom","level":"A1","category":"house","difficulty":1,"type":"noun","gender":"M"},{"id":"v-168","fr":"porte","en":"door","level":"A1","category":"house","difficulty":1,"type":"noun","gender":"F"},{"id":"v-170","fr":"table","en":"table","level":"A1","category":"house","difficulty":1,"type":"noun","gender":"F"},{"id":"v-165","fr":"salon","en":"living room","level":"A1","category":"house","difficulty":1,"type":"noun","gender":"M"},{"id":"v-161","fr":"pièce","en":"room","level":"A1","category":"house","difficulty":1,"type":"noun","gender":"F"},{"id":"v-99","fr":"avril","en":"April","level":"A1","category":"time","difficulty":1,"type":"noun","gender":""},{"id":"v-116","fr":"semaine","en":"week","level":"A1","category":"time","difficulty":1,"type":"noun","gender":"F"},{"id":"v-110","fr":"automne","en":"autumn/fall","level":"A1","category":"time","difficulty":1,"type":"noun","gender":"M"},{"id":"v-106","fr":"novembre","en":"November","level":"A1","category":"time","difficulty":1,"type":"noun","gender":""},{"id":"v-98","fr":"mars","en":"March","level":"A1","category":"time","difficulty":1,"type":"noun","gender":""},{"id":"v-282","fr":"serveur","en":"waiter","level":"A1","category":"occupations","difficulty":1,"type":"noun","gender":"M"},{"id":"v-286","fr":"artiste","en":"artist","level":"A1","category":"occupations","difficulty":1,"type":"noun","gender":""},{"id":"v-279","fr":"pompier","en":"firefighter","level":"A1","category":"occupations","difficulty":1,"type":"noun","gender":"M"},{"id":"v-278","fr":"policier","en":"police officer","level":"A1","category":"occupations","difficulty":1,"type":"noun","gender":"M"},{"id":"v-288","fr":"acteur","en":"actor","level":"A1","category":"occupations","difficulty":1,"type":"noun","gender":"M"},{"id":"v-244","fr":"cahier","en":"notebook","level":"A1","category":"school","difficulty":1,"type":"noun","gender":"M"},{"id":"v-252","fr":"examen","en":"exam","level":"A1","category":"school","difficulty":1,"type":"noun","gender":""},{"id":"v-259","fr":"dictionnaire","en":"dictionary","level":"A1","category":"school","difficulty":1,"type":"noun","gender":""},{"id":"v-249","fr":"classe","en":"class","level":"A1","category":"school","difficulty":1,"type":"noun","gender":"F"},{"id":"v-242","fr":"professeur","en":"teacher","level":"A1","category":"school","difficulty":1,"type":"noun","gender":"M"},{"id":"v-48","fr":"voir","en":"to see","level":"A1","category":"verbs","difficulty":1,"type":"verb","gender":""},{"id":"v-44","fr":"parler","en":"to speak","level":"A1","category":"verbs","difficulty":1,"type":"verb","gender":""},{"id":"v-45","fr":"écouter","en":"to listen","level":"A1","category":"verbs","difficulty":1,"type":"verb","gender":""},{"id":"v-38","fr":"avoir","en":"to have","level":"A1","category":"verbs","difficulty":1,"type":"verb","gender":""},{"id":"v-43","fr":"dormir","en":"to sleep","level":"A1","category":"verbs","difficulty":1,"type":"verb","gender":""},{"id":"v-16","fr":"mère","en":"mother","level":"A1","category":"family","difficulty":1,"type":"noun","gender":"F"},{"id":"v-18","fr":"sœur","en":"sister","level":"A1","category":"family","difficulty":1,"type":"noun","gender":"F"},{"id":"v-19","fr":"frère","en":"brother","level":"A1","category":"family","difficulty":1,"type":"noun","gender":"M"},{"id":"v-17","fr":"père","en":"father","level":"A1","category":"family","difficulty":1,"type":"noun","gender":"M"},{"id":"v-20","fr":"enfant","en":"child","level":"A1","category":"family","difficulty":1,"type":"noun","gender":"M"},{"id":"v-207","fr":"pied","en":"foot","level":"A1","category":"body","difficulty":1,"type":"noun","gender":"M"},{"id":"v-197","fr":"visage","en":"face","level":"A1","category":"body","difficulty":1,"type":"noun","gender":"M"},{"id":"v-196","fr":"tête","en":"head","level":"A1","category":"body","difficulty":1,"type":"noun","gender":"F"},{"id":"v-206","fr":"jambe","en":"leg","level":"A1","category":"body","difficulty":1,"type":"noun","gender":"F"},{"id":"v-199","fr":"nez","en":"nose","level":"A1","category":"body","difficulty":1,"type":"noun","gender":"M"},{"id":"v-85","fr":"soixante-dix","en":"seventy","level":"A1","category":"numbers","difficulty":1,"type":"number","gender":""},{"id":"v-30","fr":"dix","en":"ten","level":"A1","category":"numbers","difficulty":1,"type":"number","gender":""},{"id":"v-23","fr":"trois","en":"three","level":"A1","category":"numbers","difficulty":1,"type":"number","gender":""},{"id":"v-88","fr":"cent","en":"one hundred","level":"A1","category":"numbers","difficulty":1,"type":"number","gender":""},{"id":"v-28","fr":"huit","en":"eight","level":"A1","category":"numbers","difficulty":1,"type":"number","gender":""},{"id":"v-31","fr":"rouge","en":"red","level":"A1","category":"colors","difficulty":1,"type":"adjective","gender":""},{"id":"v-34","fr":"jaune","en":"yellow","level":"A1","category":"colors","difficulty":1,"type":"adjective","gender":""},{"id":"v-33","fr":"vert","en":"green","level":"A1","category":"colors","difficulty":1,"type":"adjective","gender":""},{"id":"v-32","fr":"bleu","en":"blue","level":"A1","category":"colors","difficulty":1,"type":"adjective","gender":""},{"id":"v-35","fr":"noir","en":"black","level":"A1","category":"colors","difficulty":1,"type":"adjective","gender":""},{"id":"v-2","fr":"au revoir","en":"goodbye","level":"A1","category":"greetings","difficulty":1,"type":"phrase","gender":""},{"id":"v-3","fr":"merci","en":"thank you","level":"A1","category":"greetings","difficulty":1,"type":"phrase","gender":""},{"id":"v-6","fr":"oui","en":"yes","level":"A1","category":"greetings","difficulty":1,"type":"phrase","gender":""},{"id":"v-1","fr":"bonjour","en":"hello","level":"A1","category":"greetings","difficulty":1,"type":"phrase","gender":""},{"id":"v-7","fr":"non","en":"no","level":"A1","category":"greetings","difficulty":1,"type":"phrase","gender":""},{"id":"v-12","fr":"thé","en":"tea","level":"A1","category":"food","difficulty":1,"type":"noun","gender":"M"},{"id":"v-159","fr":"biscuit","en":"cookie","level":"A1","category":"food","difficulty":1,"type":"noun","gender":"M"},{"id":"v-131","fr":"banane","en":"banana","level":"A1","category":"food","difficulty":1,"type":"noun","gender":"F"},{"id":"v-155","fr":"dîner","en":"dinner","level":"A1","category":"food","difficulty":1,"type":"noun","gender":"M"},{"id":"v-136","fr":"pomme de terre","en":"potato","level":"A1","category":"food","difficulty":1,"type":"noun","gender":""},{"id":"v-216","fr":"chaud","en":"hot","level":"A1","category":"adjectives","difficulty":1,"type":"adjective","gender":""},{"id":"v-225","fr":"court","en":"short","level":"A1","category":"adjectives","difficulty":1,"type":"adjective","gender":""},{"id":"v-223","fr":"lent","en":"slow","level":"A1","category":"adjectives","difficulty":1,"type":"adjective","gender":""},{"id":"v-219","fr":"jeune","en":"young","level":"A1","category":"adjectives","difficulty":1,"type":"adjective","gender":""},{"id":"v-240","fr":"correct","en":"right (correct)","level":"A1","category":"adjectives","difficulty":1,"type":"adjective","gender":""},{"id":"v-2328","fr":"malade","en":"sick","level":"A2","category":"adjectives","difficulty":2,"type":"adjective","gender":""},{"id":"v-3428","fr":"gris","en":"gray","level":"A2","category":"adjectives","difficulty":2,"type":"adjective","gender":""},{"id":"v-4090","fr":"région","en":"region","level":"A2","category":"places","difficulty":2,"type":"noun","gender":"F"},{"id":"v-4081","fr":"endroit","en":"place","level":"A2","category":"places","difficulty":2,"type":"noun","gender":""},{"id":"v-4071","fr":"chanter","en":"to sing","level":"A2","category":"verbs","difficulty":2,"type":"verb","gender":""},{"id":"v-4068","fr":"sauter","en":"to jump","level":"A2","category":"verbs","difficulty":2,"type":"verb","gender":""},{"id":"v-492","fr":"généreux","en":"generous","level":"A2","category":"personality","difficulty":2,"type":"adjective","gender":""},{"id":"v-488","fr":"sérieux","en":"serious","level":"A2","category":"personality","difficulty":2,"type":"adjective","gender":""},{"id":"v-2249","fr":"horloge","en":"clock","level":"A2","category":"household","difficulty":2,"type":"noun","gender":""},{"id":"v-2273","fr":"lave-vaisselle","en":"dishwasher","level":"A2","category":"household","difficulty":2,"type":"noun","gender":"F"},{"id":"v-4145","fr":"montagne","en":"mountain","level":"A2","category":"nature","difficulty":2,"type":"noun","gender":"F"},{"id":"v-2280","fr":"branche","en":"branch","level":"A2","category":"nature","difficulty":2,"type":"noun","gender":""},{"id":"v-397","fr":"malade","en":"sick","level":"A2","category":"health","difficulty":2,"type":"noun","gender":""},{"id":"v-399","fr":"mal de tête","en":"headache","level":"A2","category":"health","difficulty":2,"type":"noun","gender":""},{"id":"v-3475","fr":"beaucoup","en":"many","level":"A2","category":"numbers","difficulty":2,"type":"number","gender":""},{"id":"v-3476","fr":"peu","en":"few","level":"A2","category":"numbers","difficulty":2,"type":"number","gender":""},{"id":"v-474","fr":"inquiet","en":"worried","level":"A2","category":"emotions","difficulty":2,"type":"noun","gender":"M"},{"id":"v-463","fr":"haine","en":"hate","level":"A2","category":"emotions","difficulty":2,"type":"noun","gender":""},{"id":"v-348","fr":"sac","en":"bag","level":"A2","category":"shopping","difficulty":2,"type":"noun","gender":"M"},{"id":"v-355","fr":"payer","en":"to pay","level":"A2","category":"shopping","difficulty":2,"type":"verb","gender":""},{"id":"v-435","fr":"papillon","en":"butterfly","level":"A2","category":"animals","difficulty":2,"type":"noun","gender":"M"},{"id":"v-430","fr":"loup","en":"wolf","level":"A2","category":"animals","difficulty":2,"type":"noun","gender":""},{"id":"v-312","fr":"retard","en":"delay","level":"A2","category":"transportation","difficulty":2,"type":"noun","gender":""},{"id":"v-304","fr":"métro","en":"metro/subway","level":"A2","category":"transportation","difficulty":2,"type":"noun","gender":"M"},{"id":"v-2378","fr":"grand-mère","en":"grandmother","level":"A2","category":"people","difficulty":2,"type":"noun","gender":""},{"id":"v-2361","fr":"personne","en":"person","level":"A2","category":"people","difficulty":2,"type":"noun","gender":""},{"id":"v-319","fr":"passeport","en":"passport","level":"A2","category":"travel","difficulty":2,"type":"noun","gender":"M"},{"id":"v-333","fr":"village","en":"village","level":"A2","category":"travel","difficulty":2,"type":"noun","gender":"M"},{"id":"v-380","fr":"ballon","en":"ball","level":"A2","category":"hobbies","difficulty":2,"type":"noun","gender":"M"},{"id":"v-364","fr":"ski","en":"skiing","level":"A2","category":"hobbies","difficulty":2,"type":"noun","gender":""},{"id":"v-4020","fr":"mûr","en":"ripe","level":"A2","category":"food","difficulty":2,"type":"noun","gender":""},{"id":"v-4012","fr":"épicé","en":"spicy","level":"A2","category":"food","difficulty":2,"type":"noun","gender":""},{"id":"v-4046","fr":"tête","en":"head","level":"A2","category":"body","difficulty":2,"type":"noun","gender":"F"},{"id":"v-3414","fr":"oreille","en":"ear","level":"A2","category":"body","difficulty":2,"type":"noun","gender":"F"},{"id":"v-4025","fr":"jaune","en":"yellow","level":"A2","category":"descriptive","difficulty":2,"type":"adjective","gender":""},{"id":"v-4027","fr":"violet","en":"purple","level":"A2","category":"descriptive","difficulty":2,"type":"adjective","gender":""},{"id":"v-2390","fr":"après-midi","en":"afternoon","level":"A2","category":"time","difficulty":2,"type":"noun","gender":""},{"id":"v-4100","fr":"bientôt","en":"soon","level":"A2","category":"time","difficulty":2,"type":"noun","gender":""},{"id":"v-441","fr":"direction","en":"direction","level":"A2","category":"directions","difficulty":2,"type":"noun","gender":"F"},{"id":"v-449","fr":"près","en":"near","level":"A2","category":"directions","difficulty":2,"type":"noun","gender":""},{"id":"v-389","fr":"écran","en":"screen","level":"A2","category":"technology","difficulty":2,"type":"noun","gender":"M"},{"id":"v-393","fr":"mot de passe","en":"password","level":"A2","category":"technology","difficulty":2,"type":"noun","gender":""},{"id":"v-3403","fr":"robe","en":"dress","level":"A2","category":"clothing","difficulty":2,"type":"noun","gender":"F"},{"id":"v-3409","fr":"chaussettes","en":"socks","level":"A2","category":"clothing","difficulty":2,"type":"noun","gender":""},{"id":"v-3482","fr":"ici","en":"here","level":"A2","category":"locations","difficulty":2,"type":"noun","gender":""},{"id":"v-3485","fr":"droite","en":"right","level":"A2","category":"locations","difficulty":2,"type":"noun","gender":""},{"id":"v-4141","fr":"chaud","en":"warm","level":"A2","category":"weather","difficulty":2,"type":"noun","gender":""},{"id":"v-4137","fr":"neige","en":"snow","level":"A2","category":"weather","difficulty":2,"type":"noun","gender":"F"},{"id":"v-2003","fr":"four","en":"oven","level":"B1","category":"cooking","difficulty":3,"type":"noun","gender":""},{"id":"v-2011","fr":"cuisiner","en":"to cook","level":"B1","category":"cooking","difficulty":3,"type":"verb","gender":""},{"id":"v-3298","fr":"festival","en":"festival","level":"B1","category":"leisure","difficulty":3,"type":"noun","gender":"M"},{"id":"v-3299","fr":"célébration","en":"celebration","level":"B1","category":"leisure","difficulty":3,"type":"noun","gender":"F"},{"id":"v-538","fr":"ministre","en":"minister","level":"B1","category":"politics","difficulty":3,"type":"noun","gender":""},{"id":"v-540","fr":"vote","en":"vote","level":"B1","category":"politics","difficulty":3,"type":"noun","gender":""},{"id":"v-3859","fr":"autoroute","en":"highway","level":"B1","category":"transport","difficulty":3,"type":"noun","gender":""},{"id":"v-3857","fr":"mécanicien","en":"mechanic","level":"B1","category":"transport","difficulty":3,"type":"noun","gender":""},{"id":"v-2019","fr":"étagère","en":"shelf","level":"B1","category":"household","difficulty":3,"type":"noun","gender":""},{"id":"v-2024","fr":"tapis","en":"rug","level":"B1","category":"household","difficulty":3,"type":"noun","gender":""},{"id":"v-2427","fr":"galerie","en":"gallery","level":"B1","category":"culture","difficulty":3,"type":"noun","gender":"F"},{"id":"v-2430","fr":"concert","en":"concert","level":"B1","category":"culture","difficulty":3,"type":"noun","gender":""},{"id":"v-2043","fr":"télécharger","en":"to download","level":"B1","category":"technology","difficulty":3,"type":"verb","gender":""},{"id":"v-3278","fr":"spam","en":"spam","level":"B1","category":"technology","difficulty":3,"type":"noun","gender":""},{"id":"v-527","fr":"budget","en":"budget","level":"B1","category":"business","difficulty":3,"type":"noun","gender":"M"},{"id":"v-530","fr":"marché","en":"market","level":"B1","category":"business","difficulty":3,"type":"noun","gender":""},{"id":"v-3220","fr":"remboursement","en":"refund","level":"B1","category":"service","difficulty":3,"type":"noun","gender":"M"},{"id":"v-3219","fr":"plainte","en":"complaint","level":"B1","category":"service","difficulty":3,"type":"noun","gender":""},{"id":"v-3258","fr":"démission","en":"resignation","level":"B1","category":"work","difficulty":3,"type":"noun","gender":"F"},{"id":"v-3850","fr":"équipe","en":"shift","level":"B1","category":"work","difficulty":3,"type":"noun","gender":""},{"id":"v-3262","fr":"propriétaire","en":"landlord","level":"B1","category":"housing","difficulty":3,"type":"noun","gender":""},{"id":"v-3266","fr":"bail","en":"lease","level":"B1","category":"housing","difficulty":3,"type":"noun","gender":""},{"id":"v-3811","fr":"compte","en":"account","level":"B1","category":"finance","difficulty":3,"type":"noun","gender":""},{"id":"v-3819","fr":"dette","en":"debt","level":"B1","category":"finance","difficulty":3,"type":"noun","gender":"F"},{"id":"v-2067","fr":"coude","en":"elbow","level":"B1","category":"body","difficulty":3,"type":"noun","gender":"F"},{"id":"v-2070","fr":"cheville","en":"ankle","level":"B1","category":"body","difficulty":3,"type":"noun","gender":""},{"id":"v-3281","fr":"urgence","en":"emergency","level":"B1","category":"safety","difficulty":3,"type":"noun","gender":"F"},{"id":"v-3282","fr":"ambulance","en":"ambulance","level":"B1","category":"safety","difficulty":3,"type":"noun","gender":"F"},{"id":"v-2442","fr":"recherche","en":"research","level":"B1","category":"science","difficulty":3,"type":"noun","gender":""},{"id":"v-2448","fr":"technologie","en":"technology","level":"B1","category":"science","difficulty":3,"type":"noun","gender":"F"},{"id":"v-552","fr":"nature","en":"nature","level":"B1","category":"environment","difficulty":3,"type":"noun","gender":"F"},{"id":"v-551","fr":"environnement","en":"environment","level":"B1","category":"environment","difficulty":3,"type":"noun","gender":"M"},{"id":"v-3236","fr":"pourboire","en":"tip","level":"B1","category":"dining","difficulty":3,"type":"noun","gender":""},{"id":"v-3232","fr":"entrée","en":"appetizer","level":"B1","category":"dining","difficulty":3,"type":"noun","gender":"F"},{"id":"v-2477","fr":"terrain","en":"field","level":"B1","category":"sports","difficulty":3,"type":"noun","gender":"M"},{"id":"v-2468","fr":"victoire","en":"victory","level":"B1","category":"sports","difficulty":3,"type":"noun","gender":""},{"id":"v-2051","fr":"prendre le petit-déjeuner","en":"to have breakfast","level":"B1","category":"daily","difficulty":3,"type":"verb","gender":""},{"id":"v-2052","fr":"faire la navette","en":"to commute","level":"B1","category":"daily","difficulty":3,"type":"verb","gender":""},{"id":"v-3878","fr":"déforestation","en":"deforestation","level":"B1","category":"nature","difficulty":3,"type":"noun","gender":"F"},{"id":"v-3874","fr":"habitat","en":"habitat","level":"B1","category":"nature","difficulty":3,"type":"noun","gender":"M"},{"id":"v-2585","fr":"passion","en":"passion","level":"B1","category":"abstract","difficulty":3,"type":"noun","gender":"F"},{"id":"v-2532","fr":"solution","en":"solution","level":"B1","category":"abstract","difficulty":3,"type":"noun","gender":"F"},{"id":"v-2529","fr":"prétendre","en":"to claim","level":"B1","category":"verbs","difficulty":3,"type":"verb","gender":""},{"id":"v-3889","fr":"contribuer","en":"to contribute","level":"B1","category":"verbs","difficulty":3,"type":"verb","gender":""},{"id":"v-3216","fr":"chambre double","en":"double room","level":"B1","category":"travel","difficulty":3,"type":"noun","gender":""},{"id":"v-3208","fr":"passager","en":"passenger","level":"B1","category":"travel","difficulty":3,"type":"noun","gender":""},{"id":"v-3866","fr":"date limite","en":"deadline","level":"B1","category":"education","difficulty":3,"type":"noun","gender":""},{"id":"v-3864","fr":"conférence","en":"lecture","level":"B1","category":"education","difficulty":3,"type":"noun","gender":"F"},{"id":"v-2062","fr":"médicament","en":"medicine","level":"B1","category":"health","difficulty":3,"type":"noun","gender":"M"},{"id":"v-2059","fr":"mal de tête","en":"headache","level":"B1","category":"health","difficulty":3,"type":"noun","gender":""},{"id":"v-572","fr":"article","en":"article","level":"B1","category":"media","difficulty":3,"type":"noun","gender":""},{"id":"v-3838","fr":"publication","en":"publication","level":"B1","category":"media","difficulty":3,"type":"noun","gender":"F"},{"id":"v-3894","fr":"approprié","en":"appropriate","level":"B1","category":"adjectives","difficulty":3,"type":"adjective","gender":""},{"id":"v-3892","fr":"fiable","en":"reliable","level":"B1","category":"adjectives","difficulty":3,"type":"adjective","gender":""},{"id":"v-3806","fr":"garantie","en":"guarantee","level":"B1","category":"shopping","difficulty":3,"type":"noun","gender":"F"},{"id":"v-3810","fr":"qualité","en":"quality","level":"B1","category":"shopping","difficulty":3,"type":"noun","gender":"F"},{"id":"v-4214","fr":"procès","en":"trial","level":"B2","category":"law","difficulty":4,"type":"noun","gender":""},{"id":"v-627","fr":"phénomène","en":"phenomenon","level":"B2","category":"scientific","difficulty":4,"type":"noun","gender":""},{"id":"v-3611","fr":"anxiété","en":"anxiety","level":"B2","category":"emotions","difficulty":4,"type":"noun","gender":"F"},{"id":"v-3693","fr":"loisirs","en":"recreation","level":"B2","category":"leisure","difficulty":4,"type":"noun","gender":""},{"id":"v-3097","fr":"banlieue","en":"suburb","level":"B2","category":"urban","difficulty":4,"type":"noun","gender":""},{"id":"v-4261","fr":"problème","en":"problem","level":"B2","category":"abstract","difficulty":4,"type":"noun","gender":"M"},{"id":"v-2625","fr":"faillite","en":"bankruptcy","level":"B2","category":"economics","difficulty":4,"type":"noun","gender":""},{"id":"v-2109","fr":"habitat","en":"habitat","level":"B2","category":"environment","difficulty":4,"type":"noun","gender":"M"},{"id":"v-2699","fr":"remplacer","en":"to replace","level":"B2","category":"verbs","difficulty":4,"type":"verb","gender":""},{"id":"v-605","fr":"cadre","en":"framework","level":"B2","category":"professional","difficulty":4,"type":"noun","gender":""},{"id":"v-3058","fr":"dividende","en":"dividend","level":"B2","category":"finance","difficulty":4,"type":"noun","gender":""},{"id":"v-3649","fr":"monument","en":"monument","level":"B2","category":"culture","difficulty":4,"type":"noun","gender":"M"},{"id":"v-4196","fr":"invention","en":"invention","level":"B2","category":"science","difficulty":4,"type":"noun","gender":"F"},{"id":"v-615","fr":"plaignant","en":"plaintiff","level":"B2","category":"legal","difficulty":4,"type":"noun","gender":""},{"id":"v-3604","fr":"sécheresse","en":"drought","level":"B2","category":"weather","difficulty":4,"type":"noun","gender":"F"},{"id":"v-4175","fr":"tournoi","en":"tournament","level":"B2","category":"sports","difficulty":4,"type":"noun","gender":""},{"id":"v-3625","fr":"se peigner","en":"to comb hair","level":"B2","category":"daily","difficulty":4,"type":"verb","gender":""},{"id":"v-2092","fr":"dépression","en":"depression","level":"B2","category":"psychology","difficulty":4,"type":"noun","gender":"F"},{"id":"v-660","fr":"substantiel","en":"substantial","level":"B2","category":"adjectives","difficulty":4,"type":"adjective","gender":""},{"id":"v-2748","fr":"racisme","en":"racism","level":"B2","category":"politics","difficulty":4,"type":"noun","gender":"M"},{"id":"v-3639","fr":"étranger","en":"stranger","level":"B2","category":"social","difficulty":4,"type":"noun","gender":""},{"id":"v-3001","fr":"symptôme","en":"symptom","level":"B2","category":"health","difficulty":4,"type":"noun","gender":""},{"id":"v-3086","fr":"censure","en":"censorship","level":"B2","category":"media","difficulty":4,"type":"noun","gender":"F"},{"id":"v-3661","fr":"ranger","en":"to tidy up","level":"B2","category":"household","difficulty":4,"type":"verb","gender":""},{"id":"v-4241","fr":"mètre","en":"meter","level":"B2","category":"measurement","difficulty":4,"type":"noun","gender":""},{"id":"v-4188","fr":"sculpture","en":"sculpture","level":"B2","category":"arts","difficulty":4,"type":"noun","gender":"F"},{"id":"v-4239","fr":"colline","en":"hill","level":"B2","category":"geography","difficulty":4,"type":"noun","gender":""},{"id":"v-4170","fr":"singe","en":"monkey","level":"B2","category":"animals","difficulty":4,"type":"noun","gender":""},{"id":"v-4230","fr":"arme","en":"weapon","level":"B2","category":"military","difficulty":4,"type":"noun","gender":""},{"id":"v-2116","fr":"informatique en nuage","en":"cloud computing","level":"B2","category":"technology","difficulty":4,"type":"noun","gender":"M"},{"id":"v-3655","fr":"coiffure","en":"hairstyle","level":"B2","category":"appearance","difficulty":4,"type":"adjective","gender":""},{"id":"v-3689","fr":"engagement","en":"commitment","level":"B2","category":"relationships","difficulty":4,"type":"noun","gender":"M"},{"id":"v-4252","fr":"bois","en":"wood","level":"B2","category":"materials","difficulty":4,"type":"noun","gender":""},{"id":"v-2073","fr":"citation","en":"citation","level":"B2","category":"academic","difficulty":4,"type":"noun","gender":"F"},{"id":"v-632","fr":"récession","en":"recession","level":"B2","category":"economic","difficulty":4,"type":"noun","gender":"F"},{"id":"v-4210","fr":"spirituel","en":"spiritual","level":"B2","category":"philosophy","difficulty":4,"type":"noun","gender":"M"},{"id":"v-3121","fr":"stratification","en":"stratification","level":"C1","category":"sociology","difficulty":5,"type":"noun","gender":"F"},{"id":"v-3105","fr":"litige","en":"litigation","level":"C1","category":"professional","difficulty":5,"type":"noun","gender":""},{"id":"v-3582","fr":"jurisprudence","en":"jurisprudence","level":"C1","category":"law","difficulty":5,"type":"noun","gender":"F"},{"id":"v-3132","fr":"socialisme","en":"socialism","level":"C1","category":"politics","difficulty":5,"type":"noun","gender":"M"},{"id":"v-3959","fr":"virtualisation","en":"virtualization","level":"C1","category":"technology","difficulty":5,"type":"noun","gender":"F"},{"id":"v-3164","fr":"politique monétaire","en":"monetary policy","level":"C1","category":"economics","difficulty":5,"type":"noun","gender":""},{"id":"v-3569","fr":"solvant","en":"solvent","level":"C1","category":"chemistry","difficulty":5,"type":"noun","gender":""},{"id":"v-2857","fr":"étayer","en":"to substantiate","level":"C1","category":"verbs","difficulty":5,"type":"verb","gender":""},{"id":"v-3533","fr":"longitude","en":"longitude","level":"C1","category":"geography","difficulty":5,"type":"noun","gender":"F"},{"id":"v-3916","fr":"portefeuille","en":"portfolio","level":"C1","category":"finance","difficulty":5,"type":"noun","gender":""},{"id":"v-2152","fr":"diplomatie","en":"diplomacy","level":"C1","category":"political","difficulty":5,"type":"noun","gender":"F"},{"id":"v-3514","fr":"étiologie","en":"etiology","level":"C1","category":"medicine","difficulty":5,"type":"noun","gender":"F"},{"id":"v-3906","fr":"externalisation","en":"outsourcing","level":"C1","category":"business","difficulty":5,"type":"noun","gender":"F"},{"id":"v-2145","fr":"prose","en":"prose","level":"C1","category":"literary","difficulty":5,"type":"noun","gender":""},{"id":"v-3503","fr":"axiome","en":"axiom","level":"C1","category":"mathematics","difficulty":5,"type":"noun","gender":""},{"id":"v-3175","fr":"chromosome","en":"chromosome","level":"C1","category":"science","difficulty":5,"type":"noun","gender":""},{"id":"v-3529","fr":"fouille","en":"excavation","level":"C1","category":"history","difficulty":5,"type":"noun","gender":""},{"id":"v-3195","fr":"minimalisme","en":"minimalism","level":"C1","category":"art","difficulty":5,"type":"noun","gender":"M"},{"id":"v-3980","fr":"reboisement","en":"reforestation","level":"C1","category":"environment","difficulty":5,"type":"noun","gender":"M"},{"id":"v-3157","fr":"absolutisme","en":"absolutism","level":"C1","category":"philosophy","difficulty":5,"type":"noun","gender":"M"},{"id":"v-3551","fr":"biodiversité","en":"biodiversity","level":"C1","category":"biology","difficulty":5,"type":"noun","gender":"F"},{"id":"v-3599","fr":"timbre","en":"timbre","level":"C1","category":"music","difficulty":5,"type":"noun","gender":""},{"id":"v-3925","fr":"sanction","en":"sanction","level":"C1","category":"diplomacy","difficulty":5,"type":"noun","gender":"F"},{"id":"v-3542","fr":"constellation","en":"constellation","level":"C1","category":"astronomy","difficulty":5,"type":"noun","gender":"F"},{"id":"v-2775","fr":"conjecture","en":"conjecture","level":"C1","category":"academic","difficulty":5,"type":"noun","gender":"F"},{"id":"v-3185","fr":"étymologie","en":"etymology","level":"C1","category":"linguistics","difficulty":5,"type":"noun","gender":"F"},{"id":"v-2879","fr":"anomalie","en":"anomaly","level":"C1","category":"abstract","difficulty":5,"type":"noun","gender":"F"},{"id":"v-3942","fr":"thérapeutique","en":"therapeutic","level":"C1","category":"medical","difficulty":5,"type":"noun","gender":""},{"id":"v-3579","fr":"calibration","en":"calibration","level":"C1","category":"engineering","difficulty":5,"type":"noun","gender":"F"},{"id":"v-690","fr":"pragmatique","en":"pragmatic","level":"C1","category":"adjectives","difficulty":5,"type":"adjective","gender":""},{"id":"v-695","fr":"juxtaposition","en":"juxtaposition","level":"C2","category":"professional","difficulty":6,"type":"noun","gender":"F"},{"id":"v-694","fr":"mise en garde","en":"caveat","level":"C2","category":"professional","difficulty":6,"type":"noun","gender":""},{"id":"v-3372","fr":"heuristique","en":"heuristic","level":"C2","category":"philosophy","difficulty":6,"type":"noun","gender":""},{"id":"v-2184","fr":"phénoménologie","en":"phenomenology","level":"C2","category":"philosophy","difficulty":6,"type":"noun","gender":"F"},{"id":"v-3762","fr":"mitochondries","en":"mitochondria","level":"C2","category":"science","difficulty":6,"type":"noun","gender":""},{"id":"v-3767","fr":"quarks","en":"quarks","level":"C2","category":"science","difficulty":6,"type":"noun","gender":""},{"id":"v-3744","fr":"pusillanimité","en":"pusillanimity","level":"C2","category":"abstract","difficulty":6,"type":"noun","gender":"F"},{"id":"v-2988","fr":"mégalomanie","en":"megalomania","level":"C2","category":"abstract","difficulty":6,"type":"noun","gender":"F"},{"id":"v-2191","fr":"obséquieux","en":"obsequious","level":"C2","category":"adjectives","difficulty":6,"type":"adjective","gender":""},{"id":"v-701","fr":"quintessentiel","en":"quintessential","level":"C2","category":"adjectives","difficulty":6,"type":"adjective","gender":""},{"id":"v-3387","fr":"obscur","en":"recondite","level":"C2","category":"literary","difficulty":6,"type":"noun","gender":""},{"id":"v-3755","fr":"persiflage","en":"persiflage","level":"C2","category":"literary","difficulty":6,"type":"noun","gender":"M"},{"id":"v-3773","fr":"privilège","en":"lien","level":"C2","category":"law","difficulty":6,"type":"noun","gender":""},{"id":"v-3775","fr":"citation","en":"subpoena","level":"C2","category":"law","difficulty":6,"type":"noun","gender":"F"},{"id":"v-3783","fr":"quichottesque","en":"quixotic","level":"C2","category":"academic","difficulty":6,"type":"noun","gender":""},{"id":"v-3788","fr":"tautologie","en":"tautology","level":"C2","category":"academic","difficulty":6,"type":"noun","gender":"F"},{"id":"v-3318","fr":"promulguer","en":"to promulgate","level":"C2","category":"verbs","difficulty":6,"type":"verb","gender":""},{"id":"v-3738","fr":"abroger","en":"to abrogate","level":"C2","category":"verbs","difficulty":6,"type":"verb","gender":""}];
  CONJ = {"être":{"present":{"je":"suis","tu":"es","il/elle":"est","nous":"sommes","vous":"êtes","ils/elles":"sont"},"passé composé":{"j\\":"ai été"},"imparfait":{"j\\":"étais"},"futur":{"je":"serai"},"conditionnel":{"je":"serais"}},"avoir":{"present":{"je":"ai","tu":"as","il/elle":"a","nous":"avons","vous":"avez","ils/elles":"ont"},"passé composé":{"j\\":"ai eu"},"imparfait":{"tu":"avais"},"futur":{"tu":"auras"},"conditionnel":{"tu":"aurais"}},"aller":{"present":{"je":"vais","tu":"vas","il/elle":"va","nous":"allons","vous":"allez","ils/elles":"vont"},"passé composé":{"je":"suis allé(e)"},"imparfait":{"il/elle":"allait"},"futur":{"il/elle":"ira"},"conditionnel":{"il/elle":"irait"}},"parler":{"present":{"je":"parle","tu":"parles","il/elle":"parle","nous":"parlons","vous":"parlez","ils/elles":"parlent"},"passé composé":{"tu":"as parlé"},"imparfait":{"vous":"parliez"},"futur":{"vous":"parlerez"},"conditionnel":{"vous":"parleriez"}},"manger":{"present":{"je":"mange","tu":"manges","il/elle":"mange","nous":"mangeons","vous":"mangez","ils/elles":"mangent"},"passé composé":{"j\\":"ai mangé"},"imparfait":{"je":"mangeais"},"futur":{"je":"mangerai"},"conditionnel":{"je":"mangerais"}},"finir":{"present":{"je":"finis","tu":"finis","il/elle":"finit","nous":"finissons","vous":"finissez","ils/elles":"finissent"},"passé composé":{"il/elle":"a fini"},"imparfait":{"ils/elles":"finissaient"},"futur":{"ils/elles":"finiront"},"conditionnel":{"ils/elles":"finiraient"}},"vendre":{"present":{"je":"vends","tu":"vends","il/elle":"vend","nous":"vendons","vous":"vendez","ils/elles":"vendent"}},"faire":{"present":{"je":"fais","tu":"fais","il/elle":"fait","nous":"faisons","vous":"faites","ils/elles":"font"},"passé composé":{"j\\":"ai fait"},"imparfait":{"nous":"faisions"},"futur":{"nous":"ferons"},"conditionnel":{"nous":"ferions"}},"venir":{"passé composé":{"je":"suis venu(e)"},"imparfait":{"je":"venais"},"futur":{"je":"viendrai"},"conditionnel":{"je":"viendrais"}},"prendre":{"passé composé":{"nous":"avons pris"},"imparfait":{"tu":"prenais"},"futur":{"tu":"prendras"},"conditionnel":{"tu":"prendrais"}},"voir":{"passé composé":{"vous":"avez vu"},"imparfait":{"il/elle":"voyait"},"futur":{"il/elle":"verra"},"conditionnel":{"il/elle":"verrait"}},"pouvoir":{"passé composé":{"ils/elles":"ont pu"},"imparfait":{"nous":"pouvions"},"futur":{"nous":"pourrons"},"conditionnel":{"nous":"pourrions"}},"vouloir":{"passé composé":{"j\\":"ai voulu"},"imparfait":{"vous":"vouliez"},"futur":{"vous":"voudrez"},"conditionnel":{"vous":"voudriez"}}};
  VERBS = [{"verb":"être","en":"to be","category":"irregular","level":"A1","tenses":["present","passé composé","imparfait","futur","conditionnel"]},{"verb":"avoir","en":"to have","category":"irregular","level":"A1","tenses":["present","passé composé","imparfait","futur","conditionnel"]},{"verb":"aller","en":"to go","category":"irregular","level":"A1","tenses":["present","passé composé","imparfait","futur","conditionnel"]},{"verb":"parler","en":"to speak","category":"er-verb","level":"A1","tenses":["present","passé composé","imparfait","futur","conditionnel"]},{"verb":"manger","en":"to eat","category":"er-verb","level":"A1","tenses":["present","passé composé","imparfait","futur","conditionnel"]},{"verb":"finir","en":"to finish","category":"ir-verb","level":"A2","tenses":["present","passé composé","imparfait","futur","conditionnel"]},{"verb":"vendre","en":"to sell","category":"re-verb","level":"A2","tenses":["present"]},{"verb":"faire","en":"to do/make","category":"irregular","level":"A1","tenses":["present","passé composé","imparfait","futur","conditionnel"]},{"verb":"venir","en":"to come","category":"irregular","level":"B1","tenses":["passé composé","imparfait","futur","conditionnel"]},{"verb":"prendre","en":"to take","category":"irregular","level":"B1","tenses":["passé composé","imparfait","futur","conditionnel"]},{"verb":"voir","en":"to see","category":"irregular","level":"B1","tenses":["passé composé","imparfait","futur","conditionnel"]},{"verb":"pouvoir","en":"can/to be able","category":"irregular","level":"B1","tenses":["passé composé","imparfait","futur","conditionnel"]},{"verb":"vouloir","en":"to want","category":"irregular","level":"B1","tenses":["passé composé","imparfait","futur","conditionnel"]}];

  const settings = loadSettings();
  soundOn = settings.sound !== false;
  document.getElementById('sound-btn').textContent = soundOn ? '🔊' : '🔇';
  if (soundOn) document.getElementById('sound-btn').classList.add('active');

  updateStreak();
  document.getElementById('stat-streak').textContent = getStreak();

  populateVerbSelect();

  // Pre-warm Chrome's speech synthesis engine so it's ready before the first
  // correct match — avoids a 1-5 second freeze on first speak() call in Chrome
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  startRound();
}

window.addEventListener('DOMContentLoaded', init);
