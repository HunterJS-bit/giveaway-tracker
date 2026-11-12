<script setup lang="ts">
interface Props {
  page: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  totalItems: 0,
  pageSize: 9,
  loading: false,
});

const emit = defineEmits<{ (e: 'change', page: number): void }>();

const rangeStart = computed(() =>
  props.totalItems === 0 ? 0 : (props.page - 1) * props.pageSize + 1
);
const rangeEnd = computed(() => Math.min(props.page * props.pageSize, props.totalItems));

// Page numbers to render. `0` is used as an ellipsis marker so the array
// stays numeric and easy to handle in the template.
const pages = computed<number[]>(() => {
  const total = props.totalPages;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const start = Math.max(2, props.page - 1);
  const end = Math.min(total - 1, props.page + 1);
  const result: number[] = [1];

  if (start > 2) result.push(0);
  for (let i = start; i <= end; i += 1) result.push(i);
  if (end < total - 1) result.push(0);

  result.push(total);
  return result;
});

const go = (target: number) => {
  if (props.loading || target < 1 || target > props.totalPages || target === props.page) return;
  emit('change', target);
};
</script>

<template>
  <nav v-if="totalItems > 0" class="pagination" aria-label="Paginacija nagradnih igara">
    <p class="pagination-summary">
      Prikazano
      <strong>{{ rangeStart }}–{{ rangeEnd }}</strong>
      od
      <strong>{{ totalItems }}</strong>
      {{ totalItems === 1 ? 'nagradne igre' : 'nagradnih igara' }}
    </p>

    <div v-if="totalPages > 1" class="pagination-controls">
      <button
        type="button"
        class="page-btn page-arrow"
        :disabled="page <= 1 || loading"
        aria-label="Prethodna strana"
        @click="go(page - 1)"
      >
        ‹
      </button>

      <template v-for="(item, index) in pages" :key="`${item}-${index}`">
        <span v-if="item === 0" class="page-ellipsis" aria-hidden="true">…</span>
        <button
          v-else
          type="button"
          class="page-btn"
          :class="{ active: item === page }"
          :aria-current="item === page ? 'page' : undefined"
          :disabled="loading"
          @click="go(item)"
        >
          {{ item }}
        </button>
      </template>

      <button
        type="button"
        class="page-btn page-arrow"
        :disabled="page >= totalPages || loading"
        aria-label="Sledeća strana"
        @click="go(page + 1)"
      >
        ›
      </button>
    </div>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 44px;
}

.pagination-summary {
  font-size: 13.5px;
  color: var(--text-muted);
}

.pagination-summary strong {
  color: var(--heading);
  font-weight: 700;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
}

.page-btn {
  min-width: 42px;
  height: 42px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--body);
  font-family: var(--font-heading);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-softer);
  transform: translateY(-1px);
}

.page-btn.active {
  border-color: var(--primary);
  background: var(--primary);
  color: #fff;
  box-shadow: 0 8px 18px rgba(214, 65, 35, 0.24);
}

.page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.page-arrow {
  font-size: 20px;
  line-height: 1;
}

.page-ellipsis {
  min-width: 26px;
  text-align: center;
  color: var(--text-muted);
  font-weight: 700;
}
</style>
