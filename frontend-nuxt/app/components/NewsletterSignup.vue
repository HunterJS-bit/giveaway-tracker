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
  
  // Simulate API call
  console.log('Subscribing:', email.value);
  isSubscribed.value = true;
  addToast('Uspešno ste se prijavili na newsletter!', 'success');
  email.value = '';
};
</script>

<template>
  <section class="newsletter-section glass">
    <div class="container newsletter-inner">
      <div class="newsletter-content">
        <h2 class="newsletter-title">Ostanite u toku</h2>
        <p class="newsletter-description">Prijavite se na naš newsletter i prvi saznajte za najnovije i najvrednije nagradne igre.</p>
      </div>
      
      <form @submit.prevent="subscribe" class="newsletter-form">
        <div class="input-group">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Vaša email adresa..." 
            class="newsletter-input" 
            required
          />
          <button type="submit" class="btn btn-primary newsletter-btn">Prijavi se</button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.newsletter-section {
  padding: 60px 0;
  margin: 80px 0;
  background: linear-gradient(135deg, rgba(255, 75, 125, 0.05) 0%, rgba(243, 156, 18, 0.05) 100%);
  border-left: none;
  border-right: none;
}

.newsletter-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.newsletter-content {
  max-width: 500px;
}

.newsletter-title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 10px;
}

.newsletter-description {
  font-size: 16px;
  color: var(--text-muted);
}

.newsletter-form {
  flex-grow: 1;
  max-width: 500px;
}

.input-group {
  display: flex;
  gap: 10px;
  background: var(--bg-secondary);
  padding: 6px;
  border-radius: var(--radius-md);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.newsletter-input {
  flex-grow: 1;
  border: none;
  background: transparent;
  padding: 12px 15px;
  font-size: 14px;
  color: var(--text-main);
  outline: none;
}

.newsletter-btn {
  padding: 12px 24px;
}

@media (max-width: 992px) {
  .newsletter-inner {
    flex-direction: column;
    text-align: center;
  }
  .newsletter-content {
    max-width: 100%;
  }
}
</style>
