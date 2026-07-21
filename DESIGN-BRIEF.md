# Design Brief

**Location:** Keep this file in your **project root** (same folder as `package.json`). Cursor reads it to know if Module 2 is done.

Fill this out **before** Module 3 (planning). Say **"what's next"** in Cursor when you need the next step.

---

## App identity

**App name:**  
Just Salads

**One sentence — who is it for and what does it do?**  
A simple recipe app that stores 75+ gourmet salad recipes with pictures and lets users copy ingredients or the full recipe for each one.

---

## v1 — ship this first

**Core features (1–2 only):**

1. Filter salads by cuisine, flavor, and season to find recipes quickly
2. Copy ingredients or the full recipe for any salad (one tap)

**Screens in v1** (list each screen):

| Screen | What's on it | Main action |
|--------|--------------|-------------|
| Recipe list | Scrollable list of salads with pictures/names; filter controls for cuisine, flavor, season | Open a salad; apply filters |
| Recipe detail | Picture, name, ingredients, recipe steps; Copy Ingredients + Copy Recipe buttons | Copy ingredients or recipe to clipboard |

**Data — what gets saved on the phone?**

| Thing | Fields | Example |
|-------|--------|---------|
| Salad recipe | id, name, image, cuisine, flavor, season, ingredients (list), recipe (steps/text) | "Summer Caprese", Italian, fresh/bright, summer, ["mozzarella", "tomato", …], "1. Slice…" |

All recipe data is **local** (bundled or stored on device). No cloud sync in v1.

**v1 explicitly does NOT include:**

- [x] Login / accounts
- [x] Payments / subscriptions
- [x] Cloud sync / database
- [x] Camera (unless core to the app)
- [x] Push notifications

---

## Later — parking lot

Features to add **after** v1 works:

- Favorites / saved salads
- Search by ingredient
- User-added custom recipes
- Sharing recipes (beyond clipboard)

---

## Look and feel

**Vibe / style:**  
Clean, minimal, quirky

**Colors (if known):**  
- Primary:  
- Background:  
- Accent:  

**Reference apps or sites:**  
_(App Store links, Pinterest, screenshots)_

1. 
2. 

**Reference images location:**  
_(folder path in project, e.g. `design-references/`)_

---

## Notes

_Anything else Cursor should know before planning:_

- Target catalog size: 75+ gourmet salad recipes with pictures
- Copy actions should put plain text on the clipboard (ingredients list and full recipe separately)
