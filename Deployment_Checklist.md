# Pratique Française — Deployment Checklist

## Current Status (18 April 2026)
All technical fixes complete. App is functionally ready for v1 release.

---

## Before Packaging

### File Cleanup (do in project folder)
- [ ] Delete `gen_db.py` — temp file, not needed by users
- [ ] Delete `Pratique_Francaise_Assessment_v2.docx` — internal document
- [ ] Delete `.claude` folder — internal Claude Code settings
- [ ] Rename `French_Learning_Content_Database_v7(1).xlsx` to `French_Learning_Content_Database_v7.xlsx`

### Files that SHOULD be in the deployment zip
- [ ] `index.html`
- [ ] `app.js`
- [ ] `style.css`
- [ ] `database.js`
- [ ] `French_Learning_Content_Database_v7.xlsx` (source of truth)

### Files that should NOT be in the deployment zip
- `gen_db.py`
- `CLAUDE.md`
- `.claude` folder
- `Pratique_Francaise_Assessment_v2.docx`
- Any `.txt` task files

---

## GitHub
- [ ] Push latest code to GitHub (https://github.com/Eelco1403/french-practice-v2)
- [ ] Commit message: "v1 release — all fixes complete"

---

## GDPR Compliance (required before commercial release)
- [ ] Add a privacy notice — what data is stored (localStorage only, no server)
- [ ] Confirm no personal data leaves the user's device
- [ ] Add to About page: "All data stored locally on your device. Nothing is sent to any server."
- [ ] Reset all progress button already exists as data deletion option

---

## Gumroad Setup
- [ ] Create Gumroad account
- [ ] Set up Wise account for payouts
- [ ] Create product listing: "Pratique Française — Dutch/French"
- [ ] Price: 10 euros
- [ ] Prepare zip file with deployment files only
- [ ] Write product description (see assessment document)
- [ ] Add screenshots of the app

---

## Landing Page
- [ ] Create landing page per language pair (Dutch/French first)
- [ ] Target: anyone learning French seriously — lessons, courses, expats, travellers
- [ ] Key messages: serious practice tool, no gamification, spaced repetition, works offline
- [ ] Link to Gumroad product page

---

## Known Issues (v2 fixes)
- Grammar questions — some still reveal answer in question text (accepted for v1)
- Language switch mid-exercise resets in some edge cases (v2)
- Progress panel counts do not update in real time (v2)

---

## v2 Planned Features

### Priority
- First-time word introduction — when SM-2 sees a word for the first time, show French + translation + audio before drilling. Makes app accessible to near-beginners without full rebuild.
- Typing mode with accent buttons
- Listening mode — hear French, identify meaning
- Conjugation gap-fill in sentence context
- Scenario-based phrases (restaurant, doctor, housing, daily life)
- French-only definitions for B1+ users
- Timed exercises

### Secondary
- Reading comprehension — short texts with questions
- Sentence construction and reordering
- Native to French direction for vocabulary and phrases
- Fix remaining grammar question leaks in database

### v3
- Mobile optimisation — responsive layout for phone
- PWA — installable on phone, works offline
- GitHub Pages — shareable URL for testing

---

## Target Market (updated)
The app is suitable for anyone learning French seriously:
- People taking French lessons anywhere in the world
- People who bought a French course and need drilling
- People planning to visit or move to France
- Expats living in France
- People who love French and want to learn it properly

Current sweet spot: A2-B1 learners in formal study.
A1 near-beginner support planned for v2 via first-time word introduction feature.
Complete A1 (zero French knowledge) is out of scope — requires a fundamentally different app.
