<script setup lang="ts">
const route = useRoute();
const id = route.params.id as string;
const { giveaways } = useGiveaways();

// In a real app, you'd fetch by ID from the API. 
// For now, we'll find it in the existing state or fetch if not present.
const giveaway = computed(() => giveaways.value.find(g => g.id === id) || null);

const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchGiveawayDetails = async () => {
  if (giveaway.value) return;
  
  isLoading.value = true;
  try {
    // Assuming the backend has a single giveaway endpoint
    const data: any = await $fetch(`http://localhost:3000/api/giveaways/${id}`);
    // We can push to the global state to keep it in sync
    giveaways.value.push(data);
  } catch (err: any) {
    console.error('Error fetching giveaway details:', err);
    error.value = 'Nagradna igra nije pronađena.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchGiveawayDetails();
});

// SEO
useSeoMeta({
  title: () => giveaway.value?.title || 'Nagradna Igra',
  ogTitle: () => giveaway.value?.title || 'Nagradna Igra',
  description: () => giveaway.value?.description || 'Pogledajte detalje ove nagradne igre.',
  ogImage: () => giveaway.value?.imageUrl,
});
</script>

<template>
  <div class="giveaway-details-page">
    <div class="container">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Učitavanje detalja nagradne igre...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <h2>Ups!</h2>
        <p>{{ error }}</p>
        <NuxtLink to="/" class="btn btn-primary">Nazad na početnu</NuxtLink>
      </div>

      <div v-else-if="giveaway" class="details-grid">
        <!-- Sidebar / Image -->
        <div class="details-sidebar">
          <div class="image-card glass">
            <img :src="giveaway.imageUrl" :alt="giveaway.title" class="main-image" />
            <div class="category-badge">{{ giveaway.category }}</div>
          </div>
          
          <div class="actions-card glass">
            <div class="brand-info">
              <span class="label">Organizator:</span>
              <span class="value">{{ giveaway.brand }}</span>
            </div>
            <div class="prize-info">
              <span class="label">Nagrada:</span>
              <span class="valueHighlight">{{ giveaway.formattedPrizeValue || giveaway.prizeValue }} {{ giveaway.currency }}</span>
            </div>
            
            <a :href="giveaway.entryUrl" target="_blank" class="btn btn-primary btn-lg full-width">
              UČESTVUJ ODMAH
            </a>
            
            <div class="share-info">
              <p>Podeli sa prijateljima:</p>
              <div class="share-buttons">
                <!-- Add share icons here if needed -->
                <button class="btn-share">Copy Link</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="details-main">
          <h1 class="details-title">{{ giveaway.title }}</h1>
          
          <div class="meta-row">
            <div class="meta-item">
              <span class="icon">⏰</span>
              <span>{{ giveaway.status === 'expired' ? 'Završeno' : 'Aktivno' }}</span>
            </div>
            <div class="meta-item">
              <span class="icon">👥</span>
              <span>{{ giveaway.entryCount }} submisija</span>
            </div>
          </div>

          <div class="content-section glass">
            <h3>O ovoj nagradnoj igri</h3>
            <div class="description" v-html="giveaway.description || 'Nema opisa za ovu nagradnu igru.'"></div>
          </div>

          <div class="rules-section glass">
            <h3>Pravila i Uslovi</h3>
            <p>Klikom na dugme "Učestvuj" bićete preusmereni na zvaničnu stranicu nagradne igre. Obavezno pročitajte sva pravila organizatora pre učestvovanja.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.giveaway-details-page {
  padding: 40px 0 80px;
}

.details-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
}

.details-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-card {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.main-image {
  width: 100%;
  display: block;
}

.category-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: var(--accent-pink);
  color: white;
  padding: 5px 15px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
}

.actions-card {
  padding: 30px;
  border-radius: var(--radius-md);
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}

.brand-info, .prize-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 16px;
}

.brand-info .value {
  font-weight: 700;
  color: var(--accent-pink);
}

.prize-info .valueHighlight {
  font-weight: 800;
  color: var(--text-main);
}

.btn-lg {
  padding: 18px 30px;
  font-size: 16px;
  font-weight: 800;
}

.full-width {
  width: 100%;
}

.share-info {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
}

.share-info p {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 15px;
}

.details-main {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.details-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.2;
}

.meta-row {
  display: flex;
  gap: 30px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: var(--text-muted);
}

.content-section, .rules-section {
  padding: 30px;
  border-radius: var(--radius-md);
}

.content-section h3, .rules-section h3 {
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 700;
}

.description {
  line-height: 1.7;
  color: var(--text-main);
}

.loading-state, .error-state {
  text-align: center;
  padding: 100px 0;
}

@media (max-width: 992px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .details-sidebar {
    order: 2;
  }
}
</style>
