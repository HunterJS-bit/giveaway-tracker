<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';

const { giveaways, isLoading, hasMore, totalCount, fetchGiveaways } = useGiveaways();
const { categories } = useCategories();

const config = useRuntimeConfig();

await useAsyncData('home-giveaways', async () => {
  await fetchGiveaways(true);
  return true;
});

const title = 'Naslovna - Najveća baza nagradnih igara';
const description = 'Sve nagradne igre na jednom mestu u Srbiji, Hrvatskoj i BIH. Pronađi, učestvuj i osvoji vredne nagrade!';

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: config.public.siteUrl,
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: config.public.siteUrl
    }
  ]
});

const statCount = computed(() => (totalCount.value > 0 ? totalCount.value : giveaways.value.length));
const statCategories = computed(() => categories.value.length || 8);

const loadMoreTrigger = ref<HTMLElement | null>(null);
let stopObserver: (() => void) | null = null;

onMounted(() => {
  if (process.client && typeof useIntersectionObserver !== 'undefined') {
    const { stop } = useIntersectionObserver(
      loadMoreTrigger,
      ([{ isIntersecting }]) => {
        if (isIntersecting && hasMore.value && !isLoading.value) {
          fetchGiveaways();
        }
      },
      { threshold: 0.1 }
    );
    stopObserver = stop;
  }
});

onUnmounted(() => {
  if (stopObserver) stopObserver();
});
</script>

<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-glow glow-one" aria-hidden="true"></div>
      <div class="hero-glow glow-two" aria-hidden="true"></div>
      <div class="hero-grid-pattern" aria-hidden="true"></div>

      <div class="container hero-inner">
        <NuxtLink to="/submit" class="hero-badge animate-fade-in">
          <span class="pulse-dot" aria-hidden="true"></span>
          Proverene nagradne igre — ažurirano svakog dana
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </NuxtLink>

        <h1 class="hero-title animate-fade-in-up">
          Pronađi svoju
          <span class="text-gradient">sledeću nagradu</span>
        </h1>

        <AnimatedSubtitle
          class="hero-subtitle"
          text="Sve aktuelne nagradne igre na jednom mestu. Pretraži, filtriraj i učestvuj u nekoliko klikova — u Srbiji, Hrvatskoj i Bosni i Hercegovini."
          :delay="240"
        />

        <div class="hero-actions animate-fade-in-up" style="animation-delay: 0.45s">
          <a href="#giveaways" class="btn btn-primary btn-lg">
            Istraži nagradne igre
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <NuxtLink to="/submit" class="btn btn-outline btn-lg">Predloži nagradnu igru</NuxtLink>
        </div>

        <div class="hero-stats animate-fade-in-up" style="animation-delay: 0.6s">
          <div class="hero-stat">
            <strong>{{ statCount }}+</strong>
            <span>aktivnih igara</span>
          </div>
          <span class="stat-divider" aria-hidden="true"></span>
          <div class="hero-stat">
            <strong>{{ statCategories }}</strong>
            <span>kategorija</span>
          </div>
          <span class="stat-divider" aria-hidden="true"></span>
          <div class="hero-stat">
            <strong>3</strong>
            <span>zemlje regiona</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Search panel -->
    <FeedFilters />

    <!-- Categories -->
    <CategorySection class="home-categories" />

    <!-- Giveaways feed -->
    <section id="giveaways" class="feed-section section">
      <div class="container">
        <div class="feed-head">
          <div class="section-head-copy">
            <span class="eyebrow">
              <span class="live-dot" aria-hidden="true"></span>
              Aktuelno
            </span>
            <h2 class="section-title">Nagradne igre koje traju sada</h2>
            <p class="section-subtitle">Pažljivo izabrane i proverene prilike — pronađi svoju i učestvuj pre nego što istekne rok.</p>
          </div>
          <div v-if="giveaways.length" class="feed-count">
            <strong>{{ giveaways.length }}</strong>
            <span>prikazano</span>
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

        <div v-else-if="!isLoading" class="empty-state">
          <span class="empty-icon" aria-hidden="true">🔎</span>
          <h3>Nema rezultata za tvoju pretragu</h3>
          <p>Probaj drugu kategoriju ili pojam, ili predloži nagradnu igru koju želiš da vidimo.</p>
          <NuxtLink to="/submit" class="btn btn-primary">Predloži nagradnu igru</NuxtLink>
        </div>

        <div ref="loadMoreTrigger" class="scroll-trigger">
          <div v-if="isLoading && giveaways.length > 0" class="loading-spinner">
            <div class="spinner"></div>
            <p>Učitavanje novih nagradnih igara...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog -->
    <BlogSection />

    <!-- Newsletter -->
    <NewsletterSignup />

    <!-- Community -->
    <section class="community-section section">
      <div class="container">
        <div class="community-card">
          <div class="community-orb orb-a" aria-hidden="true"></div>
          <div class="community-orb orb-b" aria-hidden="true"></div>
          <div class="community-content">
            <span class="community-eyebrow">Zajednica</span>
            <h2>Pridruži se zajednici</h2>
            <p>Prati nove nagradne igre, podeli savete i prvo saznaj za nove prilike.</p>
          </div>
          <div class="community-buttons">
            <a href="https://chat.viber.com/YOUR_VIBER_LINK" target="_blank" rel="noopener noreferrer" class="community-btn viber-btn">
              <span class="community-icon" aria-hidden="true">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 5.8 2 10.5c0 2.7 1.4 5.1 3.7 6.7V22l3.4-1.8c.9.2 1.9.3 2.9.3 5.5 0 10-3.8 10-8.5S17.5 2 12 2Zm.1 13.1c-2.1 0-3.8-.4-3.8-.4l-1.9 1v-2.1c-1.4-1.1-2.2-2.7-2.2-4.4 0-3.2 3.4-5.8 7.6-5.8s7.6 2.6 7.6 5.8c0 2.7-2.4 5-5.6 5.7-.5.1-1 .2-1.7.2Z" />
                  <path d="M9.7 7.4c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.5 2.4 3.8 3.3 1.9.8 2.3.7 2.7.6.4 0 1.3-.5 1.5-1s.2-.9.1-1c-.1-.1-.2-.2-.4-.3l-1.5-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-.2-.1-.8-.3-1.5-.9-.6-.5-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4l.4-.4c.1-.2.2-.3.2-.4.1-.1.1-.3 0-.4l-.6-1.4Z" fill="#7360f2" />
                </svg>
              </span>
              <span>
                <strong>Viber grupa</strong>
                <small>Pridruži se razgovoru</small>
              </span>
            </a>
            <a href="https://t.me/YOUR_TELEGRAM_LINK" target="_blank" rel="noopener noreferrer" class="community-btn telegram-btn">
              <span class="community-icon" aria-hidden="true">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.9 4.3 18.7 19c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.3-.1-.5-.6-.2L6.3 12.3 1.5 10.8c-1-.3-1-1 .2-1.5L20.5 2c.9-.3 1.6.2 1.4 2.3Z" />
                </svg>
              </span>
              <span>
                <strong>Telegram grupa</strong>
                <small>Novosti u realnom vremenu</small>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  overflow: hidden;
}

/* Hero */
.hero-section {
  position: relative;
  padding: 88px 0 132px;
  background:
    radial-gradient(900px circle at 8% 12%, rgba(214, 65, 35, 0.13), transparent 62%),
    radial-gradient(720px circle at 92% 18%, rgba(244, 179, 42, 0.14), transparent 58%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg-soft) 100%);
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(10px);
  pointer-events: none;
}

.glow-one {
  width: 300px;
  height: 300px;
  left: -120px;
  top: 80px;
  background: rgba(214, 65, 35, 0.12);
  animation: floatY 9s ease-in-out infinite;
}

.glow-two {
  width: 240px;
  height: 240px;
  right: -80px;
  bottom: 40px;
  background: rgba(244, 179, 42, 0.16);
  animation: floatY 11s ease-in-out infinite reverse;
}

.hero-grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(82, 88, 102, 0.055) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(82, 88, 102, 0.055) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: radial-gradient(circle at 50% 35%, #000 0%, transparent 72%);
  -webkit-mask-image: radial-gradient(circle at 50% 35%, #000 0%, transparent 72%);
  pointer-events: none;
}

html.dark .hero-grid-pattern {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}

.hero-inner {
  position: relative;
  max-width: 950px;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 24px;
  padding: 8px 15px;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--surface) 80%, transparent);
  color: var(--body);
  font-family: var(--font-heading);
  font-size: 12.5px;
  font-weight: 600;
  box-shadow: var(--shadow-xs);
  backdrop-filter: blur(8px);
  transition: border-color 0.25s ease, color 0.25s ease;
}

.hero-badge:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.pulse-dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  flex-shrink: 0;
}

.pulse-dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid var(--success);
  opacity: 0;
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% { transform: scale(0.6); opacity: 0.8; }
  100% { transform: scale(1.8); opacity: 0; }
}

.hero-title {
  font-size: clamp(42px, 6.2vw, 78px);
  font-weight: 800;
  line-height: 1.03;
  letter-spacing: -0.045em;
  margin-bottom: 22px;
}

.hero-title .text-gradient {
  display: block;
  padding-bottom: 6px;
}

.hero-subtitle {
  max-width: 660px;
  margin: 0 auto;
  justify-content: center;
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-muted);
}

.hero-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: 48px;
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

/* Categories spacing */
.home-categories {
  padding-top: 82px;
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

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--success);
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
  max-width: 460px;
  margin-bottom: 12px;
  color: var(--text-muted);
}

.scroll-trigger {
  min-height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 34px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 14px;
}

/* Community */
.community-section {
  background: var(--bg);
}

.community-card {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 56px 60px;
  border-radius: var(--radius-xl);
  background: linear-gradient(120deg, #a92e16 0%, #d64123 46%, #ff8a5c 100%);
  box-shadow: 0 30px 70px rgba(214, 65, 35, 0.28);
}

.community-orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.11);
}

.orb-a {
  width: 280px;
  height: 280px;
  top: -150px;
  right: 10%;
}

.orb-b {
  width: 190px;
  height: 190px;
  bottom: -120px;
  left: 22%;
  background: rgba(244, 179, 42, 0.22);
}

.community-content {
  position: relative;
  z-index: 1;
  max-width: 540px;
}

.community-eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  font-family: var(--font-heading);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.community-content h2 {
  margin-bottom: 10px;
  font-size: clamp(28px, 3.2vw, 42px);
  font-weight: 800;
  letter-spacing: -0.035em;
  color: #fff;
}

.community-content p {
  font-size: 15.5px;
  color: rgba(255, 255, 255, 0.78);
}

.community-buttons {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.community-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  backdrop-filter: blur(10px);
  transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
}

.community-btn:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 14px 30px rgba(20, 18, 60, 0.22);
}

.community-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #fff;
  color: #7360f2;
  flex-shrink: 0;
}

.telegram-btn .community-icon {
  color: #229ed9;
}

.community-btn span:last-child {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.community-btn strong {
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 700;
}

.community-btn small {
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 1100px) {
  .giveaways-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .community-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 46px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 58px 0 108px;
  }

  .hero-title {
    font-size: clamp(36px, 10vw, 52px);
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-stats {
    gap: 18px;
  }

  .hero-stat strong {
    font-size: 22px;
  }

  .home-categories {
    padding-top: 64px;
  }

  .feed-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }

  .giveaways-grid {
    grid-template-columns: 1fr;
  }

  .community-card {
    padding: 36px 26px;
  }

  .community-buttons {
    width: 100%;
  }

  .community-btn {
    flex: 1 1 100%;
  }
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
  }

  .hero-actions .btn {
    width: 100%;
  }

  .hero-stats {
    gap: 12px;
  }

  .hero-stat span {
    font-size: 11px;
  }

  .stat-divider {
    height: 30px;
  }
}
</style>
