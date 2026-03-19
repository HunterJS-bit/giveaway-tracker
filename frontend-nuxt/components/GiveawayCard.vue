<script setup lang="ts">
const props = defineProps<{
  giveaway: any
}>();

const getCategoryColor = (category: string) => {
  const cat = category?.toLowerCase();
  if (cat?.includes('tech')) return 'var(--cat-tech)';
  if (cat?.includes('beauty')) return 'var(--cat-beauty)';
  if (cat?.includes('gaming')) return 'var(--cat-gaming)';
  return 'var(--text-main)';
};
</script>

<template>
  <div class="giveaway-card" :class="{ 'featured-card': giveaway.isFeatured }">
    <div class="card-image-wrap">
      <NuxtLink :to="`/giveaways/${giveaway.id}`">
        <img :src="giveaway.imageUrl" :alt="giveaway.title" class="card-image" />
      </NuxtLink>
      <div class="card-overlay">
        <NuxtLink :to="`/giveaways/${giveaway.id}`" class="btn btn-primary small">Detalji</NuxtLink>
        <a :href="giveaway.entryUrl" target="_blank" class="btn btn-dark small icon-btn">🔗</a>
      </div>
      <div 
        class="category-badge" 
        :style="{ backgroundColor: getCategoryColor(giveaway.category) }"
      >
        {{ giveaway.category }}
      </div>
      <div v-if="giveaway.isFeatured" class="featured-badge">
        <span class="icon" style="font-size: 10px; margin-right: 4px;">⭐</span>Sponzorisano
      </div>
    </div>
    
    <div class="card-content">
      <div class="card-meta">
        <span class="brand-name">{{ giveaway.brand }}</span>
        <span class="prize-value">{{ giveaway.formattedPrizeValue || giveaway.prizeValue }} {{ giveaway.currency }}</span>
      </div>
      <NuxtLink :to="`/giveaways/${giveaway.id}`">
        <h3 class="card-title">{{ giveaway.title }}</h3>
      </NuxtLink>
      
      <div class="card-footer">
        <div class="entry-count">
          <span class="icon">👥</span>
          {{ giveaway.entryCount }} submisija
        </div>
        <div class="time-remaining" :class="{ 'ending-soon': giveaway.isEndingSoon }">
          <span class="icon">⏰</span>
          {{ giveaway.status === 'expired' ? 'Završeno' : 'Aktivno' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.giveaway-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.giveaway-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.1);
}

.featured-card {
  border: 2px solid var(--accent-gold);
  box-shadow: 0 5px 20px rgba(243, 156, 18, 0.15);
}

.featured-card:hover {
  box-shadow: 0 12px 30px rgba(243, 156, 18, 0.25);
}

.card-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.giveaway-card:hover .card-image {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(29, 32, 32, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.giveaway-card:hover .card-overlay {
  opacity: 1;
}

.category-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  color: white;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.featured-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: var(--accent-gold);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  color: white;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(243, 156, 18, 0.5);
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
}

.brand-name {
  color: var(--accent-pink);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--text-main);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
}

.ending-soon {
  color: var(--accent-pink);
  font-weight: 700;
}

.small {
  padding: 8px 16px;
  font-size: 12px;
}

.icon-btn {
  padding: 8px 12px;
  margin-left: 8px;
}

.card-overlay .btn {
  font-weight: 700;
  text-transform: uppercase;
}
</style>
