# Build Progress

Cursor reads this file to know where you are. Say **"what's next"** in chat for the next step, or **"step complete"** when you finish one.

**App name:** Just Salads

**Last updated:** 2026-07-20

**Next session:** Module 7 — TestFlight (say **"what's next"** or **"start TestFlight"**)

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
- [x] Favorites — built and tested _(header heart toggles favorites-only; card/detail hearts save)_

## Module 7 — TestFlight (optional) ← **YOU ARE HERE**

- [ ] Expo account + `eas login`
- [ ] Apple Developer account ($99/yr — required for TestFlight / App Store)
- [ ] `eas build:configure` + unique bundle ID in `app.json`
- [ ] `eas build --platform ios` succeeded
- [ ] Build submitted + TestFlight build installed on phone

## Module 8 — App Store (optional)

- [ ] App Store Connect metadata + screenshots
- [ ] Submitted for review

---

## Notes

- Modules 1–6 complete. Ready for shipping when user has Expo + Apple Developer accounts.
- Module 1: iOS Simulator for day-to-day; physical Expo Go may lack SDK 57 until store catches up.
- v1: meal-prep-salads catalog (75 recipes + WebPs), filters, search, copy, scale, metric/US, dressing formatting, instruction highlights.
- Module 6: Favorites via AsyncStorage (`@just-salads/favorites`).
- Deployment reference: `.cursor/rules/deployment.mdc`
