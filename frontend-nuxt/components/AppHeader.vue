<template>
  <header class="app-header glass">
    <div class="container header-inner">
      <NuxtLink to="/" class="logo">
        <span class="logo-text">Fribbo</span>
        <div class="logo-underline"></div>
      </NuxtLink>
      
      <nav class="nav-links">
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
