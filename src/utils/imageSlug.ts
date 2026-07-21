/** Match meal-prep-salads recipeCardImageSlug */
export function recipeCardImageSlug(name: string, imageSlug?: string): string {
  if (imageSlug) return imageSlug;
  const base = String(name).replace(/\s+Salad$/i, '').trim();
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
