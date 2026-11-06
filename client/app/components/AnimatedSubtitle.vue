<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string;
  delay?: number;
}>(), {
  delay: 0
});

const words = computed(() => props.text.split(' '));
</script>

<template>
  <p class="animated-subtitle" :aria-label="text">
    <span
      v-for="(word, index) in words"
      :key="`${word}-${index}`"
      class="word"
      :style="{ animationDelay: `${delay + index * 45}ms` }"
      aria-hidden="true"
    >{{ word }}</span>
  </p>
</template>

<style scoped>
.animated-subtitle {
  display: flex;
  flex-wrap: wrap;
  justify-content: inherit;
  column-gap: 0.28em;
  row-gap: 0.05em;
}

.word {
  display: inline-block;
  opacity: 0;
  transform: translateY(16px);
  animation: wordReveal 0.62s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes wordReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
