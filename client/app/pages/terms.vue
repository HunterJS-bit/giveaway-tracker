<script setup lang="ts">
const title = 'Uslovi Korišćenja - Fribbo';
const description = 'Pročitajte uslove korišćenja platforme Fribbo pre nego što počnete da koristite naše usluge.';
const config = useRuntimeConfig();

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: `${config.public.siteUrl}/terms`,
});
</script>

<template>
  <div class="static-page">
    <div class="hero-section">
      <div class="container hero-inner">
        <h1 class="hero-title">Uslovi Korišćenja</h1>
        <p class="hero-subtitle">Korišćenjem sajta prihvatate ove uslove. Poslednje ažuriranje: 27. Mart 2026.</p>
      </div>
    </div>

    <div class="container">
      <div class="content-card glass">
        <h2>1. Prihvatanje Uslova</h2>
        <p>
          Korišćenjem platforme Fribbo ("Platforma", "mi", "nas") slažete se sa ovim Uslovima korišćenja. Ako se ne slažete sa nekim od ovih uslova, molimo vas da prestanete sa korišćenjem Platforme.
        </p>

        <h2>2. Opis Usluge</h2>
        <p>
          Fribbo je platforma za agregaciju nagradnih igara koja prikuplja i objavljuje informacije o aktuelnim nagradnim igrama sa Balkana i regiona. Mi nismo organizatori nagradnih igara koje su prikazane na sajtu, već ih isključivo prenosimo i agregiramo sa javnih izvora.
        </p>

        <h2>3. Odricanje od Odgovornosti</h2>
        <p>
          Fribbo nastoji da prikaže tačne i ažurne informacije, ali ne garantuje tačnost, potpunost ni aktuelnost sadržaja. Svakom nagradnom igrom upravljaju njeni organizatori, te:
        </p>
        <ul>
          <li>Fribbo ne odgovara za uslove, pravila ni isplatu nagrada pojedinih nagradnih igara.</li>
          <li>Fribbo ne odgovara za gubitke nastale učešćem u nagradnim igrama prikazanim na platformi.</li>
          <li>Preporučujemo da uvek pročitate zvanična pravila organizatora pre učešća.</li>
        </ul>

        <h2>4. Korisnička Ponašanja</h2>
        <p>Korišćenjem platforme, saglasni ste da nećete:</p>
        <ul>
          <li>Koristiti platformu u nezakonite svrhe ili kršiti važeće propise.</li>
          <li>Postavljati lažne, obmanjujuće ili uvredljive komentare.</li>
          <li>Pokušavati da narušite rad ili bezbednost platforme.</li>
          <li>Koristiti automatizovane alate (botove) za pristup platformi bez naše prethodne pisane saglasnosti.</li>
        </ul>

        <h2>5. Predlaganje Nagradnih Igara</h2>
        <p>
          Korisnici mogu predlagati nagradne igre putem forme na sajtu. Slanjem predloga potvrđujete da ste vlasnik ili imate pravo da delite navedene informacije, da predlog ne narušava autorska prava trećih lica, te da Fribbo ima pravo da predlog odbaci bez obrazloženja.
        </p>

        <h2>6. Intelektualna Svojina</h2>
        <p>
          Dizajn, kod, logo i originalni sadržaj platforme su vlasništvo Fribbo tima i zaštićeni su odgovarajućim zakonima. Logoi i zaštitni znakovi brendova prikazanih u nagradnim igrama su vlasništvo njihovih vlasnika.
        </p>

        <h2>7. Promene Uslova</h2>
        <p>
          Zadržavamo pravo da izmenimo ove Uslove u bilo kom trenutku. O značajnim promenama ćemo vas obaveštavati objavljivanjem novih Uslova na ovoj stranici. Nastavak korišćenja platforme nakon izmena smatra se prihvatanjem novih uslova.
        </p>

        <h2>8. Kontakt</h2>
        <p>
          Za sva pitanja vezana za ove Uslove, kontaktirajte nas putem <NuxtLink to="/contact" class="text-link">kontakt forme</NuxtLink> ili na email <strong>legal@fribbo.com</strong>.
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

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
  .content-card {
    padding: 30px 20px;
  }
}
</style>
