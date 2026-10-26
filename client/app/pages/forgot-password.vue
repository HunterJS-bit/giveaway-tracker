<script setup lang="ts">
const config = useRuntimeConfig();
const email = ref('');
const isLoading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

useSeoMeta({
  title: 'Zaboravljena lozinka - Sve Nagradne Igre',
});

const submitForgot = async () => {
  if (!email.value) {
    errorMsg.value = 'Molimo unesite email adresu.';
    return;
  }
  
  isLoading.value = true;
  errorMsg.value = '';
  successMsg.value = '';

  try {
    const res = await $fetch('/api/auth/forgot-password', {
      baseURL: config.public.apiBase as string,
      method: 'POST',
      body: { email: email.value }
    });
    
    successMsg.value = (res as any).message || 'Link za resetovanje je poslat na vaš email.';
    email.value = '';
  } catch (err: any) {
    errorMsg.value = err.data?.error || 'Došlo je do greške. Pokušajte ponovo.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-card glass">
        <div class="auth-header">
          <h2>Zaboravili ste lozinku?</h2>
          <p>Unesite vaš email i poslaćemo vam link za resetovanje lozinke.</p>
        </div>

        <div v-if="errorMsg" class="alert error-alert">
          {{ errorMsg }}
        </div>

        <div v-if="successMsg" class="alert success-alert">
          {{ successMsg }}
        </div>

        <form @submit.prevent="submitForgot" class="auth-form">
          <div class="form-group">
            <label for="email">Email adresa</label>
            <input 
              type="email" 
              id="email" 
              v-model="email"
              placeholder="unesite vaš email"
            />
          </div>

          <button type="submit" class="btn btn-primary full-width" :disabled="isLoading">
            <span v-if="isLoading">Slanje...</span>
            <span v-else>Pošalji link</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Setaš se lozinke? <NuxtLink to="/login" class="text-link">Prijavi se</NuxtLink></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  padding: 60px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 300px);
}

.auth-card {
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
  padding: 40px;
  border-radius: var(--radius-md);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h2 {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 10px;
}

.auth-header p {
  color: var(--text-muted);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-main);
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-sm);
  font-size: 16px;
  transition: all 0.2s;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-pink);
  box-shadow: 0 0 0 3px rgba(255, 75, 125, 0.1);
}

.full-width {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  margin-top: 10px;
}

.alert {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  margin-bottom: 20px;
  font-weight: 500;
}

.error-alert {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
}

.success-alert {
  background: #f0fdf4;
  color: #22c55e;
  border: 1px solid #dcfce7;
}

.auth-footer {
  margin-top: 25px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.auth-footer p {
  color: var(--text-muted);
}

.text-link {
  color: var(--accent-pink);
  font-weight: 700;
  text-decoration: none;
}

.text-link:hover {
  text-decoration: underline;
}
</style>
