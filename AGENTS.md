# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

---

# Just Salads — Project Context

Filled after v1 (Module 5). New Cursor chats should read this file first.

---

## App

**Name:** Just Salads  
**One-line description:** A local gourmet salad recipe browser — filter by cuisine/flavor/season, view recipes with photos, scale amounts, toggle metric/US, and copy ingredients or the full recipe.  
**Current version:** 1.0.0 (v1)

---

## How to run

```bash
cd just-salads
npx expo start --ios
```

Prefer **iOS Simulator** for now — App Store Expo Go may not support SDK 57 yet.

**Reload:** Simulator `Cmd+R`, or shake device → Reload when on a physical phone.

---

## Tech stack

- Expo SDK: **57**
- Router: **Expo Router** (stack: list → detail)
- Local storage: **AsyncStorage** for favorite recipe IDs (`@just-salads/favorites`); recipes themselves are a bundled static catalog (`src/data/salads.json` + WebP assets)
- Key packages: `expo-image`, `expo-clipboard`, `expo-haptics`, `@expo/vector-icons`, `@react-native-async-storage/async-storage`

---

## Folder map

| Path | Purpose |
|------|---------|
| `src/app/` | Screens (Expo Router) |
| `src/app/index.tsx` | Recipe list — search, filter dropdowns, Favorites filter, 2-col grid |
| `src/app/recipe/[id].tsx` | Recipe detail — scale, US/Metric, favorite heart, copy, ingredients, instructions |
| `src/components/` | `SaladCard`, `FilterBar`, `CopyButtons`, `FavoriteButton`, etc. |
| `src/context/favorites.tsx` | FavoritesProvider + AsyncStorage persistence |
| `src/hooks/use-favorites.ts` | Re-exports `useFavorites` |
| `src/data/` | `salads.json`, `saladImages.ts`, `filterOptions.ts` |
| `src/types/salad.ts` | `Salad`, filter types |
| `src/utils/` | filter, scale, metric, dressing format, highlight helpers |
| `src/constants/theme.ts` | Colors, spacing, radius |
| `assets/images/salads/` | 75 recipe WebP images (from meal-prep-salads) |
| `PLAN.md` / `DESIGN-BRIEF.md` | Approved plan and design brief |

---

## Data models

```typescript
type Flavor = 'Tangy' | 'Creamy' | 'Spicy' | 'Fresh' | 'Savory' | 'Umami';
type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'Year-round';
type SubCuisine =
  | 'American' | 'Italian' | 'Greek' | 'French' | 'Middle Eastern'
  | 'Spanish' | 'Mexican' | 'Indian' | 'Thai' | 'Japanese'
  | 'Korean' | 'Vietnamese';

type Salad = {
  id: number;
  name: string;
  imageSlug: string;
  cuisine: string;
  subCuisine: SubCuisine;
  flavorTags: Flavor[];
  seasons: Season[];
  ingredients: string[]; // may include Dressing: … // measured DIY lines
  steps: string[];
};
```

Content source: ported from sibling repo `meal-prep-salads` (75 recipes + WebPs). Re-export script: `meal-prep-salads/scripts/export-just-salads.mts`.

Favorites (device-only):

```typescript
favoriteIds: number[]  // Salad.id — AsyncStorage key `@just-salads/favorites`
```

---

## v1 features (shipped)

- Browse all 75 salads (2-column grid; odd last card stays half-width)
- Search by name + Cuisine / Flavor / Season dropdown filters (AND)
- Recipe detail with hero image, tags, formatted ingredients (dressing broken out)
- Scale amounts (×1–×8) and **Metric default** / US toggle
- Accent amounts + instruction ingredient highlighting
- Copy Ingredients / Copy Recipe (`expo-clipboard`), respects scale + unit mode

## Module 6+ features (shipped)

- **Favorites** — heart on cards + detail header; header heart on list toggles favorites-only view; persist IDs in AsyncStorage

---

## Not in v1 (do not add without planning)

- Auth / accounts
- Payments / subscriptions
- Cloud sync / backend database
- Camera, push notifications
- User-added recipes, share sheet, favorite collections/folders
- Meal planner, diet filters (Vegan/Vegetarian/Paleo/Keto) from the web app
- Shipping PNG master images from meal-prep-salads (`images/` ~473 MB)

---

## Known issues / rough edges

- Physical iPhone / Expo Go blocked until store Expo Go supports SDK 57 — use Simulator
- Metric conversion uses volume→grams heuristics (same idea as meal-prep-salads); count units (can, pinch, avocado) stay unchanged
- Dressing highlight / plural matching is best-effort — may miss unusual aliases

---

## Design

- Vibe: clean, minimal, quirky; leafy green primary (`#2F6B3A`), light background
- Do **not** clone the meal-prep-salads web CSS — this is a new iOS UI

---

## Approved plan

See [`PLAN.md`](PLAN.md) in project root.
