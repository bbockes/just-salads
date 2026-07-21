# Build Progress

Cursor reads this file to know where you are. Say **"what's next"** in chat for the next step, or **"step complete"** when you finish one.

**App name:** Just Salads

**Last updated:** 2026-07-20

---

## Module 1 — Setup (one-time per app)

- [x] Node.js works (`node -v`)
- [x] Expo Go installed on iPhone
- [x] Project created with `npx create-expo-app@latest`
- [x] `.cursor/rules/` copied into project
- [x] `PROGRESS.md` and `DESIGN-BRIEF.md` in project root
- [x] `npx expo start` — app loads (iOS Simulator; App Store Expo Go lacks SDK 57)

## Module 2 — Design

- [x] `DESIGN-BRIEF.md` filled out (v1 scope small: no auth, no payments, local storage)
- [ ] Reference screenshots or sketches collected _(skipped for now — optional)_
- [x] Data fields defined for anything the app saves

## Module 3 — Plan

- [x] Used APP-PLAN-PROMPT in Cursor (plan only — no code)
- [x] Plan reviewed and revised
- [x] `PLAN.md` saved in project root

## Module 4 — Build v1

- [x] BUILD-PROMPT run — implementation started
- [x] `npx expo start` — tested on phone _(iOS Simulator)_
- [x] Core v1 feature works
- [x] Major bugs fixed (iterate with screenshots / errors)

## Module 5 — Habits

- [x] `AGENTS.md` filled from PROJECT-CONTEXT template
- [x] Git initialized and v1 committed (recommended)

## Module 6 — Extra features (optional)

- [x] Favorites — planned
- [x] Favorites — built and tested

## Module 7 — TestFlight (optional)

- [ ] Expo account + `eas login`
- [ ] Apple Developer account
- [ ] `eas build --platform ios` succeeded
- [ ] TestFlight build installed on phone

## Module 8 — App Store (optional)

- [ ] App Store Connect metadata + screenshots
- [ ] Submitted for review

---

## Notes

- Module 1 complete via iOS Simulator (`npx expo start --ios`) — physical iPhone blocked until App Store Expo Go supports SDK 57.
- v1 built from meal-prep-salads content: 75 recipes + WebP images, cuisine/flavor/season filters, clipboard copy.
- Module 4 UI iteration complete: search + filter dropdowns, recipe readability, scale, metric/US units, dressing formatting, instruction highlights.
- Module 5 complete — `AGENTS.md` filled; v1 committed (`d8370ed`).
- Module 6: Favorites — AsyncStorage IDs, heart on cards/detail, Favorites list filter.


