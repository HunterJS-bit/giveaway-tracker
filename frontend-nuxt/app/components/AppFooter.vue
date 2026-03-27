<template>
  <footer class="app-footer glass">
    <div class="container footer-grid">
      <div class="footer-brand">
        <NuxtLink to="/" class="logo">
          <span class="logo-text">Fribbo</span>
          <div class="logo-underline"></div>
        </NuxtLink>
        <p class="brand-description">Najveća zajednica za ljubitelje nagradnih igara na Balkanu. Pronađite najbolje prilike za dobitak svaki dan.</p>
        <div class="social-links">
          <a href="#" class="social-icon" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" class="social-icon" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="#" class="social-icon" aria-label="TikTok">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
          </a>
        </div>
      </div>

      <div class="footer-nav">
        <h4>Brzi Linkovi</h4>
        <ul>
          <li><NuxtLink to="/">Početna</NuxtLink></li>
          <li><NuxtLink to="/submit">Predloži Nagradnu Igru</NuxtLink></li>
          <li><NuxtLink to="/">Sve Nagradne Igre</NuxtLink></li>
          <li><NuxtLink to="/">Pobednici</NuxtLink></li>
        </ul>
      </div>

      <div class="footer-nav">
        <h4>Kategorije</h4>
        <ul>
          <li><NuxtLink to="/">Tehnologija</NuxtLink></li>
          <li><NuxtLink to="/">Lepota i Kozmetika</NuxtLink></li>
          <li><NuxtLink to="/">Automobili</NuxtLink></li>
          <li><NuxtLink to="/">Putovanja</NuxtLink></li>
        </ul>
      </div>

      <div class="footer-nav">
        <h4>Pravne Informacije</h4>
        <ul>
          <li><NuxtLink to="/terms">Uslovi Korišćenja</NuxtLink></li>
          <li><NuxtLink to="/privacy">Politika Privatnosti</NuxtLink></li>
          <li><NuxtLink to="/cookie-policy">Politika Kolačića</NuxtLink></li>
          <li><NuxtLink to="/about">O Nama</NuxtLink></li>
          <li><NuxtLink to="/contact">Kontakt</NuxtLink></li>
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2026 Fribbo Giveaway Tracker. Sva prava zadržana. Proizvedeno sa ❤️ na Balkanu.</p>
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
}
</style>
