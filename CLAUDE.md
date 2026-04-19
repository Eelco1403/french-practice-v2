# Pratique Française — Project Context for Claude Code

## What this is
A vanilla JavaScript French practice tool for adult learners. No frameworks, no npm, no build tools. Three core files: index.html, app.js, style.css plus database.js. Serious practice tool — not gamified, not a learning app.

## Project location
C:\Users\Eelco\Desktop\french-practice-v2
GitHub: github.com/Eelco1403/french-practice-v2

## Database
French_Learning_Content_Database_v7.xlsx — always use v7, never revert to earlier versions.
Current file on disk: French_Learning_Content_Database_v7(1).xlsx (updated version, same v7 content).
Location: C:\Users\Eelco\Desktop\french-practice-v2\
Generator: gen_db.py — run `python gen_db.py` to regenerate database.js from the xlsx.

Six sheets:
- Vocabulary — 3,000 words, French + English + Dutch + German, CEFR level, category, difficulty
- Conjugation — 1,224 rows, 49 verbs, 5 tenses (présent, passé composé, imparfait, futur, conditionnel)
- Grammar — 160 questions, columns: ID, Question (EN), Answer, Explanation, Category, Type, CEFR Level, Difficulty, Question_NL, Question_DE, Question_FR
- Phrases — 100 survival phrases, French + EN + NL + DE
- Word Relationships — 250 pairs (150 antonyms, 100 synonyms), French + EN + NL + DE
- Verb Summary — 49 verbs reference

## Modes
Vocabulary, Gender, Word Relationships, Conjugation, Grammar, Phrases

## Core features working
- SM-2 spaced repetition
- Multi-user profiles (localStorage)
- Language selector EN / NL / DE / FR (FR recently added)
- Dual direction FR ↔ native language
- Progress dashboard
- Welcome screen after profile selection

## Key rules — never break these
- Vanilla JS only, no frameworks, no npm packages
- 10 items per round, consistent across all modes
- No gamification — serious practice tool positioning
- Always speak French content in fr-FR regardless of UI language
- UI language and content language are separate concepts
- Always use v7 database

## UI languages
- EN → English
- NL → Nederlands  
- DE → Deutsch
- FR → Français

Language names must always display in their own language in the selector.

## TTS / Speech rules
- French content always spoken in fr-FR
- Native language content spoken in the correct voice for selected UI language
- Always use female voice — explicitly select preferred female voice after voices load
- Use BCP 47 tags: fr-FR, nl-NL, de-DE, en-GB
- Graceful fallback if preferred voice not available

## Grammar tab rules
- Display Category as visible label above each question
- Display Explanation after user answers
- Category filter buttons must translate with UI language
- Question column to use based on UI language: Question (EN), Question_NL, Question_DE, Question_FR

## Progress tab
- No heatmap visual (data collection kept in localStorage)
- Show last practice date alongside streak counter
- Collapsible sections per mode with top-level summary e.g. "Vocabulary — 340/3000"
- When expanded, only show categories below 25% progress
- All modes covered: Vocabulary, Conjugation, Gender, Word Relationships, Phrases, Grammar

## Current status
v1 build in progress. Claude Code is working through 17 findings. See below.

## Task 13 — SM-2 Conjugation Tracking (verified 2026-04-17)
**Verified working:**
- `sm2Update(id, correct)` is called on every conjugation match — correct at line ~911, wrong at lines ~930–931 in app.js
- ID format is consistent: `buildPairs()` generates `'conj_' + verb + '_' + tense + '_' + subj`; dashboard `buildModeSection()` generates `'conj_' + c.verb + '_' + c.tense + '_' + c.subject` — these match because both derive from the same CONJUGATIONS data
- Tense strings in `TENSE_BY_LEVEL` (`'present'`, `'passé composé'`, etc.) match the tense values in the database exactly
- `updateBest('conjugation', ...)`, `updateStreak()`, and `logPractice()` are all called at round end
- Dashboard reads conjugation progress correctly and groups by tense

**Fixed:**
- `gen_db.py` had hardcoded `v6` in the output comment even though it reads from v7.xlsx — fixed to say v7
- `database.js` header comment corrected from v6 to v7

**Notes:**
- Conjugation pairs intentionally omit `item` property (vocab wrongQueue pattern doesn't apply — conjugation always shows all pronouns for a verb/tense in one round, so within-session re-queuing is not applicable)
- SM-2 persistence across sessions is correct; wrong matches lower ease factor and advance next-review date

## Round summary score cut-off fix (2026-04-17)
**Fixed:** Round-end summary preserved scroll position between rounds, causing the score to be hidden above the visible area on subsequent rounds. Added `scrollTop = 0` in `showRoundEnd()` before setting `display: flex`. Affects all modes (Phrases, Grammar, Word Relationships, Conjugation, Vocabulary, Gender).

## French capitalisation in Progress panel fix (2026-04-17)
**Root cause:** `.best-mode` and `.sub-name` CSS rules had `text-transform: capitalize`, which capitalised every word — turning `'Relations de mots'` into `'Relations De Mots'` and `'Passé composé'` into `'Passé Composé'`.
**Fixed:**
- Removed `text-transform: capitalize` from `.best-mode` and `.sub-name` in style.css (mode names in translations are already correctly capitalised)
- In `buildModeSection()`, subcategory labels now have only their first character uppercased in JS (`charAt(0).toUpperCase() + slice(1)`) so raw DB values like `'greetings'` still render as `'Greetings'`
- Fixed `itemsPracticed: 'éléments pratiqués'` → `'Éléments pratiqués'` (lowercase `é` was inconsistent with all other French stat labels)

## Grammar category filter translations (2026-04-17) — closes finding #14
**Fixed:** Grammar filter tags were displaying raw DB keys (e.g. `indirect_speech`, `past_tense`). All 22 categories now have accurate translations in EN/NL/DE/FR via `GRAMMAR_CAT_LABELS` constant and `grammarCatLabel()` helper. Labels update on language change via `refreshGrammarFilterLabels()` called from `applyTranslations()`. Categories: agreement, archaic, articles, concessive, conditional, gerund, hypothetical, indirect_speech, infinitive, literary, modal, negation, passive, past_tense, pluralization, possessive, prepositions, pronouns, register, relative, style, subjunctive.

## Round summary Next Round button always visible (2026-04-17)
**Fixed (new bug, not in original 17 findings):** In Gender and Phrases modes (and any mode with many result items), the Next Round button was pushed below the viewport. Fix: `.round-end` now uses `overflow: hidden`; `.round-details` gets `flex: 1; min-height: 0; overflow-y: auto` so the result list scrolls internally while the score header and button stay pinned at top/bottom. Applies to all modes.

## FR → FR content bug fix (2026-04-17) — closes finding #16
**Fixed:** When UI language was set to Français, `getTranslation()` returned `item.fr` (French), making both sides of the exercise French. Root cause: content language was not separated from UI language.
**Fix:** Added `contentLang()` helper — returns `'en'` when `currentLang === 'fr'`, otherwise `currentLang`. All content lookups (`getTranslation()`, direction button label, wordrel feedback, phrases flag emoji) now use `contentLang()` instead of `currentLang`. Fixed `nativeLang` for FR translations from `'FRANÇAIS'` → `'ENGLISH'`. FR UI now shows FR ↔ EN content as expected.

## Phrases direction locked to FR → native (2026-04-17)
**Fixed:** Phrases mode showed a direction toggle (FR → native / native → FR) which was not appropriate — the exercise is always "see the French phrase, pick the translation". Direction row is now hidden for Phrases mode. `showCurrentPhrase()` and `checkPhraseAnswer()` use FR → native unconditionally.

## Instruction line prominence (Task 4) (2026-04-17)
**Fixed:** The instruction line below mode tabs was 12px, #999 (grey), easy to overlook. Updated `.mode-desc` to 13px, font-weight 500, color #666. Added `margin-top: 4px` and `margin-bottom: 6px` to `.desc-dir-row` for more breathing room. Applies to all modes (the instruction text is the same element across all modes).

## Database regenerated from v7 xlsx (2026-04-17)
**Task 1:** `gen_db.py` was missing (deleted). Recreated from scratch. Regenerated `database.js` from `French_Learning_Content_Database_v7.xlsx`. Verified: 3,000 vocab, 1,224 conjugations, 49 verbs, 160 grammar, 100 phrases, 250 word relationships. Backslash-apostrophe check: **0 items** — all 27 corrected apostrophes confirmed clean in French vocab.

## Vocabulary column headers fixed (2026-04-17) — closes finding #11
**Fix:** NL and DE locale `nativeLang` strings were English words. Fixed:
- NL: `'DUTCH'` → `'NEDERLANDS'`
- DE: `'GERMAN'` → `'DEUTSCH'`
- EN: `'ENGLISH'` ✓ (unchanged)
- FR: `'ENGLISH'` ✓ (FR UI uses English content via `contentLang()`)
Removed dead `const nativeLang = currentLang.toUpperCase()` in phrases feedback (unused since `contentLang()` refactor).

## v1 findings — status
1. Fixed — FR added to language selector and full `fr` TRANSLATIONS block added
2. Fixed — grammar category label shown above question (`showCurrentGrammar()`), explanation shown after answer, filter tags translated (#14), question read from correct language column (#15)
3. Fixed — `speak()` now selects voice by `currentLang` for native content (en-GB / nl-NL / de-DE / fr-FR)
4. Fixed — conjugation speech reads `pairs[pi].left + ' ' + pairs[pi].right` (pronoun + verb form)
5. Fixed — word relationships speech reads `item.french1 + ', ' + item.french2` (both words)
6. Fixed — gender speech prepends correct article: `speak(article + ' ' + bare, true)`
7. Fixed — tense selector (`tense-select`) added; difficulty selector repurposed for verb regularity (easy = regular verbs, hard = irregular)
8. Fixed — `speak(item.answer, true)` added in `checkGrammarAnswer()`
9. Fixed — `grammar-category` shows `item.category`; `grammar-explanation` shows `item.explanation`
10. Fixed — weather vocabulary v-269 to v-275 corrected in v7 database
11. Fixed — language option labels set from `TRANSLATIONS[lang].langXX` keys so each name displays in its own language
12. Fixed — `speak()` searches `getVoices()` for a female voice matching the language code, falls back to any matching-language voice
13. Fixed — database.js header comment corrected to v7; gen_db.py output comment fixed
14. Fixed — grammar category filter tags translated in EN/NL/DE/FR via `GRAMMAR_CAT_LABELS` + `grammarCatLabel()`
15. Fixed — `getGrammarQuestion()` maps UI language to the correct DB column: `{en:'question', nl:'question_nl', de:'question_de', fr:'question_fr'}`
16. Fixed — UI language and content language decoupled via `contentLang()` helper
17. Fixed — welcome screen mode buttons use `T('wordrel')` which returns "Word Relationships" (full string, not truncated)

## OBS 18 — Conjugation pronoun order fixed (2026-04-17)
**Fix:** Pronouns in the conjugation left column now always appear in the standard order: je, tu, il/elle, nous, vous, ils/elles.
- Added module-level `PRONOUN_ORDER` constant (array of 6 pronoun strings).
- `buildPairs()` conjugation branch now sorts the result array by `PRONOUN_ORDER.indexOf(a.left)` before returning. Unknown pronouns sort to the end (index 99).
- `leftItems` in `startRound()` is already unshuffled (`pairs.map((_, i) => i)`) so no change was needed there — the sort in `buildPairs()` is sufficient.

## OBS 19 — Identical conjugation forms accepted as correct (2026-04-17)
**Fix:** When two pronouns share the exact same conjugated form (e.g. "il mange" / "elle mange" → both "mange"), matching either pronoun with that form is now accepted as correct for both.
- Added `else if (mode === 'conjugation' && pairs[pi].right === pairs[selIdx].right)` branch in `onCell()`, between the exact-match block and the wrong-match block.
- On identical-form match: sets `matched[pi] = matched[selIdx] = true`; rerenders all 4 cells (left + right for both pairs); adds both IDs to `sessionCorrectIds`; calls `sm2Update(..., true)` for both; speaks "pronoun1 / pronoun2 form"; sets feedback "✓ pronoun1 / pronoun2 → form"; pushes two correct entries to `roundResults`; updates progress bar; triggers round-end if all matched.

## Grammar questions no longer leak the answer (2026-04-17) — new fix (not in original 17 findings)
**Problem:** 15 grammar questions (g-1 through g-9, g-21, g-23, g-24, g-35, g-66, g-68, g-69) had their French answer embedded directly in the question text, e.g. "the house (la maison)" with answer "la maison". Additionally all 138 non-trivial `question_fr` fields were formatted as "French answer (hint)" — the answer led every question when UI=FR.

**Fix in database.js (60 string replacements):**
- Simple cases (g-1–g-9, g-23, g-24, g-68): removed the parenthetical French hint entirely — "the house (la maison)" → "the house". Applied to all 4 question columns (EN/NL/DE/FR). For `question_fr`, since the original value was "la maison (la maison)", the fix replaces it with the English prompt "the house".
- Possessive-choice cases (g-21, g-66, g-69): replaced the options list that included the answer noun — "my friends (mon/ma/mes amis)" → "my friends (mon, ma or mes?)". Keeps the possessive-choice hint but removes the noun that made the full answer visible.
- Adjective-agreement case (g-35): "my favorite book (mon livre favori/favorite)" → "my favorite book (favori or favorite?)". Keeps the adjective-form hint.

**Fix in app.js (1 line):**
- `getGrammarQuestion()` now maps `fr` → `'question'` (English) instead of `'question_fr'`. Reason: `question_fr` fields are formatted as "French answer (hint)" — 138 of 160 contain the answer. FR UI users are English speakers learning French (consistent with `contentLang()='en'` for FR), so the English question is the correct prompt. Verified: 0 leaks across all 4 UI languages after fix.

## Direction toggle removed from Vocabulary mode (2026-04-17) — new improvement (not in original 17 findings)
**Fix:** `applyModeUI()` previously showed the FR ↔ native direction toggle in Vocabulary mode. Changed `mode === 'vocab' ? 'flex' : 'none'` to `'none'` unconditionally — direction-row is now always hidden. The `direction` state variable and `toggleDirection()` function are retained for potential future use but the UI control is no longer shown.

## Language change no longer restarts the exercise (2026-04-17) — new improvement (not in original 17 findings)
**Fix:** `setLanguage()` previously called `startRound()` after `applyTranslations()`, discarding the user's current round on every language switch. Removed the `startRound()` call. The function now only updates `currentLang`, saves settings, and re-renders UI text via `applyTranslations()`. The active exercise continues uninterrupted.

## Verb dropdown translated labels (2026-04-17) — new improvement (not in original 17 findings)
**Fix:** Verb selector now shows translations in the active UI language instead of always English.
- `populateVerbSelect()` now looks up each verb in `VOCAB` by exact `item.fr` match and uses `item[contentLang()]` as the translation, falling back to `v.en` if not found. Display format: `être (zijn)` / `être (sein)` / `être (to be)`.
- Added `refreshVerbSelectLabels()`: updates only the text of existing `<option>` elements using the same lookup logic, without touching the selection or `currentVerb`. Called from `applyTranslations()` so the dropdown re-translates on every language switch.
- `populateVerbSelect()` is still called on mode entry and difficulty change (rebuilds full list + resets selection); `refreshVerbSelectLabels()` is called on language change only (preserves selection).

## Gender mode native translation display (2026-04-17) — new improvement (not in original 17 findings)
**New feature:** Native translation shown below the French word in Gender mode.
- `showCurrentGenderWord()` now creates a `div#gender-translation` element in JS (inserted after `#gender-word-display`) if it doesn't already exist. On every word change it sets `textContent = getTranslation(word)`. Style: font-size:14px; color:#999; text-align:center.
- Both `roundResults.push` calls in `checkGender()` updated to `left: word.fr + ' — ' + getTranslation(word)` so the round summary shows e.g. "le dos — back → le (m)".
- index.html was not modified.

## Conjugation verb auto-advance (2026-04-17) — new improvement (not in original 17 findings)
**New feature:** Each conjugation round now automatically moves to a different verb.
- Added `conjugationSessionVerbs` state variable (`null` = first round, `[]` = queue exhausted).
- Added `initConjugationSessionVerbs()`: builds a shuffled list of all available verbs (filtered by `currentDifficulty`) excluding `currentVerb`, stored in `conjugationSessionVerbs`.
- Modified `buildPairs()` conjugation branch: first call uses `currentVerb` and inits the queue; subsequent calls shift the next verb from the queue (updates `currentVerb` and the verb dropdown). Queue is rebuilt when exhausted.
- `conjugationSessionVerbs` is reset to `null` (triggering first-round behaviour) in: `setMode('conjugation')`, `startFromWelcome('conjugation')`, `setVerb()`, `setDifficulty()`.

## Grammar CEFR level filtering (2026-04-17) — new improvement (not in original 17 findings)
**New feature:** Level tabs now filter Grammar questions by CEFR level.
- `pickGrammarItems()` now filters the grammar pool by cumulative CEFR levels before selecting items: Beginner (A1) → A1 only; Elementary (A2) → A1+A2; Intermediate (B1) → A1+A2+B1; Advanced (B2) → A1–B2; Expert (C1) → all levels.
- Uses `getItemLevel(g)` which reads `g.cefr` (the field name in database.js for grammar items).
- Fallback: if the combined level+category filter yields zero items, the full GRAMMAR array is used.
- `resetSessionIfExhausted` is now called on the filtered pool (was previously called on all of GRAMMAR).
- Level-tabs were already visible for Grammar mode (`applyModeUI()` only hides them for `phrases` and `conjugation`) — no change needed there.

## OBS 19 revised — Identical conjugation forms require individual matching (2026-04-18)
**Changed:** The original OBS 19 fix auto-matched both pronouns when they shared the same conjugated form (e.g. "je finis" and "tu finis" both matched in one click). This was reverted to require the user to match each pair individually.
**New behaviour:** When the user selects a pronoun (left) and clicks a verb form (right) that matches by value but belongs to a different pair, only the selected pronoun's pair is marked correct. The other pair (same verb form) remains on screen and must be matched separately. Either verb-form cell may be used to complete either pronoun — the visual result is identical since the form text is the same.
**Fix in app.js (`onCell`, line ~1087):**
- Removed `matched[pi] = true` and the second `rerender`/`sessionCorrectIds`/`sm2Update`/`roundResults` lines.
- Left `matched[selIdx] = true`, one `rerender` pair, one `sm2Update`, one `roundResults.push`, one `speak` (pronoun + form, no dual-pronoun concatenation).
- No change to index.html, style.css, database.js.

## OBS 20 — Grammar questions no longer reveal answer text (2026-04-18)
**Problem:** 143 grammar question fields in database.js contained the answer (or parts of it) verbatim inside the question text, making the correct response visible before the user answered.
- 138 items: `question_fr` was formatted as `"[French answer] ([hint])"` — answer led the string
- g-22 (all 4 fields): answer `"l'ami / l'amie"`, question `"the friend (l'ami or l'amie)"` — parts of a `/`-separated answer appeared in all four columns
- g-79 (`question_fr`): answer `"C'est pluvieux / Il pleut"`, question_fr `"Il pleut (expression météo)"` — one part appeared in the FR column

**Fix in database.js only:**
- Pass 1 (138 items): for every grammar item where any question field contains the exact answer string, that field is replaced with `question` (the English question text).
- Pass 2 (g-22, 4 fields): English question itself leaked — replaced all four columns with `"the friend (masculine or feminine?)"` / `"de vriend (mannelijk of vrouwelijk?)"` / `"der Freund (männlich oder weiblich?)"` / `"the friend (masculine or feminine?)"`.
- Pass 3 (g-79, `question_fr`): replaced with English question `"It's raining (weather expression)"`.
- Final check: 0 exact-answer leaks and 0 partial-answer (slash-separated) leaks across all 160 grammar items × 4 question fields.
- No change to answer, explanation, category, or any other field. No change to app.js, index.html, or style.css.

## OBS 20b — Pluralization question hints no longer reveal French form (2026-04-18)
**Problem:** All 10 pluralization grammar items used hints like `"(plural of le livre)"` / `"(meervoud van le livre)"` / `"(Plural von le livre)"` — giving away the singular French form which is essentially the answer stem.
**Fix in database.js only:** Regex replacement across all 4 question columns for all 10 `category === 'pluralization'` items:
- EN: `"(plural of ...)"` → `"(make it plural)"`
- NL: `"(meervoud van ...)"` → `"(meervoud maken)"`
- DE: `"(Plural von ...)"` → `"(Mehrzahl bilden)"`
- FR: `"(plural of ...)"` → `"(mettre au pluriel)"` (FR column had already been set to the English text by OBS 20 fix)
- Verification: 0 items remain with `plural of`, `pluriel de`, `meervoud van`, or `Plural von` in any question field.

## database.js regenerated from updated xlsx (2026-04-18)
**Action:** Regenerated database.js from `French_Learning_Content_Database_v7(1).xlsx` using recreated `gen_db.py`.
**Verified counts:** vocab=3000, conj=1224, verbs=49, grammar=160, phrases=100, wordrel=250.
**Accent encoding:** The xlsx stores accented characters as XML numeric entities (`&#232;` = è). openpyxl decodes these correctly to Unicode at runtime — no special handling needed.
**Grammar leak post-processing built into gen_db.py:**
- All `question_nl`, `question_de`, `question_fr` fields that contain the answer string are replaced with the English `question` text (OBS 20 logic).
- Slash-part answers (e.g. `l'ami / l'amie`) are also caught — any field containing a slash-part is replaced with English question.
- Three hard-coded overrides where all four columns needed rewriting:
  - g-9: `"a small boy (un petit garçon)"` → `"a small boy"` (and NL/DE equivalents stripped of French hint)
  - g-22: `"the friend (l'ami or l'amie)"` → `"the friend (masculine or feminine?)"` (all four languages)
  - g-35: `"my favorite book (mon livre favori/favorite)"` → `"my favorite book (favori or favorite?)"` (all four languages)
- OBS 20b pluralization fixes (EN column) were already in the updated xlsx.
**To regenerate in future:** `cd french-practice-v2 && python gen_db.py`

## Delete profile button added (2026-04-18)
**New feature:** Each profile row in the profile overlay now shows a trash-icon delete button to the right of the profile name.
**Rules:**
- Delete button only appears when there are 2+ profiles — always keeps at least one.
- Clicking delete calls `confirm()` before proceeding.
- On confirm: removes the profile from `frenchPractice_profiles` in localStorage and clears all five per-profile keys (`_progress`, `_settings`, `_streak`, `_bests`, `_practicelog`).
- If the deleted profile was the active one (`currentProfile === name`), resets `currentProfile = null` and calls `showProfileOverlay()` to force re-selection.
- Otherwise calls `renderProfileScreen()` to refresh the list in place.
**Changes in app.js only:**
- `renderProfileScreen()`: each profile is now wrapped in a flex `<div>`; delete button appended when `profiles.length > 1`. Inline styles used — style.css not modified.
- New `deleteProfile(name)` function added immediately before `showProfileOverlay()`.

## Level label rename (2026-04-19) — tasks.txt Task 1
**Changed:** All level labels renamed across all 4 UI languages. Key names and `data-level` attributes unchanged.
- EN: Beginner→Foundation, Elementary→Essential, Expert→Proficient; added Mastery (C2)
- NL: Beginner→Basis, Elementair→Essentieel, Expert→Vaardig; added Meesterschap (C2)
- DE: Anfänger→Grundlagen, Elementar→Wesentlich, Experte→Kompetent; added Meisterschaft (C2)
- FR: Débutant→Fondation, Élémentaire→Essentiel, Expert→Maîtrise; added Excellence (C2)

## C2 level tab added (2026-04-19) — tasks.txt Task 2
**New level:** C2 ("Mastery") added after C1 via JS in `init()`. `LEVEL_MIX` and `TENSE_BY_LEVEL` extended with C2 entries. `applyTranslations()` levelKeys updated to include `C2: 'mastery'`. Tab inserted dynamically — index.html not modified.

## GDPR privacy notice in About text (2026-04-19) — tasks.txt Task 3
**Changed:** `aboutText` in all 4 languages now appends a GDPR/privacy notice: data is stored locally only, nothing sent to server, no personal data collected.

## Personal Bests removed from Progress panel (2026-04-19) — tasks.txt Task 4
**Removed:** Personal Bests section hidden via JS in `showDashboard()` (`dash-label-bests` + `bests-grid` set to `display:none`). Removed `'dash-label-bests': 'personalBests'` from `applyTranslations()` ids map. Bests data collection and `updateBest()` function retained.

## Focus recommendation added to Progress panel (2026-04-19) — tasks.txt Task 5
**New feature:** "Focus here next" recommendation box inserted below the stats grid in the Progress dashboard. `computeFocusRecommendation()` scans all modes/subcategories for unstarted modes (→ "haven't started X"), then finds the weakest-coverage subcategory (seen > 0). If all subcategories > 50%, shows "Great progress!" All text keys in TRANSLATIONS: `focusTitle`, `focusNotStartedMode`, `focusNotStartedSubcat`, `focusWeakSubcat`, `focusAllGood` — translated in EN/NL/DE/FR. `fmt()` helper added for `{0}`/`{1}` template substitution.

## Collapsible how-to help button per mode (2026-04-19) — tasks.txt Task 6
**New feature:** A "?" button (24px, round) appears top-right inside the practice card for every mode. Clicking toggles a help panel with mode-specific explanation. Panel collapses on mode change. `ensureHelpBtn()` called from `startRound()`. Help text keys added to TRANSLATIONS in all 4 languages: `helpVocab`, `helpGender`, `helpWordrel`, `helpConjugation`, `helpGrammar`, `helpPhrases`, `helpLearn`. CSS added in style.css: `.help-btn`, `.help-panel`, `#help-container`. `position: relative` added to `.practice-card`.

## GitHub push (2026-04-19)
Commit: `5bfd4c1` — "v1 desktop - all fixes complete, ready for Learn mode"
Pushed to: github.com/Eelco1403/french-practice-v2 (master)
Included: all v1 fixes (findings 1–17, OBS 18–20b), tasks.txt Tasks 1–6, database.js, Deployment_Checklist.md, tasks.txt, French_Learning_Content_Database_v7.xlsx.

## Learn mode added (2026-04-19) — tasks.txt Tasks 1–8
**New mode:** "Learn" tab added to the Words group (before Vocabulary) in index.html.

**Two-phase approach:**
- Phase 1 (Flash): Shows 5 word pairs (native → French) one at a time with audio. Duration per pair is level-dependent: A1=3s, A2=2.5s, B1=2s, B2=1.5s, C1=1s, C2=0.5s (`LEARN_FLASH_DURATION` constant).
- Phase 2 (Match): After all 5 pairs flash, the existing arena matching mechanic is used. Only 5 items, single-column grid.

**Constants:** `LEARN_FLASH_DURATION` and `LEARN_BATCH_SIZE = 5` added near state section.

**State:** `learnBatch`, `learnFlashIndex`, `learnFlashTimer` added.

**Functions:** `startLearnRound()`, `startLearnFlash()`, `startLearnMatch()` added before the Sound section.

**Integration:**
- `startRound()`: learn branch added, hides learn-card in reset block
- `applyModeUI()`: level-tabs shown, topic-row shown (same as vocab), modeDescKeys includes `learn: 'instrLearn'`
- `applyTranslations()`: modeDescKeys and helpKeys updated to include learn
- `nextRound()`: clears `learnFlashTimer` before restarting
- Round summary / SM-2 / updateBest work automatically via existing `showRoundEnd()`

**UI:** `learn-card` div added to index.html after wordrel-card. CSS classes `.learn-card`, `.learn-phase-label`, `.learn-flash-display`, `.learn-native-word`, `.learn-arrow`, `.learn-french-word`, `.learn-progress` added to style.css.

**Translations:** `learn`, `instrLearn`, `learnPhase1`, `learnPhase2`, `learnReady` added to all 4 languages.

## Learn mode welcome screen + help fix (2026-04-19)

**Task 1 — Learn button on welcome screen:**
- Learn button added as the first item in the welcome-modes grid in index.html, wrapped in `#learn-welcome-cell` (flex column) with a hidden `#learn-welcome-hint` div beneath it.
- `showWelcomeScreen()` updated: `learn: T('learn')` added to `modeNames`; when `ids.length === 0` (brand-new profile) the Learn button gets green border/background and the hint div shows `T('newStartHere')`. Styling resets when the user has any practice history.
- Translation key `newStartHere` added to all 4 languages: EN "New? Start here", NL "Nieuw? Begin hier", DE "Neu? Fang hier an", FR "Nouveau ? Commence ici".

**Task 2 — Help text fix for Learn mode:**
- `ensureHelpBtn()` helpKeys map was missing `learn: 'helpLearn'`. Added. Now the ? button in Learn mode correctly shows the helpLearn text in the active UI language.

## v2 planned features
- Timed exercises — toggle per mode and difficulty
- Conjugation sentence gap-fill
- Typing mode with accent buttons
- Listening/sound mode
- Technical grammar mode
- Reading comprehension mode

## v3 planned features
- Mobile optimisation and responsive layout
- PWA — installable, offline capable
- GitHub Pages — shareable URL
- Claude AI integration — dynamic content generation

## Commercial plan
- €10 per language pair via Gumroad zip download
- Start with Dutch ↔ French targeting expat communities in France
- Expansion packs €3–5 (Grammar pack, Reading Comprehension pack)
- No server needed — runs entirely from downloaded files
- Future: NL ↔ English, Spanish ↔ French, Dutch ↔ German