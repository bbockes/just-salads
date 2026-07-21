# Just Salads — v1 Implementation Plan

## App summary

**Just Salads** is a local recipe browser for gourmet salads. Users filter by cuisine, flavor, and season, open a recipe, and copy ingredients or the full recipe to the clipboard.

**Content source (locked):** Reuse recipes and photos from the existing web app `meal-prep-salads` — new Expo UI/design, same catalog.

## Content from meal-prep-salads

| Asset | Source path | Notes |
|-------|-------------|-------|
| 75 recipes | `meal-prep-salads/src/data/recipes.ts` (+ `ingredient-types.ts`, meta applied via `RECIPE_META_BY_ID`) | Full gourmet catalog already authored |
| Filter constants | `meal-prep-salads/src/data/constants.ts` | `FLAVOR_KEYS`, `SEASON_KEYS`, cuisine accents |
| Images (ship these) | `meal-prep-salads/public/images/*.webp` | 75 files, ~512×512, ~48–77 KB each (~4.7 MB total) |
| PNG masters (do not ship) | `meal-prep-salads/images/*.png` | Huge (~473 MB) — leave in the web repo |

**Image lookup (same as web):** optional `imageSlug`, else slug from name via `recipeCardImageSlug` (strip trailing ` Salad`, kebab-case). All 75 WebPs match that convention.

**Import step for build:** copy WebPs into `just-salads/assets/images/salads/`, port a slimmed recipe module into `src/data/`, and build a static `require()` map keyed by slug (React Native cannot use `/images/foo.webp` public URLs like Next).

## v1 scope

**Must have**
- Browse all 75 salads with images and names
- Filter by **cuisine** (`subCuisine`), **flavor** (`flavorTags`), and **season** (`seasons`) — combinable AND
- Recipe detail with ingredients + steps
- Copy Ingredients and Copy Recipe (plain text via `expo-clipboard`)

**Must NOT include**
- Auth, payments, cloud sync, camera, push notifications
- Favorites, search-by-ingredient, user-added recipes, share sheets
- **Web-app extras deferred:** meal planner, diet filters (Vegan/Vegetarian/Paleo/Keto), portion/unit toggles, drag-and-drop, HTML copy formatting — keep parking lot / later

## Data models

```ts
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
  ingredients: string[];
  steps: string[];
};
```

**Clipboard payloads (simple v1)**
- **Ingredients:** recipe name, then one `ingredients` line per line
- **Recipe:** name + ingredients block + numbered `steps`

## Navigation & screens

Replace the default Expo tabs/explore template with a **stack**:

| Screen | Route | UI | Actions |
|--------|-------|-----|---------|
| Recipe list | `src/app/index.tsx` | Header “Just Salads”; chip rows for cuisine / flavor / season; scrollable cards | Toggle filters; open detail |
| Recipe detail | `src/app/recipe/[id].tsx` | Hero image, name, tags, ingredients, steps; Copy Ingredients + Copy Recipe | Clipboard + brief confirmation |

Filter UX: three chip rows; one active value per dimension (or All); dimensions AND together.

## File / folder structure

```
src/
  app/
    _layout.tsx
    index.tsx
    recipe/[id].tsx
  data/
    salads.ts
    filterOptions.ts
    saladImages.ts
  types/
    salad.ts
  components/
    SaladCard.tsx
    FilterChips.tsx
    CopyButtons.tsx
  constants/
    theme.ts
  utils/
    filterSalads.ts
    formatClipboard.ts
    imageSlug.ts
assets/
  images/salads/   # 75 × .webp
```

## Packages

| Package | Why |
|---------|-----|
| `expo-router` (existing) | Stack; `recipe/[id]` |
| `expo-image` (existing) | WebP recipe images |
| `expo-clipboard` (**add**) | Copy ingredients / recipe |
| `expo-haptics` (optional) | Feedback on copy |

No AsyncStorage/SQLite in v1 — catalog is static bundled data.

## Design direction

- **New iOS design** — clean, minimal, quirky; do **not** clone the meal-prep-salads web layout/CSS
- Light theme; leafy/fresh accent in `theme.ts`
- Touch targets ≥ 44pt on copy buttons

## Step-by-step build order

1. Import assets — copy 75 WebPs; generate `saladImages.ts` require map
2. Port data — adapt recipes + `filterOptions` / `imageSlug` helper
3. Theme + navigation shell — stack `_layout`; drop tabs/explore
4. List screen — cards wired to full 75-recipe catalog
5. Filters — chips + `filterSalads`; empty state
6. Detail + copy — layout, `expo-clipboard`, confirmation
7. Polish — safe areas, unknown id, image loading

## Out of scope

Do not add favorites, auth, backend, camera, meal planner, or diet filters in this build.
