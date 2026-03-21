<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
  error: Object as () => NuxtError
});

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    
    <main class="main-content">
      <section class="error-section">
        <div class="container error-inner">
          <h1 class="error-title" v-if="error?.statusCode === 404">
            404 - Stranica nije pronađena
          </h1>
          <h1 class="error-title" v-else>
            {{ error?.statusCode }} - Došlo je do greške
          </h1>
          
          <p class="error-subtitle">
            Izvinjavamo se, ali izgleda da stranica koju tražite ne postoji ili je premeštena.
          </p>
          
          <div class="error-actions">
            <button @click="handleError" class="btn btn-primary">
              Vrati se na početnu
            </button>
          </div>
        </div>
      </section>
    </main>
    
    <AppFooter />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding-top: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-section {
  padding: 60px 0 80px;
  text-align: center;
  background: var(--white);
  width: 100%;
}

.error-inner {
  max-width: 600px;
  margin: 0 auto;
}

.error-title {
  font-size: 64px;
  font-weight: 800;
  margin-bottom: 20px;
  color: var(--text-main);
  line-height: 1.1;
}

.error-subtitle {
  font-size: 18px;
  color: var(--text-muted);
  margin: 0 auto 40px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

@media (max-width: 768px) {
  .error-title {
    font-size: 42px;
  }
}
</style>
