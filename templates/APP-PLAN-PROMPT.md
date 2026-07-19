# App Plan Prompt

Copy everything below the line into a **new Cursor Agent chat**. Attach your filled `DESIGN-BRIEF.md` and reference screenshots.

Do **not** use this prompt until Module 2 (design) is complete.

---

```
I want to build a mobile app using Expo and React Native. This is v1 — keep it simple.

## App

**Name:** [YOUR APP NAME]

**Summary:** [ONE SENTENCE FROM DESIGN BRIEF]

## v1 scope

**Must have:**
- [FEATURE 1]
- [FEATURE 2]

**Must NOT include in v1:**
- No authentication
- No payments
- No cloud database (local storage on device only)
- [ANY OTHER EXCLUSIONS]

## Screens

[List each screen and what it does — copy from DESIGN-BRIEF]

## Data models

For each type of data saved locally, define fields and types:

Example format:
- Transaction: id, amount (number), category (string), note (string?), date (ISO string), emoji (string?)

[YOUR DATA MODELS]

## Design

Match the attached reference screenshots for layout, colors, and feel.
Design brief summary: [PASTE VIBE / COLORS FROM DESIGN-BRIEF]

## Your task

Give me a **full implementation plan only**. Do NOT write or edit any code yet.

The plan must include:
1. Recommended file/folder structure (Expo Router if applicable)
2. Which Expo packages you'll use and why
3. Screen-by-screen breakdown
4. Data storage approach (AsyncStorage, SQLite, etc.)
5. Step-by-step build order (what to implement first, second, third)
6. Risks or things I should decide before building

After I approve the plan, I'll ask you to implement it in a separate message.
```

---

## After Cursor responds

1. Read the plan carefully
2. Request changes in plain English
3. When satisfied, save the plan to `PLAN.md` or `AGENTS.md`
4. Proceed to [`BUILD-PROMPT.md`](BUILD-PROMPT.md)
