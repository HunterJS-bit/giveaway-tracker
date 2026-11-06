<script setup lang="ts">
import { UseElementVisibility } from '@vueuse/components';
import { useFavorites } from '~/composables/useFavorites';
import { useToast } from '~/composables/useToast';
import { useCountdown } from '~/composables/useCountdown';

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
  isEndingSoon?: boolean;
  endDate: string;
}

const props = defineProps<{
  giveaway: Giveaway;
  preload?: boolean;
}>();

const { isFavorite, toggleFavorite } = useFavorites();
const { addToast } = useToast();
const { registerCountdown, unregisterCountdown, getCountdown } = useCountdown();

const timeLeft = computed(() => getCountdown(props.giveaway.id) || 'Uskoro');
const isUrgent = computed(() =>
  props.giveaway.isEndingSoon ||
  (timeLeft.value !== 'Uskoro' && timeLeft.value !== 'Završeno' && !timeLeft.value.includes('d'))
);

onMounted(() => {
  registerCountdown(props.giveaway.id, props.giveaway.endDate);
});

onUnmounted(() => {
  unregisterCountdown(props.giveaway.id);
});

const shareCard = async () => {
  try {
    await navigator.clipboard.writeText(`${window.location.origin}/giveaways/${props.giveaway.id}`);
    addToast('Link je kopiran!', 'success');
  } catch (err) {
    addToast('Greška prilikom kopiranja', 'error');
  }
};

const categoryIcon = computed(() => {
  const cat = props.giveaway.category?.toLowerCase();
  if (cat?.includes('tech')) return '💻';
  if (cat?.includes('beauty')) return '💄';
  if (cat?.includes('cars')) return '🚗';
  if (cat?.includes('travel')) return '✈️';
  if (cat?.includes('food')) return '🍕';
  if (cat?.includes('gaming')) return '🎮';
  if (cat?.includes('fashion')) return '👗';
  if (cat?.includes('home')) return '🏠';
  return '🎁';
});
</script>

<template>
  <UseElementVisibility v-slot="{ isVisible }">
    <article class="giveaway-card" :class="{ 'featured-card': giveaway.isFeatured }">
      <template v-if="isVisible || preload">
        <div class="card-media">
          <NuxtLink :to="`/giveaways/${giveaway.id}`" class="media-link" :aria-label="giveaway.title">
            <NuxtImg
              :src="giveaway.imageUrl"
              :alt="giveaway.title"
              class="card-image"
              format="webp"
              :loading="preload ? 'eager' : 'lazy'"
              :preload="preload"
              :fetchpriority="preload ? 'high' : 'auto'"
              placeholder
              placeholder-class="image-placeholder"
            />
          </NuxtLink>

          <div class="media-top">
            <span class="category-pill">
              <span aria-hidden="true">{{ categoryIcon }}</span>
              {{ giveaway.category }}
            </span>
            <button
              class="favorite-btn"
              :class="{ 'is-favorite': isFavorite(giveaway.id) }"
              :aria-label="isFavorite(giveaway.id) ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'"
              @click.prevent="toggleFavorite(giveaway.id)"
            >
              <svg v-if="isFavorite(giveaway.id)" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 21s-7.5-4.6-9.7-9.2C.6 8.4 2.5 4.8 6.1 4.1c2-.4 4 .5 5.9 3 1.9-2.5 3.9-3.4 5.9-3 3.6.7 5.5 4.3 3.8 7.7C19.5 16.4 12 21 12 21Z" />
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 21s-7.5-4.6-9.7-9.2C.6 8.4 2.5 4.8 6.1 4.1c2-.4 4 .5 5.9 3 1.9-2.5 3.9-3.4 5.9-3 3.6.7 5.5 4.3 3.8 7.7C19.5 16.4 12 21 12 21Z" />
              </svg>
            </button>
          </div>

          <div v-if="giveaway.isFeatured" class="featured-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2Z" />
            </svg>
            Izdvojeno
          </div>

          <div class="time-pill" :class="{ urgent: isUrgent }">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {{ timeLeft }}
          </div>
        </div>

        <div class="card-content">
          <div class="card-topline">
            <span class="brand-name">{{ giveaway.brand }}</span>
            <span class="prize-value">
              <span class="prize-label">Nagrada</span>
              {{ giveaway.formattedPrizeValue || giveaway.prizeValue }} {{ giveaway.currency }}
            </span>
          </div>

          <NuxtLink :to="`/giveaways/${giveaway.id}`" class="title-link">
            <h3 class="card-title">{{ giveaway.title }}</h3>
          </NuxtLink>

          <div class="card-footer">
            <span class="entry-count">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true">
                <path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" />
                <circle cx="9" cy="7" r="3.2" />
                <path d="M22 20v-1.5a4 4 0 0 0-3-3.87M16.5 4.2a3.2 3.2 0 0 1 0 6.1" />
              </svg>
              {{ giveaway.entryCount }} prijava
            </span>

            <div class="card-actions">
              <button class="share-btn" aria-label="Podeli nagradnu igru" @click.prevent="shareCard">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="18" cy="5" r="2.6" />
                  <circle cx="6" cy="12" r="2.6" />
                  <circle cx="18" cy="19" r="2.6" />
                  <path d="m8.3 10.7 7.4-4.3M8.3 13.3l7.4 4.3" />
                </svg>
              </button>
              <NuxtLink :to="`/giveaways/${giveaway.id}`" class="details-link">
                Detalji
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="card-skeleton" aria-hidden="true"></div>
    </article>
  </UseElementVisibility>
</template>

<style scoped>
.giveaway-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 390px;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.giveaway-card:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--primary) 42%, var(--border));
  box-shadow: var(--shadow-md);
}

.featured-card {
  border-color: color-mix(in srgb, var(--warning) 50%, var(--border));
}

.featured-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  z-index: 2;
  background: linear-gradient(90deg, var(--warning), var(--accent));
}

.card-media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg-muted);
}

.media-link {
  display: block;
  width: 100%;
  height: 100%;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.giveaway-card:hover .card-image {
  transform: scale(1.06);
}

.card-media::after {
  content: '';
  position: absolute;
  inset: 55% 0 0;
  background: linear-gradient(180deg, transparent, rgba(16, 17, 22, 0.62));
  pointer-events: none;
}

.media-top {
  position: absolute;
  inset: 14px 14px auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  z-index: 2;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: calc(100% - 58px);
  padding: 7px 12px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.94);
  color: var(--heading);
  font-family: var(--font-heading);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 6px 16px rgba(16, 17, 22, 0.14);
  backdrop-filter: blur(8px);
}

.favorite-btn {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  color: var(--heading);
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(16, 17, 22, 0.14);
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.08);
  color: var(--primary);
}

.favorite-btn.is-favorite {
  background: var(--accent);
  border-color: var(--accent);
  color: #2b1a00;
}

.featured-pill {
  position: absolute;
  left: 14px;
  bottom: 14px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 11px;
  border-radius: var(--radius-pill);
  background: var(--warning);
  color: #241700;
  font-family: var(--font-heading);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.time-pill {
  position: absolute;
  right: 14px;
  bottom: 14px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border-radius: var(--radius-pill);
  background: rgba(16, 17, 22, 0.72);
  color: #fff;
  font-family: var(--font-heading);
  font-size: 11.5px;
  font-weight: 700;
  backdrop-filter: blur(8px);
}

.time-pill.urgent {
  background: var(--accent);
  color: #2b1a00;
}

.card-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 20px 20px 18px;
}

.card-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.brand-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-heading);
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--primary);
}

.prize-value {
  flex-shrink: 0;
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  font-family: var(--font-heading);
  font-size: 13.5px;
  font-weight: 800;
  color: var(--heading);
}

.prize-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.title-link {
  display: block;
}

.card-title {
  font-size: 19px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.02em;
  color: var(--heading);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}

.giveaway-card:hover .card-title {
  color: var(--primary);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid var(--border);
}

.entry-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-muted);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.share-btn {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--surface);
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.share-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: var(--primary-softer);
}

.details-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  background: var(--primary-soft);
  color: var(--primary);
  font-family: var(--font-heading);
  font-size: 12.5px;
  font-weight: 700;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.details-link:hover {
  background: var(--primary);
  color: #fff;
}

.card-skeleton {
  flex: 1;
  min-height: 390px;
  background: linear-gradient(100deg, var(--bg-muted) 20%, var(--surface-2) 40%, var(--bg-muted) 60%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite linear;
}
</style>
