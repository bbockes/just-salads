import { parseIngredient } from '@/utils/scaleIngredients';

const PREP_SUFFIX =
  /,\s*(?:optional|to taste|shredded|diced|halved|cubed|sliced|chopped|minced|drained|crushed|toasted|grated|thinly sliced|finely diced|roughly chopped|fresh|dried|torn|pre-sliced).*$/i;

const LEADING_JUNK =
  /^(?:bagged|pre-cut|pre-cooked|frozen|optional:?|jarred|bottled|rotisserie|microwaved)\s+/i;

const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'or',
  'of',
  'the',
  'with',
  'fresh',
  'large',
  'small',
  'bagged',
  'mix',
  'plus',
  'cups',
  'cup',
  'optional',
  'seasoning',
  'spice',
  'blend',
]);

function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** pear → pears, radish → radishes, and reverse. */
function withNumberVariants(term: string): string[] {
  const out = new Set<string>([term]);
  if (term.includes(' ')) {
    // Multi-word phrases: keep as-is only (avoid "spicy mayos")
    return [...out];
  }

  const lower = term.toLowerCase();

  // Singular ← plural
  if (lower.endsWith('ies') && term.length > 4) {
    out.add(`${term.slice(0, -3)}y`);
  } else if (lower.endsWith('oes') && term.length > 4) {
    out.add(term.slice(0, -2));
  } else if (lower.endsWith('ses') && term.length > 4) {
    out.add(term.slice(0, -2));
  } else if (lower.endsWith('es') && /(ch|sh|x|z)$/i.test(term.slice(0, -2))) {
    out.add(term.slice(0, -2));
  } else if (lower.endsWith('s') && !lower.endsWith('ss') && term.length > 3) {
    out.add(term.slice(0, -1));
  }

  // Plural ← singular (skip if already plural-looking)
  if (!/(?:ies|oes|ses|s)$/i.test(lower) || lower.endsWith('ss')) {
    if (lower.endsWith('y') && term.length > 2 && !/[aeiou]y$/i.test(lower)) {
      out.add(`${term.slice(0, -1)}ies`);
    } else if (/(ch|sh|x|z)$/i.test(lower)) {
      out.add(`${term}es`);
    } else if (!lower.endsWith('s')) {
      out.add(`${term}s`);
    }
  }

  return [...out];
}

function addTerm(terms: Set<string>, raw: string) {
  const t = raw.replace(/\s+/g, ' ').trim();
  if (t.length < 3) return;
  if (STOPWORDS.has(fold(t))) return;
  for (const variant of withNumberVariants(t)) {
    if (variant.length >= 3) terms.add(variant);
  }
}

function significantWords(core: string): string[] {
  return core
    .split(/\s+/)
    .map((w) => w.replace(/^[^\p{L}]+|[^\p{L}']+$/gu, ''))
    .filter((w) => w.length >= 3 && !STOPWORDS.has(fold(w)));
}

function dressingNameTerms(line: string): string[] {
  const terms = ['dressing'];
  const m = line.match(/^Dressing:\s*(.*)$/i);
  if (!m) return terms;
  const conceptual = m[1].split(/\s+\/\/\s+/)[0] ?? '';
  const name = conceptual
    .replace(/\([^)]*\)/g, '')
    .replace(/\s*\+\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (name.length >= 4) terms.push(name);
  // "spicy mayo" from "spicy mayo + lime juice"
  for (const part of name.split(/\s+/)) {
    if (part.length >= 4 && !STOPWORDS.has(fold(part))) terms.push(part);
  }
  const words = significantWords(name);
  if (words.length >= 2) {
    terms.push(words.slice(0, 2).join(' '));
    terms.push(words.slice(-2).join(' '));
  }
  return terms;
}

function addCoreTerms(terms: Set<string>, coreRaw: string) {
  let core = coreRaw
    .replace(/\([^)]*\)/g, ' ')
    .replace(PREP_SUFFIX, '')
    .replace(LEADING_JUNK, '')
    .replace(/\s+/g, ' ')
    .replace(/^of\s+/i, '')
    .trim();

  if (!core) return;

  // Split alternatives: "butter lettuce or romaine"
  const branches = core.split(/\s+or\s+/i);
  for (const branch of branches) {
    const cleaned = branch.replace(LEADING_JUNK, '').trim();
    if (!cleaned) continue;
    addTerm(terms, cleaned);

    const words = significantWords(cleaned);
    if (words.length >= 2) {
      addTerm(terms, words.slice(-2).join(' '));
      addTerm(terms, words.slice(0, 2).join(' '));
    }
    // Every content word (lettuce, Tajín, pear, …)
    for (const w of words) addTerm(terms, w);
  }
}

/** Build longest-first ingredient phrases to highlight inside instruction steps. */
export function ingredientHighlightTerms(ingredientLines: string[]): string[] {
  const terms = new Set<string>();

  for (const line of ingredientLines) {
    if (/^Dressing:/i.test(line)) {
      for (const t of dressingNameTerms(line)) addTerm(terms, t);
      continue;
    }

    // "optional: avocado, sliced"
    const cleanedLine = line.replace(/^optional:\s*/i, '');
    const { rest } = parseIngredient(cleanedLine);
    addCoreTerms(terms, rest);
  }

  return [...terms].sort((a, b) => b.length - a.length || a.localeCompare(b));
}

export type TextSegment = { text: string; highlight: boolean };

/** Split a step into plain / highlighted segments for ingredient names. */
export function segmentStepByIngredients(step: string, terms: string[]): TextSegment[] {
  if (!terms.length) return [{ text: step, highlight: false }];

  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = step.split(re);

  const foldedTerms = new Set(terms.map(fold));
  return parts
    .filter((p) => p.length > 0)
    .map((text) => ({
      text,
      highlight: foldedTerms.has(fold(text)),
    }));
}
