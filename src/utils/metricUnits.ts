/**
 * Imperial ↔ metric amount display (aligned with meal-prep-salads conversions).
 */

export type UnitMode = 'imperial' | 'metric';

const ML_PER_TSP = 4.92892;
const ML_PER_TBSP = 14.7868;
const ML_PER_CUP = 236.588;
const G_PER_OZ = 28.3495;
const G_PER_LB = 453.592;

const UNIT_ALIASES: Record<string, string> = {
  tablespoon: 'tbsp',
  tablespoons: 'tbsp',
  teaspoon: 'tsp',
  teaspoons: 'tsp',
  cups: 'cup',
  cup: 'cup',
  ounces: 'oz',
  ounce: 'oz',
  oz: 'oz',
  pounds: 'lb',
  pound: 'lb',
  lbs: 'lb',
  lb: 'lb',
  pint: 'pint',
  pints: 'pint',
  quart: 'qt',
  quarts: 'qt',
  qt: 'qt',
  tbsp: 'tbsp',
  tsp: 'tsp',
  g: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
};

const COUNT_UNITS = new Set([
  'can',
  'cans',
  'clove',
  'cloves',
  'slice',
  'slices',
  'piece',
  'pieces',
  'sprig',
  'sprigs',
  'bunch',
  'bunches',
  'head',
  'heads',
  'pinch',
  'dash',
  'handful',
  'scoop',
  'scoops',
  'pkg',
  'package',
  'packages',
  'pouch',
  'strip',
  'strips',
]);

function normalizeUnit(unitRaw: string): string {
  const u = unitRaw.toLowerCase().replace(/\.$/, '');
  return UNIT_ALIASES[u] ?? u;
}

function formatMetricMl(ml: number): string {
  if (ml >= 1000) {
    const L = ml / 1000;
    const t = L >= 10 ? L.toFixed(0) : L.toFixed(1).replace(/\.0$/, '');
    return `${t} L`;
  }
  if (ml < 10) return `${Math.round(ml * 10) / 10} ml`.replace(/\.0$/, '');
  return `${Math.round(ml)} ml`;
}

function formatMetricG(g: number): string {
  if (g >= 1000) {
    const kg = g / 1000;
    const t = kg >= 10 ? kg.toFixed(1).replace(/\.0$/, '') : kg.toFixed(2).replace(/\.?0+$/, '');
    return `${t} kg`;
  }
  if (g < 10) return `${Math.round(g * 10) / 10} g`.replace(/\.0$/, '');
  return `${Math.round(g)} g`;
}

function gramsPerMlForLiquid(rest: string): number {
  const r = rest.toLowerCase();
  if (/\b(honey|molasses)\b/.test(r)) return 1.42;
  if (/\bmaple syrup\b/.test(r)) return 1.37;
  if (/\bagave\b/.test(r)) return 1.36;
  if (/\bsyrup\b/.test(r)) return 1.3;
  if (/\b(oil|olive oil|sesame oil)\b/.test(r)) return 0.92;
  if (/\b(mayo|mayonnaise)\b/.test(r)) return 0.91;
  if (/\b(milk|buttermilk|yogurt|sour cream|cream)\b/.test(r)) return 1.03;
  if (/\b(soy sauce|tamari|fish sauce|worcestershire)\b/.test(r)) return 1.15;
  if (/\b(ketchup|hot sauce|sriracha)\b/.test(r)) return 1.05;
  if (/\b(vinegar|juice|broth|stock)\b/.test(r)) return 1.0;
  return 1.0;
}

function isIngredientLiquid(rest: string): boolean {
  const r = rest.toLowerCase();
  if (/\bcream cheese|cottage cheese|ricotta|watermelon\b/.test(r)) return false;
  return (
    /\b(sauce|dressing|vinaigrette|oil|vinegar|juice|milk|mayo|mayonnaise|yogurt|sour cream|honey|syrup|broth|stock|tamari|soy sauce|hot sauce|sriracha|ketchup|pesto|tahini|hummus|mustard|bbq|ranch|buffalo|ponzu|gochujang)\b/.test(
      r
    )
  );
}

function gramsPerUsCupForSolid(rest: string): number {
  const r = rest.toLowerCase();
  if (/\b(lettuce|romaine|kale|spinach|arugula|greens|cabbage)\b/.test(r)) return 40;
  if (/\b(cilantro|parsley|basil|mint|herbs|microgreens)\b/.test(r)) return 20;
  if (/\b(chicken|turkey|beef|pork|salmon|shrimp|tofu|bacon|ham)\b/.test(r)) return 140;
  if (/\b(feta|parmesan|mozzarella|cheddar|cheese)\b/.test(r)) return 115;
  if (/\b(beans|chickpeas|lentils|edamame)\b/.test(r)) return 180;
  if (/\b(quinoa|rice|pasta|noodles)\b/.test(r)) return 185;
  if (/\b(walnuts|almonds|pecans|peanuts|pepitas|seeds|nuts)\b/.test(r)) return 120;
  if (/\b(avocado)\b/.test(r)) return 150;
  if (/\b(tomato|cucumber|onion|pepper|carrot|apple|pear|radish|celery|corn|peas)\b/.test(r))
    return 100;
  return 110;
}

const UNICODE_FRACTIONS: Record<string, number> = {
  '⅛': 0.125,
  '¼': 0.25,
  '⅓': 1 / 3,
  '⅜': 0.375,
  '½': 0.5,
  '⅝': 0.625,
  '⅔': 2 / 3,
  '¾': 0.75,
  '⅞': 0.875,
};

function parseSingleQuantity(raw: string): number | null {
  let s = String(raw).trim();
  if (!s) return null;
  let total = 0;
  for (const [sym, val] of Object.entries(UNICODE_FRACTIONS)) {
    if (s.includes(sym)) {
      const parts = s.split(sym);
      const whole = parts[0].trim() ? parseInt(parts[0].trim(), 10) : 0;
      if (Number.isNaN(whole)) return null;
      total += whole + val;
      s = parts.slice(1).join(sym).trim();
      break;
    }
  }
  const mixed = s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const b = parseInt(mixed[3], 10);
    if (!b) return null;
    return total + parseInt(mixed[1], 10) + parseInt(mixed[2], 10) / b;
  }
  const frac = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (frac) {
    const b = parseInt(frac[2], 10);
    if (!b) return null;
    return total + parseInt(frac[1], 10) / b;
  }
  if (/^\d/.test(s)) {
    const n = parseFloat(s.replace(/[^\d.]/g, ''));
    if (!Number.isNaN(n)) return total + n;
  }
  return total || null;
}

function parseQuantityValue(numPart: string): number | [number, number] | null {
  const trimmed = String(numPart).trim();
  if (/[–\-]/.test(trimmed)) {
    const parts = trimmed
      .split(/[–\-]/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length === 2) {
      const a = parseSingleQuantity(parts[0]);
      const b = parseSingleQuantity(parts[1]);
      if (a != null && b != null) return [Math.min(a, b), Math.max(a, b)];
    }
  }
  return parseSingleQuantity(trimmed);
}

function splitAmountNumberAndUnit(
  amountStr: string
): { numPart: string; unit: string } | null {
  const s = String(amountStr).trim();
  const sorted = [
    'tablespoons',
    'tablespoon',
    'teaspoons',
    'teaspoon',
    'cups',
    'cup',
    'pounds',
    'pound',
    'ounces',
    'ounce',
    'pints',
    'pint',
    'quarts',
    'quart',
    'tbsp',
    'tsp',
    'lbs',
    'lb',
    'oz',
    'qt',
    'kg',
    'ml',
    'g',
    'l',
  ];
  const lower = s.toLowerCase();
  for (const tok of sorted) {
    if (lower.endsWith(tok)) {
      const num = s.slice(0, s.length - tok.length).trim();
      const next = s[s.length - tok.length - 1];
      if (num && (next === ' ' || next === undefined || /[\d¼½¾⅓⅔⅛⅜⅝⅞\/]/.test(next))) {
        // require space before unit when unit is letter-based
        if (tok.length > 2 && next !== ' ' && next !== undefined) continue;
        return { numPart: num, unit: normalizeUnit(tok) };
      }
    }
  }
  // fallback: "2 cups" style with space
  const m = s.match(/^([\d¼½¾⅓⅔⅛⅜⅝⅞\/\-–.\s]+)\s+([a-zA-Z]+)\.?$/);
  if (m) return { numPart: m[1].trim(), unit: normalizeUnit(m[2]) };
  return null;
}

function convertQuantityToMetric(
  value: number | [number, number],
  unit: string,
  rest: string
): string | null {
  const toRange = (fmt: (n: number) => string, lo: number, hi: number) =>
    lo !== hi ? `${fmt(lo)}–${fmt(hi)}` : fmt(lo);

  const liquid = isIngredientLiquid(rest);

  const asPair = (n: number | [number, number]): [number, number] =>
    Array.isArray(n) ? n : [n, n];

  if (unit === 'tsp' || unit === 'tbsp' || unit === 'cup' || unit === 'pint' || unit === 'qt') {
    const factor =
      unit === 'tsp'
        ? ML_PER_TSP
        : unit === 'tbsp'
          ? ML_PER_TBSP
          : unit === 'cup'
            ? ML_PER_CUP
            : unit === 'pint'
              ? ML_PER_CUP * 2
              : ML_PER_CUP * 4;
    const [lo, hi] = asPair(value);
    const mlLo = lo * factor;
    const mlHi = hi * factor;
    if (liquid) {
      const d = gramsPerMlForLiquid(rest);
      return toRange(formatMetricG, mlLo * d, mlHi * d);
    }
    const gPerCup = gramsPerUsCupForSolid(rest);
    const gPerMl = gPerCup / ML_PER_CUP;
    return toRange(formatMetricG, mlLo * gPerMl, mlHi * gPerMl);
  }

  if (unit === 'oz') {
    const [lo, hi] = asPair(value);
    return toRange(formatMetricG, lo * G_PER_OZ, hi * G_PER_OZ);
  }
  if (unit === 'lb') {
    const [lo, hi] = asPair(value);
    return toRange(formatMetricG, lo * G_PER_LB, hi * G_PER_LB);
  }
  if (unit === 'ml') {
    const [lo, hi] = asPair(value);
    return toRange(formatMetricMl, lo, hi);
  }
  if (unit === 'l') {
    const [lo, hi] = asPair(value);
    return toRange(formatMetricMl, lo * 1000, hi * 1000);
  }
  if (unit === 'g' || unit === 'kg') {
    const [lo, hi] = asPair(value);
    const mul = unit === 'kg' ? 1000 : 1;
    return toRange(formatMetricG, lo * mul, hi * mul);
  }

  return null;
}

/** Convert an imperial amount string for display, using ingredient rest for density heuristics. */
export function formatAmountForUnit(
  amount: string | null,
  rest: string,
  mode: UnitMode
): string | null {
  if (!amount) return amount;
  if (mode === 'imperial') return amount;

  const sp = splitAmountNumberAndUnit(amount);
  if (!sp) return amount;
  if (COUNT_UNITS.has(sp.unit)) return amount;

  const q = parseQuantityValue(sp.numPart);
  if (q == null) return amount;

  const converted = convertQuantityToMetric(q, sp.unit, rest);
  return converted ?? amount;
}

/** Convert every volume/weight token in a plain ingredient line (for clipboard). */
export function convertIngredientLineUnits(line: string, mode: UnitMode): string {
  if (mode === 'imperial') return line;
  // Best-effort: parse leading amount
  const match = line.match(
    /^([\d¼½¾⅓⅔⅛⅜⅝⅞\/\-–.\s]*(?:tbsp|tsp|cups?|oz|lb|lbs|pint|qt)?\.?)\s+(.+)$/i
  );
  if (!match) return line;
  const amount = match[1].trim();
  const rest = match[2].trim();
  if (!amount) return line;
  const converted = formatAmountForUnit(amount, rest, mode);
  return converted ? `${converted} ${rest}` : line;
}
