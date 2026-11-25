import type { Category } from '~/composables/useCategories';

// Fallbacks for giveaways whose category value predates the categories table
// or was imported with a Serbian slug. Values in the categories table win.
const CATEGORY_LABELS: Record<string, string> = {
  tech: 'Tehnologija',
  technology: 'Tehnologija',
  elektronika: 'Tehnologija',
  beauty: 'Lepota',
  lepota: 'Lepota',
  cars: 'Automobili',
  car: 'Automobili',
  automobili: 'Automobili',
  travel: 'Putovanja',
  putovanja: 'Putovanja',
  food: 'Hrana i Piće',
  hrana: 'Hrana i Piće',
  gaming: 'Gaming',
  igre: 'Gaming',
  fashion: 'Moda',
  moda: 'Moda',
  home: 'Dom i Bašta',
  kucanstvo: 'Dom i Bašta',
};

const CATEGORY_ICONS: Record<string, string> = {
  tech: '💻',
  technology: '💻',
  elektronika: '💻',
  beauty: '💄',
  lepota: '💄',
  cars: '🚗',
  car: '🚗',
  automobili: '🚗',
  travel: '✈️',
  putovanja: '✈️',
  food: '🍕',
  hrana: '🍕',
  gaming: '🎮',
  igre: '🎮',
  fashion: '👗',
  moda: '👗',
  home: '🏠',
  kucanstvo: '🏠',
};

const normalize = (value?: string | null) => value?.trim().toLowerCase() ?? '';

export const findCategory = (category?: string | null, categories: Category[] = []) => {
  const key = normalize(category);
  if (!key) return undefined;
  return categories.find(c => normalize(c.slug) === key || normalize(c.name) === key);
};

/** Display name in Serbian, based on the categories table with a local fallback. */
export const getCategoryLabel = (category?: string | null, categories: Category[] = []): string => {
  if (!category) return '';
  return findCategory(category, categories)?.name || CATEGORY_LABELS[normalize(category)] || category;
};

/** Emoji icon from the categories table with a local fallback. */
export const getCategoryIcon = (category?: string | null, categories: Category[] = []): string => {
  return findCategory(category, categories)?.icon || CATEGORY_ICONS[normalize(category)] || '🎁';
};
