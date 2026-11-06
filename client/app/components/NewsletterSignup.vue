<script setup lang="ts">
import { useToast } from '~/composables/useToast';

const email = ref('');
const isSubscribed = ref(false);
const { addToast } = useToast();

const subscribe = () => {
  if (!email.value || !email.value.includes('@')) {
    addToast('Molimo unesite ispravnu email adresu', 'error');
    return;
  }

  isSubscribed.value = true;
  addToast('Uspešno ste se prijavili na newsletter!', 'success');
  email.value = '';
};
</script>

<template>
  <section class="newsletter-section">
    <div class="container">
      <div class="newsletter-card">
        <div class="newsletter-glow" aria-hidden="true"></div>

        <div class="newsletter-content">
          <span class="newsletter-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            Newsletter
          </span>
          <h2 class="newsletter-title">Ne propusti nijednu priliku</h2>
          <p class="newsletter-description">
            Prijavi se i prvi saznaj za najnovije i najvrednije nagradne igre. Bez spama — samo dobre prilike.
          </p>
        </div>

        <form class="newsletter-form" @submit.prevent="subscribe">
          <div class="input-group">
            <span class="input-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </span>
            <input
              v-model="email"
              type="email"
              placeholder="Tvoja email adresa"
              class="newsletter-input"
              aria-label="Email adresa"
              required
            />
            <button type="submit" class="btn btn-primary newsletter-btn">
              Prijavi se
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          <p class="newsletter-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Tvoji podaci su sigurni. Odjava je moguća u svakom trenutku.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.newsletter-section {
  padding: 24px 0 20px;
  background: var(--bg);
}

.newsletter-card {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  padding: 48px 56px;
  border: 1px solid color-mix(in srgb, var(--primary) 18%, var(--border));
  border-radius: var(--radius-xl);
  background:
    radial-gradient(600px circle at 100% 0%, rgba(244, 179, 42, 0.16), transparent 60%),
    linear-gradient(120deg, var(--primary-softer), var(--surface) 55%);
}

.newsletter-glow {
  position: absolute;
  width: 220px;
  height: 220px;
  right: -80px;
  top: -100px;
  border-radius: 50%;
  background: rgba(214, 65, 35, 0.16);
  filter: blur(6px);
}

.newsletter-content {
  position: relative;
  z-index: 1;
  max-width: 460px;
}

.newsletter-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  background: var(--surface);
  color: var(--primary);
  font-family: var(--font-heading);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: var(--shadow-xs);
}

.newsletter-title {
  margin-bottom: 10px;
  font-size: clamp(26px, 3vw, 38px);
  font-weight: 800;
  letter-spacing: -0.035em;
}

.newsletter-description {
  font-size: 15px;
  line-height: 1.65;
  color: var(--text-muted);
}

.newsletter-form {
  position: relative;
  z-index: 1;
  flex: 1;
  max-width: 540px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 7px 7px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.input-icon {
  display: inline-flex;
  color: var(--text-muted);
  flex-shrink: 0;
}

.newsletter-input {
  flex: 1;
  min-width: 0;
  padding: 10px 0;
  border: none;
  background: transparent;
  color: var(--heading);
  font-size: 14.5px;
  outline: none;
}

.newsletter-input::placeholder {
  color: var(--text-muted);
}

.newsletter-btn {
  flex-shrink: 0;
}

.newsletter-note {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding-left: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.newsletter-note svg {
  flex-shrink: 0;
  color: var(--success);
}

@media (max-width: 1000px) {
  .newsletter-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 28px;
    padding: 38px;
  }

  .newsletter-content,
  .newsletter-form {
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 600px) {
  .newsletter-card {
    padding: 28px 20px;
    border-radius: var(--radius-lg);
  }

  .input-group {
    flex-wrap: wrap;
    padding: 10px;
    border-radius: var(--radius-md);
  }

  .input-icon {
    margin-left: 4px;
  }

  .newsletter-input {
    flex-basis: calc(100% - 40px);
  }

  .newsletter-btn {
    width: 100%;
    margin-top: 4px;
  }
}
</style>
