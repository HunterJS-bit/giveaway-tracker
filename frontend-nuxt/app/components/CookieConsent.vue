<script setup lang="ts">
import { ref, onMounted } from 'vue';

const showBanner = ref(false);

const acceptCookies = () => {
  localStorage.setItem('cookieConsent', 'accepted');
  showBanner.value = false;
};

const declineCookies = () => {
  localStorage.setItem('cookieConsent', 'declined');
  showBanner.value = false;
};

onMounted(() => {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    showBanner.value = true;
  }
});
</script>

<template>
  <div v-if="showBanner" class="cookie-banner glass">
    <div class="cookie-content container">
      <p>
        <strong>🍪 Kolačići na sajtu</strong><br/>
        Ova web stranica koristi kolačiće za poboljšanje vašeg korisničkog iskustva, 
        pružanje personalizovanog sadržaja i analizu našeg saobraćaja. Klikom na "Prihvatam", 
        slažete se sa upotrebom kolačića.
        <NuxtLink to="/cookie-policy" class="cookie-link">Saznaj više →</NuxtLink>
      </p>
      <div class="cookie-actions">
        <button @click="declineCookies" class="btn btn-outline">Odbijam</button>
        <button @click="acceptCookies" class="btn btn-primary">Prihvatam</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
  box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
}

.cookie-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

@media (min-width: 768px) {
  .cookie-content {
    flex-direction: row;
    justify-content: space-between;
  }
}

.cookie-content p {
  margin: 0;
  font-size: 14px;
  color: var(--text-main);
  flex: 1;
  line-height: 1.5;
}

.cookie-actions {
  display: flex;
  gap: 12px;
  white-space: nowrap;
  width: 100%;
}

@media (min-width: 768px) {
  .cookie-actions {
    width: auto;
  }
}

.cookie-actions .btn {
  flex: 1;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--text-muted);
  color: var(--text-main);
}

.btn-outline:hover {
  background: rgba(0,0,0,0.05);
}

.cookie-link {
  display: inline-block;
  margin-top: 8px;
  color: var(--accent-pink);
  font-weight: 600;
  font-size: 13px;
  text-decoration: underline;
}
</style>
