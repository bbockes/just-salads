import type { Salad, SaladFilters } from '@/types/salad';

export function filterSalads(salads: Salad[], filters: SaladFilters): Salad[] {
  const query = filters.query.trim().toLowerCase();

  return salads.filter((salad) => {
    if (query && !salad.name.toLowerCase().includes(query)) return false;
    if (filters.cuisine && salad.subCuisine !== filters.cuisine) return false;
    if (filters.flavor && !salad.flavorTags.includes(filters.flavor)) return false;
    if (filters.season && !salad.seasons.includes(filters.season)) return false;
    return true;
  });
}
