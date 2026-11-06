<script setup lang="ts">
const posts = [
  {
    title: 'Kako prepoznati pravu nagradnu igru i izbeći prevaru',
    excerpt: 'Proverite organizatora, pravila i način na koji se biraju pobednici pre nego što uložite svoje vreme.',
    category: 'Saveti',
    date: '12. oktobar 2025.',
    readTime: '5 min čitanja',
    icon: '🛡️',
    theme: 'sunset'
  },
  {
    title: '7 koraka do boljih šansi za osvajanje nagrade',
    excerpt: 'Od temeljnog čitanja pravila do praćenja omiljenih brendova — evo šta zaista pravi razliku.',
    category: 'Vodič',
    date: '8. oktobar 2025.',
    readTime: '4 min čitanja',
    icon: '🎯',
    theme: 'berry'
  },
  {
    title: 'Najzanimljivije nagradne igre ovog meseca',
    excerpt: 'Izdvajamo nagradne igre sa najvrednijim nagradama i najjednostavnijim načinom učešća.',
    category: 'Pregled',
    date: '3. oktobar 2025.',
    readTime: '6 min čitanja',
    icon: '🎁',
    theme: 'blue'
  }
];
</script>

<template>
  <section id="blog" class="blog-section section section-soft">
    <div class="container">
      <div class="section-head">
        <div class="section-head-copy">
          <span class="eyebrow">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" />
            </svg>
            Blog
          </span>
          <h2 class="section-title">Najnovije sa bloga</h2>
          <p class="section-subtitle">Saveti, vodiči i inspiracija za sve koji vole da osvajaju nagrade.</p>
        </div>
        <NuxtLink to="/#blog" class="btn btn-outline blog-all">
          Svi članci
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </NuxtLink>
      </div>

      <div class="blog-grid">
        <article
          v-for="(post, index) in posts"
          :key="post.title"
          class="blog-card"
          :style="{ animationDelay: `${index * 70}ms` }"
        >
          <div class="blog-cover" :class="post.theme">
            <span class="cover-orb orb-one"></span>
            <span class="cover-orb orb-two"></span>
            <span class="cover-icon" aria-hidden="true">{{ post.icon }}</span>
            <span class="cover-category">{{ post.category }}</span>
          </div>

          <div class="blog-body">
            <div class="blog-meta">
              <span>{{ post.date }}</span>
              <span class="meta-dot" aria-hidden="true"></span>
              <span>{{ post.readTime }}</span>
            </div>
            <h3 class="blog-title">{{ post.title }}</h3>
            <p class="blog-excerpt">{{ post.excerpt }}</p>
            <span class="blog-readmore">
              Pročitaj više
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-section {
  position: relative;
}

.blog-all {
  flex-shrink: 0;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 26px;
}

.blog-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  opacity: 0;
  animation: fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.blog-card:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--primary) 38%, var(--border));
  box-shadow: var(--shadow-md);
}

.blog-cover {
  position: relative;
  height: 210px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blog-cover.sunset {
  background: linear-gradient(135deg, #d64123 0%, #ff8a5c 58%, #ffd6a8 100%);
}

.blog-cover.berry {
  background: linear-gradient(135deg, #6f1f2c 0%, #c93f5f 55%, #ff9e7a 100%);
}

.blog-cover.blue {
  background: linear-gradient(135deg, #103e56 0%, #1f7a9c 55%, #79d6e8 100%);
}

.cover-orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  filter: blur(1px);
}

.orb-one {
  width: 170px;
  height: 170px;
  top: -70px;
  right: -40px;
}

.orb-two {
  width: 110px;
  height: 110px;
  bottom: -50px;
  left: -28px;
  background: rgba(255, 255, 255, 0.11);
}

.cover-icon {
  position: relative;
  z-index: 1;
  width: 86px;
  height: 86px;
  display: grid;
  place-items: center;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  font-size: 40px;
  box-shadow: 0 18px 40px rgba(16, 17, 22, 0.22);
  backdrop-filter: blur(8px);
  transition: transform 0.35s ease;
}

.blog-card:hover .cover-icon {
  transform: rotate(-6deg) scale(1.08);
}

.cover-category {
  position: absolute;
  left: 16px;
  bottom: 16px;
  z-index: 1;
  padding: 7px 13px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.94);
  color: var(--heading);
  font-family: var(--font-heading);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.blog-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 24px;
}

.blog-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

.meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--border-strong);
}

.blog-title {
  margin-bottom: 10px;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.36;
  letter-spacing: -0.02em;
  color: var(--heading);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}

.blog-card:hover .blog-title {
  color: var(--primary);
}

.blog-excerpt {
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-readmore {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  font-family: var(--font-heading);
  font-size: 13.5px;
  font-weight: 700;
  color: var(--primary);
}

.blog-readmore svg {
  transition: transform 0.25s ease;
}

.blog-card:hover .blog-readmore svg {
  transform: translateX(4px);
}

@media (max-width: 960px) {
  .blog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .blog-card:last-child {
    display: none;
  }
}

@media (max-width: 640px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }

  .blog-card:last-child {
    display: flex;
  }

  .blog-cover {
    height: 190px;
  }
}
</style>
