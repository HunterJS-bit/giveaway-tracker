<script setup lang="ts">
const { categories, fetchCategories } = useCategories();
onMounted(() => fetchCategories());
</script>

<template>
  <footer class="app-footer glass">
    <div class="container footer-grid">
      <div class="footer-brand">
        <NuxtLink to="/" class="logo">
          <span class="logo-text">Nagradne Igre</span>
          <div class="logo-underline"></div>
        </NuxtLink>
        <p class="brand-description">
          Najveća zajednica za ljubitelje nagradnih igara na Balkanu. Pronađite najbolje prilike za dobitak svaki dan.
        </p>
        <div class="social-links">
          <a href="#" class="social-icon" aria-label="Instagram">
            <!-- SVG -->
          </a>
          <a href="#" class="social-icon" aria-label="Facebook">
            <!-- SVG -->
          </a>
          <a href="#" class="social-icon" aria-label="TikTok">
            <!-- SVG -->
          </a>
        </div>
      </div>

      <nav class="footer-nav" aria-label="Quick Links">
        <h4>Brzi Linkovi</h4>
        <ul>
          <li><NuxtLink to="/">Početna</NuxtLink></li>
          <li><NuxtLink to="/submit">Predloži Nagradnu Igru</NuxtLink></li>
          <li><NuxtLink to="/">Sve Nagradne Igre</NuxtLink></li>
          <li><NuxtLink to="/">Pobednici</NuxtLink></li>
        </ul>
      </nav>

      <nav class="footer-nav" aria-label="Categories">
        <h4>Kategorije</h4>
        <ul>
          <li v-for="cat in categories" :key="cat.slug">
            <NuxtLink :to="`/category/${cat.slug}`">{{ cat.icon }} {{ cat.name }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <nav class="footer-nav" aria-label="Legal Information">
        <h4>Pravne Informacije</h4>
        <ul>
          <li><NuxtLink to="/terms">Uslovi Korišćenja</NuxtLink></li>
          <li><NuxtLink to="/privacy">Politika Privatnosti</NuxtLink></li>
          <li><NuxtLink to="/cookie-policy">Politika Kolačića</NuxtLink></li>
          <li><NuxtLink to="/about">O Nama</NuxtLink></li>
          <li><NuxtLink to="/contact">Kontakt</NuxtLink></li>
        </ul>
      </nav>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Sve Nagradne Igre. Sva prava zadržana. Proizvedeno sa ❤️ na Balkanu.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: auto;
  padding: 80px 0 0;
  border-top: 1px solid #eee;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 60px;
  padding-bottom: 60px;
}

.footer-brand {
  max-width: 320px;
}

.logo {
  display: inline-flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.logo-text {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-main);
}

.logo-underline {
  height: 4px;
  width: 100%;
  background-color: var(--accent-pink);
  margin-top: -5px;
}

.brand-description {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-muted);
  margin-bottom: 25px;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 75, 125, 0.1);
  color: var(--accent-pink);
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: var(--accent-pink);
  color: var(--white);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 75, 125, 0.3);
}

.footer-nav h4 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 25px;
  color: var(--text-main);
}

.footer-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-nav a {
  font-size: 15px;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.footer-nav a:hover {
  color: var(--accent-pink);
}

.footer-bottom {
  padding: 30px 0;
  background: rgba(0,0,0,0.02);
  border-top: 1px solid #eee;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  .footer-brand {
    grid-column: 1 / -1;
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .footer-brand {
    max-width: none;
    margin: 0 auto;
  }

  .social-links {
    justify-content: center;
  }

  .app-footer {
    padding: 50px 0 0;
  }
}
</style>
