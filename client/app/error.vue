<script setup lang="ts">
const error = useError();
const is404 = computed(() => error.value?.statusCode === 404);
const config = useRuntimeConfig();

// Log error details to console for debugging (controlled by DEBUG_ERRORS env var)
const debugErrors = config.public.debugErrors === 'true';

if (error.value && debugErrors) {
  console.error('Error details:', {
    statusCode: error.value.statusCode,
    statusMessage: error.value.statusMessage,
    message: error.value.message,
    url: error.value.url,
    stack: error.value.stack,
    data: error.value.data,
  });
}

useSeoMeta({
  title: computed(() => is404.value ? 'Stranica nije pronađena - Fribbo' : 'Greška - Fribbo'),
});

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-content">
      <div class="error-page">
        <div class="error-blob blob-1"></div>
        <div class="error-blob blob-2"></div>

        <div class="error-content">
          <div class="error-code">{{ is404 ? '404' : error?.statusCode || '500' }}</div>
          <h1 class="error-title">
            {{ is404 ? 'Ups! Stranica nije pronađena.' : 'Nešto je pošlo naopako.' }}
          </h1>
          <p class="error-description">
            {{ is404
              ? 'Nagradna igra ili stranica koju tražite ne postoji ili je uklonjena.'
              : 'Desila se neočekivana greška. Naš tim je obavešten. Pokušajte ponovo za koji trenutak.'
            }}
          </p>
          <div class="error-actions">
            <button @click="handleError" class="btn btn-primary">← Nazad na početnu</button>
            <NuxtLink to="/submit" class="btn btn-outline-pink">Predloži nagradnu igru</NuxtLink>
          </div>
        </div>

        <div class="emoji-float">🎁</div>
      </div>
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
}

.error-page {
  min-height: calc(100vh - var(--header-height) - 200px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
}

.error-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
  pointer-events: none;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: var(--accent-pink);
  top: -100px;
  right: -100px;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: #7c3aed;
  bottom: -50px;
  left: -100px;
}

.error-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
}

.error-code {
  font-size: 140px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, var(--accent-pink), #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  font-family: 'Outfit', sans-serif;
}

.error-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 16px;
}

.error-description {
  font-size: 17px;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 40px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-outline-pink {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--accent-pink);
  color: var(--accent-pink);
  background: transparent;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline-pink:hover {
  background: var(--accent-pink);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 75, 125, 0.3);
}

.emoji-float {
  font-size: 80px;
  position: absolute;
  bottom: 60px;
  right: 10%;
  animation: float 4s ease-in-out infinite;
  opacity: 0.4;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@media (max-width: 600px) {
  .error-code {
    font-size: 100px;
  }
  .error-title {
    font-size: 22px;
  }
  .emoji-float {
    display: none;
  }
}
</style>
