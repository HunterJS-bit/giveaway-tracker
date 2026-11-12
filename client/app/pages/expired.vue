<script setup lang="ts">
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

const config = useRuntimeConfig();
const PAGE_SIZE = 9;

const fetchExpiredGiveaways = (targetPage: number) =>
  $fetch<{ data: Giveaway[]; totalCount: number }>(
    `${config.public.apiBase}/api/giveaways/expired`,
    {
      query: {
        limit: PAGE_SIZE,
        offset: (targetPage - 1) * PAGE_SIZE,
      },
    }
  );

const { data: initialData, error } = await useAsyncData('expired-giveaways', () =>
  fetchExpiredGiveaways(1)
);

if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Greška pri učitavanju isteklih nagradnih igara',
  });
}

const giveaways = ref<Giveaway[]>(initialData.value?.data ?? []);
const totalCount = ref<number>(initialData.value?.totalCount ?? 0);
const page = ref(1);
const isLoading = ref(false);

const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE)));

const handlePageChange = async (nextPage: number) => {
  if (isLoading.value || nextPage < 1 || nextPage > totalPages.value) return;

  isLoading.value = true;
  try {
    const response = await fetchExpiredGiveaways(nextPage);
    giveaways.value = response.data || [];
    totalCount.value = response.totalCount || 0;
    page.value = nextPage;

    if (process.client) {
      nextTick(() => {
        document
          .getElementById('expired-giveaways')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  } catch (err) {
    console.error('Error fetching expired giveaways:', err);
  } finally {
    isLoading.value = false;
  }
};

const title = 'Istekle nagradne igre - Arhiva završenih nagradnih igara';
const description =
  'Pregled završenih nagradnih igara u Srbiji, Hrvatskoj i BiH. Iako je rok za učešće prošao, pogledaj detalje prethodnih igara i pronađi nove aktuelne prilike.';

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: `${config.public.siteUrl}/expired`,
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: `${config.public.siteUrl}/expired`,
    },
  ],
});
</script>

<template>
  <div class="expired-page">
    <!-- Hero -->
    <section class="expired-hero">
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="container hero-inner">
        <span class="eyebrow">Arhiva</span>
        <h1 class="hero-title">Istekle nagradne igre</h1>
        <p class="hero-subtitle">
          Ovde se nalaze nagradne igre kojima je istekao rok za učešće. Pogledaj kako su izgledale,
          saznaj koje su nagrade bile u igri i pronađi slične aktuelne nagradne igre u kojima još
          možeš da učestvuješ.
        </p>

        <div class="hero-actions">
          <NuxtLink to="/" class="btn btn-primary btn-lg">Pogledaj aktuelne igre</NuxtLink>
          <NuxtLink to="/submit" class="btn btn-outline btn-lg">Predloži nagradnu igru</NuxtLink>
        </div>

        <div class="hero-stats">
          <div class="hero-stat">
            <strong>{{ totalCount }}</strong>
            <span>{{ totalCount === 1 ? 'istekla igra' : 'isteklih igara' }}</span>
          </div>
          <span class="stat-divider" aria-hidden="true"></span>
          <div class="hero-stat">
            <strong>3</strong>
            <span>zemlje regiona</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Expired giveaways feed -->
    <section id="expired-giveaways" class="feed-section section">
      <div class="container">
        <div class="feed-head">
          <div class="section-head-copy">
            <span class="eyebrow">
              <span class="archive-dot" aria-hidden="true"></span>
              Završeno
            </span>
            <h2 class="section-title">Nagradne igre koje su završene</h2>
            <p class="section-subtitle">
              Rok za učešće je prošao, ali detalji ostaju dostupni. Klikni na igru da vidiš opis i
              pronađeš nove prilike.
            </p>
          </div>
          <div v-if="totalCount" class="feed-count">
            <strong>{{ totalCount }}</strong>
            <span>ukupno</span>
          </div>
        </div>

        <div v-if="isLoading && giveaways.length === 0" class="giveaways-grid">
          <SkeletonCard v-for="i in 6" :key="i" />
        </div>

        <div v-else-if="giveaways.length > 0" class="giveaways-grid">
          <GiveawayCard
            v-for="(giveaway, index) in giveaways"
            :key="giveaway.id"
            :giveaway="giveaway"
            :preload="index < 4"
          />
        </div>

        <div v-else class="empty-state">
          <span class="empty-icon" aria-hidden="true">🗓️</span>
          <h3>Još nema isteklih nagradnih igara</h3>
          <p>
            Sve objavljene nagradne igre su još u toku. Pogledaj aktuelne nagradne igre i pronađi
            svoju sledeću priliku.
          </p>
          <NuxtLink to="/" class="btn btn-primary">Pogledaj aktuelne igre</NuxtLink>
        </div>

        <div v-if="isLoading && giveaways.length > 0" class="loading-spinner">
          <div class="spinner"></div>
          <p>Učitavanje nagradnih igara...</p>
        </div>

        <PaginationControls
          v-if="giveaways.length > 0"
          :page="page"
          :total-pages="totalPages"
          :total-items="totalCount"
          :page-size="PAGE_SIZE"
          :loading="isLoading"
          @change="handlePageChange"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.expired-page {
  overflow: hidden;
}

/* Hero */
.expired-hero {
  position: relative;
  padding: 76px 0 74px;
  text-align: center;
  background:
    radial-gradient(900px circle at 8% 12%, rgba(214, 65, 35, 0.1), transparent 62%),
    radial-gradient(720px circle at 92% 18%, rgba(244, 179, 42, 0.12), transparent 58%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg-soft) 100%);
}

.hero-glow {
  position: absolute;
  right: -110px;
  bottom: -140px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: rgba(214, 65, 35, 0.08);
  pointer-events: none;
}

.hero-inner {
  position: relative;
  max-width: 860px;
}

.hero-title {
  font-size: clamp(38px, 5.4vw, 62px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.045em;
  margin-bottom: 18px;
}

.hero-subtitle {
  max-width: 700px;
  margin: 0 auto;
  font-size: 17px;
  line-height: 1.7;
  color: var(--text-muted);
}

.hero-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: 42px;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hero-stat strong {
  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--heading);
}

.hero-stat span {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-muted);
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--border);
}

/* Feed */
.feed-section {
  background: var(--bg);
}

.feed-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 38px;
}

.archive-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--text-muted);
}

.feed-count {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--surface);
  box-shadow: var(--shadow-xs);
  flex-shrink: 0;
}

.feed-count strong {
  font-family: var(--font-heading);
  font-size: 16px;
  font-weight: 800;
  color: var(--primary);
}

.feed-count span {
  font-size: 12.5px;
  color: var(--text-muted);
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
  font-size: 42px;
  margin-bottom: 4px;
}

.empty-state h3 {
  font-size: 22px;
}

.empty-state p {
  max-width: 480px;
  margin-bottom: 12px;
  color: var(--text-muted);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 34px;
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 1100px) {
  .giveaways-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .expired-hero {
    padding: 52px 0 58px;
  }

  .hero-subtitle {
    font-size: 15.5px;
  }

  .feed-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }

  .giveaways-grid {
    grid-template-columns: 1fr;
  }
}
</style>
