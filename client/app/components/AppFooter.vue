<script setup lang="ts">
const { categories, fetchCategories } = useCategories();

onMounted(() => fetchCategories());

const socials = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.415.56.217.96.476 1.38.896.42.42.68.82.896 1.38.166.422.361 1.057.415 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.415 2.227-.217.56-.476.96-.896 1.38-.42.42-.82.68-1.38.896-.422.166-1.057.361-2.227.415-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.415-.56-.217-.96-.476-1.38-.896-.42-.42-.68-.82-.896-1.38-.166-.422-.361-1.057-.415-2.227C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.249-1.805.415-2.227.217-.56.476-.96.896-1.38.42-.42.82-.68 1.38-.896.422-.166 1.057-.361 2.227-.415C8.416 2.175 8.796 2.163 12 2.163Zm0 1.892c-3.15 0-3.522.012-4.766.069-1.15.052-1.774.244-2.19.406-.55.214-.942.47-1.354.882-.412.412-.668.804-.882 1.354-.162.416-.354 1.04-.406 2.19-.057 1.244-.069 1.616-.069 4.766s.012 3.522.069 4.766c.052 1.15.244 1.774.406 2.19.214.55.47.942.882 1.354.412.412.804.668 1.354.882.416.162 1.04.354 2.19.406 1.244.057 1.616.069 4.766.069s3.522-.012 4.766-.069c1.15-.052 1.774-.244 2.19-.406.55-.214.942-.47 1.354-.882.412-.412.668-.804.882-1.354.162-.416.354-1.04.406-2.19.057-1.244.069-1.616.069-4.766s-.012-3.522-.069-4.766c-.052-1.15-.244-1.774-.406-2.19-.214-.55-.47-.942-.882-1.354-.412-.412-.804-.668-1.354-.882-.416-.162-1.04-.354-2.19-.406-1.244-.057-1.616-.069-4.766-.069Zm0 3.217a4.728 4.728 0 1 1 0 9.456 4.728 4.728 0 0 1 0-9.456Zm0 1.892a2.836 2.836 0 1 0 0 5.672 2.836 2.836 0 0 0 0-5.672Zm6.016-2.109a1.106 1.106 0 1 1-2.212 0 1.106 1.106 0 0 1 2.212 0Z'
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/',
    path: 'M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06C2 17.08 5.657 21.245 10.438 22v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.196 2.238.196v2.474h-1.26c-1.243 0-1.63.776-1.63 1.573v1.887h2.773l-.443 2.91h-2.33V22C18.343 21.245 22 17.08 22 12.06Z'
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/',
    path: 'M16.6 2h-3.1v13.02a2.62 2.62 0 1 1-2.62-2.62c.27 0 .53.04.78.12V9.34a5.8 5.8 0 0 0-.78-.05 5.8 5.8 0 1 0 5.8 5.8V8.42a7.3 7.3 0 0 0 4.27 1.37V6.62a4.3 4.3 0 0 1-4.35-4.3V2Z'
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/',
    path: 'M23.5 6.2a3 3 0 0 0-2.1-2.12C19.54 3.57 12 3.57 12 3.57s-7.54 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.86.51 9.4.51 9.4.51s7.54 0 9.4-.5a3 3 0 0 0 2.1-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.23 3.6-6.23 3.6Z'
  }
];
</script>

<template>
  <footer class="app-footer">
    <div class="footer-glow" aria-hidden="true"></div>
    <div class="container footer-grid">
      <div class="footer-brand">
        <NuxtLink to="/" class="logo">
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
        <p class="brand-description">
          Najveća zajednica za ljubitelje nagradnih igara na Balkanu. Pronađite proverene nagradne igre i osvojite vredne nagrade — svaki dan.
        </p>
        <div class="social-block">
          <span class="social-label">Pratite nas</span>
          <div class="social-links">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.href"
              class="social-icon"
              :aria-label="social.name"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path :d="social.path" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <nav class="footer-nav" aria-label="Brzi linkovi">
        <h4>Istraži</h4>
        <ul>
          <li><NuxtLink to="/">Početna</NuxtLink></li>
          <li><NuxtLink to="/submit">Predloži nagradnu igru</NuxtLink></li>
          <li><NuxtLink to="/#giveaways">Sve nagradne igre</NuxtLink></li>
          <li><NuxtLink to="/#blog">Blog</NuxtLink></li>
          <li><NuxtLink to="/about">O nama</NuxtLink></li>
        </ul>
      </nav>

      <nav class="footer-nav" aria-label="Kategorije">
        <h4>Kategorije</h4>
        <ul>
          <li v-for="cat in categories.slice(0, 6)" :key="cat.slug">
            <NuxtLink :to="`/category/${cat.slug}`">
              <span class="category-dot" :style="{ background: cat.color }"></span>
              {{ cat.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <nav class="footer-nav" aria-label="Pravne informacije">
        <h4>Informacije</h4>
        <ul>
          <li><NuxtLink to="/terms">Uslovi korišćenja</NuxtLink></li>
          <li><NuxtLink to="/privacy">Politika privatnosti</NuxtLink></li>
          <li><NuxtLink to="/cookie-policy">Politika kolačića</NuxtLink></li>
          <li><NuxtLink to="/contact">Kontakt</NuxtLink></li>
        </ul>
        <div class="footer-contact">
          <span>Kontaktirajte nas</span>
          <a href="mailto:info@svenagradneigre.rs">info@svenagradneigre.rs</a>
        </div>
      </nav>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>&copy; {{ new Date().getFullYear() }} Sve Nagradne Igre. Sva prava zadržana.</p>
        <p class="made-with">Napravljeno sa <span aria-hidden="true">❤️</span> na Balkanu</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  position: relative;
  overflow: hidden;
  margin-top: auto;
  padding: 76px 0 0;
  background: #17110e;
  color: #c4b8b0;
}

.footer-glow {
  position: absolute;
  top: -220px;
  right: -160px;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(214, 65, 35, 0.38), transparent 68%);
  pointer-events: none;
}

.footer-grid {
  position: relative;
  display: grid;
  grid-template-columns: 1.7fr 0.9fr 1fr 1fr;
  gap: 56px;
  padding-bottom: 60px;
}

.footer-brand {
  max-width: 380px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.logo-mark {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(140deg, var(--primary) 20%, var(--lavender) 100%);
  box-shadow: 0 10px 22px rgba(214, 65, 35, 0.3);
}

.logo-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.logo-text {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
}

.logo-tagline {
  margin-top: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--lavender);
}

.brand-description {
  font-size: 14.5px;
  line-height: 1.7;
  color: #c4b8b0;
  margin-bottom: 28px;
}

.social-label {
  display: block;
  margin-bottom: 12px;
  font-family: var(--font-heading);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94857b;
}

.social-links {
  display: flex;
  gap: 10px;
}

.social-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #e6dcd5;
  transition: transform 0.25s ease, color 0.25s ease, background-color 0.25s ease, border-color 0.25s ease;
}

.social-icon:hover {
  transform: translateY(-3px);
  color: #fff;
  background: var(--primary);
  border-color: var(--primary);
  box-shadow: 0 10px 22px rgba(214, 65, 35, 0.35);
}

.footer-nav h4 {
  margin-bottom: 22px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #fff;
}

.footer-nav ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-nav a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14.5px;
  color: #c4b8b0;
}

.footer-nav a:hover {
  color: #fff;
}

.category-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.footer-contact {
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.footer-contact span {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94857b;
}

.footer-contact a {
  font-size: 14px;
  color: #fff;
}

.footer-contact a:hover {
  color: var(--lavender);
}

.footer-bottom {
  position: relative;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(0, 0, 0, 0.14);
}

.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 24px;
  padding-bottom: 24px;
}

.footer-bottom p {
  font-size: 13px;
  color: #a4958b;
}

.made-with span {
  color: var(--accent);
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 40px;
  }

  .footer-brand {
    grid-column: 1 / -1;
    max-width: 520px;
  }
}

@media (max-width: 680px) {
  .app-footer {
    padding-top: 56px;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 34px 24px;
    padding-bottom: 44px;
  }

  .footer-brand {
    max-width: none;
  }

  .footer-nav:last-child {
    grid-column: 1 / -1;
  }

  .footer-bottom-inner {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}

@media (max-width: 440px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-nav:last-child {
    grid-column: auto;
  }
}
</style>
