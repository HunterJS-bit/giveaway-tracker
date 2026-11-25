<script setup lang="ts">
const config = useRuntimeConfig();
const auth = useAuth();
const siteUrl = (config.public.siteUrl || '').replace(/\/+$/, '');
const ogImage = `${siteUrl}/og-image.jpg`;

// Initialize auth check on app load
onMounted(() => {
  auth.checkAuthStatus();
});

useSeoMeta({
  ogSiteName: 'Nagradne Igre Tracker',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Sve Nagradne Igre - pronađi svoju sledeću nagradu',
  twitterImage: ogImage,
  twitterImageAlt: 'Sve Nagradne Igre - pronađi svoju sledeću nagradu'
});
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-content">
      <NuxtPage />
    </main>
    <LazyAppFooter />
    <LazyToastContainer />
    <LazyCookieConsent />
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
</style>
