// ── Database ───────────────────────────────────────────────────────────────────
/* global database */
const { VOCAB, CONJUGATIONS, VERBS, GRAMMAR, PHRASES, WORD_RELATIONSHIPS } = database;
let CONJ = {}; // built at init() from flat CONJUGATIONS array

// ── Translations ───────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    // language names
    langEN: 'English', langNL: 'Nederlands', langDE: 'Deutsch', langFR: 'Français',
    // mode tabs
    vocab: 'Vocabulary', gender: 'Gender', conjugation: 'Conjugation',
    phrases: 'Phrases', grammar: 'Grammar', wordrel: 'Word Relationships',
    // mode group labels
    groupWords: 'Words', groupVerbs: 'Verbs', groupLanguage: 'Language',
    // levels
    beginner: 'Foundation', elementary: 'Essential', intermediate: 'Intermediate',
    advanced: 'Advanced', expert: 'Proficient', mastery: 'Mastery',
    // topics
    topicAll: 'All', everyday: 'Everyday', food: 'Food', family: 'Family',
    travel: 'Travel', work: 'Work', nature: 'Nature', body: 'Body',
    school: 'School', shopping: 'Shopping', animals: 'Animals', home: 'Home',
    // col headers
    francais: 'FRANÇAIS', nativeLang: 'ENGLISH',
    pronoun: 'PRONOUN',
    // mode instructions
    instrVocab: 'Match each French word to its translation.',
    instrGender: 'Is the noun masculine (LE) or feminine (LA)?',
    instrConjugation: 'Match each pronoun to the correct verb form.',
    instrPhrases: 'Choose the correct translation for each phrase.',
    instrGrammar: 'Choose the correct answer.',
    instrWordrel: 'Select the word that is related to the one shown.',
    // buttons
    nextRound: 'Next round →', nextItem: 'Next →', seeResults: 'See results →',
    progress: 'Progress', addProfile: 'Add', about: 'About',
    difficultyLevel: 'Difficulty:', difficulty: 'Difficulty',
    // round-end score messages
    scorePerfect: 'Perfect!', scoreExcellent: 'Excellent!',
    scoreGood: 'Good job!', scoreKeepPractising: 'Keep practising!',
    // word relationships filter
    wrAll: 'All', wrAntonyms: 'Antonyms', wrSynonyms: 'Synonyms',
    antonymLabel: 'antonym', synonymLabel: 'synonym',
    findAntonym: 'Antonym of:', findSynonym: 'Synonym of:',
    // profile overlay
    whoPracticing: "Who's practicing?",
    noProfiles: 'No profiles yet — create one below.',
    // dashboard
    itemsPracticed: 'Items practiced', mastered: 'Mastered', streakLabel: 'Streak',
    lastPractice: 'Last practice', dueForReview: 'Due for review',
    byCategory: 'BY CATEGORY', personalBests: 'PERSONAL BESTS',
    resetProgress: 'Reset all progress',
    days: 'days', day: 'day',
    // misc
    notAMatch: 'Not a match — try again!',
    verbLabel: 'Verb:',
    tenseLabel: 'Tense:',
    welcomePrompt: 'What would you like to practice?',
    // about
    aboutTitle: 'About Pratique française',
    aboutText: 'Pratique française is a practice tool, not a learning app. It is designed for people who are already learning French through lessons, a course, or a teacher. The purpose is to drill and reinforce what you already know through regular, focused practice. The app uses spaced repetition to show you the words and concepts you find most difficult, most often. All your practice data is stored locally on your device only. Nothing is sent to any server. No personal data is collected or shared.',
    // tenses
    tensePresent: 'Présent', tensePerfect: 'Passé composé', tenseImperfect: 'Imparfait', tenseFuture: 'Futur', tenseConditional: 'Conditionnel',
    // difficulty
    easy: 'Easy', hard: 'Hard',
    // mode progress breakdown
    modeVocab: 'Vocabulary', modeConjugation: 'Conjugation', modeGender: 'Gender', modeWordrel: 'Word Relationships', modePhrases: 'Phrases', modeGrammar: 'Grammar',
    byTense: 'BY TENSE', byGrammarCategory: 'BY CATEGORY',
    progressByMode: 'PROGRESS BY MODE',
    lastPracticeLabel: 'Last practice',
    neverPracticed: 'Never',
    todayLabel: 'Today',
    yesterdayLabel: 'Yesterday',
    noSubcatsBelow25: 'All categories above 25% — great work!',
    // focus recommendation
    focusTitle: 'Focus here next',
    focusNotStartedMode: "You haven't started {0} yet — give it a try",
    focusNotStartedSubcat: "You haven't started {0} yet — try {1} with {0} selected",
    focusWeakSubcat: 'Your weakest area is {0} in {1} — try {1} with {0} selected',
    focusAllGood: 'Great progress! Keep practicing to maintain your knowledge.',
    // mode help text
    helpVocab: 'Match each French word to its translation. Click a word on the left, then click its match on the right. Correct pairs turn green.',
    helpGender: 'Decide if the French noun is masculine (LE) or feminine (LA). Click the correct button. The translation is shown below the word for reference.',
    helpWordrel: 'Find the related word. Select the antonym (opposite) or synonym (similar meaning) of the French word shown.',
    helpConjugation: 'Match each pronoun to its correct verb form. Click a pronoun on the left, then its matching conjugation on the right.',
    helpGrammar: 'Choose the correct French answer. An explanation is shown after each answer to help you understand the rule.',
    helpPhrases: 'Choose the correct translation for the French phrase shown. Focus on meaning, not word-for-word translation.',
    helpLearn: 'Watch each word pair carefully. After 5 pairs you will be asked to match them from memory.',
  },
  nl: {
    langEN: 'English', langNL: 'Nederlands', langDE: 'Deutsch', langFR: 'Français',
    vocab: 'Woordenschat', gender: 'Geslacht', conjugation: 'Vervoeging',
    phrases: 'Zinnen', grammar: 'Grammatica', wordrel: 'Woordverhoudingen',
    groupWords: 'Woorden', groupVerbs: 'Werkwoorden', groupLanguage: 'Taal',
    beginner: 'Basis', elementary: 'Essentieel', intermediate: 'Gemiddeld',
    advanced: 'Gevorderd', expert: 'Vaardig', mastery: 'Meesterschap',
    topicAll: 'Alle', everyday: 'Dagelijks', food: 'Eten', family: 'Familie',
    travel: 'Reizen', work: 'Werk', nature: 'Natuur', body: 'Lichaam',
    school: 'School', shopping: 'Winkelen', animals: 'Dieren', home: 'Thuis',
    francais: 'FRANÇAIS', nativeLang: 'NEDERLANDS',
    pronoun: 'VOORNAAMWOORD',
    instrVocab: 'Koppel elk Frans woord aan de juiste vertaling.',
    instrGender: 'Is het zelfstandig naamwoord mannelijk (LE) of vrouwelijk (LA)?',
    instrConjugation: 'Koppel elk voornaamwoord aan de juiste werkwoordsvorm.',
    instrPhrases: 'Kies de juiste vertaling voor elke zin.',
    instrGrammar: 'Kies het juiste antwoord.',
    instrWordrel: 'Selecteer het woord dat verwant is aan het getoonde woord.',
    nextRound: 'Volgende ronde →', nextItem: 'Volgende →', seeResults: 'Resultaten bekijken →',
    progress: 'Voortgang', addProfile: 'Toevoegen', about: 'Over',
    difficultyLevel: 'Moeilijkheid:', difficulty: 'Moeilijkheid',
    scorePerfect: 'Perfect!', scoreExcellent: 'Uitstekend!',
    scoreGood: 'Goed gedaan!', scoreKeepPractising: 'Blijf oefenen!',
    wrAll: 'Alle', wrAntonyms: 'Antoniemen', wrSynonyms: 'Synoniemen',
    antonymLabel: 'antoniem', synonymLabel: 'synoniem',
    findAntonym: 'Antoniem van:', findSynonym: 'Synoniem van:',
    whoPracticing: 'Wie oefent er?',
    noProfiles: 'Nog geen profielen — maak er een aan.',
    itemsPracticed: 'Items geoefend', mastered: 'Beheerst', streakLabel: 'Reeks',
    lastPractice: 'Laatst geoefend', dueForReview: 'Klaar voor herhaling',
    byCategory: 'PER CATEGORIE', personalBests: 'PERSOONLIJKE RECORDS',
    resetProgress: 'Reset alle voortgang',
    days: 'dagen', day: 'dag',
    notAMatch: 'Geen overeenkomst — probeer opnieuw!',
    verbLabel: 'Werkwoord:',
    tenseLabel: 'Tijd:',
    welcomePrompt: 'Wat wil je oefenen?',
    aboutTitle: 'Over Pratique française',
    aboutText: 'Pratique française is een oefentool, geen leerapp. Bedoeld voor mensen die al Frans leren via lessen, een cursus of een docent. Het doel is om te oefenen en te versterken wat je al weet. De app gebruikt spaced repetition om de moeilijkste woorden vaker te tonen. Al je oefengegevens worden alleen lokaal op je apparaat opgeslagen. Er wordt niets naar een server verzonden. Er worden geen persoonlijke gegevens verzameld of gedeeld.',
    // tenses
    tensePresent: 'Présent', tensePerfect: 'Passé composé', tenseImperfect: 'Imparfait', tenseFuture: 'Futur', tenseConditional: 'Conditionnel',
    // difficulty
    easy: 'Makkelijk', hard: 'Moeilijk',
    // mode progress breakdown
    modeVocab: 'Woordenschat', modeConjugation: 'Vervoeging', modeGender: 'Geslacht', modeWordrel: 'Woordverhoudingen', modePhrases: 'Zinnen', modeGrammar: 'Grammatica',
    byTense: 'PER TIJD', byGrammarCategory: 'PER CATEGORIE',
    progressByMode: 'VOORTGANG PER MODUS',
    lastPracticeLabel: 'Laatste oefening',
    neverPracticed: 'Nooit',
    todayLabel: 'Vandaag',
    yesterdayLabel: 'Gisteren',
    noSubcatsBelow25: 'Alle categorieën boven 25% — goed bezig!',
    // focus recommendation
    focusTitle: 'Hier als volgende oefenen',
    focusNotStartedMode: 'Je bent nog niet begonnen met {0} — probeer het eens',
    focusNotStartedSubcat: 'Je bent nog niet begonnen met {0} — probeer {1} met {0} geselecteerd',
    focusWeakSubcat: 'Jouw zwakste punt is {0} in {1} — probeer {1} met {0} geselecteerd',
    focusAllGood: 'Goed bezig! Blijf oefenen om je kennis bij te houden.',
    // mode help text
    helpVocab: 'Koppel elk Frans woord aan de juiste vertaling. Klik een woord links, dan de bijbehorende vertaling rechts.',
    helpGender: 'Bepaal of het Franse zelfstandig naamwoord mannelijk (LE) of vrouwelijk (LA) is.',
    helpWordrel: 'Zoek het verwante woord. Selecteer het antoniem of synoniem van het getoonde Franse woord.',
    helpConjugation: 'Koppel elk voornaamwoord aan de juiste werkwoordsvorm.',
    helpGrammar: 'Kies het juiste Franse antwoord. Na elk antwoord verschijnt een uitleg.',
    helpPhrases: 'Kies de juiste vertaling van de getoonde Franse zin.',
    helpLearn: 'Bekijk elk woordpaar goed. Na 5 paren word je gevraagd ze uit je geheugen te koppelen.',
  },
  de: {
    langEN: 'English', langNL: 'Nederlands', langDE: 'Deutsch', langFR: 'Français',
    vocab: 'Wortschatz', gender: 'Geschlecht', conjugation: 'Konjugation',
    phrases: 'Phrasen', grammar: 'Grammatik', wordrel: 'Wortbeziehungen',
    groupWords: 'Wörter', groupVerbs: 'Verben', groupLanguage: 'Sprache',
    beginner: 'Grundlagen', elementary: 'Wesentlich', intermediate: 'Mittelstufe',
    advanced: 'Fortgeschritten', expert: 'Kompetent', mastery: 'Meisterschaft',
    topicAll: 'Alle', everyday: 'Alltag', food: 'Essen', family: 'Familie',
    travel: 'Reisen', work: 'Arbeit', nature: 'Natur', body: 'Körper',
    school: 'Schule', shopping: 'Einkaufen', animals: 'Tiere', home: 'Zuhause',
    francais: 'FRANÇAIS', nativeLang: 'DEUTSCH',
    pronoun: 'PRONOMEN',
    instrVocab: 'Ordne jedes französische Wort der richtigen Übersetzung zu.',
    instrGender: 'Ist das Nomen männlich (LE) oder weiblich (LA)?',
    instrConjugation: 'Ordne jedes Pronomen der richtigen Verbform zu.',
    instrPhrases: 'Wähle die richtige Übersetzung für jeden Satz.',
    instrGrammar: 'Wähle die richtige Antwort.',
    instrWordrel: 'Wähle das Wort, das mit dem gezeigten Wort verwandt ist.',
    nextRound: 'Nächste Runde →', nextItem: 'Weiter →', seeResults: 'Ergebnisse →',
    progress: 'Fortschritt', addProfile: 'Hinzufügen', about: 'Über',
    difficultyLevel: 'Schwierigkeit:', difficulty: 'Schwierigkeit',
    scorePerfect: 'Perfekt!', scoreExcellent: 'Ausgezeichnet!',
    scoreGood: 'Gut gemacht!', scoreKeepPractising: 'Weiter üben!',
    wrAll: 'Alle', wrAntonyms: 'Antonyme', wrSynonyms: 'Synonyme',
    antonymLabel: 'Antonym', synonymLabel: 'Synonym',
    findAntonym: 'Antonym von:', findSynonym: 'Synonym von:',
    whoPracticing: 'Wer übt?',
    noProfiles: 'Noch keine Profile — erstelle eines.',
    itemsPracticed: 'Geübte Einheiten', mastered: 'Gemeistert', streakLabel: 'Serie',
    lastPractice: 'Zuletzt geübt', dueForReview: 'Zur Wiederholung fällig',
    byCategory: 'NACH KATEGORIE', personalBests: 'PERSÖNLICHE BESTLEISTUNGEN',
    resetProgress: 'Alle Fortschritte zurücksetzen',
    days: 'Tage', day: 'Tag',
    notAMatch: 'Keine Übereinstimmung — versuche es erneut!',
    verbLabel: 'Verb:',
    tenseLabel: 'Tempus:',
    welcomePrompt: 'Was möchtest du üben?',
    aboutTitle: 'Über Pratique française',
    aboutText: 'Pratique française ist ein Übungswerkzeug, keine Lern-App. Es ist für Menschen gedacht, die bereits durch Unterricht, einen Kurs oder einen Lehrer Französisch lernen. Der Zweck ist es, das Gelernte durch regelmäßiges Üben zu festigen. Die App verwendet Spaced Repetition, um die schwierigsten Wörter häufiger zu zeigen. Alle deine Übungsdaten werden nur lokal auf deinem Gerät gespeichert. Es werden keine Daten an einen Server gesendet. Es werden keine persönlichen Daten gesammelt oder weitergegeben.',
    // tenses
    tensePresent: 'Présent', tensePerfect: 'Passé composé', tenseImperfect: 'Imparfait', tenseFuture: 'Futur', tenseConditional: 'Conditionnel',
    // difficulty
    easy: 'Einfach', hard: 'Schwierig',
    // mode progress breakdown
    modeVocab: 'Wortschatz', modeConjugation: 'Konjugation', modeGender: 'Geschlecht', modeWordrel: 'Wortbeziehungen', modePhrases: 'Phrasen', modeGrammar: 'Grammatik',
    byTense: 'NACH ZEIT', byGrammarCategory: 'NACH KATEGORIE',
    progressByMode: 'FORTSCHRITT NACH MODUS',
    lastPracticeLabel: 'Letzte Übung',
    neverPracticed: 'Nie',
    todayLabel: 'Heute',
    yesterdayLabel: 'Gestern',
    noSubcatsBelow25: 'Alle Kategorien über 25% — super!',
    // focus recommendation
    focusTitle: 'Als nächstes üben',
    focusNotStartedMode: 'Du hast {0} noch nicht begonnen — probiere es aus',
    focusNotStartedSubcat: 'Du hast {0} noch nicht begonnen — versuche {1} mit {0} ausgewählt',
    focusWeakSubcat: 'Dein schwächstes Gebiet ist {0} in {1} — versuche {1} mit {0} ausgewählt',
    focusAllGood: 'Toller Fortschritt! Weiter üben, um dein Wissen zu behalten.',
    // mode help text
    helpVocab: 'Ordne jedes französische Wort seiner Übersetzung zu. Klicke ein Wort links, dann die passende Übersetzung rechts.',
    helpGender: 'Entscheide ob das französische Substantiv männlich (LE) oder weiblich (LA) ist.',
    helpWordrel: 'Finde das verwandte Wort. Wähle das Antonym oder Synonym des gezeigten französischen Wortes.',
    helpConjugation: 'Ordne jedes Pronomen der richtigen Verbform zu.',
    helpGrammar: 'Wähle die richtige französische Antwort. Nach jeder Antwort erscheint eine Erklärung.',
    helpPhrases: 'Wähle die richtige Übersetzung für den gezeigten französischen Satz.',
    helpLearn: 'Beobachte jedes Wortpaar genau. Nach 5 Paaren wirst du gebeten sie aus dem Gedächtnis zuzuordnen.',
  },
  fr: {
    langEN: 'English', langNL: 'Nederlands', langDE: 'Deutsch', langFR: 'Français',
    vocab: 'Vocabulaire', gender: 'Genre', conjugation: 'Conjugaison',
    phrases: 'Phrases', grammar: 'Grammaire', wordrel: 'Relations de mots',
    groupWords: 'Mots', groupVerbs: 'Verbes', groupLanguage: 'Langue',
    beginner: 'Fondation', elementary: 'Essentiel', intermediate: 'Intermédiaire',
    advanced: 'Avancé', expert: 'Maîtrise', mastery: 'Excellence',
    topicAll: 'Tous', everyday: 'Quotidien', food: 'Nourriture', family: 'Famille',
    travel: 'Voyage', work: 'Travail', nature: 'Nature', body: 'Corps',
    school: 'École', shopping: 'Shopping', animals: 'Animaux', home: 'Maison',
    francais: 'FRANÇAIS', nativeLang: 'ENGLISH',
    pronoun: 'PRONOM',
    instrVocab: 'Associe chaque mot français à sa traduction.',
    instrGender: 'Le nom est-il masculin (LE) ou féminin (LA) ?',
    instrConjugation: 'Associe chaque pronom à la forme correcte du verbe.',
    instrPhrases: 'Choisissez la traduction correcte pour chaque phrase.',
    instrGrammar: 'Choisissez la bonne réponse.',
    instrWordrel: 'Sélectionnez le mot lié au mot affiché.',
    nextRound: 'Prochain tour →', nextItem: 'Suivant →', seeResults: 'Voir résultats →',
    progress: 'Progrès', addProfile: 'Ajouter', about: 'À propos',
    difficultyLevel: 'Difficulté :', difficulty: 'Difficulté',
    scorePerfect: 'Parfait !', scoreExcellent: 'Excellent !',
    scoreGood: 'Bravo !', scoreKeepPractising: 'Continuez à pratiquer !',
    wrAll: 'Tous', wrAntonyms: 'Antonymes', wrSynonyms: 'Synonymes',
    antonymLabel: 'antonyme', synonymLabel: 'synonyme',
    findAntonym: 'Antonyme de :', findSynonym: 'Synonyme de :',
    whoPracticing: 'Qui pratique ?',
    noProfiles: 'Pas encore de profils — créez-en un.',
    itemsPracticed: 'Éléments pratiqués', mastered: 'Maîtrisé', streakLabel: 'Série',
    lastPractice: 'Dernière pratique', dueForReview: 'À réviser',
    byCategory: 'PAR CATÉGORIE', personalBests: 'MEILLEURS RÉSULTATS',
    resetProgress: 'Réinitialiser toute progression',
    days: 'jours', day: 'jour',
    notAMatch: 'Pas une correspondance — réessayez !',
    verbLabel: 'Verbe :',
    tenseLabel: 'Temps :',
    welcomePrompt: 'Que veux-tu pratiquer ?',
    aboutTitle: 'À propos de Pratique française',
    aboutText: 'Pratique française est un outil d\'entraînement, pas une application d\'apprentissage. Elle est conçue pour les personnes qui apprennent déjà le français par des cours, un cursus ou un professeur. L\'objectif est de pratiquer et renforcer ce que vous savez déjà. L\'application utilise la répétition espacée pour vous montrer les mots les plus difficiles plus souvent. Toutes vos données de pratique sont stockées uniquement sur votre appareil. Rien n\'est envoyé à un serveur. Aucune donnée personnelle n\'est collectée ou partagée.',
    // tenses
    tensePresent: 'Présent', tensePerfect: 'Passé composé', tenseImperfect: 'Imparfait', tenseFuture: 'Futur', tenseConditional: 'Conditionnel',
    // difficulty
    easy: 'Facile', hard: 'Difficile',
    // mode progress breakdown
    modeVocab: 'Vocabulaire', modeConjugation: 'Conjugaison', modeGender: 'Genre', modeWordrel: 'Relations de mots', modePhrases: 'Phrases', modeGrammar: 'Grammaire',
    byTense: 'PAR TEMPS', byGrammarCategory: 'PAR CATÉGORIE',
    progressByMode: 'PROGRÈS PAR MODE',
    lastPracticeLabel: 'Dernière pratique',
    neverPracticed: 'Jamais',
    todayLabel: "Aujourd'hui",
    yesterdayLabel: 'Hier',
    noSubcatsBelow25: 'Toutes les catégories au-dessus de 25% — bravo !',
    // focus recommendation
    focusTitle: 'À travailler ensuite',
    focusNotStartedMode: 'Tu n\'as pas encore commencé {0} — essaie-le',
    focusNotStartedSubcat: 'Tu n\'as pas encore commencé {0} — essaie {1} avec {0} sélectionné',
    focusWeakSubcat: 'Ton point faible est {0} dans {1} — essaie {1} avec {0} sélectionné',
    focusAllGood: 'Bon travail ! Continue à pratiquer pour maintenir tes connaissances.',
    // mode help text
    helpVocab: 'Associe chaque mot français à sa traduction. Clique un mot à gauche, puis sa correspondance à droite.',
    helpGender: 'Décide si le nom français est masculin (LE) ou féminin (LA).',
    helpWordrel: 'Trouve le mot lié. Sélectionne l\'antonyme ou le synonyme du mot français affiché.',
    helpConjugation: 'Associe chaque pronom à la forme verbale correcte.',
    helpGrammar: 'Choisis la bonne réponse française. Une explication apparaît après chaque réponse.',
    helpPhrases: 'Choisis la bonne traduction pour la phrase française affichée.',
    helpLearn: 'Observe chaque paire de mots attentivement. Après 5 paires tu devras les associer de mémoire.',
  },
};

function T(key) {
  return (TRANSLATIONS[currentLang] || TRANSLATIONS.en)[key] || TRANSLATIONS.en[key] || key;
}

// ── Language ───────────────────────────────────────────────────────────────────
let currentLang = 'en';

// UI language and practice content language are separate concepts.
// When UI is set to Français (fr), content still uses English on the native side —
// the user has chosen a French interface but is practising French ↔ English.
function contentLang() {
  return currentLang === 'fr' ? 'en' : currentLang;
}

function getTranslation(item) {
  const lang = contentLang();
  return item[lang] || item.en || '';
}

// ── Direction ──────────────────────────────────────────────────────────────────
// 'fr-native' = show French, guess native | 'native-fr' = show native, guess French
// Direction only applies to Vocabulary mode. Phrases is always FR → native.
let direction = 'fr-native';

function toggleDirection() {
  direction = direction === 'fr-native' ? 'native-fr' : 'fr-native';
  const s = loadSettings();
  s.direction = direction;
  saveSettings(s);
  updateDirectionBtn();
  sessionCorrectIds = new Set();
  sessionWrongQueue = [];
  startRound();
}

function updateDirectionBtn() {
  const native = contentLang().toUpperCase();
  const btn = document.getElementById('direction-btn');
  if (btn) {
    btn.textContent = direction === 'fr-native' ? 'FR → ' + native : native + ' → FR';
  }
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
  document.getElementById('profile-title').textContent = T('whoPracticing');
  document.getElementById('add-profile-btn').textContent = T('addProfile');
  if (profiles.length === 0) {
    list.innerHTML = '<p class="profile-empty">' + T('noProfiles') + '</p>';
  } else {
    list.innerHTML = profiles.map(p => {
      const n = JSON.stringify(p.name);
      const delBtn = profiles.length > 1
        ? '<button onclick=\'deleteProfile(' + n + ')\' style="background:none;border:none;color:#c0392b;font-size:14px;cursor:pointer;padding:0 4px;margin-left:8px;flex-shrink:0;" title="Delete profile">&#x1F5D1;</button>'
        : '';
      return '<div style="display:flex;align-items:center;width:100%;">'
        + '<button class="profile-item-btn" style="flex:1;" onclick=\'selectProfile(' + n + ')\'>' + p.name + '</button>'
        + delBtn
        + '</div>';
    }).join('');
  }
  document.getElementById('add-profile-row').style.display = profiles.length < 4 ? 'flex' : 'none';
  const closeBtn = document.getElementById('profile-close-btn');
  if (closeBtn) closeBtn.style.display = currentProfile ? 'inline' : 'none';
}

function deleteProfile(name) {
  if (!confirm('Delete profile "' + name + '" and all their progress? This cannot be undone.')) return;
  profiles = loadProfiles().filter(p => p.name !== name);
  saveProfiles(profiles);
  ['progress', 'settings', 'streak', 'bests', 'practicelog'].forEach(k => {
    try { localStorage.removeItem('frenchPractice_' + name + '_' + k); } catch {}
  });
  if (currentProfile === name) {
    currentProfile = null;
    showProfileOverlay();
  } else {
    renderProfileScreen();
  }
}

function showProfileOverlay() {
  renderProfileScreen();
  document.getElementById('profile-overlay').classList.remove('hidden');
}

function closeProfileOverlay() {
  if (currentProfile) document.getElementById('profile-overlay').classList.add('hidden');
}

function selectProfile(name) {
  currentProfile = name;
  document.getElementById('profile-overlay').classList.add('hidden');
  document.getElementById('profile-name-display').textContent = name;
  sessionCorrectIds = new Set();
  sessionWrongQueue = [];
  applyProfileSettings();
  updateStreak();
  applyModeUI();
  applyTranslations();
  showWelcomeScreen();
}

function applyProfileSettings() {
  const s = loadSettings();
  soundOn = s.sound !== false;
  currentLang = s.lang || 'en';
  direction = s.direction || 'fr-native';
  const btn = document.getElementById('sound-btn');
  btn.textContent = soundOn ? '🔊' : '🔇';
  btn.classList.toggle('active', soundOn);
  document.getElementById('lang-select').value = currentLang;
  updateDirectionBtn();
}

// ── Welcome Screen ─────────────────────────────────────────────────────────────
function showWelcomeScreen() {
  const p = loadProgress();
  const ids = Object.keys(p);
  const today = new Date().toISOString().split('T')[0];
  const due = ids.filter(id => p[id].nextReview <= today).length;
  
  document.getElementById('welcome-name').textContent = currentProfile + "'s Dashboard";
  
  // Show progress summary
  const progressHtml = due > 0
    ? `<div class="welcome-stat"><strong>${due}</strong> items due for review today</div>`
    : `<div class="welcome-stat">Great job! No reviews due today.</div>`;
  
  document.getElementById('welcome-progress').innerHTML = progressHtml;
  
  // Update mode button labels based on current language
  const modeNames = {
    vocab: T('vocab'), gender: T('gender'), wordrel: T('wordrel'),
    conjugation: T('conjugation'), phrases: T('phrases'), grammar: T('grammar')
  };
  document.querySelectorAll('.welcome-mode-btn').forEach(btn => {
    const mode = btn.getAttribute('onclick').match(/'(\w+)'/)[1];
    btn.textContent = modeNames[mode] || mode;
  });
  
  document.getElementById('welcome-overlay').classList.remove('hidden');
}

function closeWelcomeScreen() {
  document.getElementById('welcome-overlay').classList.add('hidden');
}

function startFromWelcome(selectedMode) {
  mode = selectedMode;
  // Reset session for new mode
  sessionCorrectIds = new Set();
  sessionWrongQueue = [];
  if (selectedMode === 'conjugation') conjugationSessionVerbs = null;
  // Update active mode tab
  document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active'));
  document.querySelector(`.mode-tab[data-mode="${selectedMode}"]`).classList.add('active');
  applyModeUI();
  document.getElementById('welcome-overlay').classList.add('hidden');
  startRound();
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

// SM-2 update: intervals 1→3→7→14→factor-based
function sm2Update(id, correct) {
  if (!currentProfile) return;
  const p = loadProgress();
  const today = new Date().toISOString().split('T')[0];
  const entry = p[id] || { easeFactor: 2.5, interval: 1, repetitions: 0, nextReview: today };
  if (correct) {
    entry.repetitions++;
    if      (entry.repetitions === 1) entry.interval = 1;
    else if (entry.repetitions === 2) entry.interval = 3;
    else if (entry.repetitions === 3) entry.interval = 7;
    else if (entry.repetitions === 4) entry.interval = 14;
    else entry.interval = Math.round(entry.interval * entry.easeFactor);
    entry.easeFactor = Math.max(1.3, (entry.easeFactor || 2.5) + 0.1);
  } else {
    entry.repetitions = 0;
    entry.interval = 1;
    entry.easeFactor = Math.max(1.3, (entry.easeFactor || 2.5) - 0.2);
  }
  const next = new Date(Date.now() + entry.interval * 86400000);
  entry.nextReview = next.toISOString().split('T')[0];
  entry.lastSeen   = today;
  p[id] = entry;
  saveProgress(p);
}

// ── Practice log (heatmap data) ────────────────────────────────────────────────
function loadPracticeLog() {
  if (!currentProfile) return {};
  try { return JSON.parse(localStorage.getItem(profileKey('practicelog')) || '{}'); } catch { return {}; }
}
function savePracticeLog(log) {
  if (!currentProfile) return;
  try { localStorage.setItem(profileKey('practicelog'), JSON.stringify(log)); } catch {}
}
function logPractice() {
  const today = new Date().toISOString().split('T')[0];
  const log = loadPracticeLog();
  log[today] = (log[today] || 0) + 1;
  savePracticeLog(log);
}

// ── Personal bests (per mode) ─────────────────────────────────────────────────
function loadBests() {
  if (!currentProfile) return {};
  try { return JSON.parse(localStorage.getItem(profileKey('bests')) || '{}'); } catch { return {}; }
}
function saveBests(b) {
  if (!currentProfile) return;
  try { localStorage.setItem(profileKey('bests'), JSON.stringify(b)); } catch {}
}
function updateBest(m, score, total) {
  if (!currentProfile) return;
  const bests = loadBests();
  const pct = total > 0 ? score / total : 0;
  if (!bests[m] || pct > bests[m].pct) {
    bests[m] = { score, total, pct };
  }
  saveBests(bests);
}

// ── Session SM-2 tracking ──────────────────────────────────────────────────────
let sessionCorrectIds = new Set();
let sessionWrongQueue = [];

// ── Grammar category labels (translated) ──────────────────────────────────────
const GRAMMAR_CAT_LABELS = {
  en: {
    agreement:      'Agreement',
    archaic:        'Archaic',
    articles:       'Articles',
    concessive:     'Concessive',
    conditional:    'Conditional',
    gerund:         'Gerund',
    hypothetical:   'Hypothetical',
    indirect_speech:'Indirect Speech',
    infinitive:     'Infinitive',
    literary:       'Literary',
    modal:          'Modal Verbs',
    negation:       'Negation',
    passive:        'Passive Voice',
    past_tense:     'Past Tense',
    pluralization:  'Pluralization',
    possessive:     'Possessive',
    prepositions:   'Prepositions',
    pronouns:       'Pronouns',
    register:       'Register',
    relative:       'Relative Clauses',
    style:          'Style',
    subjunctive:    'Subjunctive',
  },
  nl: {
    agreement:      'Congruentie',
    archaic:        'Archaïsch',
    articles:       'Lidwoorden',
    concessive:     'Concessief',
    conditional:    'Conditioneel',
    gerund:         'Gerundium',
    hypothetical:   'Hypothetisch',
    indirect_speech:'Indirecte rede',
    infinitive:     'Infinitief',
    literary:       'Literair',
    modal:          'Modale werkwoorden',
    negation:       'Ontkenning',
    passive:        'Lijdende vorm',
    past_tense:     'Verleden tijd',
    pluralization:  'Meervoud',
    possessive:     'Bezittelijk',
    prepositions:   'Voorzetsels',
    pronouns:       'Voornaamwoorden',
    register:       'Register',
    relative:       'Betrekkelijke bijzinnen',
    style:          'Stijl',
    subjunctive:    'Aanvoegende wijs',
  },
  de: {
    agreement:      'Kongruenz',
    archaic:        'Veraltet',
    articles:       'Artikel',
    concessive:     'Konzessiv',
    conditional:    'Konditional',
    gerund:         'Gerundium',
    hypothetical:   'Hypothetisch',
    indirect_speech:'Indirekte Rede',
    infinitive:     'Infinitiv',
    literary:       'Literarisch',
    modal:          'Modalverben',
    negation:       'Verneinung',
    passive:        'Passiv',
    past_tense:     'Vergangenheit',
    pluralization:  'Pluralbildung',
    possessive:     'Possessiv',
    prepositions:   'Präpositionen',
    pronouns:       'Pronomen',
    register:       'Register',
    relative:       'Relativsätze',
    style:          'Stil',
    subjunctive:    'Konjunktiv',
  },
  fr: {
    agreement:      'Accord',
    archaic:        'Archaïque',
    articles:       'Articles',
    concessive:     'Concessif',
    conditional:    'Conditionnel',
    gerund:         'Gérondif',
    hypothetical:   'Hypothétique',
    indirect_speech:'Discours indirect',
    infinitive:     'Infinitif',
    literary:       'Littéraire',
    modal:          'Verbes modaux',
    negation:       'Négation',
    passive:        'Voix passive',
    past_tense:     'Temps du passé',
    pluralization:  'Pluralisation',
    possessive:     'Possessif',
    prepositions:   'Prépositions',
    pronouns:       'Pronoms',
    register:       'Registre',
    relative:       'Propositions relatives',
    style:          'Style',
    subjunctive:    'Subjonctif',
  },
};

function grammarCatLabel(cat) {
  const map = GRAMMAR_CAT_LABELS[currentLang] || GRAMMAR_CAT_LABELS.en;
  return map[cat] || (GRAMMAR_CAT_LABELS.en[cat]) || cat;
}

// ── Topic mapping ──────────────────────────────────────────────────────────────
const TOPIC_MAP = {
  all: null,
  everyday: ['daily','greetings','time','directions','social'],
  food:     ['food','cooking','dining','drinks'],
  family:   ['family','relationships','people'],
  travel:   ['travel','transport','transportation','locations','places'],
  work:     ['work','business','occupations','professional'],
  nature:   ['nature','weather','geography','environment'],
  body:     ['body','health','medical','medicine'],
  school:   ['school','education'],
  shopping: ['shopping','clothing','colors'],
  animals:  ['animals'],
  home:     ['house','household','housing'],
};

// ── Level mix ──────────────────────────────────────────────────────────────────
const LEVEL_MIX = {
  A1: [{ level: 'A1', weight: 1.0 }],
  A2: [{ level: 'A2', weight: 0.7 },  { level: 'A1', weight: 0.3 }],
  B1: [{ level: 'B1', weight: 0.6 },  { level: 'A2', weight: 0.25 }, { level: 'A1', weight: 0.15 }],
  B2: [{ level: 'B2', weight: 0.5 },  { level: 'B1', weight: 0.25 }, { level: 'A2', weight: 0.15 }, { level: 'A1', weight: 0.1 }],
  C1: [{ level: 'C1', weight: 0.4 },  { level: 'B2', weight: 0.25 }, { level: 'B1', weight: 0.2 },  { level: 'A2', weight: 0.1 }, { level: 'A1', weight: 0.05 }],
  C2: [{ level: 'C2', weight: 0.5 },  { level: 'C1', weight: 0.3 }, { level: 'B2', weight: 0.2 }],
};

// ── Tense progression by level ─────────────────────────────────────────────────
const TENSE_BY_LEVEL = {
  A1: ['present'],
  A2: ['present', 'passé composé'],
  B1: ['present', 'passé composé', 'imparfait'],
  B2: ['present', 'passé composé', 'imparfait', 'futur'],
  C1: ['present', 'passé composé', 'imparfait', 'futur', 'conditionnel'],
  C2: ['present', 'passé composé', 'imparfait', 'futur', 'conditionnel'],
};

// ── State ──────────────────────────────────────────────────────────────────────
const ROUND_SIZE = 10;
let mode          = 'vocab';
let level         = 'A1';
let topic         = 'all';
let wordRelFilter = 'all';
let grammarCategory = 'all';
let currentVerb   = 'être';
let currentTense  = 'all';  // 'all' or specific tense: 'present', 'passé composé', 'imparfait', 'futur', 'conditionnel'
let currentDifficulty = 'all';  // 'all', 'easy' (regular), or 'hard' (irregular)
let conjugationSessionVerbs = null; // null = first round; array = queued verbs for auto-advance

let pairs   = [];
let matched = [];
let wrongTimer = null;
let selSide = null;
let selIdx  = null;
let leftItems  = [];
let rightItems = [];

let roundMistakes = 0;
let roundResults  = []; // { left, right, correct }

let soundOn = true;

// ── Utility ────────────────────────────────────────────────────────────────────
function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }

function getItemLevel(item) { return item.level || item.cefr || 'A1'; }

function sm2Priority(id, progress, today) {
  const e = progress[id];
  if (!e) return 1;               // unseen
  if (e.nextReview <= today) return 0;  // due
  return 2;                       // not yet due
}

// Pick words using level-mix proportions + SM-2 priority sort
function pickWordsMixed(fullPool, count, excludeSet, applyTopicFilter) {
  const progress = loadProgress();
  const today    = new Date().toISOString().split('T')[0];
  const mix      = LEVEL_MIX[level] || [{ level, weight: 1.0 }];

  const tiers = mix.map(({ level: lvl, weight }) => ({
    lvl,
    target: Math.round(count * weight),
  }));
  const rawTotal = tiers.reduce((s, t) => s + t.target, 0);
  if (rawTotal !== count) tiers[0].target += (count - rawTotal);

  const result = [];
  const used   = new Set(excludeSet);
  const cats   = (applyTopicFilter && topic !== 'all') ? TOPIC_MAP[topic] : null;

  for (const { lvl, target } of tiers) {
    if (target <= 0) continue;
    let pool = fullPool.filter(w => getItemLevel(w) === lvl && !used.has(w.id));
    if (cats) pool = pool.filter(w => cats.includes(w.category));
    pool.sort((a, b) => {
      const diff = sm2Priority(a.id, progress, today) - sm2Priority(b.id, progress, today);
      return diff !== 0 ? diff : (Math.random() - 0.5);
    });
    const picked = pool.slice(0, target);
    picked.forEach(w => used.add(w.id));
    result.push(...picked);
  }

  if (result.length < count) {
    let fallback = fullPool.filter(w => !used.has(w.id));
    if (cats) fallback = fallback.filter(w => cats.includes(w.category));
    fallback.sort(() => Math.random() - 0.5);
    result.push(...fallback.slice(0, count - result.length));
  }

  return shuffle(result).slice(0, count);
}

function getWrongQueueFromPool(pool) {
  const poolIds = new Set(pool.map(w => w.id));
  return sessionWrongQueue.filter(w => poolIds.has(w.id) && !sessionCorrectIds.has(w.id));
}

function resetSessionIfExhausted(pool) {
  const available = pool.filter(w => !sessionCorrectIds.has(w.id));
  if (available.length < ROUND_SIZE) {
    sessionCorrectIds = new Set();
    sessionWrongQueue = [];
  }
}

// Fixed pronoun order for conjugation left column
const PRONOUN_ORDER = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];

// ── Conjugation session verb queue ─────────────────────────────────────────────
// Builds a shuffled queue of verb names (excluding currentVerb) for auto-advance.
// Called when entering conjugation mode or after user manually changes verb/difficulty.
function initConjugationSessionVerbs() {
  let availableVerbs = VERBS;
  if (currentDifficulty === 'easy') {
    availableVerbs = VERBS.filter(v => v.type && v.type !== 'irregular');
  } else if (currentDifficulty === 'hard') {
    availableVerbs = VERBS.filter(v => v.type === 'irregular');
  }
  const verbNames = availableVerbs.map(v => v.verb).filter(v => v !== currentVerb);
  conjugationSessionVerbs = shuffle(verbNames);
}

// ── Build pairs ────────────────────────────────────────────────────────────────
function buildPairs() {
  if (mode === 'vocab') {
    resetSessionIfExhausted(VOCAB);
    const wrongItems = getWrongQueueFromPool(VOCAB).slice(0, ROUND_SIZE);
    const wrongIds   = new Set(wrongItems.map(w => w.id));
    const fresh      = pickWordsMixed(VOCAB, ROUND_SIZE - wrongItems.length,
                         new Set([...sessionCorrectIds, ...wrongIds]), true);
    const words = shuffle([...wrongItems, ...fresh]).slice(0, ROUND_SIZE);
    if (direction === 'fr-native') {
      return words.map(w => ({ left: w.fr, right: getTranslation(w), id: w.id, item: w, frWord: w.fr }));
    } else {
      return words.map(w => ({ left: getTranslation(w), right: w.fr, id: w.id, item: w, frWord: w.fr }));
    }
  }

  if (mode === 'conjugation') {
    // Auto-advance verb each round via session queue
    if (conjugationSessionVerbs === null) {
      // First round: use currentVerb, then initialise queue for subsequent rounds
      initConjugationSessionVerbs();
    } else {
      // Subsequent rounds: pick next verb from shuffled queue
      if (conjugationSessionVerbs.length === 0) {
        initConjugationSessionVerbs();
      }
      if (conjugationSessionVerbs.length > 0) {
        currentVerb = conjugationSessionVerbs.shift();
        const sel = document.getElementById('verb-select');
        if (sel) sel.value = currentVerb;
      }
    }

    // Ensure currentVerb is valid for the current difficulty filter
    let availableVerbs = VERBS;
    if (currentDifficulty === 'easy') {
      availableVerbs = VERBS.filter(v => v.type && v.type !== 'irregular');
    } else if (currentDifficulty === 'hard') {
      availableVerbs = VERBS.filter(v => v.type === 'irregular');
    }
    const availableVerbNames = new Set(availableVerbs.map(v => v.verb));
    if (!availableVerbNames.has(currentVerb)) {
      currentVerb = availableVerbs.length > 0 ? availableVerbs[0].verb : 'être';
      const sel = document.getElementById('verb-select');
      if (sel) sel.value = currentVerb;
    }

    const verbData = CONJ[currentVerb];
    if (!verbData) return buildFallbackPairs();

    let allowedTenses;
    if (currentTense === 'all') {
      allowedTenses = (TENSE_BY_LEVEL[level] || ['present']).filter(t => verbData[t]);
    } else {
      allowedTenses = verbData[currentTense] ? [currentTense] : [];
    }

    if (allowedTenses.length === 0) return buildFallbackPairs();
    const tense    = allowedTenses[Math.floor(Math.random() * allowedTenses.length)];
    const tenseData = verbData[tense];
    const subjects  = Object.keys(tenseData);
    const result = subjects.map(subj => ({
      left:  subj,
      right: tenseData[subj],
      id:    'conj_' + currentVerb + '_' + tense + '_' + subj,
      tense, verb: currentVerb,
    }));
    result.sort((a, b) => {
      const ia = PRONOUN_ORDER.indexOf(a.left);
      const ib = PRONOUN_ORDER.indexOf(b.left);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    return result;
  }

  return buildFallbackPairs();
}

function buildFallbackPairs() {
  const words = pickWordsMixed(VOCAB, ROUND_SIZE, new Set(sessionCorrectIds), true);
  if (direction === 'fr-native') {
    return words.map(w => ({ left: w.fr, right: getTranslation(w), id: w.id, item: w, frWord: w.fr }));
  } else {
    return words.map(w => ({ left: getTranslation(w), right: w.fr, id: w.id, item: w, frWord: w.fr }));
  }
}

// ── Column labels ──────────────────────────────────────────────────────────────
function updateColLabels() {
  const ll = document.getElementById('label-l');
  const lr = document.getElementById('label-r');
  if (mode === 'conjugation') {
    const tense = pairs[0]?.tense || '';
    const verb  = pairs[0]?.verb  || currentVerb;
    ll.textContent = T('pronoun');
    lr.textContent = (verb + (tense ? ' — ' + tense : '')).toUpperCase();
  } else {
    ll.textContent = direction === 'fr-native' ? T('francais') : T('nativeLang');
    lr.textContent = direction === 'fr-native' ? T('nativeLang') : T('francais');
  }
}

// ── Mode UI visibility ─────────────────────────────────────────────────────────
function applyModeUI() {
  document.getElementById('level-tabs').style.display =
    (mode === 'phrases' || mode === 'conjugation') ? 'none' : 'flex';
  document.getElementById('topic-row').style.display =
    (mode === 'vocab' || mode === 'gender') ? 'flex' : 'none';
  document.getElementById('wordrel-filter-row').style.display =
    mode === 'wordrel' ? 'flex' : 'none';
  document.getElementById('grammar-filter-row').style.display =
    mode === 'grammar' ? 'flex' : 'none';
  document.getElementById('verb-selector').style.display =
    mode === 'conjugation' ? 'flex' : 'none';
  document.getElementById('tense-selector').style.display =
    mode === 'conjugation' ? 'flex' : 'none';
  document.getElementById('direction-row').style.display = 'none';
  document.getElementById('difficulty-selector').style.display =
    mode === 'conjugation' ? 'flex' : 'none';

  const modeDescKeys = {
    vocab: 'instrVocab', gender: 'instrGender', conjugation: 'instrConjugation',
    phrases: 'instrPhrases', grammar: 'instrGrammar', wordrel: 'instrWordrel',
  };
  document.getElementById('mode-desc').textContent = T(modeDescKeys[mode] || 'instrVocab');
  updateDirectionBtn();
}

// ── startRound — main entry point ──────────────────────────────────────────────
function startRound() {
  if (!currentProfile) return;

  ensureHelpBtn();

  document.getElementById('round-end').style.display    = 'none';
  document.getElementById('col-labels').style.display   = 'none';
  document.getElementById('arena').style.display        = 'none';
  document.getElementById('fb').style.display           = 'none';
  document.getElementById('gender-card').style.display  = 'none';
  document.getElementById('phrases-card').style.display = 'none';
  document.getElementById('grammar-card').style.display = 'none';
  document.getElementById('wordrel-card').style.display = 'none';

  roundMistakes = 0;
  roundResults  = [];
  document.getElementById('prog').style.width = '0%';

  if (mode === 'gender') {
    document.getElementById('gender-card').style.display = 'flex';
    startGenderRound();
    return;
  }
  if (mode === 'phrases') {
    document.getElementById('phrases-card').style.display = 'flex';
    startPhrasesRound();
    return;
  }
  if (mode === 'grammar') {
    document.getElementById('grammar-card').style.display = 'flex';
    startGrammarRound();
    return;
  }
  if (mode === 'wordrel') {
    document.getElementById('wordrel-card').style.display = 'flex';
    startWordRelRound();
    return;
  }

  // vocab / conjugation — arena mode
  pairs   = buildPairs();
  matched = Array(pairs.length).fill(false);
  selSide = null; selIdx = null; wrongTimer = null;

  document.getElementById('fb').style.display       = '';
  document.getElementById('col-labels').style.display = '';
  document.getElementById('arena').style.display    = '';
  setFb('', '');
  updateColLabels();

  const count = pairs.length;
  const cols  = count <= 4 ? 1 : count <= 8 ? 2 : 3;
  leftItems  = pairs.map((_, i) => i);
  rightItems = shuffle(pairs.map((_, i) => i));

  const gl = document.getElementById('grid-l');
  const gr = document.getElementById('grid-r');
  gl.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  gr.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  gl.innerHTML = leftItems.map( (pi, slot) => cellHTML('l', slot, pi)).join('');
  gr.innerHTML = rightItems.map((pi, slot) => cellHTML('r', slot, pi)).join('');
}

function cellHTML(side, slot, pi) {
  const text = side === 'l' ? pairs[pi].left : pairs[pi].right;
  const m = matched[pi];
  return `<div class="cell${m ? ' matched' : ''}" id="c-${side}-${slot}" onclick="onCell('${side}',${slot},${pi})">${text}</div>`;
}

function getSlot(side, pi) {
  return (side === 'l' ? leftItems : rightItems).indexOf(pi);
}

// ── Gender mode — single word per turn ────────────────────────────────────────
let genderQueue   = []; // items to practice this round
let genderIndex   = 0;
let genderCorrect = 0;

function startGenderRound() {
  const genderPool = VOCAB.filter(w => w.type === 'noun' && (w.gender === 'M' || w.gender === 'F'));
  resetSessionIfExhausted(genderPool);
  const wrongItems = getWrongQueueFromPool(genderPool).slice(0, ROUND_SIZE);
  const wrongIds   = new Set(wrongItems.map(w => w.id));
  const fresh      = pickWordsMixed(genderPool, ROUND_SIZE - wrongItems.length,
                       new Set([...sessionCorrectIds, ...wrongIds]), true);
  genderQueue   = shuffle([...wrongItems, ...fresh]).slice(0, ROUND_SIZE);
  genderIndex   = 0;
  genderCorrect = 0;
  roundMistakes = 0;
  roundResults  = [];
  showCurrentGenderWord();
}

function showCurrentGenderWord() {
  const word = genderQueue[genderIndex];
  // Strip article prefix if present
  const bare = word.fr.replace(/^(le |la |les |l'|l')/i, '');
  document.getElementById('gender-word-display').textContent = bare;
  document.getElementById('gender-counter').textContent = (genderIndex + 1) + ' / ' + ROUND_SIZE;
  document.getElementById('gender-feedback').textContent = '';
  document.getElementById('gender-feedback').className = 'gender-feedback';

  // Show native translation below the French word
  let transEl = document.getElementById('gender-translation');
  if (!transEl) {
    transEl = document.createElement('div');
    transEl.id = 'gender-translation';
    transEl.style.fontSize = '14px';
    transEl.style.color = '#999';
    transEl.style.textAlign = 'center';
    document.getElementById('gender-word-display').insertAdjacentElement('afterend', transEl);
  }
  transEl.textContent = getTranslation(word);

  const leBtn = document.getElementById('btn-le');
  const laBtn = document.getElementById('btn-la');
  leBtn.disabled = false;
  laBtn.disabled = false;
  leBtn.className = 'gender-btn le-btn';
  laBtn.className = 'gender-btn la-btn';
}

function checkGender(gender) {
  const word   = genderQueue[genderIndex];
  const correct = word.gender === gender;
  const leBtn  = document.getElementById('btn-le');
  const laBtn  = document.getElementById('btn-la');

  leBtn.disabled = true;
  laBtn.disabled = true;

  if (correct) {
    (gender === 'M' ? leBtn : laBtn).classList.add('btn-correct');
    sessionCorrectIds.add(word.id);
    sm2Update(word.id, true);
    // Speak the full phrase with article: "le chat" or "la table"
    const article = word.gender === 'M' ? 'le' : 'la';
    const bare = word.fr.replace(/^(le |la |les |l'|l')/i, '');
    speak(article + ' ' + bare, true);  // French content
    genderCorrect++;
    const fb = document.getElementById('gender-feedback');
    fb.textContent = '✓ ' + word.fr + ' — ' + (gender === 'M' ? 'le (m)' : 'la (f)');
    fb.className = 'gender-feedback correct';
    roundResults.push({ left: word.fr + ' — ' + getTranslation(word), right: gender === 'M' ? 'le (m)' : 'la (f)', correct: true });
  } else {
    const correctGender = word.gender === 'M' ? 'M' : 'F';
    (gender === 'M' ? leBtn : laBtn).classList.add('btn-wrong');
    (correctGender === 'M' ? leBtn : laBtn).classList.add('btn-correct');
    sm2Update(word.id, false);
    roundMistakes++;
    if (!sessionWrongQueue.find(x => x.id === word.id)) sessionWrongQueue.push(word);
    const fb = document.getElementById('gender-feedback');
    fb.textContent = '✗ ' + word.fr + ' → ' + (word.gender === 'M' ? 'le (m)' : 'la (f)');
    fb.className = 'gender-feedback wrong';
    roundResults.push({ left: word.fr + ' — ' + getTranslation(word), right: word.gender === 'M' ? 'le (m)' : 'la (f)', correct: false });
  }

  const pct = Math.round((genderIndex + 1) / ROUND_SIZE * 100);
  document.getElementById('prog').style.width = pct + '%';

  setTimeout(() => {
    genderIndex++;
    if (genderIndex >= genderQueue.length) {
      document.getElementById('gender-card').style.display = 'none';
      showRoundEnd();
    } else {
      showCurrentGenderWord();
    }
  }, correct ? 700 : 1200);
}

// ── Match logic (vocab / conjugation) ─────────────────────────────────────────
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
    sessionCorrectIds.add(pairs[pi].id);
    sm2Update(pairs[pi].id, true);
    
    // Speak the correct conjugation: pronoun + verb form
    const textToSpeak = mode === 'conjugation' 
      ? pairs[pi].left + ' ' + pairs[pi].right
      : pairs[pi].frWord || pairs[pi].left;
    speak(textToSpeak, true);  // French content
    
    setFb('✓ ' + pairs[pi].left + ' → ' + pairs[pi].right, 'correct');
    roundResults.push({ left: pairs[pi].left, right: pairs[pi].right, correct: true });
    const pct = Math.round(matched.filter(Boolean).length / pairs.length * 100);
    document.getElementById('prog').style.width = pct + '%';
    selSide = null; selIdx = null;
    if (matched.every(Boolean)) setTimeout(showRoundEnd, 500);
  } else if (mode === 'conjugation' && pairs[pi].right === pairs[selIdx].right) {
    // Identical conjugated form — match only the selected pronoun; user must match the other separately
    matched[selIdx] = true;
    document.querySelectorAll('.cell.selected').forEach(e => e.classList.remove('selected'));
    rerender('l', selIdx); rerender('r', selIdx);
    sessionCorrectIds.add(pairs[selIdx].id);
    sm2Update(pairs[selIdx].id, true);
    speak(pairs[selIdx].left + ' ' + pairs[selIdx].right, true);
    setFb('✓ ' + pairs[selIdx].left + ' → ' + pairs[selIdx].right, 'correct');
    roundResults.push({ left: pairs[selIdx].left, right: pairs[selIdx].right, correct: true });
    const pct2 = Math.round(matched.filter(Boolean).length / pairs.length * 100);
    document.getElementById('prog').style.width = pct2 + '%';
    selSide = null; selIdx = null;
    if (matched.every(Boolean)) setTimeout(showRoundEnd, 500);
  } else {
    roundMistakes++;
    const ps = selSide, pi2 = selIdx;
    document.querySelectorAll('.cell.selected').forEach(e => e.classList.remove('selected'));
    flash(side, pi); flash(ps, pi2);
    sm2Update(pairs[pi].id,  false);
    sm2Update(pairs[pi2].id, false);
    [pairs[pi], pairs[pi2]].forEach(p => {
      if (!sessionCorrectIds.has(p.id) && !sessionWrongQueue.find(x => x.id === p.id)) {
        if (p.item) sessionWrongQueue.push(p.item);
      }
    });
    setFb(T('notAMatch'), 'wrong');
    wrongTimer = setTimeout(() => {
      wrongTimer = null;
      unflash(side, pi); unflash(ps, pi2);
      setFb('', '');
    }, 700);
    selSide = null; selIdx = null;
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

function setFb(msg, type) {
  const el = document.getElementById('fb');
  el.textContent = msg;
  el.className = 'feedback' + (type ? ' ' + type : '');
}

// ── Round end ──────────────────────────────────────────────────────────────────
function showRoundEnd() {
  updateStreak();
  logPractice();

  const total    = roundResults.length || ROUND_SIZE;
  const isMcMode = mode === 'phrases' || mode === 'grammar' || mode === 'wordrel';
  const isGender = mode === 'gender';

  let score;
  if (isMcMode || isGender) {
    score = roundResults.filter(r => r.correct).length;
  } else {
    // match modes: effective score = ROUND_SIZE minus mistakes, floored at 0
    score = Math.max(0, pairs.length - roundMistakes);
  }
  const denominator = isMcMode || isGender ? total : pairs.length;

  updateBest(mode, score, denominator);

  document.getElementById('round-score').textContent = score + '/' + denominator;

  const ratio = denominator > 0 ? score / denominator : 0;
  let msg;
  if (ratio === 1)        msg = T('scorePerfect');
  else if (ratio >= 0.8)  msg = T('scoreExcellent');
  else if (ratio >= 0.6)  msg = T('scoreGood');
  else                    msg = T('scoreKeepPractising');
  document.getElementById('round-sub').textContent = msg;

  const details = document.getElementById('round-details');
  if (roundResults.length > 0) {
    details.innerHTML = roundResults.map(r => {
      const icon = r.correct ? '✓' : '✗';
      const cls  = r.correct ? 'correct' : 'incorrect';
      return `<div class="round-detail-item ${cls}">
        <span class="round-detail-icon">${icon}</span>
        <span class="round-detail-text">${r.left} → ${r.right}</span>
      </div>`;
    }).join('');
  } else {
    details.innerHTML = '';
  }

  document.getElementById('round-next-btn').textContent = T('nextRound');
  const roundEndEl = document.getElementById('round-end');
  roundEndEl.scrollTop = 0;
  roundEndEl.style.display = 'flex';
}

function nextRound() {
  document.getElementById('round-end').style.display = 'none';
  startRound();
}

// ── Phrases mode ───────────────────────────────────────────────────────────────
let phraseRound    = [];
let phraseIndex    = 0;
let phraseAnswered = false;
let phraseChoices  = [];

function startPhrasesRound() {
  resetSessionIfExhausted(PHRASES);
  const wrongItems = getWrongQueueFromPool(PHRASES).slice(0, ROUND_SIZE);
  const wrongIds   = new Set(wrongItems.map(w => w.id));
  const fresh      = pickWordsMixed(PHRASES, ROUND_SIZE - wrongItems.length,
                       new Set([...sessionCorrectIds, ...wrongIds]), false);
  phraseRound  = shuffle([...wrongItems, ...fresh]).slice(0, ROUND_SIZE);
  phraseIndex  = 0;
  roundMistakes = 0;
  roundResults  = [];
  showCurrentPhrase();
}

function showCurrentPhrase() {
  phraseAnswered = false;
  const phrase = phraseRound[phraseIndex];
  document.getElementById('phrase-counter').textContent = (phraseIndex + 1) + ' / ' + ROUND_SIZE;
  document.getElementById('phrase-feedback').innerHTML = '';

  // Phrases is always FR → native: see the French phrase, pick the translation
  const question    = phrase.fr;
  const correct     = getTranslation(phrase);
  const distractors = shuffle(PHRASES.filter(p => p.id !== phrase.id)).slice(0, 3).map(p => getTranslation(p));
  document.getElementById('phrase-fr').textContent = question;
  phraseChoices = shuffle([correct, ...distractors]);

  document.getElementById('phrase-choices').innerHTML = phraseChoices.map((c, i) =>
    `<button class="phrase-choice-btn" onclick="checkPhraseAnswer(${i})">${c}</button>`
  ).join('');
}

function checkPhraseAnswer(choiceIdx) {
  if (phraseAnswered) return;
  phraseAnswered = true;

  const phrase    = phraseRound[phraseIndex];
  const correct   = getTranslation(phrase);
  const chosen    = phraseChoices[choiceIdx];
  const isCorrect = chosen === correct;

  document.querySelectorAll('.phrase-choice-btn').forEach((b, i) => {
    b.disabled = true;
    if (phraseChoices[i] === correct) b.classList.add('correct');
    else if (i === choiceIdx && !isCorrect) b.classList.add('wrong');
  });

  if (isCorrect) {
    sessionCorrectIds.add(phrase.id);
    sm2Update(phrase.id, true);
    speak(phrase.fr, true);  // French content
    roundResults.push({ left: phrase.fr, right: getTranslation(phrase), correct: true });
  } else {
    roundMistakes++;
    sm2Update(phrase.id, false);
    if (!sessionWrongQueue.find(x => x.id === phrase.id)) sessionWrongQueue.push(phrase);
    roundResults.push({ left: phrase.fr, right: getTranslation(phrase), correct: false });
  }

  const pct = Math.round((phraseIndex + 1) / ROUND_SIZE * 100);
  document.getElementById('prog').style.width = pct + '%';

  const isLast   = phraseIndex >= ROUND_SIZE - 1;
  const nextLabel = isLast ? T('seeResults') : T('nextItem');

  document.getElementById('phrase-feedback').innerHTML =
    `<div class="phrase-ref">` +
    `<div><span class="phrase-ref-flag">🇫🇷</span> ${phrase.fr}</div>` +
    `<div><span class="phrase-ref-flag">${contentLang() === 'nl' ? '🇳🇱' : contentLang() === 'de' ? '🇩🇪' : '🇬🇧'}</span> ${getTranslation(phrase)}</div>` +
    `</div>` +
    `<button class="next-btn" onclick="advancePhrase()">${nextLabel}</button>`;
}

function advancePhrase() {
  phraseIndex++;
  if (phraseIndex >= ROUND_SIZE) {
    document.getElementById('phrases-card').style.display = 'none';
    showRoundEnd();
  } else {
    showCurrentPhrase();
  }
}

// Get grammar question text in the correct language
function getGrammarQuestion(item) {
  // fr maps to English question: FR UI users are English speakers learning French (contentLang='en'),
  // and question_fr fields are formatted as "French answer (hint)" which leaks the answer.
  const questionMap = {
    en: 'question',
    nl: 'question_nl',
    de: 'question_de',
    fr: 'question'
  };
  const key = questionMap[currentLang] || 'question';
  return item[key] || item.question || '';
}

// ── Grammar mode ───────────────────────────────────────────────────────────────
let grammarRound    = [];
let grammarIndex    = 0;
let grammarAnswered = false;
let grammarChoices  = [];

function pickGrammarItems(count) {
  const progress = loadProgress();
  const today    = new Date().toISOString().split('T')[0];

  // CEFR level filter: cumulative — Beginner=A1 only, Elementary=A1+A2, Intermediate=A1+A2+B1, etc.
  const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const levelIndex = levelOrder.indexOf(level);
  const allowedLevels = new Set(levelOrder.slice(0, levelIndex + 1));

  let grammarPool = GRAMMAR.filter(g => allowedLevels.has(getItemLevel(g)));
  if (grammarCategory !== 'all') {
    grammarPool = grammarPool.filter(g => g.category === grammarCategory);
  }
  // Fallback: if combination of level + category filter yields nothing, use all
  if (grammarPool.length === 0) grammarPool = GRAMMAR;

  resetSessionIfExhausted(grammarPool);

  const wrongItems = getWrongQueueFromPool(grammarPool).slice(0, count);
  const wrongIds   = new Set(wrongItems.map(g => g.id));

  let pool = grammarPool.filter(g => !sessionCorrectIds.has(g.id) && !wrongIds.has(g.id));
  pool.sort((a, b) => {
    const diff = sm2Priority(a.id, progress, today) - sm2Priority(b.id, progress, today);
    return diff !== 0 ? diff : (Math.random() - 0.5);
  });
  const fresh = pool.slice(0, count - wrongItems.length);
  return shuffle([...wrongItems, ...fresh]).slice(0, count);
}

function getGrammarDistractors(item, count) {
  let samecat = GRAMMAR.filter(g => g.id !== item.id && g.category === item.category);
  let other   = GRAMMAR.filter(g => g.id !== item.id && g.category !== item.category);
  const pool  = shuffle([...samecat, ...other]);
  const answers = [];
  const seen    = new Set([item.answer]);
  for (const g of pool) {
    if (!seen.has(g.answer)) { seen.add(g.answer); answers.push(g.answer); }
    if (answers.length >= count) break;
  }
  return answers;
}

function startGrammarRound() {
  grammarRound    = pickGrammarItems(ROUND_SIZE);
  grammarIndex    = 0;
  roundMistakes   = 0;
  roundResults    = [];
  showCurrentGrammar();
}

function showCurrentGrammar() {
  grammarAnswered = false;
  const item = grammarRound[grammarIndex];
  document.getElementById('grammar-counter').textContent = (grammarIndex + 1) + ' / ' + ROUND_SIZE;
  document.getElementById('grammar-category').textContent = item.category || '';
  document.getElementById('grammar-question').textContent = getGrammarQuestion(item);
  document.getElementById('grammar-feedback').innerHTML = '';

  const distractors = getGrammarDistractors(item, 3);
  grammarChoices = shuffle([item.answer, ...distractors]);

  document.getElementById('grammar-choices').innerHTML = grammarChoices.map((c, i) =>
    `<button class="phrase-choice-btn" onclick="checkGrammarAnswer(${i})">${c}</button>`
  ).join('');
}

function checkGrammarAnswer(choiceIdx) {
  if (grammarAnswered) return;
  grammarAnswered = true;

  const item      = grammarRound[grammarIndex];
  const isCorrect = grammarChoices[choiceIdx] === item.answer;

  document.querySelectorAll('#grammar-choices .phrase-choice-btn').forEach((b, i) => {
    b.disabled = true;
    if (grammarChoices[i] === item.answer) b.classList.add('correct');
    else if (i === choiceIdx && !isCorrect) b.classList.add('wrong');
  });

  if (isCorrect) {
    sessionCorrectIds.add(item.id);
    sm2Update(item.id, true);
    speak(item.answer, true);  // Grammar answers are always French
    roundResults.push({ left: getGrammarQuestion(item), right: item.answer, correct: true });
  } else {
    roundMistakes++;
    sm2Update(item.id, false);
    if (!sessionWrongQueue.find(x => x.id === item.id)) sessionWrongQueue.push(item);
    roundResults.push({ left: getGrammarQuestion(item), right: item.answer, correct: false });
  }

  const pct = Math.round((grammarIndex + 1) / ROUND_SIZE * 100);
  document.getElementById('prog').style.width = pct + '%';

  const isLast    = grammarIndex >= ROUND_SIZE - 1;
  const nextLabel = isLast ? T('seeResults') : T('nextItem');
  document.getElementById('grammar-feedback').innerHTML =
    `<div class="grammar-explanation">${item.explanation}</div>` +
    `<button class="next-btn" onclick="advanceGrammar()">${nextLabel}</button>`;
}

function advanceGrammar() {
  grammarIndex++;
  if (grammarIndex >= ROUND_SIZE) {
    document.getElementById('grammar-card').style.display = 'none';
    showRoundEnd();
  } else {
    showCurrentGrammar();
  }
}

// ── Word Relationships mode ────────────────────────────────────────────────────
let wordRelRound    = [];
let wordRelIndex    = 0;
let wordRelAnswered = false;
let wordRelChoices  = [];

function pickWordRelItems(count) {
  let pool = WORD_RELATIONSHIPS.slice();
  if (wordRelFilter !== 'all') pool = pool.filter(w => w.relationship === wordRelFilter);
  resetSessionIfExhausted(pool);
  const wrongItems = getWrongQueueFromPool(pool).slice(0, count);
  const wrongIds   = new Set(wrongItems.map(w => w.id));
  const fresh      = pickWordsMixed(pool, count - wrongItems.length,
                       new Set([...sessionCorrectIds, ...wrongIds]), false);
  return shuffle([...wrongItems, ...fresh]).slice(0, count);
}

function startWordRelRound() {
  wordRelRound    = pickWordRelItems(ROUND_SIZE);
  wordRelIndex    = 0;
  roundMistakes   = 0;
  roundResults    = [];
  showCurrentWordRel();
}

function showCurrentWordRel() {
  wordRelAnswered = false;
  const item = wordRelRound[wordRelIndex];
  document.getElementById('wordrel-counter').textContent = (wordRelIndex + 1) + ' / ' + ROUND_SIZE;
  document.getElementById('wordrel-label').textContent =
    item.relationship === 'antonym' ? T('findAntonym') : T('findSynonym');

  let questionWord, correctAnswer;
  if (direction === 'fr-native') {
    questionWord  = item.french1;
    correctAnswer = item.french2;
  } else {
    questionWord  = item.french1; // word-rel is always FR→FR (find the related FR word)
    correctAnswer = item.french2;
  }
  document.getElementById('wordrel-word').textContent = questionWord;
  document.getElementById('wordrel-feedback').innerHTML = '';

  const allOptions = WORD_RELATIONSHIPS.filter(w => w.id !== item.id && w.relationship === item.relationship);
  const distractors = shuffle(allOptions).slice(0, 3).map(w => ({ text: w.french2, id: w.id, isCorrect: false }));
  wordRelChoices = shuffle([{ text: correctAnswer, id: item.id, isCorrect: true }, ...distractors]);

  document.getElementById('wordrel-choices').innerHTML = wordRelChoices.map((c, i) =>
    `<button class="phrase-choice-btn" onclick="checkWordRelAnswer(${i})">${c.text}</button>`
  ).join('');
}

function checkWordRelAnswer(choiceIdx) {
  if (wordRelAnswered) return;
  wordRelAnswered = true;

  const item      = wordRelRound[wordRelIndex];
  const chosen    = wordRelChoices[choiceIdx];
  const isCorrect = chosen.isCorrect;

  document.querySelectorAll('#wordrel-choices .phrase-choice-btn').forEach((b, i) => {
    b.disabled = true;
    if (wordRelChoices[i].isCorrect) b.classList.add('correct');
    else if (i === choiceIdx && !isCorrect) b.classList.add('wrong');
  });

  const lang1   = contentLang() === 'nl' ? item.dutch1  : contentLang() === 'de' ? item.german1 : item.english1;
  const lang2   = contentLang() === 'nl' ? item.dutch2  : contentLang() === 'de' ? item.german2 : item.english2;
  const relStr  = T(item.relationship === 'antonym' ? 'antonymLabel' : 'synonymLabel');
  const trans   = (lang1 && lang2) ? ' (' + lang1 + ' / ' + lang2 + ')' : '';
  const confirmLine = item.french1 + ' ↔ ' + item.french2 + ' [' + relStr + ']' + trans;

  if (isCorrect) {
    sessionCorrectIds.add(item.id);
    sm2Update(item.id, true);
    // Speak both words of the relationship
    speak(item.french1 + ', ' + item.french2, true);  // French content
    roundResults.push({ left: item.french1, right: item.french2, correct: true });
  } else {
    roundMistakes++;
    sm2Update(item.id, false);
    if (!sessionWrongQueue.find(x => x.id === item.id)) sessionWrongQueue.push(item);
    roundResults.push({ left: item.french1, right: item.french2, correct: false });
  }

  const pct = Math.round((wordRelIndex + 1) / ROUND_SIZE * 100);
  document.getElementById('prog').style.width = pct + '%';

  const isLast    = wordRelIndex >= ROUND_SIZE - 1;
  const nextLabel = isLast ? T('seeResults') : T('nextItem');
  const fbCls     = isCorrect ? 'grammar-explanation' : 'phrase-ref';
  document.getElementById('wordrel-feedback').innerHTML =
    `<div class="${fbCls}">${confirmLine}</div>` +
    `<button class="next-btn" onclick="advanceWordRel()">${nextLabel}</button>`;
}

function advanceWordRel() {
  wordRelIndex++;
  if (wordRelIndex >= ROUND_SIZE) {
    document.getElementById('wordrel-card').style.display = 'none';
    showRoundEnd();
  } else {
    showCurrentWordRel();
  }
}

// ── Sound ──────────────────────────────────────────────────────────────────────
// Voice preferences for each language
const VOICE_PREFERENCES = {
  'fr-FR': { lang: 'fr-FR', name: 'French' },
  'nl-NL': { lang: 'nl-NL', name: 'Dutch' },
  'de-DE': { lang: 'de-DE', name: 'German' },
  'en-GB': { lang: 'en-GB', name: 'English' },
};

let selectedVoices = {}; // Cache for selected voices

function speak(text, isFrench = false) {
  if (!soundOn || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  setTimeout(() => {
    const u = new SpeechSynthesisUtterance(text);
    
    // French content always speaks in French, regardless of UI language
    // Native content speaks in the UI language
    let langCode;
    if (isFrench) {
      langCode = 'fr-FR';
    } else {
      const langMap = { en: 'en-GB', nl: 'nl-NL', de: 'de-DE', fr: 'fr-FR' };
      langCode = langMap[currentLang] || 'en-GB';
    }
    
    u.lang = langCode;
    u.rate = 0.9;
    
    // Try to select a preferred female voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find(v => 
        v.lang && v.lang.startsWith(langCode) && v.name.toLowerCase().includes('female')
      ) || voices.find(v => v.lang && v.lang.startsWith(langCode));
      if (preferredVoice) {
        u.voice = preferredVoice;
      }
    }
    
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
  applyTranslations();
}

// ── Apply translations ─────────────────────────────────────────────────────────
function applyTranslations() {
  // Language option labels (display in their own language)
  const langLabels = { en: 'langEN', nl: 'langNL', de: 'langDE', fr: 'langFR' };
  Object.entries(langLabels).forEach(([lang, key]) => {
    const option = document.getElementById('lang-opt-' + lang);
    if (option) option.textContent = T(key);
  });

  // Mode tabs
  document.querySelectorAll('.mode-tab[data-mode]').forEach(btn => {
    btn.textContent = T(btn.getAttribute('data-mode'));
  });

  // Mode group labels
  const gw = document.getElementById('group-words-label');
  const gv = document.getElementById('group-verbs-label');
  const gl = document.getElementById('group-lang-label');
  if (gw) gw.textContent = T('groupWords');
  if (gv) gv.textContent = T('groupVerbs');
  if (gl) gl.textContent = T('groupLanguage');

  // Level tabs
  const levelKeys = { A1: 'beginner', A2: 'elementary', B1: 'intermediate', B2: 'advanced', C1: 'expert', C2: 'mastery' };
  document.querySelectorAll('.level-tab[data-level]').forEach(btn => {
    btn.textContent = T(levelKeys[btn.getAttribute('data-level')] || btn.getAttribute('data-level'));
  });

  // Topic tabs
  const topicKeys = {
    all: 'topicAll', everyday: 'everyday', food: 'food', family: 'family',
    travel: 'travel', work: 'work', nature: 'nature', body: 'body',
    school: 'school', shopping: 'shopping', animals: 'animals', home: 'home',
  };
  document.querySelectorAll('#topic-row .topic-tab[data-topic]').forEach(btn => {
    btn.textContent = T(topicKeys[btn.getAttribute('data-topic')] || btn.getAttribute('data-topic'));
  });

  // Wordrel filter
  document.querySelectorAll('#wordrel-filter-row .topic-tab[data-wrfilter]').forEach(btn => {
    const f = btn.getAttribute('data-wrfilter');
    if (f === 'all')     btn.textContent = T('wrAll');
    if (f === 'antonym') btn.textContent = T('wrAntonyms');
    if (f === 'synonym') btn.textContent = T('wrSynonyms');
  });

  // Mode description
  const modeDescKeys = {
    vocab: 'instrVocab', gender: 'instrGender', conjugation: 'instrConjugation',
    phrases: 'instrPhrases', grammar: 'instrGrammar', wordrel: 'instrWordrel',
  };
  document.getElementById('mode-desc').textContent = T(modeDescKeys[mode] || 'instrVocab');

  // Direction button
  updateDirectionBtn();

  // Header buttons
  document.getElementById('about-btn').textContent    = T('about');
  document.getElementById('progress-btn').textContent = T('progress');

  // Verb label
  const verbLbl = document.getElementById('verb-label');
  if (verbLbl) verbLbl.textContent = T('verbLabel');

  // Tense label
  const tenseLbl = document.getElementById('tense-label');
  if (tenseLbl) tenseLbl.textContent = T('tenseLabel');

  // Difficulty label
  const diffLbl = document.getElementById('difficultyLevel-label');
  if (diffLbl) diffLbl.textContent = T('difficultyLevel');

  // Tense selector options
  document.querySelectorAll('#tense-select option[data-tense-key]').forEach(opt => {
    const key = opt.getAttribute('data-tense-key');
    if (key === 'all') opt.textContent = T('topicAll');
    else opt.textContent = T(key);
  });

  // Difficulty selector options
  document.querySelectorAll('#difficulty-select option[data-diff-key]').forEach(opt => {
    const key = opt.getAttribute('data-diff-key');
    if (key === 'all') opt.textContent = T('topicAll');
    else opt.textContent = T(key);
  });

  // Dashboard labels
  const ids = {
    'dash-title':         'progress',
    'dash-label-total':   'itemsPracticed',
    'dash-label-mastered':'mastered',
    'dash-label-streak':  'streakLabel',
    'dash-label-due':     'dueForReview',
    'dash-label-bymode':  'progressByMode',
    'reset-btn':          'resetProgress',
  };
  Object.entries(ids).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = T(key);
  });

  // Profile overlay
  renderProfileScreen();

  // About overlay
  const aTitle = document.getElementById('about-title');
  const aText  = document.getElementById('about-text');
  if (aTitle) aTitle.textContent = T('aboutTitle');
  if (aText)  aText.textContent  = T('aboutText');

  // Welcome screen prompt
  const welcomePrompt = document.getElementById('welcome-prompt');
  if (welcomePrompt) welcomePrompt.textContent = T('welcomePrompt');

  // Round-end next button
  const nextBtn = document.getElementById('round-next-btn');
  if (nextBtn) nextBtn.textContent = T('nextRound');

  // Grammar filter labels (translated category names)
  refreshGrammarFilterLabels();

  // Verb dropdown: re-translate option labels without changing selection or currentVerb
  refreshVerbSelectLabels();

  // Column labels
  updateColLabels();

  // Help panel: update text for current mode if panel exists
  const helpPanelEl = document.getElementById('help-panel');
  if (helpPanelEl) {
    const helpKeys = { vocab: 'helpVocab', gender: 'helpGender', wordrel: 'helpWordrel', conjugation: 'helpConjugation', grammar: 'helpGrammar', phrases: 'helpPhrases' };
    helpPanelEl.textContent = T(helpKeys[mode] || 'helpVocab');
  }
}

// ── Progress dashboard ─────────────────────────────────────────────────────────

function fmt(template) {
  const args = Array.prototype.slice.call(arguments, 1);
  return template.replace(/\{(\d+)\}/g, function(_, i) { return args[i] || ''; });
}

function computeFocusRecommendation() {
  const p = loadProgress();
  const genderPool = VOCAB.filter(w => w.type === 'noun' && (w.gender === 'M' || w.gender === 'F'));
  const tenseDisplayMap = {
    'present': T('tensePresent'), 'passé composé': T('tensePerfect'),
    'imparfait': T('tenseImperfect'), 'futur': T('tenseFuture'),
    'conditionnel': T('tenseConditional'),
  };

  const modes = [
    { name: T('modeVocab'),        items: VOCAB,             getId: w  => w.id,  getSubcat: w  => w.category || 'other',   getSubcatDisplay: s => s },
    { name: T('modeGender'),       items: genderPool,         getId: w  => w.id,  getSubcat: w  => w.category || 'other',   getSubcatDisplay: s => s },
    { name: T('modeConjugation'),  items: CONJUGATIONS,       getId: c  => 'conj_' + c.verb + '_' + c.tense + '_' + c.subject, getSubcat: c => c.tense, getSubcatDisplay: s => tenseDisplayMap[s] || s },
    { name: T('modeWordrel'),      items: WORD_RELATIONSHIPS, getId: w  => w.id,  getSubcat: w  => w.relationship || 'other', getSubcatDisplay: s => s },
    { name: T('modePhrases'),      items: PHRASES,            getId: ph => ph.id, getSubcat: ph => ph.category || 'other',  getSubcatDisplay: s => s },
    { name: T('modeGrammar'),      items: GRAMMAR,            getId: g  => g.id,  getSubcat: g  => g.category || 'other',   getSubcatDisplay: s => grammarCatLabel(s) },
  ];

  // Check for entirely unstarted modes
  for (const m of modes) {
    const seen = m.items.filter(item => p[m.getId(item)]).length;
    if (seen === 0) return fmt(T('focusNotStartedMode'), m.name);
  }

  // Find weakest subcategory across all modes (skip subcats with seen=0 — whole mode already started)
  let weakest = null;
  for (const m of modes) {
    const subcats = {};
    m.items.forEach(item => {
      const sub = m.getSubcat(item);
      if (!subcats[sub]) subcats[sub] = { total: 0, seen: 0, display: m.getSubcatDisplay(sub) };
      subcats[sub].total++;
      if (p[m.getId(item)]) subcats[sub].seen++;
    });
    for (const d of Object.values(subcats)) {
      if (d.seen === 0) continue;
      const pct = d.seen / d.total;
      if (!weakest || pct < weakest.pct) {
        weakest = { modeName: m.name, subcatDisplay: d.display, pct };
      }
    }
  }

  if (!weakest || weakest.pct > 0.5) return T('focusAllGood');
  return fmt(T('focusWeakSubcat'), weakest.subcatDisplay, weakest.modeName);
}

function getLastPracticeDate() {
  if (!currentProfile) return '';
  try {
    const s = JSON.parse(localStorage.getItem(profileKey('streak')) || '{}');
    return s.lastDate || '';
  } catch { return ''; }
}

function formatPracticeDate(dateStr) {
  if (!dateStr) return T('neverPracticed');
  const today     = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (dateStr === today)     return T('todayLabel');
  if (dateStr === yesterday) return T('yesterdayLabel');
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

function buildModeSection(name, items, getId, getSubcat, p, extraSubLabel) {
  const total = items.length;
  const seen  = items.filter(item => p[getId(item)]).length;
  const pct   = total > 0 ? seen / total : 0;
  const pctRound = Math.round(pct * 100);

  // Subcategory breakdown — only categories below 25%
  const subcats = {};
  items.forEach(item => {
    const sub = getSubcat(item);
    if (!subcats[sub]) subcats[sub] = { total: 0, seen: 0 };
    subcats[sub].total++;
    if (p[getId(item)]) subcats[sub].seen++;
  });
  const lowSubs = Object.entries(subcats)
    .filter(([, d]) => d.total > 0 && d.seen / d.total < 0.25)
    .sort((a, b) => (a[1].seen / a[1].total) - (b[1].seen / b[1].total));

  let bodyHtml;
  if (lowSubs.length === 0) {
    bodyHtml = `<div style="font-size:11px;color:#aaa;padding:2px 0">${T('noSubcatsBelow25')}</div>`;
  } else {
    const subLabel = extraSubLabel ? `<div style="font-size:10px;color:#bbb;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">${extraSubLabel}</div>` : '';
    bodyHtml = subLabel + lowSubs.map(([sub, d]) => {
      const subPct = Math.round(d.seen / d.total * 100);
      const subDisplay = sub ? sub.charAt(0).toUpperCase() + sub.slice(1) : sub;
      return `<div class="sub-row">
        <div class="sub-name">${subDisplay}</div>
        <div class="sub-bar-wrap"><div class="sub-bar" style="width:${subPct}%"></div></div>
        <div class="sub-count">${d.seen}/${d.total}</div>
      </div>`;
    }).join('');
  }

  return `<div class="mode-section">
    <div class="mode-section-header" onclick="toggleModeSection(this)">
      <span class="mode-section-name">${name}</span>
      <span class="mode-section-count">${seen}/${total}</span>
      <div class="mode-section-bar-wrap"><div class="mode-section-bar" style="width:${pctRound}%"></div></div>
      <span class="mode-section-arrow">▶</span>
    </div>
    <div class="mode-section-body">${bodyHtml}</div>
  </div>`;
}

function toggleModeSection(headerEl) {
  headerEl.closest('.mode-section').classList.toggle('open');
}

function showDashboard() {
  const p      = loadProgress();
  const ids    = Object.keys(p);
  const today  = new Date().toISOString().split('T')[0];
  const mastered = ids.filter(id => p[id].repetitions >= 3 && p[id].easeFactor > 2.0).length;
  const due      = ids.filter(id => p[id].nextReview <= today).length;
  const streak   = getStreak();

  document.getElementById('dash-total').textContent    = ids.length;
  document.getElementById('dash-mastered').textContent = mastered;
  document.getElementById('dash-streak').textContent   = streak + ' ' + T(streak === 1 ? 'day' : 'days');
  document.getElementById('dash-due').textContent      = due;

  // Last practice date
  const lastDate = getLastPracticeDate();
  const lastEl   = document.getElementById('dash-last-practice');
  if (lastEl) lastEl.textContent = T('lastPracticeLabel') + ': ' + formatPracticeDate(lastDate);

  // Apply translated labels
  applyTranslations();

  // Hide Personal Bests section (removed from dashboard)
  const bestsLabel = document.getElementById('dash-label-bests');
  const bestsGrid  = document.getElementById('bests-grid');
  if (bestsLabel) bestsLabel.style.display = 'none';
  if (bestsGrid)  bestsGrid.style.display  = 'none';

  // Focus recommendation
  const focusEl = document.getElementById('dash-focus');
  if (focusEl) {
    focusEl.innerHTML = `<div style="font-size:11px;font-weight:600;color:#1D9E75;letter-spacing:.06em;margin-bottom:5px;text-transform:uppercase">${T('focusTitle')}</div>` +
      `<div style="font-size:13px;color:#333">${computeFocusRecommendation()}</div>`;
  } else {
    // Create focus box after stats grid if it doesn't exist
    const statsGrid = document.querySelector('.dash-stats');
    if (statsGrid) {
      const box = document.createElement('div');
      box.id = 'dash-focus';
      box.style.cssText = 'border-left:3px solid #1D9E75;background:#f0f9f5;border-radius:8px;padding:10px 14px;margin-bottom:1rem;';
      box.innerHTML = `<div style="font-size:11px;font-weight:600;color:#1D9E75;letter-spacing:.06em;margin-bottom:5px;text-transform:uppercase">${T('focusTitle')}</div>` +
        `<div style="font-size:13px;color:#333">${computeFocusRecommendation()}</div>`;
      statsGrid.insertAdjacentElement('afterend', box);
    }
  }

  // Mode progress sections
  const genderPool = VOCAB.filter(w => w.type === 'noun' && (w.gender === 'M' || w.gender === 'F'));
  const tenseDisplayMap = {
    'present': T('tensePresent'), 'passé composé': T('tensePerfect'),
    'imparfait': T('tenseImperfect'), 'futur': T('tenseFuture'),
    'conditionnel': T('tenseConditional'),
  };

  const sectionsHtml = [
    buildModeSection(
      T('modeVocab'), VOCAB,
      w => w.id,
      w => w.category || 'other',
      p
    ),
    buildModeSection(
      T('modeGender'), genderPool,
      w => w.id,
      w => w.category || 'other',
      p
    ),
    buildModeSection(
      T('modeConjugation'), CONJUGATIONS,
      c => 'conj_' + c.verb + '_' + c.tense + '_' + c.subject,
      c => tenseDisplayMap[c.tense] || c.tense,
      p,
      T('byTense')
    ),
    buildModeSection(
      T('modeWordrel'), WORD_RELATIONSHIPS,
      w => w.id,
      w => w.relationship || 'other',
      p
    ),
    buildModeSection(
      T('modePhrases'), PHRASES,
      ph => ph.id,
      ph => ph.category || 'other',
      p
    ),
    buildModeSection(
      T('modeGrammar'), GRAMMAR,
      g => g.id,
      g => g.category || 'other',
      p,
      T('byGrammarCategory')
    ),
  ].join('');

  document.getElementById('mode-progress').innerHTML = sectionsHtml;
  document.getElementById('overlay').classList.remove('hidden');
}

function hideDashboard() {
  document.getElementById('overlay').classList.add('hidden');
}

function resetProgress() {
  if (!currentProfile) return;
  if (!confirm('Reset all progress for ' + currentProfile + '? This cannot be undone.')) return;
  localStorage.removeItem(profileKey('progress'));
  localStorage.removeItem(profileKey('streak'));
  localStorage.removeItem(profileKey('practicelog'));
  localStorage.removeItem(profileKey('bests'));
  sessionCorrectIds = new Set();
  sessionWrongQueue = [];
  hideDashboard();
  startRound();
}

// ── About ──────────────────────────────────────────────────────────────────────
function showAbout() {
  document.getElementById('about-title').textContent = T('aboutTitle');
  document.getElementById('about-text').textContent  = T('aboutText');
  document.getElementById('about-overlay').classList.remove('hidden');
}
function closeAbout() {
  document.getElementById('about-overlay').classList.add('hidden');
}

// ── UI event handlers ──────────────────────────────────────────────────────────
function setMode(m, el) {
  mode = m;
  document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  applyModeUI();
  
  // Populate verb selector and reset queue when switching to conjugation mode
  if (mode === 'conjugation') {
    populateVerbSelect();
    conjugationSessionVerbs = null;
  }

  sessionCorrectIds = new Set();
  sessionWrongQueue = [];
  startRound();
}

function setLevel(l, el) {
  level = l;
  document.querySelectorAll('.level-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  sessionCorrectIds = new Set();
  sessionWrongQueue = [];
  startRound();
}

function setTopic(t, el) {
  topic = t;
  document.querySelectorAll('#topic-row .topic-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  startRound();
}

function setWordRelFilter(f, el) {
  wordRelFilter = f;
  document.querySelectorAll('#wordrel-filter-row .topic-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  startRound();
}

function setGrammarCategory(cat, el) {
  grammarCategory = cat;
  document.querySelectorAll('#grammar-filter-row .topic-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  sessionCorrectIds = new Set();
  sessionWrongQueue = [];
  startRound();
}

function setVerb() {
  currentVerb = document.getElementById('verb-select').value;
  conjugationSessionVerbs = null; // reset so queue is rebuilt excluding new currentVerb
  sessionCorrectIds = new Set();
  sessionWrongQueue = [];
  startRound();
}

function setTense() {
  currentTense = document.getElementById('tense-select').value;
  sessionCorrectIds = new Set();
  sessionWrongQueue = [];
  startRound();
}

function setDifficulty() {
  currentDifficulty = document.getElementById('difficulty-select').value;
  populateVerbSelect();  // Update verb list based on new difficulty
  conjugationSessionVerbs = null; // reset so queue is rebuilt with new verb pool
  sessionCorrectIds = new Set();
  sessionWrongQueue = [];
  startRound();
}

function refreshVerbSelectLabels() {
  const sel = document.getElementById('verb-select');
  if (!sel) return;
  Array.from(sel.options).forEach(opt => {
    const verbName = opt.value;
    const vocabMatch = VOCAB.find(w => w.fr === verbName);
    const verbData   = VERBS.find(v => v.verb === verbName);
    const fallback   = verbData ? verbData.en : verbName;
    const translation = vocabMatch ? (vocabMatch[contentLang()] || fallback) : fallback;
    opt.textContent = verbName + ' (' + translation + ')';
  });
}

function populateVerbSelect() {
  // Filter verbs based on current difficulty setting
  let availableVerbs = VERBS;
  if (currentDifficulty === 'easy') {
    availableVerbs = VERBS.filter(v => v.type && v.type !== 'irregular');
  } else if (currentDifficulty === 'hard') {
    availableVerbs = VERBS.filter(v => v.type === 'irregular');
  }

  const sel = document.getElementById('verb-select');
  sel.innerHTML = availableVerbs.map(v => {
    const vocabMatch = VOCAB.find(w => w.fr === v.verb);
    const translation = vocabMatch ? (vocabMatch[contentLang()] || v.en) : v.en;
    return `<option value="${v.verb}">${v.verb} (${translation})</option>`;
  }).join('');
  
  // Set default verb: prefer 'être' if available, otherwise first available
  let defaultVerb = availableVerbs.find(v => v.verb === 'être');
  if (!defaultVerb && availableVerbs.length > 0) {
    defaultVerb = availableVerbs[0];
  }
  if (defaultVerb) {
    sel.value = defaultVerb.verb;
    currentVerb = defaultVerb.verb;
  }
}

// ── Build CONJ map from flat CONJUGATIONS array ────────────────────────────────
function buildConjMap() {
  const conj = {};
  CONJUGATIONS.forEach(c => {
    if (!conj[c.verb])        conj[c.verb] = {};
    if (!conj[c.verb][c.tense]) conj[c.verb][c.tense] = {};
    conj[c.verb][c.tense][c.subject] = c.form;
  });
  return conj;
}

// ── Help button (per-mode how-to) ─────────────────────────────────────────────
function ensureHelpBtn() {
  const card = document.querySelector('.practice-card');
  if (!card) return;

  let helpContainer = document.getElementById('help-container');
  if (!helpContainer) {
    helpContainer = document.createElement('div');
    helpContainer.id = 'help-container';
    card.appendChild(helpContainer);

    const btn = document.createElement('button');
    btn.id = 'help-btn';
    btn.className = 'help-btn';
    btn.textContent = '?';
    btn.onclick = toggleHelpPanel;
    helpContainer.appendChild(btn);

    const panel = document.createElement('div');
    panel.id = 'help-panel';
    panel.className = 'help-panel';
    panel.style.display = 'none';
    helpContainer.appendChild(panel);
  }

  const helpKeys = { vocab: 'helpVocab', gender: 'helpGender', wordrel: 'helpWordrel', conjugation: 'helpConjugation', grammar: 'helpGrammar', phrases: 'helpPhrases' };
  const panel = document.getElementById('help-panel');
  const btn   = document.getElementById('help-btn');
  if (panel) { panel.textContent = T(helpKeys[mode] || 'helpVocab'); panel.style.display = 'none'; }
  if (btn)   btn.textContent = '?';
}

function toggleHelpPanel() {
  const panel = document.getElementById('help-panel');
  const btn   = document.getElementById('help-btn');
  if (!panel || !btn) return;
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  btn.textContent = isOpen ? '?' : '✕';
}

// ── Keyboard shortcuts ─────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.cell.selected').forEach(el => el.classList.remove('selected'));
    selSide = null; selIdx = null;
    closeProfileOverlay();
    closeAbout();
    hideDashboard();
  }
});

// ── Init ───────────────────────────────────────────────────────────────────────
// sortedGrammarCats is computed once; labels are re-applied on language change
let sortedGrammarCats = [];

function populateGrammarFilter() {
  const categories = new Set();
  GRAMMAR.forEach(g => { if (g.category) categories.add(g.category); });
  sortedGrammarCats = Array.from(categories).sort();
  const filterRow = document.getElementById('grammar-filter-row');

  // Clear existing category buttons (keep the "All" button)
  filterRow.querySelectorAll('[data-gramcat]:not([data-gramcat="all"])').forEach(btn => btn.remove());

  // Add buttons for each category with translated labels
  sortedGrammarCats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'topic-tab';
    btn.setAttribute('data-gramcat', cat);
    btn.textContent = grammarCatLabel(cat);
    btn.onclick = function() { setGrammarCategory(cat, this); };
    filterRow.appendChild(btn);
  });
}

function refreshGrammarFilterLabels() {
  const filterRow = document.getElementById('grammar-filter-row');
  filterRow.querySelectorAll('[data-gramcat]:not([data-gramcat="all"])').forEach(btn => {
    const cat = btn.getAttribute('data-gramcat');
    btn.textContent = grammarCatLabel(cat);
  });
  // Translate the "All" button
  const allBtn = filterRow.querySelector('[data-gramcat="all"]');
  if (allBtn) allBtn.textContent = T('topicAll');
}

function init() {
  CONJ = buildConjMap();
  populateVerbSelect();
  populateGrammarFilter();

  // Add C2 level tab after C1
  const levelTabsEl = document.getElementById('level-tabs');
  const c1Tab = levelTabsEl ? levelTabsEl.querySelector('[data-level="C1"]') : null;
  if (c1Tab && !levelTabsEl.querySelector('[data-level="C2"]')) {
    const c2Tab = document.createElement('button');
    c2Tab.className = 'level-tab';
    c2Tab.setAttribute('data-level', 'C2');
    c2Tab.textContent = T('mastery');
    c2Tab.onclick = function() { setLevel('C2', this); };
    c1Tab.insertAdjacentElement('afterend', c2Tab);
  }

  // Pre-warm speech synthesis
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  applyTranslations();
  showProfileOverlay();
}

window.addEventListener('DOMContentLoaded', init);
