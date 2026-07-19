# Build Prompt

Use **after** you approve the plan from Module 3. Paste into Cursor (same chat or new chat with plan attached).

---

```
The plan is approved. Implement v1 now.

## Rules

- Follow the approved plan in [PLAN.md / AGENTS.md / paste plan below]
- Implement in the order specified in the plan
- Use Expo Router conventions if this project has an `app/` directory
- Use `npx expo install` for any new native packages
- Store data locally only — no backend for v1
- Match the design references I provided earlier

## Approved plan

[PASTE FULL PLAN HERE — or say "see PLAN.md in project root"]

## When done

Tell me:
1. How to run and test (`npx expo start`)
2. What to tap to verify core features
3. Any known limitations or rough edges

Start implementing.
```

---

## Optional — build one chunk at a time

For larger apps, replace the main instruction with:

```
Implement **only step 1** from the approved plan: [DESCRIBE STEP].

Do not implement other steps yet. I'll test on Expo Go first, then ask for the next step.
```
