<script setup lang="ts">
const title = 'O Nama - Sve Nagradne Igre';
const description = 'Saznajte više o Sve Nagradne Igre platformi, našoj misiji i kako vam pomažemo da pronađete najbolje nagradne igre na Balkanu.';
const config = useRuntimeConfig();

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: `${config.public.siteUrl}/about`,
});
</script>

<template>
  <div class="static-page">
    <div class="hero-section">
      <div class="container hero-inner">
        <h1 class="hero-title">O Nama</h1>
        <p class="hero-subtitle">Najveća zajednica ljubitelja nagradnih igara na Balkanu.</p>
      </div>
    </div>

    <div class="container">
      <div class="content-card glass">
        <h2>Naša misija</h2>
        <p>
          Sve Nagradne Igre je nastao sa jednostavnom idejom: da na jednom mestu okupi sve aktuelne nagradne igre i olakša korisnicima učestvovanje. Svesni smo koliko je teško pratiti stotine različitih profila i sajtova kako biste pronašli validne nagradne igre. Zato mi to radimo za vas!
        </p>
        
        <h2>Šta radimo?</h2>
        <p>
          Naš tim svakodnevno pretražuje internet, društvene mreže (Instagram, Facebook, TikTok) i zvanične sajtove brendova u potrazi za najnovijim nagradnim igrama u Srbiji, Hrvatskoj, Bosni i Hercegovini i regionu. 
        </p>
        <ul>
          <li><strong>Proveravamo validnost:</strong> Objavljujemo samo proverene nagradne igre od pouzdanih organizatora.</li>
          <li><strong>Kategorizujemo:</strong> Lako pronađite nagradne igre koje vas zanimaju pomoću naših filtera.</li>
          <li><strong>Obaveštavamo:</strong> Pratite nas i budite u toku sa nagradama koje se uskoro završavaju.</li>
        </ul>

        <h2>Pridružite se zajednici</h2>
        <p>
          Svako može doprineti! Ako ste pronašli nagradnu igru koja nije na našem sajtu, možete je <NuxtLink to="/submit" class="text-link">predložiti ovde</NuxtLink>. Nakon brze provere, biće objavljena i dostupna svima.
        </p>

        <p class="signature">
          Srećno u osvajanju nagrada!<br>
          <strong>Vaš Fribbo Tim</strong>
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
  font-size: 24px;
  font-weight: 700;
  margin: 30px 0 15px;
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

.signature {
  margin-top: 40px;
  font-size: 16px;
  border-top: 1px solid #eee;
  padding-top: 20px;
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
