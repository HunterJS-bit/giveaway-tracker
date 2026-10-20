<script setup lang="ts">
const { giveaways, isLoading, hasMore, fetchGiveaways } = useGiveaways();

await useAsyncData('home-giveaways', async () => {
  if (giveaways.value.length === 0) {
    await fetchGiveaways(true);
  }
  return true;
});

const title = 'Naslovna - Najveća baza nagradnih igara';
const description = 'Sve nagradne igre na jednom mestu u Srbiji, Hrvatskoj i BIH. Osvoji vredne nagrade!';
const config = useRuntimeConfig();

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: config.public.siteUrl,
})

// Infinite scroll observer
const loadMoreTrigger = ref<HTMLElement | null>(null);

const { stop } = useIntersectionObserver(
  loadMoreTrigger,
  ([{ isIntersecting }]) => {
    if (isIntersecting && hasMore.value && !isLoading.value) {
      fetchGiveaways();
    }
  },
  {
    threshold: 0.1,
  }
);

onUnmounted(() => {
  stop();
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-inner">
        <h1 class="hero-title">Najbolje nagradne igre na jednom mestu</h1>
        <p class="hero-subtitle">Pronađi, učestvuj i osvoji vredne nagrade u Srbiji, Hrvatskoj i BIH.</p>
        <div class="hero-actions">
          <NuxtLink to="/submit" class="btn btn-primary">Predloži nagradnu igru</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Community Section -->
    <section class="community-section">
      <div class="container community-inner">
        <h2 class="community-title">Pridruži se zajednici</h2>
        <p class="community-subtitle">Delite nagradne igre sa drugima i prvo saznajte za nove prilike!</p>
        <div class="community-buttons">
          <a href="https://chat.viber.com/YOUR_VIBER_LINK" target="_blank" rel="noopener noreferrer" class="community-btn viber-btn">
            <span class="btn-icon">💬</span>
            <span class="btn-text">Viber Grupa</span>
          </a>
          <a href="https://t.me/YOUR_TELEGRAM_LINK" target="_blank" rel="noopener noreferrer" class="community-btn telegram-btn">
            <span class="btn-icon">✈️</span>
            <span class="btn-text">Telegram Grupa</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <FeedFilters />

    <!-- Grid -->
    <section class="feed-section container">
      <div v-if="isLoading && giveaways.length === 0" class="grid">
        <SkeletonCard v-for="i in 6" :key="i" />
      </div>

      <div v-else-if="giveaways.length > 0" class="grid">
        <GiveawayCard 
          v-for="(giveaway, index) in giveaways" 
          :key="giveaway.id" 
          :giveaway="giveaway" 
          :preload="index < 4"
        />
      </div>

      <div v-else-if="!isLoading" class="empty-state">
        <p>Trenutno nema dostupnih nagradnih igara za odabrane kriterijume.</p>
      </div>

      <!-- Infinite scroll trigger -->
      <div ref="loadMoreTrigger" class="scroll-trigger">
        <div v-if="isLoading && giveaways.length > 0" class="loading-spinner">
          <div class="spinner"></div>
          <p>Učitavanje...</p>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <NewsletterSignup />
  </div>
</template>

<style scoped>
.hero-section {
  padding: 60px 0 80px;
  text-align: center;
  background: var(--white);
  margin-bottom: 20px;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-main);
}

.hero-subtitle {
  font-size: 18px;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto 30px;
}

.community-section {
  padding: 40px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-bottom: 20px;
}

.community-inner {
  text-align: center;
}

.community-title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

.community-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
}

.community-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.community-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: white;
}

.community-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.viber-btn {
  background: #7360f2;
}

.telegram-btn {
  background: #0088cc;
}

.btn-icon {
  font-size: 20px;
}

.feed-section {
  padding-bottom: 80px;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
}

.scroll-trigger {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color, #eaeaea);
  border-top-color: var(--accent-pink);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
}
</style>
