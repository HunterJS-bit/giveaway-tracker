<script setup lang="ts">
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header class="app-header glass">
    <div class="container header-inner">
      <NuxtLink to="/" class="logo">
        <span class="logo-text">Fribbo</span>
        <div class="logo-underline"></div>
      </NuxtLink>
      
      <nav class="nav-links">
        <button @click="toggleTheme" class="theme-toggle" aria-label="Toggle Dark Mode">
          <svg v-if="colorMode.value === 'light'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>
        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        <NuxtLink to="/submit" class="nav-link btn btn-primary">Submit Giveaway</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
}

.header-inner {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  position: relative;
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-main);
  /* handwritten feel could be added with a specific font if available */
}

.logo-underline {
  height: 3px;
  width: 100%;
  background-color: var(--accent-pink);
  margin-top: -5px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.theme-toggle:hover {
  background-color: var(--bg-primary); /* Slight dark mode highlight */
  color: var(--accent-pink);
}

.nav-link {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-main);
}

.nav-link:not(.btn):hover {
  color: var(--accent-pink);
}

@media (max-width: 600px) {
  .logo-text {
    font-size: 24px;
  }
  .nav-links {
    gap: 15px;
  }
  .nav-link:not(.btn) {
    display: none;
  }
}
</style>
