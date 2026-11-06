<script setup lang="ts">
import type { Category } from '~/composables/useCategories';

const { categories, fetchCategories } = useCategories();

onMounted(() => fetchCategories());

const positionLabel = (count?: number) => {
  if (count === undefined) return 'Aktivne nagradne igre';
  if (count === 1) return '1 aktivna igra';
  return `${count} aktivnih igara`;
};
</script>

<template>
  <section class="category-section section" aria-labelledby="categories-heading">
    <div class="container">
      <div class="section-head">
        <div class="section-head-copy">
          <span class="eyebrow">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
              <path d="m12 3 2.4 5.2 5.6.7-4.2 3.9 1.1 5.5L12 15.6l-4.9 2.7 1.1-5.5L4 8.9l5.6-.7L12 3Z" />
            </svg>
            Kategorije
          </span>
          <h2 id="categories-heading" class="section-title">Pretraži po kategorijama</h2>
          <p class="section-subtitle">Pronađi tačno onu vrstu nagradne igre koja te zanima — od tehnologije do putovanja.</p>
        </div>
        <NuxtLink to="/#giveaways" class="btn btn-outline browse-all">
          Pogledaj sve
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </NuxtLink>
      </div>

      <div v-if="categories.length" class="category-grid">
        <NuxtLink
          v-for="(cat, index) in categories"
          :key="cat.slug"
          :to="`/category/${cat.slug}`"
          class="category-card"
          :style="{ '--cat-color': cat.color, animationDelay: `${index * 45}ms` }"
        >
          <span class="category-icon">{{ cat.icon }}</span>
          <span class="category-copy">
            <span class="category-name">{{ cat.name }}</span>
            <span class="category-count">{{ positionLabel(cat.giveawayCount) }}</span>
          </span>
          <span class="category-arrow" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </NuxtLink>
      </div>

      <div v-else class="category-grid">
        <div v-for="i in 8" :key="i" class="category-card category-skeleton">
          <span class="category-icon"></span>
          <span class="category-copy">
            <span class="category-name skeleton-line"></span>
            <span class="category-count skeleton-line short"></span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.category-section {
  background: var(--bg);
}

.browse-all {
  flex-shrink: 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.category-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
  opacity: 0;
  animation: fadeInUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease;
}

.category-card::after {
  content: '';
  position: absolute;
  width: 120px;
  height: 120px;
  right: -55px;
  bottom: -65px;
  border-radius: 50%;
  background: var(--cat-color, var(--primary));
  opacity: 0.07;
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--cat-color, var(--primary)) 60%, var(--border));
  box-shadow: var(--shadow-sm);
}

.category-card:hover::after {
  opacity: 0.12;
  transform: scale(1.15);
}

.category-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 16px;
  font-size: 24px;
  line-height: 1;
  background: color-mix(in srgb, var(--cat-color, var(--primary)) 14%, transparent);
  transition: transform 0.28s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.08) rotate(-4deg);
}

.category-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
}

.category-name {
  font-family: var(--font-heading);
  font-size: 15.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-count {
  font-size: 12.5px;
  color: var(--text-muted);
}

.category-arrow {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--bg-muted);
  color: var(--text-muted);
  transition: background-color 0.28s ease, color 0.28s ease, transform 0.28s ease;
}

.category-card:hover .category-arrow {
  background: var(--cat-color, var(--primary));
  color: #fff;
  transform: translateX(2px);
}

.category-skeleton {
  pointer-events: none;
}

.category-skeleton .category-icon {
  background: var(--bg-muted);
}

.skeleton-line {
  display: block;
  width: 90px;
  height: 12px;
  border-radius: 5px;
  background: linear-gradient(100deg, var(--bg-muted) 20%, var(--surface-2) 40%, var(--bg-muted) 60%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite linear;
}

.skeleton-line.short {
  width: 60px;
}

@media (max-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .category-card {
    padding: 16px;
    gap: 12px;
  }

  .category-icon {
    width: 46px;
    height: 46px;
    font-size: 21px;
    border-radius: 14px;
  }

  .category-arrow {
    display: none;
  }
}

@media (max-width: 420px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>
