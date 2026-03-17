<script setup lang="ts">
const categories = [
  'All', 'Tech', 'Beauty', 'Cars', 'Travel', 'Food', 'Gaming', 'Fashion', 'Home'
];

const activeCategory = ref('All');
</script>

<template>
  <div class="filters-wrap">
    <div class="container">
      <ul class="filters-list">
        <li 
          v-for="cat in categories" 
          :key="cat"
          class="filter-item"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.filters-wrap {
  margin-bottom: 40px;
  border-bottom: 1px solid #eee;
}

.filters-list {
  display: flex;
  gap: 25px;
  overflow-x: auto;
  padding: 15px 0;
  scrollbar-width: none;
}

.filters-list::-webkit-scrollbar {
  display: none;
}

.filter-item {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  padding-bottom: 5px;
}

.filter-item:hover {
  color: var(--text-main);
}

.filter-item.active {
  color: var(--accent-pink);
}

.filter-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--accent-pink);
}
</style>
