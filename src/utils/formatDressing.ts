import { parseIngredient, scaleIngredientLine } from '@/utils/scaleIngredients';
import { formatAmountForUnit, type UnitMode } from '@/utils/metricUnits';

export type IngredientRow =
  | { kind: 'item'; amount: string | null; rest: string }
  | { kind: 'dressingHeader'; title: string }
  | { kind: 'diyLabel' };

function withUnits(row: IngredientRow, mode: UnitMode): IngredientRow {
  if (row.kind !== 'item' || !row.amount) return row;
  return {
    ...row,
    amount: formatAmountForUnit(row.amount, row.rest, mode),
  };
}

/** Split on ` + ` only when not inside parentheses. */
export function splitPlusAtDepthZero(text: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  const s = String(text);

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    else if (ch === '+' && depth === 0) {
      const left = s[i - 1];
      const right = s[i + 1];
      if (left === ' ' && right === ' ') {
        parts.push(s.slice(start, i).trim());
        start = i + 1;
      }
    }
  }
  parts.push(s.slice(start).trim());
  return parts.filter(Boolean);
}

function findFirstBalancedParen(text: string): { start: number; end: number } | null {
  const start = text.indexOf('(');
  if (start < 0) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')') {
      depth--;
      if (depth === 0) return { start, end: i };
    }
  }
  return null;
}

function dressingTitleFromConceptual(conceptual: string): string {
  const cleaned = conceptual
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*\+\s*/g, ' + ')
    .trim();
  return cleaned || 'Dressing';
}

/** True when parentheses hold a real DIY sub-recipe, not a trailing paraphrase. */
function shouldExpandDiy(outerRest: string, inner: string): boolean {
  if (!inner.includes('+')) return false;
  const r = outerRest.toLowerCase().replace(/^of\s+/, '').trim();
  // Skip paraphrase tags like "salt (…restate everything…)"
  if (/^(salt|pepper|sugar|honey|cilantro|mint|scallions?|herbs?)\b/.test(r)) return false;
  if (/\bto taste\b/.test(r)) return false;
  // Expand for named dressings / sauces / vinaigrettes
  return /\b(vinaigrette|dressing|sauce|ranch|mayo|aioli|pesto|tahini|yogurt|miso|ponzu|bbq|caesar|goddess|chimichurri|nuoc|gochujang|peanut|sesame|buffalo)\b/.test(
    r
  );
}

function rowsFromMeasuredChunk(chunk: string): IngredientRow[] {
  const trimmed = chunk.trim();
  if (!trimmed) return [];

  const paren = findFirstBalancedParen(trimmed);
  if (!paren) {
    const { amount, rest } = parseIngredient(trimmed);
    return [{ kind: 'item', amount, rest }];
  }

  const before = trimmed.slice(0, paren.start).trim();
  const after = trimmed.slice(paren.end + 1).trim();
  const outer = `${before} ${after}`.trim();
  const inner = trimmed.slice(paren.start + 1, paren.end).trim();
  const { amount, rest } = parseIngredient(outer || before);

  const rows: IngredientRow[] = [
    {
      kind: 'item',
      amount,
      rest: rest || before,
    },
  ];

  if (shouldExpandDiy(rest || before, inner)) {
    rows.push({ kind: 'diyLabel' });
    for (const part of splitPlusAtDepthZero(inner)) {
      const parsed = parseIngredient(part);
      rows.push({
        kind: 'item',
        amount: parsed.amount,
        rest: parsed.rest,
      });
    }
  }

  return rows;
}

/**
 * Turn a raw ingredient line into readable display rows.
 * Dressing lines (`Dressing: … // measured…`) become a header + broken-out DIY amounts.
 */
export function ingredientLineToRows(
  line: string,
  scale: number,
  unitMode: UnitMode = 'imperial'
): IngredientRow[] {
  const scaled = scaleIngredientLine(line, scale);
  const dressingMatch = scaled.match(/^Dressing:\s*(.*)$/i);

  if (!dressingMatch) {
    const { amount, rest } = parseIngredient(scaled);
    return [withUnits({ kind: 'item', amount, rest }, unitMode)];
  }

  const body = dressingMatch[1].trim();
  const [conceptualRaw, measuredRaw] = body.split(/\s+\/\/\s+/);
  const conceptual = (conceptualRaw ?? '').trim();
  const measured = (measuredRaw ?? conceptual).trim();
  const title = dressingTitleFromConceptual(conceptual);

  const rows: IngredientRow[] = [{ kind: 'dressingHeader', title }];

  for (const chunk of splitPlusAtDepthZero(measured)) {
    for (const row of rowsFromMeasuredChunk(chunk)) {
      rows.push(withUnits(row, unitMode));
    }
  }

  return rows;
}

export function expandIngredientsForDisplay(
  lines: string[],
  scale: number,
  unitMode: UnitMode = 'imperial'
): IngredientRow[] {
  return lines.flatMap((line) => ingredientLineToRows(line, scale, unitMode));
}

/** Plain-text dressing block for clipboard — readable multi-line form. */
export function formatDressingClipboard(
  line: string,
  scale: number,
  unitMode: UnitMode = 'imperial'
): string {
  const rows = ingredientLineToRows(line, scale, unitMode);
  const out: string[] = [];
  for (const row of rows) {
    if (row.kind === 'dressingHeader') {
      out.push(`Dressing — ${row.title}`);
      continue;
    }
    if (row.kind === 'diyLabel') {
      out.push('Make it:');
      continue;
    }
    out.push(row.amount ? `• ${row.amount} ${row.rest}` : `• ${row.rest}`);
  }
  return out.join('\n');
}

export function formatScaledIngredientsClipboard(
  lines: string[],
  scale: number,
  unitMode: UnitMode = 'imperial'
): string[] {
  const out: string[] = [];
  for (const line of lines) {
    if (/^Dressing:/i.test(line)) {
      out.push(formatDressingClipboard(line, scale, unitMode));
    } else {
      const scaled = scaleIngredientLine(line, scale);
      const { amount, rest } = parseIngredient(scaled);
      if (!amount) {
        out.push(scaled);
      } else {
        const converted = formatAmountForUnit(amount, rest, unitMode);
        out.push(converted ? `${converted} ${rest}` : scaled);
      }
    }
  }
  return out;
}
