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

const BASE_URL = 'http://localhost:3000';

// Fetch category info + giveaways from the new endpoint
const { data, error } = await useAsyncData(`category-${slug}`, () =>
  $fetch<{ category: Category; giveaways: Giveaway[] }>(`${BASE_URL}/api/categories/${slug}/giveaways`, {
    query: { limit: 24, sort: 'endingSoonest' }
  })
);

// 404 if category not found
if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Category Not Found' });
}

const category = computed(() => data.value?.category ?? null);
const giveaways = computed(() => data.value?.giveaways ?? []);
const isLoading = ref(false);
const allGiveaways = ref<Giveaway[]>(giveaways.value);
const hasMore = ref(giveaways.value.length === 24);
const offset = ref(24);

const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  try {
    const result = await $fetch<{ category: Category; giveaways: Giveaway[] }>(
      `${BASE_URL}/api/categories/${slug}/giveaways`,
      { query: { limit: 24, offset: offset.value, sort: 'endingSoonest' } }
    );
    allGiveaways.value.push(...result.giveaways);
    hasMore.value = result.giveaways.length === 24;
    offset.value += 24;
  } finally {
    isLoading.value = false;
  }
};

// Dynamic SEO per category
useSeoMeta({
  title: () => category.value ? `${category.value.icon} ${category.value.name} Giveaways - Fribbo` : 'Kategorija - Fribbo',
  description: () => category.value?.description ?? 'Pronađite najbolje nagradne igre na Fribbo.',
  ogTitle: () => category.value ? `${category.value.icon} ${category.value.name} Giveaways` : 'Giveaways',
  ogDescription: () => category.value?.description ?? '',
  ogImage: () => allGiveaways.value[0]?.imageUrl ?? null,
  ogUrl: () => `https://fribbo.rs/category/${slug}`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <div class="category-page">
    <!-- Hero -->
    <section class="category-hero" :style="{ borderBottomColor: category?.color }">
      <div class="container hero-inner">
        <div class="category-icon">{{ category?.icon }}</div>
        <h1 class="category-title">{{ category?.name }}</h1>
        <p class="category-description">{{ category?.description }}</p>
        <div class="category-stat">
          <span class="stat-number">{{ allGiveaways.length }}</span>
          <span class="stat-label">aktivnih nagradnih igara</span>
        </div>
      </div>
    </section>

    <!-- Grid -->
    <section class="feed-section container">
      <div v-if="allGiveaways.length > 0" class="grid">
        <GiveawayCard
          v-for="(giveaway, index) in allGiveaways"
          :key="giveaway.id"
          :giveaway="giveaway"
          :preload="index < 4"
        />
      </div>

      <div v-else class="empty-state">
        <p>Trenutno nema aktivnih nagradnih igara u kategoriji <strong>{{ category?.name }}</strong>.</p>
        <NuxtLink to="/" class="btn btn-primary" style="margin-top: 20px;">← Sve nagradne igre</NuxtLink>
      </div>

      <div v-if="hasMore" class="pagination-wrap">
        <button class="btn btn-dark" @click="loadMore" :disabled="isLoading">
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
  padding: 60px 0 50px;
  text-align: center;
  background: var(--white);
  border-bottom: 4px solid var(--accent-pink);
  margin-bottom: 40px;
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.category-icon {
  font-size: 64px;
  line-height: 1;
  margin-bottom: 4px;
}

.category-title {
  font-size: 42px;
  font-weight: 800;
  color: var(--text-main);
}

.category-description {
  font-size: 18px;
  color: var(--text-muted);
  max-width: 500px;
}

.category-stat {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 8px;
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: var(--accent-pink);
  font-family: 'Outfit', sans-serif;
}

.stat-label {
  font-size: 15px;
  color: var(--text-muted);
}

.feed-section {
  padding-bottom: 60px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
}

.pagination-wrap {
  margin-top: 60px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .category-title {
    font-size: 30px;
  }
  .category-icon {
    font-size: 48px;
  }
}
</style>
