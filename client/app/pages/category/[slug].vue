<script setup lang="ts">
import type { Category } from '~/composables/useCategories';

interface Giveaway {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  entryUrl: string;
  category: string;
  brand: string;
  prizeValue: string;
  formattedPrizeValue?: string;
  currency: string;
  status: string;
  entryCount: number;
  endDate: string;
  isFeatured?: boolean;
}

const route = useRoute();
const slug = route.params.slug as string;
const config = useRuntimeConfig();

// Fetch category info + giveaways from the new endpoint
const { data, error } = await useAsyncData(`category-${slug}`, () =>
  $fetch<{ category: Category; giveaways: Giveaway[], totalCount: number }>(`${config.public.apiBase}/api/categories/${slug}/giveaways`, {
    query: { limit: 24, sort: 'endingSoonest' }
  })
);

// 404 if category not found
if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Category Not Found' });
}

const category = computed(() => data.value?.category ?? null);
const giveaways = computed(() => data.value?.giveaways ?? []);
const initialTotalCount = computed(() => data.value?.totalCount ?? 0);
const isLoading = ref(false);
const allGiveaways = ref<Giveaway[]>(giveaways.value);
const hasMore = ref(allGiveaways.value.length < initialTotalCount.value);
const offset = ref(24);

const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  try {
    const result = await $fetch<{ category: Category; giveaways: Giveaway[], totalCount: number }>(
      `${config.public.apiBase}/api/categories/${slug}/giveaways`,
      { query: { limit: 24, offset: offset.value, sort: 'endingSoonest' } }
    );
    allGiveaways.value.push(...result.giveaways);
    hasMore.value = allGiveaways.value.length < result.totalCount;
    offset.value += 24;
  } finally {
    isLoading.value = false;
  }
};

// Dynamic SEO per category
useSeoMeta({
  title: () => category.value ? `${category.value.icon} ${category.value.name} Giveaways - Sve Nagradne Igre` : 'Kategorija - Sve Nagradne Igre',
  description: () => category.value?.description ?? 'Pronađite najbolje nagradne igre na SveNagradneIgre.rs',
  ogTitle: () => category.value ? `${category.value.icon} ${category.value.name} Giveaways` : 'Giveaways',
  ogDescription: () => category.value?.description ?? '',
  ogImage: () => allGiveaways.value[0]?.imageUrl ?? null,
  ogUrl: () => `${config.public.siteUrl}/category/${slug}`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <div class="category-page">
    <!-- Hero -->
    <section class="category-hero">
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="container hero-inner">
        <nav class="breadcrumb" aria-label="Putanja">
          <NuxtLink to="/">Početna</NuxtLink>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span class="current">{{ category?.name }}</span>
        </nav>

        <div class="hero-card" :style="{ '--cat-color': category?.color || 'var(--primary)' }">
          <span class="category-icon">{{ category?.icon }}</span>
          <div class="hero-copy">
            <span class="eyebrow">Kategorija</span>
            <h1 class="category-title">{{ category?.name }}</h1>
            <p class="category-description">{{ category?.description }}</p>
          </div>
          <div class="category-stat">
            <strong>{{ initialTotalCount }}</strong>
            <span>aktivnih nagradnih igara</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Grid -->
    <section class="feed-section container">
      <div v-if="allGiveaways.length > 0" class="giveaways-grid">
        <GiveawayCard
          v-for="(giveaway, index) in allGiveaways"
          :key="giveaway.id"
          :giveaway="giveaway"
          :preload="index < 4"
        />
      </div>

      <div v-else class="empty-state">
        <span class="empty-icon" aria-hidden="true">{{ category?.icon }}</span>
        <h2>Još nema aktivnih igara</h2>
        <p>Trenutno nema aktivnih nagradnih igara u kategoriji <strong>{{ category?.name }}</strong>. Pogledaj ostale kategorije ili predloži novu.</p>
        <div class="empty-actions">
          <NuxtLink to="/" class="btn btn-primary">Sve nagradne igre</NuxtLink>
          <NuxtLink to="/submit" class="btn btn-outline">Predloži nagradnu igru</NuxtLink>
        </div>
      </div>

      <div v-if="hasMore" class="pagination-wrap">
        <button class="btn btn-primary" @click="loadMore" :disabled="isLoading">
          {{ isLoading ? 'Učitavanje...' : 'Učitaj još' }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.category-page {
  padding-bottom: 80px;
}

.category-hero {
  position: relative;
  overflow: hidden;
  padding: 34px 0 46px;
  background:
    radial-gradient(700px circle at 12% 20%, rgba(214, 65, 35, 0.1), transparent 60%),
    radial-gradient(520px circle at 88% 0%, rgba(244, 179, 42, 0.12), transparent 55%),
    var(--bg-soft);
}

.hero-glow {
  position: absolute;
  right: -120px;
  bottom: -180px;
  width: 380px;
  height: 380px;
  border-radius: 50%;
  background: rgba(214, 65, 35, 0.08);
  pointer-events: none;
}

.hero-inner {
  position: relative;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 22px;
  font-size: 13px;
  color: var(--text-muted);
}

.breadcrumb svg {
  color: var(--border-strong);
}

.breadcrumb a {
  font-weight: 600;
}

.breadcrumb a:hover {
  color: var(--primary);
}

.breadcrumb .current {
  font-weight: 600;
  color: var(--heading);
}

.hero-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 34px 38px;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.hero-card::after {
  content: '';
  position: absolute;
  right: -70px;
  top: -90px;
  width: 230px;
  height: 230px;
  border-radius: 50%;
  background: var(--cat-color);
  opacity: 0.08;
}

.category-icon {
  width: 88px;
  height: 88px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 24px;
  font-size: 42px;
  line-height: 1;
  background: color-mix(in srgb, var(--cat-color) 13%, var(--surface));
  border: 1px solid color-mix(in srgb, var(--cat-color) 24%, var(--border));
}

.hero-copy {
  flex: 1;
  min-width: 0;
}

.hero-copy .eyebrow {
  margin-bottom: 10px;
}

.category-title {
  margin-bottom: 8px;
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.04em;
  color: var(--heading);
}

.category-description {
  max-width: 560px;
  font-size: 15.5px;
  color: var(--text-muted);
}

.category-stat {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 18px 26px;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--cat-color) 9%, var(--surface));
  border: 1px solid color-mix(in srgb, var(--cat-color) 22%, var(--border));
}

.category-stat strong {
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--cat-color);
}

.category-stat span {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-muted);
  text-align: center;
}

.feed-section {
  padding-top: 48px;
  padding-bottom: 60px;
}

.giveaways-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 26px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 72px 24px;
  text-align: center;
  background: var(--surface);
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius-lg);
}

.empty-icon {
  font-size: 46px;
  line-height: 1;
  margin-bottom: 4px;
}

.empty-state h2 {
  font-size: 22px;
}

.empty-state p {
  max-width: 480px;
  color: var(--text-muted);
}

.empty-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 12px;
}

.pagination-wrap {
  margin-top: 48px;
  display: flex;
  justify-content: center;
}

@media (max-width: 1024px) {
  .giveaways-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .category-hero {
    padding: 24px 0 36px;
  }

  .hero-card {
    flex-wrap: wrap;
    padding: 26px;
    gap: 18px;
  }

  .category-icon {
    width: 68px;
    height: 68px;
    border-radius: 20px;
    font-size: 32px;
  }

  .hero-copy {
    flex-basis: calc(100% - 90px);
  }

  .category-title {
    font-size: 30px;
  }

  .category-stat {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
    padding: 14px;
  }

  .category-stat strong {
    font-size: 24px;
  }

  .giveaways-grid {
    grid-template-columns: 1fr;
  }
}
</style>
