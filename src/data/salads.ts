import saladsJson from '@/data/salads.json';
import type { Salad } from '@/types/salad';

export const SALADS: Salad[] = saladsJson as Salad[];

export function getSaladById(id: number | string): Salad | undefined {
  const numericId = typeof id === 'string' ? Number(id) : id;
  return SALADS.find((salad) => salad.id === numericId);
}
