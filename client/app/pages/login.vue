<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="page-title">Welcome Back</h1>
      <p class="subtitle">Log in to your account.</p>

      <form @submit.prevent="submitForm" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required placeholder="you@example.com" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required placeholder="••••••••" />
        </div>
        
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <button type="submit" class="btn primary-btn" :disabled="loading">
          {{ loading ? 'Processing...' : 'Log In' }}
        </button>
        
        <div class="forgot-password-link">
          <NuxtLink to="/forgot-password" class="text-link">Zaboravili ste lozinku?</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useRuntimeConfig } from '#app';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const router = useRouter();
const auth = useAuth();
const config = useRuntimeConfig();

const submitForm = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await $fetch<any>('/api/auth/login', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { email: email.value, password: password.value }
    });

    if (response && response.token) {
      auth.setSession(response.token, response.user);
      router.push('/');
    }
  } catch (error: any) {
    errorMessage.value = error.data?.error || 'Authentication failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem;
}

.login-card {
  background: var(--surface-color, #fff);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.page-title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.subtitle {
  color: var(--text-muted);
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.auth-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color, #eaeaea);
  border-radius: 8px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(111, 66, 193, 0.1);
}

.primary-btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  justify-content: center;
}

.error-msg {
  color: #dc3545;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
}

.forgot-password-link {
  text-align: center;
  margin-top: 1rem;
}

.text-link {
  color: var(--primary-color);
  font-size: 0.9rem;
  text-decoration: none;
}

.text-link:hover {
  text-decoration: underline;
}

.divider {
  margin: 1.5rem 0;
  position: relative;
  text-align: center;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color, #eaeaea);
  z-index: 1;
}

.divider span {
  background: var(--surface-color, #fff);
  padding: 0 1rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  position: relative;
  z-index: 2;
}

.google-auth {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.text-btn {
  background: none;
  color: var(--primary-color);
  font-size: 0.9rem;
  padding: 0;
  text-decoration: underline;
}

.text-btn:hover {
  background: none;
  color: var(--primary-hover);
}
</style>
