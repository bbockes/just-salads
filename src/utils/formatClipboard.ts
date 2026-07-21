import type { Salad } from '@/types/salad';

export function formatIngredientsClipboard(salad: Salad, ingredientLines?: string[]): string {
  const lines = ingredientLines ?? salad.ingredients;
  return [salad.name, '', ...lines].join('\n');
}

export function formatRecipeClipboard(salad: Salad, ingredientLines?: string[]): string {
  const lines = ingredientLines ?? salad.ingredients;
  const steps = salad.steps.map((step, index) => `${index + 1}. ${step}`);
  return [salad.name, '', 'Ingredients', ...lines, '', 'Instructions', ...steps].join('\n');
}
