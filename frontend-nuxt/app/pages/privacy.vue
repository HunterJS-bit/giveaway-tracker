<script setup lang="ts">
useSeoMeta({
  title: 'Politika Privatnosti - Fribbo',
  description: 'Pročitajte kako Fribbo štiti vašu privatnost i obrađuje vaše podatke.',
});
</script>

<template>
  <div class="static-page">
    <div class="hero-section">
      <div class="container hero-inner">
        <h1 class="hero-title">Politika Privatnosti</h1>
        <p class="hero-subtitle">Vaša privatnost je naš prioritet. Poslednje ažuriranje: 15. Mart 2026.</p>
      </div>
    </div>

    <div class="container">
      <div class="content-card glass">
        <h2>1. Uvod</h2>
        <p>
          Dobrodošli na Fribbo. Poštujemo vašu privatnost i posvećeni smo zaštiti vaših ličnih podataka. Ova Politika privatnosti objašnjava kako prikupljamo, koristimo i štitimo vaše informacije kada posetite naš sajt.
        </p>

        <h2>2. Prikupljanje podataka</h2>
        <p>
          Kao platforma koja prevashodno agregira linkove ka eksternim nagradnim igrama, Fribbo trenutno prikuplja minimalne informacije o korisnicima:
        </p>
        <ul>
          <li><strong>Tehnički podaci:</strong> Anonimizovani podaci poput tipa pretraživača, IP adrese (privremeno) i podataka o poseti (putem standardnih analitičkih alata).</li>
          <li><strong>Podaci za kontakt:</strong> Ukoliko nas kontaktirate putem forme, sačuvaćemo vašu email adresu i ime u svrhu odgovora.</li>
          <li><strong>Lokalno skladište:</strong> Za funkciju "Omiljene nagradne igre", koristimo lokalno skladištenje na vašem uređaju (Local Storage). Ti podaci se ne šalju na naše servere.</li>
        </ul>

        <h2>3. Korišćenje podataka</h2>
        <p>Prikupljene podatke koristimo isključivo za:</p>
        <ul>
          <li>Održavanje i poboljšanje performansi sajta.</li>
          <li>Odgovor na vaše upite.</li>
          <li>Razumevanje načina na koji korisnici interaguju sa sajtom radi unapređenja korisničkog iskustva.</li>
        </ul>

        <h2>4. Kolačići (Cookies)</h2>
        <p>
          Koristimo osnovne kolačiće potrebne za funkcionisanje sajta, kao i analitičke kolačiće za praćenje poseta. Možete podesiti vaš pretraživač da odbije sve ili neke kolačiće, ali u tom slučaju određeni delovi sajta možda neće raditi ispravno.
        </p>

        <h2>5. Linkovi ka eksternim sajtovima</h2>
        <p>
          Fribbo sadrži linkove ka nagradnim igrama na sajtovima trećih lica (poput Instagrama, Facebooka ili zvaničnih sajtova brendova). Klikom na te linkove napuštate naš sajt. Mi nemamo kontrolu nad politikom privatnosti i praksom tih eksternih sajtova, te vam savetujemo da ih pročitate pre učešća u nagradnim igrama.
        </p>

        <h2>6. Kontakt</h2>
        <p>
          Ukoliko imate bilo kakva pitanja u vezi sa našom Politikom privatnosti, kontaktirajte nas putem <NuxtLink to="/contact" class="text-link">kontakt forme</NuxtLink> ili na email <strong>privacy@fribbo.com</strong>.
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
