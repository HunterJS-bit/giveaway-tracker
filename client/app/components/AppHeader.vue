<script setup lang="ts">
const colorMode = useColorMode();
const isMenuOpen = ref(false);
const { isAuthenticated, checkAuthStatus } = useAuth();

checkAuthStatus();

onMounted(() => {
  checkAuthStatus();
});

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const route = useRoute();
watch(() => route.path, closeMenu);
</script>

<template>
  <header class="app-header">
    <div class="container header-inner">
      <NuxtLink to="/" class="logo" aria-label="Sve Nagradne Igre — početna" @click="closeMenu">
        <span class="logo-mark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 12v8.25a.75.75 0 0 1-.75.75H4.75a.75.75 0 0 1-.75-.75V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M3 7.5h18v4.5H3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
            <path d="M12 7.5V21M12 7.5S10.8 3 8.25 3 5.25 7.5 8.25 7.5H12Zm0 0s1.2-4.5 3.75-4.5 3 4.5 0 4.5H12Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="logo-copy">
          <span class="logo-text">Sve Nagradne Igre</span>
          <span class="logo-tagline">tvoj put do nagrade</span>
        </span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="nav-links desktop-nav" aria-label="Glavna navigacija">
        <NuxtLink to="/" class="nav-link">Početna</NuxtLink>
        <NuxtLink to="/about" class="nav-link">O nama</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">Kontakt</NuxtLink>

        <button @click="toggleTheme" class="theme-toggle" aria-label="Promeni temu">
          <svg class="theme-icon icon-moon" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <svg class="theme-icon icon-sun" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
          </svg>
        </button>
<!-- 
        <NuxtLink v-if="!isAuthenticated" to="/login" class="nav-link nav-login">Prijava</NuxtLink> -->

        <NuxtLink to="/submit" class="btn btn-primary nav-cta">
          Predloži nagradnu igru
        </NuxtLink>
      </nav>

      <!-- Mobile controls -->
      <div class="mobile-controls">
        <button @click="toggleTheme" class="theme-toggle" aria-label="Promeni temu">
          <svg class="theme-icon icon-moon" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <svg class="theme-icon icon-sun" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
          </svg>
        </button>
        <button @click="toggleMenu" class="hamburger" :class="{ open: isMenuOpen }" aria-label="Otvori meni">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Transition name="drawer">
      <nav v-if="isMenuOpen" class="mobile-menu" aria-label="Mobilna navigacija">
        <NuxtLink to="/" class="mobile-link" @click="closeMenu">Početna</NuxtLink>
        <NuxtLink to="/about" class="mobile-link" @click="closeMenu">O nama</NuxtLink>
        <NuxtLink to="/contact" class="mobile-link" @click="closeMenu">Kontakt</NuxtLink>
        <!-- <NuxtLink v-if="!isAuthenticated" to="/login" class="mobile-link" @click="closeMenu">Prijava</NuxtLink> -->
        <NuxtLink to="/submit" class="mobile-link mobile-cta btn btn-primary" @click="closeMenu">Predloži nagradnu igru</NuxtLink>
      </nav>
    </Transition>

    <Transition name="fade">
      <div v-if="isMenuOpen" class="menu-backdrop" @click="closeMenu"></div>
    </Transition>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 200;
  height: var(--header-height);
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.header-inner {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.logo-mark {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(140deg, var(--primary) 20%, var(--lavender) 100%);
  box-shadow: 0 10px 22px rgba(214, 65, 35, 0.26);
  transition: transform 0.3s ease;
}

.logo:hover .logo-mark {
  transform: rotate(-5deg) scale(1.04);
}

.logo-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.logo-text {
  font-family: var(--font-heading);
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--heading);
}

.logo-tagline {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--primary);
  margin-top: 4px;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link {
  position: relative;
  padding: 9px 14px;
  border-radius: var(--radius-pill);
  font-family: var(--font-heading);
  font-size: 14.5px;
  font-weight: 600;
  color: var(--body);
  transition: color 0.2s ease, background-color 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary);
  background: var(--primary-softer);
}

.nav-login {
  margin-left: 4px;
}

.nav-cta {
  margin-left: 10px;
}

.theme-toggle {
  width: 42px;
  height: 42px;
  display: inline-grid;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--surface);
  color: var(--heading);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.theme-toggle:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: var(--primary-softer);
  transform: translateY(-1px);
}

.theme-icon {
  display: none;
}

.icon-moon {
  display: block;
}

:global(html.dark) .icon-moon {
  display: none;
}

:global(html.dark) .icon-sun {
  display: block;
}

.mobile-controls {
  display: none;
  align-items: center;
  gap: 8px;
}

.hamburger {
  width: 42px;
  height: 42px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  padding: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
}

.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--heading);
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

.mobile-menu {
  position: absolute;
  top: var(--header-height);
  left: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  z-index: 199;
}

.mobile-link {
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  font-family: var(--font-heading);
  font-size: 16px;
  font-weight: 600;
  color: var(--heading);
}

.mobile-link:hover {
  background: var(--primary-softer);
  color: var(--primary);
}

.mobile-cta {
  margin-top: 6px;
  color: #fff !important;
  text-align: center;
}

.menu-backdrop {
  position: fixed;
  inset: var(--header-height) 0 0;
  background: rgba(15, 16, 24, 0.38);
  backdrop-filter: blur(2px);
  z-index: 198;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 980px) {
  .desktop-nav {
    display: none;
  }

  .mobile-controls {
    display: flex;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 17px;
  }

  .logo-tagline {
    font-size: 9px;
  }

  .logo-mark {
    width: 40px;
    height: 40px;
  }
}
</style>
