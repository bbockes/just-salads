# Build Progress

Cursor reads this file to know where you are. Say **"what's next"** in chat for the next step, or **"step complete"** when you finish one.

**App name:** Just Salads

**Last updated:** 2026-07-19

---

## Module 1 — Setup (one-time per app)

- [x] Node.js works (`node -v`)
- [x] Expo Go installed on iPhone
- [x] Project created with `npx create-expo-app@latest`
- [x] `.cursor/rules/` copied into project
- [x] `PROGRESS.md` and `DESIGN-BRIEF.md` in project root
- [x] `npx expo start` — app loads (iOS Simulator; App Store Expo Go lacks SDK 57)

## Module 2 — Design

- [ ] `DESIGN-BRIEF.md` filled out (v1 scope small: no auth, no payments, local storage)
- [ ] Reference screenshots or sketches collected
- [ ] Data fields defined for anything the app saves

## Module 3 — Plan

- [ ] Used APP-PLAN-PROMPT in Cursor (plan only — no code)
- [ ] Plan reviewed and revised
- [ ] `PLAN.md` saved in project root

## Module 4 — Build v1

- [ ] BUILD-PROMPT run — implementation started
- [ ] `npx expo start` — tested on phone
- [ ] Core v1 feature works
- [ ] Major bugs fixed (iterate with screenshots / errors)

## Module 5 — Habits

- [ ] `AGENTS.md` filled from PROJECT-CONTEXT template
- [ ] Git initialized and v1 committed (recommended)

## Module 6 — Extra features (optional)

- [ ] _(feature name)_ — planned
- [ ] _(feature name)_ — built and tested

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



