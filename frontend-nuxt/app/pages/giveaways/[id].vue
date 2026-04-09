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
  startDate?: string;
  endDate: string;
}

const route = useRoute();
const id = route.params.id as string;
const { giveaways } = useGiveaways();
const { isFavorite, toggleFavorite } = useFavorites();

// In a real app, you'd fetch by ID from the API. 
// For now, we'll find it in the existing state or fetch if not present.
const giveaway = computed<Giveaway | null>(() => giveaways.value.find((g: Giveaway) => g.id === id) || null);

const isLoading = ref(false);
const error = ref<string | null>(null);

const showToast = ref(false);
const toastMessage = ref('');

const showToastMessage = (msg: string) => {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const shareGiveaway = async () => {
  if (!giveaway.value) return;
  
  const shareData = {
    title: giveaway.value.title,
    text: `Pogledaj ovu nagradnu igru: ${giveaway.value.title}`,
    url: window.location.href,
  };

  try {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToastMessage('Link je kopiran!');
    }
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      console.error('Error sharing:', err);
    }
  }
};

const fetchGiveawayDetails = async () => {
  if (giveaway.value) return;
  
  isLoading.value = true;
  try {
    const { data: result, error: fetchError } = await useAsyncData(
      `giveaway-${id}`,
      () => $fetch(`http://localhost:3000/api/giveaways/${id}`),
      {
        getCachedData(key, nuxtApp) {
          const fromList = giveaways.value.find(g => g.id === id);
          if (fromList) return fromList;
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        }
      }
    );
    
    if (fetchError.value) {
      const statusCode = (fetchError.value as any)?.statusCode || (fetchError.value as any)?.response?.status || 404;
      throw createError({
        statusCode,
        statusMessage: statusCode === 404
          ? 'Nagradna igra nije pronađena'
          : 'Greška pri učitavanju nagradne igre',
      });
    }
    if (result.value) {
      giveaways.value.push(result.value);
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: 'Nagradna igra nije pronađena',
      });
    }
  } catch (err: any) {
    // If it's already a Nuxt error (from createError), re-throw to trigger error.vue
    if (err.statusCode) {
      showError(err);
      return;
    }
    console.error('Error fetching giveaway details:', err);
    showError({
      statusCode: 404,
      statusMessage: 'Nagradna igra nije pronađena',
    });
  } finally {
    isLoading.value = false;
  }
};

const similarGiveaways = ref<Giveaway[]>([]);
const fetchSimilarGiveaways = async () => {
  try {
    const { data } = await useFetch<Giveaway[]>(`http://localhost:3000/api/giveaways/${id}/similar`);
    if (data.value) {
      similarGiveaways.value = data.value;
    }
  } catch (err) {
    console.error('Error fetching similar giveaways:', err);
  }
};

onMounted(() => {
  fetchGiveawayDetails();
  fetchSimilarGiveaways();
});

// SEO
useSeoMeta({
  title: () => giveaway.value?.title || 'Nagradna Igra',
  ogTitle: () => giveaway.value?.title || 'Nagradna Igra',
  description: () => giveaway.value?.description || 'Pogledajte detalje ove nagradne igre.',
  ogDescription: () => giveaway.value?.description || 'Pogledajte detalje ove nagradne igre.',
  ogImage: () => giveaway.value?.imageUrl,
  ogUrl: () => `https://nagradneigre.balkan/giveaways/${id}`,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => giveaway.value?.title || 'Nagradna Igra',
  twitterDescription: () => giveaway.value?.description || 'Pogledajte detalje ove nagradne igre.',
  twitterImage: () => giveaway.value?.imageUrl,
});

const jsonLd = computed(() => {
  if (!giveaway.value) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': giveaway.value.title,
    'description': giveaway.value.description?.replace(/<[^>]*>?/gm, '').substring(0, 160) || giveaway.value.title,
    'image': giveaway.value.imageUrl,
    'startDate': giveaway.value.startDate || new Date().toISOString(),
    'endDate': giveaway.value.endDate || new Date().toISOString(),
    'eventAttendanceMode': 'https://schema.org/OnlineEventAttendanceMode',
    'eventStatus': giveaway.value.status === 'expired' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
    'location': {
      '@type': 'VirtualLocation',
      'url': giveaway.value.entryUrl
    },
    'organizer': {
      '@type': 'Organization',
      'name': giveaway.value.brand
    },
    'offers': {
      '@type': 'Offer',
      'url': giveaway.value.entryUrl,
      'price': '0',
      'priceCurrency': giveaway.value.currency || 'RSD',
      'availability': giveaway.value.status === 'expired' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      'validFrom': giveaway.value.startDate || new Date().toISOString()
    }
  };
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify(jsonLd.value)
    }
  ]
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
          <div class="image-card glass animate-fade-in-up" style="animation-delay: 0.1s">
            <NuxtImg :src="giveaway.imageUrl" :alt="giveaway.title" class="main-image" :style="{ viewTransitionName: 'giveaway-' + giveaway.id }" format="webp" preload fetchpriority="high" />
            <div class="category-badge">{{ giveaway.category }}</div>
          </div>
          
          <div class="actions-card glass animate-fade-in-up" style="animation-delay: 0.2s">
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
                <button @click="shareGiveaway" class="btn-share">
                  <span class="icon">📤</span> Podeli
                </button>
                <button @click="toggleFavorite(id)" class="btn-share favorite-btn" :class="{ 'is-favorite': isFavorite(id) }">
                  <span class="icon">{{ isFavorite(id) ? '❤️' : '🤍' }}</span> Omiljeno
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="details-main">
          <h1 class="details-title animate-fade-in-up" style="animation-delay: 0.15s">{{ giveaway.title }}</h1>
          
          <div class="meta-row animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="meta-item">
              <span class="icon">⏰</span>
              <span>{{ giveaway.status === 'expired' ? 'Završeno' : 'Aktivno' }}</span>
            </div>
            <div class="meta-item">
              <span class="icon">👥</span>
              <span>{{ giveaway.entryCount }} submisija</span>
            </div>
          </div>

          <div class="content-section glass animate-fade-in-up" style="animation-delay: 0.3s">
            <h3>O ovoj nagradnoj igri</h3>
            <div class="description" v-html="giveaway.description || 'Nema opisa za ovu nagradnu igru.'"></div>
          </div>

          <div class="rules-section glass animate-fade-in-up" style="animation-delay: 0.4s">
            <h3>Pravila i Uslovi</h3>
            <p>Klikom na dugme "Učestvuj" bićete preusmereni na zvaničnu stranicu nagradne igre. Obavezno pročitajte sva pravila organizatora pre učestvovanja.</p>
          </div>

          <!-- Similar Giveaways -->
          <div v-if="similarGiveaways.length > 0" class="similar-giveaways-section glass animate-fade-in-up" style="animation-delay: 0.5s">
            <h3>Slične nagradne igre</h3>
            <div class="giveaways-grid">
              <GiveawayCard v-for="simGiveaway in similarGiveaways" :key="simGiveaway.id" :giveaway="simGiveaway" />
            </div>
          </div>

          <!-- Comment Section -->
          <div class="animate-fade-in-up" style="animation-delay: 0.6s">
            <CommentSection :giveaway-id="id" />
          </div>
        </div>
      </div>
    </div>
    <!-- Toast Notification -->
    <div class="toast" :class="{ 'toast-visible': showToast }">
      <span class="toast-icon">✓</span>
      {{ toastMessage }}
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

.btn-share {
  background: #f1f5f9;
  color: var(--text-main);
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  transition: all 0.2s ease;
}

.btn-share:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: var(--text-main);
  color: var(--white);
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.toast.toast-visible {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.toast-icon {
  background: #4ade80;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

@media (max-width: 992px) {
  .details-grid {
    grid-template-columns: 1fr;
  }

  .details-sidebar {
    order: 2;
  }

  .details-title {
    font-size: 26px;
  }
}

@media (max-width: 600px) {
  .giveaway-details-page {
    padding: 20px 0 60px;
  }

  .details-grid {
    gap: 20px;
  }

  .content-section, .rules-section {
    padding: 20px;
  }

  .actions-card {
    padding: 20px;
  }

  .share-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .giveaways-grid {
    grid-template-columns: 1fr;
  }
}

.similar-giveaways-section {
  padding: 30px;
  border-radius: var(--radius-md);
  margin-top: 20px;
}

.similar-giveaways-section h3 {
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 700;
}

.giveaways-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
</style>
