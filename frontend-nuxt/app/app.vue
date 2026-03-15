<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-content">
      <NuxtPage />
    </main>
    
    <footer class="app-footer">
      <div class="container footer-inner">
        <p>&copy; 2026 Fribbo Giveaway Tracker. Sva prava zadržana.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-footer {
  margin-top: auto;
  padding: 40px 0;
  background-color: var(--white);
  border-top: 1px solid #eee;
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
}
</style>
