<script setup lang="ts">
import type { Category } from '~/composables/useCategories';

const { categories: categoryList, fetchCategories } = useCategories();

const platforms = ['All', 'Instagram', 'Facebook', 'TikTok', 'Website'];

const categories = computed(() => ['All', ...categoryList.value.map((c: Category) => c.slug)]);

const categoryLabel = (slug: string) => {
  if (slug === 'All') return 'Sve kategorije';
  return categoryList.value.find((c: Category) => c.slug === slug)?.name ?? slug;
};

onMounted(() => fetchCategories());

const { category, platform, searchQuery, sort, fetchGiveaways } = useGiveaways();

const scrollToResults = () => {
  if (!process.client) return;
  nextTick(() => {
    document.getElementById('giveaways')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
};

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;

  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchGiveaways(true);
  }, 500);
};

const clearSearch = () => {
  searchQuery.value = '';
  fetchGiveaways(true);
};

const applySearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  fetchGiveaways(true);
  scrollToResults();
};

const setCategory = (value: string) => {
  if (category.value === value) return;
  category.value = value;
  fetchGiveaways(true);
  scrollToResults();
};

const setCategoryFromEvent = (event: Event) => {
  setCategory((event.target as HTMLSelectElement).value);
};

const setPlatform = (event: Event) => {
  platform.value = (event.target as HTMLSelectElement).value;
  fetchGiveaways(true);
};

const setSort = (event: Event) => {
  sort.value = (event.target as HTMLSelectElement).value;
  fetchGiveaways(true);
};
</script>

<template>
  <div class="filters-wrap">
    <div class="container">
      <form class="search-panel" @submit.prevent="applySearch">
        <div class="search-field">
          <span class="field-icon" aria-hidden="true">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <input
            :value="searchQuery"
            type="text"
            class="search-input"
            placeholder="Pretraži nagradne igre, brendove..."
            aria-label="Pretraži nagradne igre"
            @input="handleSearchInput"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="clear-search"
            aria-label="Obriši pretragu"
            @click="clearSearch"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <span class="field-divider" aria-hidden="true"></span>

        <label class="select-field">
          <span class="field-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
          <span class="select-copy">
            <span class="select-label">Kategorija</span>
            <select :value="category" class="select-control" @change="setCategoryFromEvent">
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ categoryLabel(cat) }}
              </option>
            </select>
          </span>
          <span class="select-chevron" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </label>

        <span class="field-divider" aria-hidden="true"></span>

        <label class="select-field">
          <span class="field-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
            </svg>
          </span>
          <span class="select-copy">
            <span class="select-label">Platforma</span>
            <select :value="platform" class="select-control" @change="setPlatform">
              <option v-for="p in platforms" :key="p" :value="p">
                {{ p === 'All' ? 'Sve platforme' : p }}
              </option>
            </select>
          </span>
          <span class="select-chevron" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </label>

        <span class="field-divider" aria-hidden="true"></span>

        <label class="select-field sort-field">
          <span class="field-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          </span>
          <span class="select-copy">
            <span class="select-label">Sortiraj</span>
            <select :value="sort" class="select-control" @change="setSort">
              <option value="endingSoonest">Uskoro ističe</option>
              <option value="newest">Najnovije</option>
              <option value="highestValue">Najveća vrednost</option>
            </select>
          </span>
          <span class="select-chevron" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </label>

        <button type="submit" class="btn btn-primary search-submit">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          Pretraži
        </button>
      </form>

      <div class="quick-categories">
        <span class="quick-label">Popularno</span>
        <div class="quick-list">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="quick-chip"
            :class="{ active: category === cat }"
            @click="setCategory(cat)"
          >
            <span v-if="cat !== 'All'">{{ categoryList.find(c => c.slug === cat)?.icon }}</span>
            {{ categoryLabel(cat) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters-wrap {
  position: relative;
  z-index: 12;
  margin-top: -68px;
}

.search-panel {
  display: flex;
  align-items: stretch;
  gap: 0;
  padding: 9px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.search-field {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1.55 1 260px;
  min-width: 0;
  padding: 0 10px 0 12px;
}

.field-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  min-width: 0;
  padding: 10px 0;
  border: none;
  background: transparent;
  color: var(--heading);
  font-size: 15px;
  font-weight: 500;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.clear-search {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: var(--bg-muted);
  color: var(--text-muted);
  cursor: pointer;
  flex-shrink: 0;
}

.clear-search:hover {
  color: var(--heading);
}

.field-divider {
  width: 1px;
  align-self: center;
  height: 32px;
  background: var(--border);
  flex-shrink: 0;
}

.select-field {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 150px;
  min-width: 0;
  padding: 0 32px 0 12px;
  cursor: pointer;
}

.select-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.select-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--text-muted);
  line-height: 1.2;
  margin-bottom: 2px;
}

.select-control {
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--heading);
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
}

.select-chevron {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
  display: inline-flex;
}

.search-submit {
  flex-shrink: 0;
  padding-left: 28px;
  padding-right: 28px;
}

.quick-categories {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  padding: 0 6px;
}

.quick-label {
  flex-shrink: 0;
  font-family: var(--font-heading);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.quick-list {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 4px 2px;
}

.quick-list::-webkit-scrollbar {
  display: none;
}

.quick-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  background: var(--surface);
  color: var(--body);
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.quick-chip:hover {
  color: var(--primary);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.quick-chip.active {
  color: #fff;
  background: var(--primary);
  border-color: var(--primary);
}

@media (max-width: 1100px) {
  .search-panel {
    flex-wrap: wrap;
    gap: 4px 0;
  }

  .search-field {
    flex-basis: 100%;
    padding: 6px 12px;
  }

  .search-panel > .field-divider:nth-of-type(1) {
    display: none;
  }

  .select-field {
    flex: 1 1 30%;
    padding: 10px 32px 10px 12px;
  }

  .search-submit {
    flex: 1 1 100%;
    margin-top: 4px;
    padding: 15px 24px;
  }
}

@media (max-width: 660px) {
  .filters-wrap {
    margin-top: -40px;
  }

  .search-panel {
    padding: 8px;
    border-radius: var(--radius-md);
  }

  .field-divider {
    display: none;
  }

  .select-field {
    flex-basis: 100%;
    padding: 11px 32px 11px 12px;
    border-top: 1px solid var(--border);
  }

  .sort-field {
    flex-basis: 100%;
  }

  .quick-categories {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
