<script setup lang="ts">
import type { Category } from '~/composables/useCategories';
const { categories: categoryList, fetchCategories } = useCategories();

const platforms = [
  'All', 'Instagram', 'Facebook', 'TikTok', 'Website'
];

// All category slugs including the 'All' option
const categories = computed(() => ['All', ...categoryList.value.map((c: Category) => c.slug)]);
const categoryLabel = (slug: string) => {
  if (slug === 'All') return 'Sve';
  return categoryList.value.find((c: Category) => c.slug === slug)?.name ?? slug;
};

onMounted(() => fetchCategories());

const { category, platform, searchQuery, sort, fetchGiveaways } = useGiveaways();

// Debounce search slightly
let searchTimeout: any = null;
const handleSearchInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  searchQuery.value = target.value;
  
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchGiveaways(true);
  }, 500);
};

const setCategory = (c: string) => {
  if (category.value === c) return;
  category.value = c;
  fetchGiveaways(true);
};

const setPlatform = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  platform.value = target.value;
  fetchGiveaways(true);
};

const setSort = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  sort.value = target.value;
  fetchGiveaways(true);
};
</script>

<template>
  <div class="filters-wrap animate-fade-in-up">
    <div class="container filters-inner">
      
      <!-- Top row: Search and Platform -->
      <div class="filters-controls">
        <div class="search-box">
          <input 
            type="text" 
            :value="searchQuery"
            @input="handleSearchInput"
            placeholder="Pretraži nagradne igre..." 
            class="form-input search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        
        <div class="platform-filter">
          <select :value="platform" @change="setPlatform" class="form-input select-input">
            <option v-for="p in platforms" :key="p" :value="p">
              {{ p === 'All' ? 'Sve platforme' : p }}
            </option>
          </select>
        </div>
        <div class="sort-filter">
          <select :value="sort" @change="setSort" class="form-input select-input">
            <option value="endingSoonest">Uskoro Ističe</option>
            <option value="newest">Najnovije</option>
            <option value="highestValue">Najveća Vrednost</option>
          </select>
        </div>
      </div>

      <!-- Bottom row: Categories -->
      <ul class="categories-list">
        <li
          v-for="cat in categories"
          :key="cat"
          class="category-item"
          :class="{ active: category === cat }"
          @click="setCategory(cat)"
        >
          <span v-if="cat !== 'All'">{{ categoryList.find(c => c.slug === cat)?.icon }} </span>
          {{ categoryLabel(cat) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.filters-wrap {
  margin-bottom: 40px;
  border-bottom: 1px solid #eee;
  padding: 20px 0;
  background: var(--white);
}

.filters-inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filters-controls {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.search-box {
  position: relative;
  flex-grow: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 15px 12px 40px;
  border: 1px solid #ddd;
  border-radius: var(--radius-sm);
  font-size: 14px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.select-input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: var(--radius-sm);
  font-size: 14px;
  background-color: var(--white);
  min-width: 150px;
  cursor: pointer;
}

.categories-list {
  display: flex;
  gap: 25px;
  overflow-x: auto;
  padding-bottom: 5px;
  scrollbar-width: none;
}

.categories-list::-webkit-scrollbar {
  display: none;
}

.category-item {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  padding: 5px 0;
  transition: color 0.2s ease;
}

.category-item:hover {
  color: var(--text-main);
}

.category-item.active {
  color: var(--accent-pink);
}

.category-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--accent-pink);
}

@media (max-width: 600px) {
  .filters-controls {
    flex-direction: column;
  }
  .search-box {
    max-width: 100%;
  }
}
</style>
