// ── Database ───────────────────────────────────────────────────────────────────
// database.js must be loaded before app.js
/* global database */
const { VOCAB, CONJUGATIONS, VERBS, GRAMMAR, PHRASES } = database;
let CONJ = {}; // built in init() from flat CONJUGATIONS array

// ── Language ───────────────────────────────────────────────────────────────────
let currentLang = 'en'; // 'en' | 'nl' | 'de'
const LANG_LABELS = { en: 'ENGLISH', nl: 'DUTCH', de: 'GERMAN' };

function getTranslation(item) {
  return item[currentLang] || item.en;
}

// ── Profiles ───────────────────────────────────────────────────────────────────
const PROFILES_KEY = 'frenchPractice_profiles';
let currentProfile = null;
let profiles = [];

function profileKey(base) {
  return 'frenchPractice_' + currentProfile + '_' + base;
}
function loadProfiles() {
  try { return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]'); } catch { return []; }
}
function saveProfiles(p) {
  try { localStorage.setItem(PROFILES_KEY, JSON.stringify(p)); } catch {}
}

function renderProfileScreen() {
  profiles = loadProfiles();
  const list = document.getElementById('profile-list');
  if (profiles.length === 0) {
    list.innerHTML = '<p class="profile-empty">No profiles yet — create one below.</p>';
  } else {
    list.innerHTML = profiles.map(p =>
      '<button class="profile-item-btn" onclick="selectProfile(' + JSON.stringify(p.name) + ')">' + p.name + '</button>'
    ).join('');
  }
  document.getElementById('add-profile-row').style.display = profiles.length < 4 ? 'flex' : 'none';
  // Show close button only when a profile is already active
  const closeBtn = document.getElementById('profile-close-btn');
  if (closeBtn) closeBtn.style.display = currentProfile ? 'inline' : 'none';
}

function showProfileOverlay() {
  renderProfileScreen();
  document.getElementById('profile-overlay').classList.remove('hidden');
}

function closeProfileOverlay() {
  if (currentProfile) {
    document.getElementById('profile-overlay').classList.add('hidden');
  }
}

function selectProfile(name) {
  currentProfile = name;
  document.getElementById('profile-overlay').classList.add('hidden');
  document.getElementById('profile-name-display').textContent = name;
  usedIds = {};
  sessionCorrect = 0; sessionWrong = 0; sessionRounds = 0;
  applyProfileSettings();
  updateStreak();
  document.getElementById('stat-streak').textContent = getStreak();
  updateSessionStats();
  startRound();
}

function applyProfileSettings() {
  const s = loadSettings();
  soundOn = s.sound !== false;
  currentLang = s.lang || 'en';
  const btn = document.getElementById('sound-btn');
  btn.textContent = soundOn ? '🔊' : '🔇';
  btn.classList.toggle('active', soundOn);
  document.getElementById('lang-select').value = currentLang;
}

function addProfile() {
  const input = document.getElementById('profile-name-input');
  const name = (input.value || '').trim();
  if (!name) return;
  profiles = loadProfiles();
  if (profiles.length >= 4) return;
  if (profiles.find(p => p.name === name)) { input.select(); return; }
  profiles.push({ name });
  saveProfiles(profiles);
  input.value = '';
  renderProfileScreen();
}

// ── SM-2 Storage (profile-scoped) ──────────────────────────────────────────────
function loadProgress() {
  if (!currentProfile) return {};
  try { return JSON.parse(localStorage.getItem(profileKey('progress')) || '{}'); } catch { return {}; }
}
function saveProgress(p) {
  if (!currentProfile) return;
  try { localStorage.setItem(profileKey('progress'), JSON.stringify(p)); } catch {}
}
function loadSettings() {
  if (!currentProfile) return {};
  try { return JSON.parse(localStorage.getItem(profileKey('settings')) || '{}'); } catch { return {}; }
}
function saveSettings(s) {
  if (!currentProfile) return;
  try { localStorage.setItem(profileKey('settings'), JSON.stringify(s)); } catch {}
}

function updateStreak() {
  if (!currentProfile) return 0;
  const today = new Date().toISOString().split('T')[0];
  try {
    const s = JSON.parse(localStorage.getItem(profileKey('streak')) || '{"lastDate":"","streak":0}');
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (s.lastDate === today) return s.streak;
    if (s.lastDate === yesterday) { s.streak++; } else { s.streak = 1; }
    s.lastDate = today;
    localStorage.setItem(profileKey('streak'), JSON.stringify(s));
    return s.streak;
  } catch { return 0; }
}

function getStreak() {
  if (!currentProfile) return 0;
  try {
    const s = JSON.parse(localStorage.getItem(profileKey('streak')) || '{"streak":0}');
    return s.streak || 0;
  } catch { return 0; }
}

function sm2Update(id, correct) {
  if (!currentProfile) return;
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

// ── Antonym pairs ──────────────────────────────────────────────────────────────
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
  {a:'noir',b:'blanc'},{a:'proche',b:'loin'},
];

// ── Topic mapping ──────────────────────────────────────────────────────────────
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

// ── Level config ───────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  A1: { name: 'Beginner',     count: 5  },
  A2: { name: 'Elementary',   count: 8  },
  B1: { name: 'Intermediate', count: 12 },
  B2: { name: 'Advanced',     count: 16 },
  C1: { name: 'Expert',       count: 20 },
};

const MODE_DESC = {
  vocab:       'Match each French word to its translation.',
  gender:      'Match each noun to its correct gender — le (masculine) or la (feminine).',
  antonyms:    'Match each French word to its French opposite.',
  conjugation: 'Match each pronoun to the correct verb form.',
  phrases:     'Choose the correct translation for each French phrase.',
};

// ── State ──────────────────────────────────────────────────────────────────────
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

// ── Utility ────────────────────────────────────────────────────────────────────
function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }

function getFilteredVocab() {
  const cats = TOPIC_MAP[topic];
  let pool = VOCAB.filter(w => w.level === level);
  if (cats) pool = pool.filter(w => cats.includes(w.category));
  if (pool.length < 4) pool = VOCAB.filter(w => w.level === level);
  return pool;
}

function pickWords(pool, count) {
  const key = level + topic;
  const used = usedIds[key] || [];
  let available = pool.filter(w => !used.includes(w.id));
  if (available.length < count) {
    usedIds[key] = [];
    available = pool;
  }
  const picked = shuffle(available).slice(0, count);
  usedIds[key] = [...(usedIds[key] || []), ...picked.map(w => w.id)];
  return picked;
}

// ── Build CONJ map from flat CONJUGATIONS array ────────────────────────────────
function buildConjMap() {
  const conj = {};
  CONJUGATIONS.forEach(c => {
    if (!conj[c.verb]) conj[c.verb] = {};
    if (!conj[c.verb][c.tense]) conj[c.verb][c.tense] = {};
    conj[c.verb][c.tense][c.subject] = c.form;
  });
  return conj;
}

// ── Build pairs ────────────────────────────────────────────────────────────────
function buildPairs() {
  const count = LEVEL_CONFIG[level]?.count || 5;

  if (mode === 'vocab') {
    const pool = getFilteredVocab();
    const words = pickWords(pool, count);
    return words.map(w => ({ left: w.fr, right: getTranslation(w), id: w.id }));
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
      id: 'conj_' + currentVerb + '_' + currentTense + '_' + i,
    }));
  }

  return buildFallbackPairs(count);
}

function buildFallbackPairs(count) {
  const pool = getFilteredVocab();
  const src = pool.length >= count ? pool : VOCAB;
  const words = shuffle(src).slice(0, count);
  return words.map(w => ({ left: w.fr, right: getTranslation(w), id: w.id }));
}

// ── Arena visibility helper ────────────────────────────────────────────────────
function showArena(visible) {
  const display = visible ? '' : 'none';
  document.getElementById('col-labels').style.display = display;
  document.getElementById('arena').style.display = display;
  document.getElementById('fb').style.display = display;
  document.getElementById('phrases-card').style.display = visible ? 'none' : 'none';
}

// ── Render ─────────────────────────────────────────────────────────────────────
function startRound() {
  if (!currentProfile) return;

  document.getElementById('round-end').style.display = 'none';

  if (mode === 'phrases') {
    document.getElementById('col-labels').style.display = 'none';
    document.getElementById('arena').style.display = 'none';
    document.getElementById('fb').style.display = 'none';
    document.getElementById('phrases-card').style.display = 'block';
    startPhrasesRound();
    return;
  }

  // Restore arena
  document.getElementById('col-labels').style.display = '';
  document.getElementById('arena').style.display = '';
  document.getElementById('fb').style.display = '';
  document.getElementById('phrases-card').style.display = 'none';

  pairs = buildPairs();

  if (mode === 'gender') {
    startGenderRound();
    return;
  }

  matched = Array(pairs.length).fill(false);
  selSide = null; selIdx = null; wrongTimer = null; roundMistakes = 0;

  document.getElementById('prog').style.width = '0%';
  setFb('', '');

  const count = pairs.length;
  const cols = count <= 5 ? 1 : count <= 8 ? 2 : 3;
  leftItems  = pairs.map((_, i) => i);
  rightItems = shuffle(pairs.map((_, i) => i));

  const gl = document.getElementById('grid-l');
  const gr = document.getElementById('grid-r');
  gl.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  gr.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  gl.innerHTML = leftItems.map( (pi, slot) => cellHTML('l', slot, pi)).join('');
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
    lr.textContent = LANG_LABELS[currentLang] || 'ENGLISH';
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

// ── Gender mode ────────────────────────────────────────────────────────────────
let genderNouns   = [];
let genderMatched = [];
let genderSel     = null;
let genderMistakes = 0;

function startGenderRound() {
  genderNouns   = pairs;
  genderMatched = Array(genderNouns.length).fill(false);
  genderSel = null; genderMistakes = 0; roundMistakes = 0;
  wrongTimer = null;

  document.getElementById('prog').style.width = '0%';
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
    const lblEl  = document.getElementById(`gg-${i}`);
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

// ── Match logic ────────────────────────────────────────────────────────────────
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
    sm2Update(pairs[pi].id,  false);
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

// ── Feedback & stats ───────────────────────────────────────────────────────────
function setFb(msg, type) {
  const el = document.getElementById('fb');
  el.textContent = msg;
  el.className = 'feedback' + (type ? ' ' + type : '');
}

function updateSessionStats() {
  document.getElementById('stat-correct').textContent = sessionCorrect;
  document.getElementById('stat-wrong').textContent   = sessionWrong;
}

// ── Round end ──────────────────────────────────────────────────────────────────
function showRoundEnd() {
  sessionRounds++;
  updateStreak();
  const total = pairs.length || genderNouns.length;
  document.getElementById('round-score').textContent = total + '/' + total;
  document.getElementById('round-sub').textContent   = roundMistakes === 0 ? 'Perfect round!' : roundMistakes + ' mistake' + (roundMistakes !== 1 ? 's' : '');
  document.getElementById('round-end').style.display = 'block';
  // Part 1: scroll summary into view
  setTimeout(() => document.getElementById('round-end').scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  document.getElementById('stat-streak').textContent = getStreak();
  setFb('', '');
}

function nextRound() {
  document.getElementById('round-end').style.display = 'none';
  startRound();
}

// ── Phrases mode ───────────────────────────────────────────────────────────────
const PHRASES_PER_ROUND = 10;
let phraseRound    = [];
let phraseIndex    = 0;
let phraseScore    = 0;
let phraseMistakes = 0;
let phraseAnswered = false;
let phraseChoices  = []; // choices for current phrase (set in showCurrentPhrase)

function startPhrasesRound() {
  const used = usedIds['phrases'] || [];
  let pool = PHRASES.filter(p => !used.includes(p.id));
  if (pool.length < PHRASES_PER_ROUND) { usedIds['phrases'] = []; pool = [...PHRASES]; }
  phraseRound = shuffle(pool).slice(0, PHRASES_PER_ROUND);
  usedIds['phrases'] = [...(usedIds['phrases'] || []), ...phraseRound.map(p => p.id)];

  phraseIndex = 0; phraseScore = 0; phraseMistakes = 0; roundMistakes = 0;
  document.getElementById('prog').style.width = '0%';
  showCurrentPhrase();
}

function showCurrentPhrase() {
  phraseAnswered = false;
  const phrase = phraseRound[phraseIndex];

  document.getElementById('phrase-counter').textContent = (phraseIndex + 1) + ' / ' + PHRASES_PER_ROUND;
  document.getElementById('phrase-fr').textContent = phrase.fr;
  document.getElementById('phrase-feedback').innerHTML = '';

  const correct = getTranslation(phrase);
  const distractors = shuffle(PHRASES.filter(p => p.id !== phrase.id))
    .slice(0, 3)
    .map(p => getTranslation(p));
  phraseChoices = shuffle([correct, ...distractors]);

  document.getElementById('phrase-choices').innerHTML = phraseChoices.map((c, i) =>
    `<button class="phrase-choice-btn" onclick="checkPhraseAnswer(${i})">${c}</button>`
  ).join('');
}

function checkPhraseAnswer(choiceIdx) {
  if (phraseAnswered) return;
  phraseAnswered = true;

  const phrase   = phraseRound[phraseIndex];
  const correct  = getTranslation(phrase);
  const chosen   = phraseChoices[choiceIdx];
  const isCorrect = chosen === correct;

  document.querySelectorAll('.phrase-choice-btn').forEach((b, i) => {
    b.disabled = true;
    if (phraseChoices[i] === correct) b.classList.add('correct');
    else if (i === choiceIdx && !isCorrect) b.classList.add('wrong');
  });

  if (isCorrect) {
    phraseScore++; sessionCorrect++;
    sm2Update(phrase.id, true);
    speak(phrase.fr);
  } else {
    phraseMistakes++; roundMistakes++; sessionWrong++;
    sm2Update(phrase.id, false);
  }
  updateSessionStats();

  const pct = Math.round((phraseIndex + 1) / PHRASES_PER_ROUND * 100);
  document.getElementById('prog').style.width = pct + '%';

  const isLast = phraseIndex >= PHRASES_PER_ROUND - 1;
  document.getElementById('phrase-feedback').innerHTML =
    `<div class="phrase-ref">` +
    `<div><span class="phrase-ref-flag">🇫🇷</span> ${phrase.fr}</div>` +
    `<div><span class="phrase-ref-flag">🇬🇧</span> ${phrase.en}</div>` +
    `<div><span class="phrase-ref-flag">🇳🇱</span> ${phrase.nl || '—'}</div>` +
    `<div><span class="phrase-ref-flag">🇩🇪</span> ${phrase.de || '—'}</div>` +
    `</div>` +
    `<button class="next-btn" onclick="advancePhrase()">${isLast ? 'See results →' : 'Next phrase →'}</button>`;
}

function advancePhrase() {
  phraseIndex++;
  if (phraseIndex >= PHRASES_PER_ROUND) {
    endPhrasesRound();
  } else {
    showCurrentPhrase();
  }
}

function endPhrasesRound() {
  sessionRounds++;
  updateStreak();
  document.getElementById('phrases-card').style.display = 'none';
  document.getElementById('round-score').textContent = phraseScore + '/' + PHRASES_PER_ROUND;
  document.getElementById('round-sub').textContent   = phraseMistakes === 0 ? 'Perfect round!' : phraseMistakes + ' mistake' + (phraseMistakes !== 1 ? 's' : '');
  document.getElementById('round-end').style.display = 'block';
  setTimeout(() => document.getElementById('round-end').scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  document.getElementById('stat-streak').textContent = getStreak();
}

// ── Sound ──────────────────────────────────────────────────────────────────────
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

// ── Language selector ──────────────────────────────────────────────────────────
function setLanguage(lang) {
  currentLang = lang;
  const s = loadSettings();
  s.lang = lang;
  saveSettings(s);
  usedIds = {};
  startRound();
}

// ── Progress dashboard ─────────────────────────────────────────────────────────
function showDashboard() {
  const p      = loadProgress();
  const ids    = Object.keys(p);
  const today  = new Date().toISOString().split('T')[0];
  const mastered = ids.filter(id => p[id].repetitions >= 3 && p[id].easeFactor > 2.0).length;
  const due      = ids.filter(id => p[id].nextReview <= today).length;
  const streak   = getStreak();

  document.getElementById('dash-total').textContent    = ids.length;
  document.getElementById('dash-mastered').textContent = mastered;
  document.getElementById('dash-streak').textContent   = streak + ' day' + (streak !== 1 ? 's' : '');
  document.getElementById('dash-due').textContent      = due;

  // Category breakdown — VOCAB + PHRASES
  const catData = {};
  VOCAB.forEach(w => {
    if (!catData[w.category]) catData[w.category] = { total: 0, seen: 0 };
    catData[w.category].total++;
    if (p[w.id]) catData[w.category].seen++;
  });
  PHRASES.forEach(ph => {
    const key = 'phrases';
    if (!catData[key]) catData[key] = { total: 0, seen: 0 };
    catData[key].total++;
    if (p[ph.id]) catData[key].seen++;
  });

  const topCats = Object.entries(catData).sort((a, b) => b[1].total - a[1].total).slice(0, 10);
  document.getElementById('cat-breakdown').innerHTML = topCats.map(([cat, d]) => `
    <div class="cat-row">
      <div class="cat-name">${cat}</div>
      <div class="cat-bar-wrap"><div class="cat-bar" style="width:${Math.round(d.seen / d.total * 100)}%"></div></div>
      <div class="cat-count">${d.seen}/${d.total}</div>
    </div>
  `).join('');

  document.getElementById('overlay').classList.remove('hidden');
}

function hideDashboard() {
  document.getElementById('overlay').classList.add('hidden');
}

function resetProgress() {
  if (!currentProfile) return;
  if (!confirm(`Reset all progress for ${currentProfile}? This cannot be undone.`)) return;
  localStorage.removeItem(profileKey('progress'));
  localStorage.removeItem(profileKey('streak'));
  usedIds = {};
  hideDashboard();
  startRound();
}

// ── UI event handlers ──────────────────────────────────────────────────────────
function setMode(m, el) {
  mode = m;
  document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('mode-desc').textContent = MODE_DESC[m] || '';
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
  const sel     = document.getElementById('verb-select');
  const tenseSel = document.getElementById('tense-select');
  sel.innerHTML = VERBS.map(v => `<option value="${v.verb}">${v.verb} (${v.en})</option>`).join('');
  const allTenses = ['present', 'imparfait', 'passé composé', 'futur', 'conditionnel'];
  tenseSel.innerHTML = allTenses.map(t => `<option value="${t}">${t}</option>`).join('');
  sel.value   = 'être';
  currentVerb = 'être';
}

// ── Keyboard ───────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.cell.selected').forEach(el => el.classList.remove('selected'));
    selSide = null; selIdx = null; genderSel = null;
    closeProfileOverlay();
  }
});

// ── Init ───────────────────────────────────────────────────────────────────────
function init() {
  // Build nested CONJ map from flat CONJUGATIONS array (Part 6)
  CONJ = buildConjMap();

  populateVerbSelect();

  // Pre-warm Chrome's speech synthesis engine to avoid first-call freeze
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  // Show profile selection — startRound() called after selectProfile()
  showProfileOverlay();
}

window.addEventListener('DOMContentLoaded', init);
