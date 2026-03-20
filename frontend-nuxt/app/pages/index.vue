<script setup lang="ts">
const { giveaways, isLoading, hasMore, fetchGiveaways } = useGiveaways();

onMounted(() => {
  fetchGiveaways(true);
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

    <!-- Filters -->
    <FeedFilters />

    <!-- Grid -->
    <section class="feed-section">
      <div class="container">
        <div v-if="giveaways.length > 0" class="grid">
          <GiveawayCard 
            v-for="(g, index) in giveaways" 
            :key="g.id" 
            :giveaway="g"
            :preload="index < 4"
          />
        </div>
        
        <div v-else-if="isLoading" class="loading-state">
          Učitavanje nagradnih igara...
        </div>
        
        <div v-else class="empty-state">
          <p>Trenutno nema aktivnih nagradnih igara za odabrane kriterijume.</p>
        </div>

        <!-- Pagination -->
        <div v-if="hasMore" class="pagination-wrap">
          <button 
            class="btn btn-dark" 
            :disabled="isLoading"
            @click="fetchGiveaways()"
          >
            {{ isLoading ? 'Učitavanje...' : 'Prikaži još' }}
          </button>
        </div>
      </div>
    </section>
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
