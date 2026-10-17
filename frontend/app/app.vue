<script setup lang="ts">
const config = useRuntimeConfig();

useSeoMeta({
  ogSiteName: 'Nagradne Igre Tracker',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  ogImage: `${config.public.siteUrl}/og-image.jpg`,
  twitterImage: `${config.public.siteUrl}/og-image.jpg`
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
