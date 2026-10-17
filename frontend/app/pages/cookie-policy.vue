<script setup lang="ts">
const title = 'Politika Kolačića - Fribbo';
const description = 'Saznajte koje kolačiće Fribbo koristi i kako možete upravljati njima u vašem pretraživaču.';
const config = useRuntimeConfig();

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: `${config.public.siteUrl}/cookie-policy`,
});
</script>

<template>
  <div class="static-page">
    <div class="hero-section">
      <div class="container hero-inner">
        <h1 class="hero-title">Politika Kolačića</h1>
        <p class="hero-subtitle">Objašnjenje kako i zašto koristimo kolačiće. Poslednje ažuriranje: 27. Mart 2026.</p>
      </div>
    </div>

    <div class="container">
      <div class="content-card glass">
        <h2>1. Šta su Kolačići?</h2>
        <p>
          Kolačići (cookies) su mali tekstualni fajlovi koje web sajt smešta na vaš uređaj (računar, telefon, tablet) kada ga posećujete. Oni pomažu sajtovima da zapamte vaše preference i poboljšaju vaše iskustvo.
        </p>

        <h2>2. Koje Kolačiće Koristimo?</h2>

        <div class="cookie-table-wrapper">
          <table class="cookie-table">
            <thead>
              <tr>
                <th>Naziv</th>
                <th>Tip</th>
                <th>Svrha</th>
                <th>Trajanje</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>cookieConsent</code></td>
                <td>Neophodni</td>
                <td>Pamti vašu odluku o prihvatanju kolačića</td>
                <td>1 godina</td>
              </tr>
              <tr>
                <td><code>colorMode</code></td>
                <td>Funkcionalni</td>
                <td>Pamti vašu preferencu svetle ili tamne teme</td>
                <td>1 godina</td>
              </tr>
              <tr>
                <td><code>favorites</code></td>
                <td>Funkcionalni</td>
                <td>Čuva lokalno vaše omiljene nagradne igre (Local Storage, ne cookie)</td>
                <td>Bez isteka</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>3. Tipovi Kolačića koje Koristimo</h2>

        <h3>🔒 Neophodni Kolačići</h3>
        <p>
          Ovi kolačići su neophodni za funkcionisanje sajta. Bez njih određene funkcije neće raditi. Ne mogu se isključiti u okviru naših sistema.
        </p>

        <h3>⚙️ Funkcionalni Kolačići</h3>
        <p>
          Ovi kolačići omogućavaju poboljšanu funkcionalnost i personalizaciju, poput pamćenja vaše teme (svetla/tamna) i omiljenih nagradnih igara. Možete ih onemogućiti, ali to može uticati na vaše iskustvo.
        </p>

        <h3>📊 Analitički Kolačići</h3>
        <p>
          U budućnosti možemo koristiti analitičke alate (poput Google Analytics 4 ili Plausible) za merenje poseta u cilju poboljšanja sadržaja. Takvi kolačići biće jasno navedeni i podložni su vašoj saglasnosti.
        </p>

        <h2>4. Kako Kontrolisati Kolačiće?</h2>
        <p>Kolačićima možete upravljati na sledeće načine:</p>
        <ul>
          <li><strong>Putem našeg banera:</strong> Kada pierwszy put posetite sajt, prikazujemo baner gde možete prihvatiti ili odbiti kolačiće.</li>
          <li><strong>Putem pretraživača:</strong> Možete podesiti pretraživač da blokira ili briše kolačiće. Pogledajte uputstvo za vaš pretraživač:
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" class="text-link">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" target="_blank" rel="noopener" class="text-link">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/en-us/105082" target="_blank" rel="noopener" class="text-link">Safari</a></li>
            </ul>
          </li>
        </ul>

        <h2>5. Vaša Prava (GDPR)</h2>
        <p>U skladu sa Opštom uredbom o zaštiti podataka (GDPR), imate pravo da:</p>
        <ul>
          <li>Pristupite podacima koje imamo o vama.</li>
          <li>Zatražite brisanje vaših podataka.</li>
          <li>Povučete saglasnost za obradu podataka u bilo kom trenutku.</li>
        </ul>
        <p>Za ostvarivanje ovih prava, kontaktirajte nas na: <strong>privacy@fribbo.com</strong></p>

        <h2>6. Kontakt</h2>
        <p>
          Za sva pitanja o kolačićima, kontaktirajte nas putem <NuxtLink to="/contact" class="text-link">kontakt forme</NuxtLink> ili pogledajte našu <NuxtLink to="/privacy" class="text-link">Politiku Privatnosti</NuxtLink>.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.static-page {
  padding-bottom: 80px;
}

.hero-section {
  padding: 60px 0 40px;
  text-align: center;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--text-main);
}

.hero-subtitle {
  font-size: 18px;
  color: var(--text-muted);
}

.content-card {
  padding: 40px 60px;
  border-radius: var(--radius-md);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  font-size: 22px;
  font-weight: 700;
  margin: 35px 0 15px;
  color: var(--text-main);
}

h2:first-child {
  margin-top: 0;
}

h3 {
  font-size: 17px;
  font-weight: 700;
  margin: 20px 0 10px;
  color: var(--text-main);
}

p {
  line-height: 1.7;
  color: var(--text-main);
  margin-bottom: 15px;
}

ul {
  margin-bottom: 25px;
  padding-left: 20px;
}

li {
  line-height: 1.7;
  margin-bottom: 10px;
  color: var(--text-main);
}

.text-link {
  color: var(--accent-pink);
  font-weight: 600;
  text-decoration: underline;
}

.cookie-table-wrapper {
  overflow-x: auto;
  margin-bottom: 25px;
}

.cookie-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.cookie-table th {
  background: rgba(255, 75, 125, 0.08);
  color: var(--text-main);
  font-weight: 700;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 2px solid rgba(255, 75, 125, 0.2);
}

.cookie-table td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  color: var(--text-main);
  vertical-align: top;
}

.cookie-table code {
  background: rgba(0,0,0,0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-family: monospace;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
  .content-card {
    padding: 30px 20px;
  }
}
</style>
