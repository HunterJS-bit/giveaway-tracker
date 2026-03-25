<script setup lang="ts">
const { giveaways, isLoading, hasMore, fetchGiveaways } = useGiveaways();

onMounted(() => {
  fetchGiveaways(true);
});

useHead({
  title: 'Naslovna - Najveća baza nagradnih igara',
  meta: [
    { name: 'description', content: 'Sve nagradne igre na jednom mestu u Srbiji, Hrvatskoj i BIH. Osvoji vredne nagrade!' }
  ]
})
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

      <div v-if="hasMore" class="pagination-wrap">
        <button class="btn btn-dark" @click="fetchGiveaways()" :disabled="isLoading">
          {{ isLoading ? 'Učitavanje...' : 'Učitaj još' }}
        </button>
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

.feed-section {
  padding-bottom: 80px;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
}

.pagination-wrap {
  margin-top: 60px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
}
</style>
