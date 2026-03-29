<script setup lang="ts">
const colorMode = useColorMode();
const isMenuOpen = ref(false);

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// Close menu on route change
const route = useRoute();
watch(() => route.path, closeMenu);
</script>

<template>
  <header class="app-header glass">
    <div class="container header-inner">
      <NuxtLink to="/" class="logo" @click="closeMenu">
        <span class="logo-text">Fribbo</span>
        <div class="logo-underline"></div>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="nav-links desktop-nav">
        <NuxtLink to="/" class="nav-link">Početna</NuxtLink>
        <NuxtLink to="/about" class="nav-link">O nama</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">Kontakt</NuxtLink>
        <button @click="toggleTheme" class="theme-toggle" aria-label="Toggle Dark Mode">
          <svg v-if="colorMode.value === 'light'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>
        <NuxtLink to="/submit" class="nav-link btn btn-primary">Predloži nagradnu igru</NuxtLink>
      </nav>

      <!-- Mobile controls -->
      <div class="mobile-controls">
        <button @click="toggleTheme" class="theme-toggle" aria-label="Toggle Dark Mode">
          <svg v-if="colorMode.value === 'light'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>
        <button @click="toggleMenu" class="hamburger" :class="{ open: isMenuOpen }" aria-label="Toggle Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Transition name="drawer">
      <nav v-if="isMenuOpen" class="mobile-menu glass">
        <NuxtLink to="/" class="mobile-link" @click="closeMenu">🏠 Početna</NuxtLink>
        <NuxtLink to="/about" class="mobile-link" @click="closeMenu">ℹ️ O nama</NuxtLink>
        <NuxtLink to="/contact" class="mobile-link" @click="closeMenu">📩 Kontakt</NuxtLink>
        <NuxtLink to="/submit" class="mobile-link btn btn-primary mobile-cta" @click="closeMenu">Predloži nagradnu igru</NuxtLink>
      </nav>
    </Transition>

    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="isMenuOpen" class="menu-backdrop" @click="closeMenu"></div>
    </Transition>
  </header>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.header-inner {
  height: var(--header-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-main);
}

.logo-underline {
  height: 3px;
  width: 100%;
  background-color: var(--accent-pink);
  margin-top: -5px;
}

/* Desktop Nav */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 28px;
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
  background-color: var(--bg-primary);
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

/* Mobile Controls - hidden on desktop */
.mobile-controls {
  display: none;
  align-items: center;
  gap: 8px;
}

/* Hamburger Button */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-sm);
  transition: background 0.2s ease;
}

.hamburger:hover {
  background: var(--bg-primary);
}

.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--text-main);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.77, 0.2, 0.05, 1);
  transform-origin: center;
}

.hamburger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile Drawer */
.mobile-menu {
  position: absolute;
  top: var(--header-height);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 4px;
  z-index: 199;
  border-top: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.mobile-link {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  transition: background 0.2s ease, color 0.2s ease;
}

.mobile-link:hover {
  background: var(--bg-primary);
  color: var(--accent-pink);
}

.mobile-cta {
  margin-top: 10px;
  text-align: center;
}

/* Backdrop */
.menu-backdrop {
  position: fixed;
  inset: 0;
  top: var(--header-height);
  background: rgba(0,0,0,0.3);
  z-index: 198;
}

/* Transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .logo-text {
    font-size: 24px;
  }

  .desktop-nav {
    display: none;
  }

  .mobile-controls {
    display: flex;
  }
}
</style>
