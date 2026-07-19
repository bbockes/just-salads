# New App Checklist

One-page reference for the [Cursor Mobile App Building Curriculum](../README.md).

**Easier way:** Open project in Cursor → paste [START-HERE-PROMPT.md](templates/START-HERE-PROMPT.md) → say **`what's next`** or **`step complete`**.

---

## One-time setup (Module 1)

- [ ] Node.js installed (`node -v` works)
- [ ] Expo Go installed on iPhone
- [ ] Cursor installed and working

---

## New project (every app)

- [ ] `npx create-expo-app@latest my-app-name` (you run this — not AI)
- [ ] Copy `starter-kit/.cursor/` → project `.cursor/`
- [ ] Copy `starter-kit/PROGRESS.md` → project root
- [ ] Copy `starter-kit/DESIGN-BRIEF.md` → project root
- [ ] Open folder in Cursor
- [ ] Paste [START-HERE-PROMPT.md](templates/START-HERE-PROMPT.md) → **`what's next`**
- [ ] `npx expo start` → QR → app loads in Expo Go

---

## Design (Module 2)

- [ ] Fill `DESIGN-BRIEF.md` in **project root** (say **step complete** when done)
- [ ] v1 = 1–2 features, local storage, no auth/payments
- [ ] Sketches or reference screenshots collected
- [ ] Data fields defined

---

## Plan (Module 3)

- [ ] New Cursor chat
- [ ] Paste [`templates/APP-PLAN-PROMPT.md`](templates/APP-PLAN-PROMPT.md) + attach brief & images
- [ ] Review plan — **no code yet**
- [ ] Save approved plan → `PLAN.md` or `AGENTS.md`

---

## Build (Module 4)

- [ ] Paste [`templates/BUILD-PROMPT.md`](templates/BUILD-PROMPT.md)
- [ ] `npx expo start` running
- [ ] Test on phone after each chunk
- [ ] Fix with [`templates/ITERATION-PROMPTS.md`](templates/ITERATION-PROMPTS.md)
- [ ] v1 core feature works

---

## Habits (Module 5)

- [ ] `AGENTS.md` filled from [`templates/PROJECT-CONTEXT.md`](templates/PROJECT-CONTEXT.md)
- [ ] New chat when context gets confused
- [ ] No secrets in chat or git
- [ ] Git commit at working v1 (recommended)

---

## Optional: complexity (Module 6)

- [ ] One feature at a time
- [ ] Plan → build → test for each

---

## Optional: ship (Modules 7–8)

- [ ] Apple Developer account ($99/yr)
- [ ] Expo account + `eas login`
- [ ] `eas build --platform ios`
- [ ] `eas submit` → TestFlight
- [ ] App Store Connect metadata + screenshots
- [ ] Submit for review

---

## Quick commands

| Task | Command |
|------|---------|
| Start dev server | `npx expo start` |
| Install Expo package | `npx expo install [package]` |
| EAS configure | `eas build:configure` |
| iOS cloud build | `eas build --platform ios` |
| Submit TestFlight | `eas submit --platform ios` |

---

## When stuck

1. Copy full error → paste in Cursor  
2. Screenshot UI → attach → describe what's wrong  
3. Shake phone → Reload  
4. New chat + point to `AGENTS.md`
