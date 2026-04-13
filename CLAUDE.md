# French Practice v2

A French language practice web app built with vanilla JavaScript, HTML, and CSS. No frameworks, no npm, no build tools.

## Stack

- Vanilla JS, HTML, CSS only
- No React, no Vue, no build tools, no package managers
- Web Speech API for audio
- All data (VOCAB, CONJ, VERBS) is embedded directly in `app.js`

## Game Modes

- **Vocabulary mode** — match French/English word pairs
- **Gender mode** — match words with their grammatical gender (le/la/les/un/une)
- **Antonym mode** — match words with their opposites
- **Conjugation mode** — match verb infinitives with conjugated forms

## Features

- Match-the-pairs game mechanic
- SM-2 spaced repetition algorithm
- Streak tracking
- Sound via Web Speech API
- Progress dashboard

## Known Bugs

1. **Conjugation mode shows vocabulary words** — when switching to conjugation mode, vocabulary words appear instead of verb conjugation forms.
2. **Round-end summary requires scrolling** — the summary panel shown at the end of a round is not fully visible without scrolling.

## Conventions

- Always use vanilla JS, HTML, and CSS — never introduce React, npm, or any build tooling
- Keep all data embedded in `app.js`; do not split into separate data files unless asked
