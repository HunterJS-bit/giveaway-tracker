<script setup lang="ts">
const { submitGiveaway } = useGiveaways();
const url = ref('');
const isSubmitting = ref(false);
const message = ref({ text: '', type: '' });

const handleSubmit = async () => {
  if (!url.value.startsWith('http')) {
    message.value = { text: 'Molimo unesite ispravan URL (sa http/https)', type: 'error' };
    return;
  }

  isSubmitting.value = true;
  message.value = { text: '', type: '' };

  const result = await submitGiveaway(url.value);
  
  if (result.success) {
    message.value = { text: 'Hvala! Nagradna igra je poslata na verifikaciju.', type: 'success' };
    url.value = '';
  } else {
    message.value = { text: result.error || 'Greška pri slanju', type: 'error' };
  }
  
  isSubmitting.value = false;
};
</script>

<template>
  <div class="submit-page">
    <div class="container container-small">
      <div class="submit-card glass">
        <h1 class="page-title">Predloži nagradnu igru</h1>
        <p class="page-subtitle">Pronašli ste nagradnu igru koju mi nemamo? Nalepite link ispod i mi ćemo je proveriti!</p>
        
        <form @submit.prevent="handleSubmit" class="submit-form">
          <div class="input-group">
            <label for="url">URL nagradne igre</label>
            <input 
              id="url"
              v-model="url" 
              type="url" 
              placeholder="https://www.instagram.com/p/..." 
              required
              class="form-input"
            />
          </div>
          
          <div v-if="message.text" :class="['message', message.type]">
            {{ message.text }}
          </div>
          
          <button type="submit" class="btn btn-primary full-width" :disabled="isSubmitting">
            {{ isSubmitting ? 'Slanje...' : 'POŠALJI NA PROVERU' }}
          </button>
        </form>
        
        <div class="form-note">
          Napomena: Objavljujemo samo proverene nagradne igre koje su u skladu sa našim pravilima.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.submit-page {
  padding: 60px 0 100px;
}

.container-small {
  max-width: 600px;
}

.submit-card {
  padding: 40px;
  border-radius: var(--radius-md);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 15px;
  text-align: center;
}

.page-subtitle {
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 40px;
  font-size: 15px;
}

.submit-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
}

.form-input {
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 15px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-pink);
}

.message {
  padding: 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
}

.full-width {
  width: 100%;
}

.form-note {
  margin-top: 30px;
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  opacity: 0.8;
}
</style>
