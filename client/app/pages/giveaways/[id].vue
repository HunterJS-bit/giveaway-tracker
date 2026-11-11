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
  isFeatured?: boolean;
  isVerified?: boolean;
  country?: string;
  startDate?: string;
  endDate: string;
}

const route = useRoute();
const id = route.params.id as string;
const config = useRuntimeConfig();
const { giveaways } = useGiveaways();
const { isFavorite, toggleFavorite } = useFavorites();
const { registerCountdown, unregisterCountdown, getCountdown, getTimeLeft } = useCountdown();
const { sanitizeHtml } = useSanitize();

const giveaway = computed<Giveaway | null>(() => giveaways.value.find((g: Giveaway) => g.id === id) || null);

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

const { data: result, error: fetchError } = await useAsyncData(
  `giveaway-${id}`,
  () => $fetch(`${config.public.apiBase}/api/giveaways/${id}`),
  {
    getCachedData(key, nuxtApp) {
      const fromList = giveaways.value.find((g: Giveaway) => g.id === id);
      if (fromList) return fromList;
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    }
  }
);

if (fetchError.value) {
  const statusCode = (fetchError.value as any)?.statusCode || 404;
  throw createError({
    statusCode,
    statusMessage: statusCode === 404 ? 'Nagradna igra nije pronađena' : 'Greška pri učitavanju'
  });
}

if (result.value) {
  const existing = giveaways.value.find((g: Giveaway) => g.id === id);
  if (!existing) {
    giveaways.value.push(result.value as any);
  }
} else if (!giveaway.value) {
  throw createError({ statusCode: 404, statusMessage: 'Nije pronađeno' });
}

// Dynamic SEO meta tags
const currentGiveaway = computed(() => giveaway.value || result.value as Giveaway);
const seoTitle = computed(() => `${currentGiveaway.value?.title || 'Nagradna igra'} - Osvoji ${currentGiveaway.value?.formattedPrizeValue || currentGiveaway.value?.prizeValue || 'nagradu'}`);
const seoDescription = computed(() => currentGiveaway.value?.description || `Učestvuj u nagradnoj igri i osvoji ${currentGiveaway.value?.formattedPrizeValue || currentGiveaway.value?.prizeValue} od ${currentGiveaway.value?.brand}. Završava se: ${new Date(currentGiveaway.value?.endDate).toLocaleDateString('sr-RS')}.`);
const seoImage = computed(() => currentGiveaway.value?.imageUrl || '/og-image.jpg');

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
  ogImage: seoImage,
  ogUrl: `${config.public.siteUrl}/giveaways/${id}`,
  twitterCard: 'summary_large_image',
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: `${config.public.siteUrl}/giveaways/${id}`
    }
  ]
});

// JSON-LD structured data for SEO
const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Promotion',
  name: currentGiveaway.value?.title,
  description: currentGiveaway.value?.description,
  image: currentGiveaway.value?.imageUrl,
  url: `${config.public.siteUrl}/giveaways/${id}`,
  brand: {
    '@type': 'Brand',
    name: currentGiveaway.value?.brand
  },
  offers: {
    '@type': 'Offer',
    price: currentGiveaway.value?.prizeValue,
    priceCurrency: currentGiveaway.value?.currency || 'RSD',
    availability: 'https://schema.org/InStock',
    validFrom: currentGiveaway.value?.startDate,
    validThrough: currentGiveaway.value?.endDate
  }
}));

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: jsonLd.value
    }
  ]
});

const { data: similarData } = await useAsyncData(
  `similar-${id}`,
  () => $fetch<Giveaway[]>(`${config.public.apiBase}/api/giveaways/${id}/similar`)
);
const similarGiveaways = computed(() => similarData.value || []);

const timeLeft = computed(() => {
  if (!giveaway.value) return '';
  return getCountdown(id) || getTimeLeft(giveaway.value.endDate);
});

const isExpired = computed(() => {
  if (!giveaway.value) return false;
  return giveaway.value.status === 'expired' || new Date(giveaway.value.endDate).getTime() < Date.now();
});

const isUrgent = computed(() => {
  if (isExpired.value) return false;
  return timeLeft.value !== 'Završeno' && !timeLeft.value.includes('d');
});

const formattedEndDate = computed(() => {
  if (!giveaway.value?.endDate) return '—';
  return new Date(giveaway.value.endDate).toLocaleDateString('sr-RS', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

onMounted(() => {
  if (giveaway.value) {
    registerCountdown(id, giveaway.value.endDate);
  }
});

watch(
  () => giveaway.value?.endDate,
  (endDate) => {
    if (endDate) registerCountdown(id, endDate);
  }
);

onUnmounted(() => {
  unregisterCountdown(id);
});

const categoryLabel = computed(() => {
  const cat = giveaway.value?.category || '';
  if (!cat) return '';
  return cat.charAt(0).toUpperCase() + cat.slice(1);
});

useSeoMeta({
  title: () => giveaway.value?.title || 'Nagradna Igra',
  ogTitle: () => giveaway.value?.title || 'Nagradna Igra',
  description: () => giveaway.value?.description || 'Pogledajte detalje ove nagradne igre.',
  ogDescription: () => giveaway.value?.description || 'Pogledajte detalje ove nagradne igre.',
  ogImage: () => giveaway.value?.imageUrl,
  ogUrl: () => `${config.public.siteUrl}/giveaways/${id}`,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => giveaway.value?.title || 'Nagradna Igra',
  twitterDescription: () => giveaway.value?.description || 'Pogledajte detalje ove nagradne igre.',
  twitterImage: () => giveaway.value?.imageUrl,
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: jsonLd.value
    }
  ]
});
</script>

<template>
  <div class="giveaway-details-page">
    <div class="container">
      <template v-if="giveaway">
        <!-- Breadcrumb -->
        <nav class="breadcrumb reveal" style="--delay: 0s" aria-label="Putanja">
          <NuxtLink to="/">Početna</NuxtLink>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <NuxtLink :to="`/category/${giveaway.category}`">{{ categoryLabel }}</NuxtLink>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span class="current">{{ giveaway.title }}</span>
        </nav>

        <!-- Hero: media + summary -->
        <section class="detail-hero">
          <div class="hero-media reveal" style="--delay: 0.06s">
            <NuxtImg
              v-if="giveaway.imageUrl"
              :src="giveaway.imageUrl"
              :alt="`${giveaway.brand ? giveaway.brand + ' - ' : ''}${giveaway.title} - ${giveaway.category} nagradna igra ${giveaway.prize ? 'sa nagradom ' + giveaway.prize : ''}`"
              class="main-image"
              format="webp"
              preload
              fetchpriority="high"
            />
            <div v-else class="main-image main-image-placeholder">
              <span class="placeholder-icon" aria-hidden="true">🎁</span>
            </div>
            <div class="media-badges">
              <span class="media-category">
                {{ categoryLabel }}
              </span>
              <span v-if="giveaway.isFeatured" class="media-featured">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2Z" />
                </svg>
                Izdvojeno
              </span>
            </div>
            <div class="media-timer" :class="{ urgent: isUrgent, expired: isExpired }">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {{ isExpired ? 'Završeno' : timeLeft }}
            </div>
          </div>

          <div class="hero-summary reveal" style="--delay: 0.14s">
            <div class="summary-topline">
              <span class="status-pill" :class="{ expired: isExpired }">
                <span class="status-dot" aria-hidden="true"></span>
                {{ isExpired ? 'Završena nagradna igra' : 'Aktivna nagradna igra' }}
              </span>
              <span v-if="giveaway.isVerified" class="verified-pill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m20 6-11 11-5-5" />
                </svg>
                Provereno
              </span>
            </div>

            <h1 class="details-title">{{ giveaway.title }}</h1>

            <div class="summary-meta">
              <div class="meta-box">
                <span class="meta-label">Organizator</span>
                <strong>{{ giveaway.brand }}</strong>
              </div>
              <div class="meta-box">
                <span class="meta-label">Učesnika</span>
                <strong>{{ giveaway.entryCount }}</strong>
              </div>
            </div>

            <div class="prize-box">
              <span class="prize-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 12v8.25a.75.75 0 0 1-.75.75H4.75a.75.75 0 0 1-.75-.75V12" />
                  <path d="M3 7.5h18v4.5H3z" />
                  <path d="M12 7.5V21M12 7.5S10.8 3 8.25 3 5.25 7.5 8.25 7.5H12Zm0 0s1.2-4.5 3.75-4.5 3 4.5 0 4.5H12Z" />
                </svg>
              </span>
              <div class="prize-copy" v-if="giveaway.prizeValue">
                <span class="prize-label">Vrednost nagrade</span>
                <strong>{{ giveaway.formattedPrizeValue || giveaway.prizeValue }} {{ giveaway.currency }}</strong>
              </div>
            </div>

            <div class="deadline-box" :class="{ urgent: isUrgent, expired: isExpired }">
              <span class="deadline-icon" aria-hidden="true">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div class="deadline-copy">
                <span>Rok za učešće</span>
                <strong>{{ formattedEndDate }}<template v-if="!isExpired"> · još {{ timeLeft }}</template></strong>
              </div>
            </div>

            <a
              v-if="!isExpired && giveaway.entryUrl"
              :href="giveaway.entryUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary btn-lg btn-full"
            >
              Učestvuj odmah
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
            <div v-else class="expired-notice">
              Ova nagradna igra je završena. Pogledaj slične aktivne nagradne igre ispod.
            </div>

            <div class="share-row">
              <button type="button" class="btn btn-outline" @click="shareGiveaway">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="18" cy="5" r="2.6" />
                  <circle cx="6" cy="12" r="2.6" />
                  <circle cx="18" cy="19" r="2.6" />
                  <path d="m8.3 10.7 7.4-4.3M8.3 13.3l7.4 4.3" />
                </svg>
                Podeli
              </button>
              <button
                type="button"
                class="btn btn-outline favorite-toggle"
                :class="{ active: isFavorite(id) }"
                @click="toggleFavorite(id)"
              >
                <svg v-if="isFavorite(id)" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 21s-7.5-4.6-9.7-9.2C.6 8.4 2.5 4.8 6.1 4.1c2-.4 4 .5 5.9 3 1.9-2.5 3.9-3.4 5.9-3 3.6.7 5.5 4.3 3.8 7.7C19.5 16.4 12 21 12 21Z" />
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 21s-7.5-4.6-9.7-9.2C.6 8.4 2.5 4.8 6.1 4.1c2-.4 4 .5 5.9 3 1.9-2.5 3.9-3.4 5.9-3 3.6.7 5.5 4.3 3.8 7.7C19.5 16.4 12 21 12 21Z" />
                </svg>
                {{ isFavorite(id) ? 'Sačuvano' : 'Sačuvaj' }}
              </button>
            </div>

            <p class="external-note">
              Učešćem napuštaš naš sajt i prelaziš na zvaničnu stranicu organizatora.
            </p>
          </div>
        </section>

        <!-- Main content + sidebar -->
        <div class="detail-body">
          <div class="detail-main">
            <section class="content-card reveal" style="--delay: 0.18s">
              <div class="card-heading">
                <span class="heading-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" />
                  </svg>
                </span>
                <h2>O ovoj nagradnoj igri</h2>
              </div>
              <div class="description" v-html="sanitizeHtml(giveaway.description) || 'Nema opisa za ovu nagradnu igru.'"></div>
            </section>

            <section class="rules-card reveal" style="--delay: 0.24s">
              <div class="card-heading">
                <span class="heading-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </span>
                <h2>Pravila i uslovi</h2>
              </div>
              <div class="rules-list">
                <div class="rule-item">
                  <span class="rule-number">1</span>
                  <p>Pročitaj pravila na zvaničnoj stranici organizatora pre učešća.</p>
                </div>
                <div class="rule-item">
                  <span class="rule-number">2</span>
                  <p>Klikom na dugme „Učestvuj“ napuštaš naš sajt i prelaziš na stranicu organizatora.</p>
                </div>
                <div class="rule-item">
                  <span class="rule-number">3</span>
                  <p>Sve nagradne igre objavljujemo informativno. Uslove i način izbora pobednika definiše organizator.</p>
                </div>
              </div>
            </section>

            <div class="reveal" style="--delay: 0.3s">
              <CommentSection :giveaway-id="id" />
            </div>
          </div>

          <aside class="detail-sidebar">
            <div class="sidebar-card reveal" style="--delay: 0.2s">
              <h3>Brzi pregled</h3>
              <ul class="info-list">
                <li>
                  <span>Kategorija</span>
                  <NuxtLink :to="`/category/${giveaway.category}`" class="info-link">{{ categoryLabel }}</NuxtLink>
                </li>
                <li>
                  <span>Organizator</span>
                  <strong>{{ giveaway.brand }}</strong>
                </li>
                <li v-if="giveaway.country">
                  <span>Zemlja</span>
                  <strong>{{ giveaway.country }}</strong>
                </li>
                <li v-if="giveaway.prizeValue">
                  <span>Nagrada</span>
                  <strong>{{ giveaway.formattedPrizeValue || giveaway.prizeValue }} {{ giveaway.currency }}</strong>
                </li>
                <li>
                  <span>Rok za učešće</span>
                  <strong>{{ formattedEndDate }}</strong>
                </li>
                <li>
                  <span>Status</span>
                  <strong :class="{ 'text-danger': isExpired, 'text-success': !isExpired }">
                    {{ isExpired ? 'Završena' : 'Aktivna' }}
                  </strong>
                </li>
              </ul>

              <a
                v-if="!isExpired && giveaway.entryUrl"
                :href="giveaway.entryUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary btn-full sidebar-cta"
              >
                Učestvuj odmah
              </a>

              <div class="sidebar-share">
                <button type="button" class="sidebar-icon-btn" aria-label="Podeli" @click="shareGiveaway">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="18" cy="5" r="2.6" />
                    <circle cx="6" cy="12" r="2.6" />
                    <circle cx="18" cy="19" r="2.6" />
                    <path d="m8.3 10.7 7.4-4.3M8.3 13.3l7.4 4.3" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="sidebar-icon-btn"
                  :class="{ active: isFavorite(id) }"
                  :aria-label="isFavorite(id) ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'"
                  @click="toggleFavorite(id)"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" :fill="isFavorite(id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 21s-7.5-4.6-9.7-9.2C.6 8.4 2.5 4.8 6.1 4.1c2-.4 4 .5 5.9 3 1.9-2.5 3.9-3.4 5.9-3 3.6.7 5.5 4.3 3.8 7.7C19.5 16.4 12 21 12 21Z" />
                  </svg>
                </button>
              </div>
            </div>
          </aside>
        </div>

        <!-- Similar -->
        <section v-if="similarGiveaways.length > 0" class="similar-section reveal" style="--delay: 0.36s">
          <div class="similar-head">
            <div>
              <span class="eyebrow">Još prilika</span>
              <h2 class="section-title">Slične nagradne igre</h2>
            </div>
            <NuxtLink :to="`/category/${giveaway.category}`" class="btn btn-outline">
              Sve u kategoriji
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </NuxtLink>
          </div>
          <div class="similar-grid">
            <GiveawayCard v-for="simGiveaway in similarGiveaways" :key="simGiveaway.id" :giveaway="simGiveaway" />
          </div>
        </section>
      </template>
    </div>

    <div class="toast" :class="{ 'toast-visible': showToast }">
      <span class="toast-icon">✓</span>
      {{ toastMessage }}
    </div>
  </div>
</template>

<style scoped>
.giveaway-details-page {
  padding: 30px 0 90px;
}

/* Reveal animation */
@keyframes detailReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal {
  opacity: 0;
  animation: detailReveal 0.72s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0s) forwards;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 13px;
  color: var(--text-muted);
}

.breadcrumb svg {
  color: var(--border-strong);
  flex-shrink: 0;
}

.breadcrumb a {
  font-weight: 600;
  color: var(--text-muted);
}

.breadcrumb a:hover {
  color: var(--primary);
}

.breadcrumb .current {
  max-width: 420px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--heading);
  font-weight: 600;
}

/* Hero */
.detail-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(400px, 0.98fr);
  gap: 34px;
  align-items: start;
}

.hero-media {
  position: relative;
  min-height: 460px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--bg-muted);
  box-shadow: var(--shadow-md);
}

.main-image {
  width: 100%;
  height: 100%;
  min-height: 460px;
  max-height: 620px;
  object-fit: cover;
}

.main-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 55%),
    radial-gradient(circle at 75% 80%, color-mix(in srgb, var(--accent, var(--primary)) 15%, transparent), transparent 60%),
    var(--bg-muted);
}

.main-image-placeholder .placeholder-icon {
  font-size: 4.5rem;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.15));
}

.media-badges {
  position: absolute;
  top: 18px;
  left: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.media-category,
.media-featured {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 13px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.94);
  color: var(--heading);
  font-family: var(--font-heading);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow: 0 8px 20px rgba(16, 17, 22, 0.14);
  backdrop-filter: blur(8px);
}

.media-featured {
  background: var(--warning);
  color: #241700;
}

.media-timer {
  position: absolute;
  left: 18px;
  bottom: 18px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 14px;
  border-radius: var(--radius-pill);
  background: rgba(16, 17, 22, 0.72);
  color: #fff;
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 700;
  backdrop-filter: blur(8px);
}

.media-timer.urgent {
  background: var(--accent);
  color: #2b1a00;
}

.media-timer.expired {
  background: rgba(16, 17, 22, 0.82);
  color: #c9cdd6;
}

/* Summary card */
.hero-summary {
  padding: 30px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.summary-topline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.status-pill,
.verified-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px;
  border-radius: var(--radius-pill);
  font-family: var(--font-heading);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.status-pill {
  background: var(--success-soft);
  color: var(--success);
}

.status-pill.expired {
  background: var(--bg-muted);
  color: var(--text-muted);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 18%, transparent);
}

.verified-pill {
  background: var(--primary-soft);
  color: var(--primary);
}

.details-title {
  margin-bottom: 20px;
  font-size: clamp(28px, 3.1vw, 42px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.04em;
  color: var(--heading);
}

.summary-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

.meta-box {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 13px 15px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);
}

.meta-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.meta-box strong {
  font-family: var(--font-heading);
  font-size: 14.5px;
  font-weight: 700;
  color: var(--heading);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.prize-box {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  margin-bottom: 12px;
  border-radius: var(--radius-md);
  background: linear-gradient(120deg, var(--primary-soft), var(--primary-softer));
  border: 1px solid color-mix(in srgb, var(--primary) 22%, var(--border));
}

.prize-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: var(--primary);
  color: #fff;
  box-shadow: 0 8px 18px rgba(214, 65, 35, 0.26);
}

.prize-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.prize-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.prize-copy strong {
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--heading);
}

.deadline-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  margin-bottom: 18px;
  border-radius: var(--radius-sm);
  background: var(--warning-soft);
  border: 1px solid color-mix(in srgb, var(--warning) 22%, var(--border));
}

.deadline-box.urgent {
  background: var(--danger-soft);
  border-color: color-mix(in srgb, var(--danger) 24%, var(--border));
}

.deadline-box.expired {
  background: var(--bg-muted);
  border-color: var(--border);
}

.deadline-icon {
  flex-shrink: 0;
  color: var(--warning);
}

.deadline-box.urgent .deadline-icon {
  color: var(--danger);
}

.deadline-box.expired .deadline-icon {
  color: var(--text-muted);
}

.deadline-copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.deadline-copy span {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.deadline-copy strong {
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 700;
  color: var(--heading);
}

.expired-notice {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: var(--radius-sm);
  background: var(--bg-muted);
  color: var(--text-muted);
  font-size: 13.5px;
  text-align: center;
}

.share-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}

.favorite-toggle.active {
  color: var(--accent-strong);
  border-color: var(--accent-strong);
  background: var(--accent-soft);
}

.external-note {
  margin-top: 12px;
  font-size: 11.5px;
  line-height: 1.5;
  text-align: center;
  color: var(--text-muted);
}

/* Body */
.detail-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 28px;
  align-items: start;
  margin-top: 34px;
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.content-card,
.rules-card {
  padding: 30px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
}

.card-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.card-heading h2 {
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.heading-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: var(--primary-soft);
  color: var(--primary);
}

.description {
  font-size: 15.5px;
  line-height: 1.8;
  color: var(--body);
}

.description :deep(p) {
  margin-bottom: 14px;
}

.description :deep(p:last-child) {
  margin-bottom: 0;
}

.description :deep(h2),
.description :deep(h3),
.description :deep(h4) {
  margin: 22px 0 10px;
  font-size: 18px;
  color: var(--heading);
}

.description :deep(ul),
.description :deep(ol) {
  margin: 0 0 16px;
  padding-left: 22px;
}

.description :deep(ul) {
  list-style: disc;
}

.description :deep(ol) {
  list-style: decimal;
}

.description :deep(li) {
  margin-bottom: 6px;
}

.description :deep(a) {
  color: var(--primary);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.description :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
  margin: 12px 0;
}

.description :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.description :deep(th),
.description :deep(td) {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.description :deep(th) {
  background: var(--primary-soft);
  font-weight: 600;
  color: var(--heading);
}

.description :deep(tr:last-child td) {
  border-bottom: none;
}

.description :deep(blockquote) {
  margin: 16px 0;
  padding: 12px 20px;
  border-left: 4px solid var(--primary);
  background: var(--primary-soft);
  color: var(--body);
  font-style: italic;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.rule-number {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--primary-soft);
  color: var(--primary);
  font-family: var(--font-heading);
  font-size: 12px;
  font-weight: 800;
}

.rule-item p {
  font-size: 14.5px;
  line-height: 1.65;
  color: var(--body);
}

/* Sidebar */
.detail-sidebar {
  position: sticky;
  top: calc(var(--header-height) + 18px);
}

.sidebar-card {
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.sidebar-card h3 {
  margin-bottom: 18px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-list li {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  padding: 11px 0;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
}

.info-list li:first-child {
  padding-top: 0;
}

.info-list li:last-child {
  border-bottom: none;
}

.info-list span {
  flex-shrink: 0;
  color: var(--text-muted);
}

.info-list strong,
.info-link {
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 700;
  text-align: right;
  color: var(--heading);
}

.info-link {
  color: var(--primary);
}

.info-link:hover {
  color: var(--primary-hover);
}

.text-success {
  color: var(--success) !important;
}

.text-danger {
  color: var(--danger) !important;
}

.sidebar-cta {
  margin-top: 18px;
}

.sidebar-share {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.sidebar-icon-btn {
  flex: 1;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--surface);
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.sidebar-icon-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: var(--primary-softer);
}

.sidebar-icon-btn.active {
  color: var(--accent-strong);
  border-color: var(--accent-strong);
  background: var(--accent-soft);
}

/* Similar */
.similar-section {
  margin-top: 60px;
}

.similar-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.similar-head .section-title {
  font-size: clamp(24px, 3vw, 36px);
}

.similar-head .eyebrow {
  margin-bottom: 10px;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: var(--heading);
  color: var(--bg);
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 1000;
  box-shadow: var(--shadow-lg);
}

.toast.toast-visible {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.toast-icon {
  background: var(--success);
  color: #fff;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

@media (max-width: 1080px) {
  .detail-hero {
    grid-template-columns: 1fr;
  }

  .hero-media,
  .main-image {
    min-height: 360px;
    max-height: 500px;
  }

  .detail-body {
    grid-template-columns: 1fr;
  }

  .detail-sidebar {
    position: static;
    order: -1;
  }

  .similar-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .giveaway-details-page {
    padding: 20px 0 64px;
  }

  .detail-hero {
    gap: 18px;
  }

  .hero-media,
  .main-image {
    min-height: 260px;
    max-height: 360px;
  }

  .hero-media {
    border-radius: var(--radius-lg);
  }

  .hero-summary {
    padding: 22px;
    border-radius: var(--radius-lg);
  }

  .details-title {
    font-size: 28px;
  }

  .summary-meta {
    grid-template-columns: 1fr;
  }

  .content-card,
  .rules-card {
    padding: 22px;
  }

  .similar-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .similar-grid {
    grid-template-columns: 1fr;
  }

  .share-row {
    grid-template-columns: 1fr;
  }
}
</style>
