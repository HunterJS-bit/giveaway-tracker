<script setup lang="ts">
useSeoMeta({
  title: 'Kontakt - Fribbo',
  description: 'Imate pitanje, sugestiju ili želite da ostvarimo saradnju? Kontaktirajte Fribbo tim.',
});

const isSubmitting = ref(false);
const message = ref({ text: '', type: '' });
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  message.value = { text: '', type: '' };
  
  // Simulate API call
  setTimeout(() => {
    isSubmitting.value = false;
    message.value = { text: 'Vaša poruka je uspešno poslata! Odgovorićemo vam u najkraćem mogućem roku.', type: 'success' };
    form.value = { name: '', email: '', subject: '', message: '' };
  }, 1000);
};
</script>

<template>
  <div class="static-page">
    <div class="hero-section">
      <div class="container hero-inner">
        <h1 class="hero-title">Kontaktirajte Nas</h1>
        <p class="hero-subtitle">Tu smo da odgovorimo na Vaša pitanja i predloge.</p>
      </div>
    </div>

    <div class="container">
      <div class="contact-grid">
        <div class="contact-info glass">
          <h2>Informacije</h2>
          <p>Imate pitanje o nagradnim igrama, želite da prijavite problem ili ste zainteresovani za poslovnu saradnju?</p>
          
          <div class="info-blocks">
            <div class="info-item">
              <span class="icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>info@fribbo.com</p>
              </div>
            </div>
            
            <div class="info-item">
              <span class="icon">🤝</span>
              <div>
                <strong>Saradnja</strong>
                <p>marketing@fribbo.com</p>
              </div>
            </div>
          </div>
          
          <div class="social-links-contact">
            <h3>Pratite nas</h3>
            <div class="social-icons">
              <a href="#" class="btn btn-dark small">Instagram</a>
              <a href="#" class="btn btn-dark small">Facebook</a>
            </div>
          </div>
        </div>

        <div class="contact-form-wrap glass">
          <h2>Pošaljite poruku</h2>
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-row">
              <div class="input-group">
                <label for="name">Vaše Ime</label>
                <input id="name" v-model="form.name" type="text" required class="form-input" />
              </div>
              <div class="input-group">
                <label for="email">Email Adresa</label>
                <input id="email" v-model="form.email" type="email" required class="form-input" />
              </div>
            </div>
            
            <div class="input-group">
              <label for="subject">Naslov</label>
              <input id="subject" v-model="form.subject" type="text" required class="form-input" />
            </div>
            
            <div class="input-group">
              <label for="message">Vaša Poruka</label>
              <textarea id="message" v-model="form.message" rows="5" required class="form-input"></textarea>
            </div>
            
            <div v-if="message.text" :class="['message', message.type]">
              {{ message.text }}
            </div>
            
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Slanje...' : 'POŠALJI PORUKU' }}
            </button>
          </form>
        </div>
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
  margin-bottom: 20px;
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

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
}

.contact-info, .contact-form-wrap {
  padding: 40px;
  border-radius: var(--radius-md);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

h2 {
  font-size: 24px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--text-main);
}

.contact-info p {
  line-height: 1.6;
  color: var(--text-muted);
  margin-bottom: 30px;
}

.info-blocks {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 40px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.info-item .icon {
  font-size: 24px;
}

.info-item strong {
  display: block;
  font-size: 16px;
  color: var(--text-main);
  margin-bottom: 5px;
}

.info-item p {
  margin: 0;
  font-size: 15px;
}

.social-links-contact h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
}

.social-icons {
  display: flex;
  gap: 10px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 14px;
  font-weight: 600;
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

textarea.form-input {
  resize: vertical;
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

@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 32px;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .contact-info, .contact-form-wrap {
    padding: 30px 20px;
  }
}
</style>
