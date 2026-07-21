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

const UNIT_PATTERN =
  'tbsp|tsp|tablespoons?|teaspoons?|cups?|oz|lb|lbs|g|kg|ml|l|bunch|head|cans?|pouch|pkg|packages?|cloves?|slices?|strips?|pieces?|sprigs?|handful|pinch|dash|scoops?|qt|pint';

const LEADING_AMOUNT_RE = new RegExp(
  `^([\\d¼½¾⅓⅔⅛⅜⅝⅞/\\-–. ]*(?:${UNIT_PATTERN})?\\.?)\\s+(.+)$`,
  'i'
);

const QUANTITY_TOKEN_RE = new RegExp(
  `(\\d+\\s+\\d+/\\d+|\\d+/\\d+|\\d*\\s*[¼½¾⅓⅔⅛⅜⅝⅞]|\\d+(?:\\.\\d+)?)(?:\\s*(${UNIT_PATTERN})\\.?)?`,
  'gi'
);

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

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
    const whole = parseInt(mixed[1], 10);
    const a = parseInt(mixed[2], 10);
    const b = parseInt(mixed[3], 10);
    if (!b) return null;
    return total + whole + a / b;
  }

  const frac = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (frac) {
    const a = parseInt(frac[1], 10);
    const b = parseInt(frac[2], 10);
    if (!b) return null;
    return total + a / b;
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

export function formatQuantityForDisplay(n: number): string {
  if (!Number.isFinite(n) || n < 0) return String(n);
  const rounded = Math.round(n * 10000) / 10000;
  const symFracs: [number, string][] = [
    [0.125, '⅛'],
    [0.25, '¼'],
    [1 / 3, '⅓'],
    [0.375, '⅜'],
    [0.5, '½'],
    [0.625, '⅝'],
    [2 / 3, '⅔'],
    [0.75, '¾'],
    [0.875, '⅞'],
  ];

  for (const [fv, sym] of symFracs) {
    if (Math.abs(rounded - fv) < 0.04) return sym;
  }

  const w = Math.floor(rounded + 1e-9);
  const frac = rounded - w;
  if (w >= 1) {
    for (const [fv, sym] of symFracs) {
      if (Math.abs(frac - fv) < 0.04) return `${w}${sym}`;
    }
  }

  const s48 = Math.round(rounded * 48);
  if (s48 > 0 && Math.abs(rounded * 48 - s48) < 0.0001) {
    const whole = Math.floor(s48 / 48);
    const rem = s48 % 48;
    if (rem === 0) return String(whole);
    const g = gcd(rem, 48);
    const nn = rem / g;
    const dd = 48 / g;
    const fracStr = `${nn}/${dd}`;
    const cupFracUnicode: Record<string, string> = {
      '1/8': '⅛',
      '1/4': '¼',
      '3/8': '⅜',
      '1/2': '½',
      '5/8': '⅝',
      '3/4': '¾',
      '7/8': '⅞',
      '1/3': '⅓',
      '2/3': '⅔',
    };
    const sym = cupFracUnicode[fracStr];
    if (whole === 0) return sym || fracStr;
    return sym ? `${whole}${sym}` : `${whole} ${fracStr}`;
  }

  const ri = Math.round(rounded);
  if (Math.abs(rounded - ri) < 0.06) return String(ri);
  const t = Math.round(rounded * 100) / 100;
  return String(t)
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/\.$/, '');
}

function pluralizeUnit(unit: string, qty: number): string {
  const u = unit.toLowerCase().replace(/\.$/, '');
  if (u === 'cup' || u === 'cups') return qty > 1.001 ? 'cups' : 'cup';
  if (u === 'can' || u === 'cans') return qty > 1.001 ? 'cans' : 'can';
  if (u === 'clove' || u === 'cloves') return qty > 1.001 ? 'cloves' : 'clove';
  if (u === 'slice' || u === 'slices') return qty > 1.001 ? 'slices' : 'slice';
  if (u === 'piece' || u === 'pieces') return qty > 1.001 ? 'pieces' : 'piece';
  if (u === 'tbsp' || u === 'tablespoon' || u === 'tablespoons') return 'tbsp';
  if (u === 'tsp' || u === 'teaspoon' || u === 'teaspoons') return 'tsp';
  return unit;
}

export function scaleAmountString(amountStr: string, factor: number): string {
  const trimmed = String(amountStr).trim();
  if (!trimmed || !Number.isFinite(factor) || Math.abs(factor - 1) < 1e-9) return trimmed;

  const unitMatch = trimmed.match(
    new RegExp(`^([\\d¼½¾⅓⅔⅛⅜⅝⅞/\\-–. ]+)\\s*(${UNIT_PATTERN})\\.?$`, 'i')
  );

  if (unitMatch) {
    const q = parseQuantityValue(unitMatch[1]);
    if (q == null) return trimmed;
    if (Array.isArray(q)) {
      const lo = q[0] * factor;
      const hi = q[1] * factor;
      return `${formatQuantityForDisplay(lo)}–${formatQuantityForDisplay(hi)} ${pluralizeUnit(unitMatch[2], hi)}`;
    }
    const scaled = q * factor;
    return `${formatQuantityForDisplay(scaled)} ${pluralizeUnit(unitMatch[2], scaled)}`;
  }

  const qOnly = parseQuantityValue(trimmed);
  if (qOnly == null) return trimmed;
  if (Array.isArray(qOnly)) {
    return `${formatQuantityForDisplay(qOnly[0] * factor)}–${formatQuantityForDisplay(qOnly[1] * factor)}`;
  }
  return formatQuantityForDisplay(qOnly * factor);
}

export function parseIngredient(line: string): { amount: string | null; rest: string } {
  const match = String(line).trim().match(LEADING_AMOUNT_RE);
  if (match && match[1].trim()) {
    return { amount: match[1].trim(), rest: match[2].trim() };
  }
  return { amount: null, rest: String(line).trim() };
}

/** Scale every quantity token in a string (used for dressing lines with many amounts). */
function scaleAllQuantityTokens(text: string, factor: number): string {
  if (!Number.isFinite(factor) || Math.abs(factor - 1) < 1e-9) return text;
  return text.replace(QUANTITY_TOKEN_RE, (full, numPart: string, unit?: string) => {
    const q = parseQuantityValue(numPart);
    if (q == null) return full;
    const scaled = Array.isArray(q)
      ? `${formatQuantityForDisplay(q[0] * factor)}–${formatQuantityForDisplay(q[1] * factor)}`
      : formatQuantityForDisplay(q * factor);
    if (!unit) return scaled;
    const qty = Array.isArray(q) ? q[1] * factor : q * factor;
    return `${scaled} ${pluralizeUnit(unit, qty)}`;
  });
}

export function scaleIngredientLine(line: string, factor: number): string {
  if (!Number.isFinite(factor) || Math.abs(factor - 1) < 1e-9) return line;

  // Dressing / compound lines: scale every quantity token
  if (/^Dressing:/i.test(line) || line.includes('//') || line.includes(' + ')) {
    return scaleAllQuantityTokens(line, factor);
  }

  const { amount, rest } = parseIngredient(line);
  if (!amount) return scaleAllQuantityTokens(line, factor);
  return `${scaleAmountString(amount, factor)} ${rest}`;
}

export function scaleIngredientLines(lines: string[], factor: number): string[] {
  return lines.map((line) => scaleIngredientLine(line, factor));
}

export type ParsedIngredient = {
  amount: string | null;
  rest: string;
};

export function parseScaledIngredient(line: string, factor: number): ParsedIngredient {
  const scaled = scaleIngredientLine(line, factor);
  return parseIngredient(scaled);
}
