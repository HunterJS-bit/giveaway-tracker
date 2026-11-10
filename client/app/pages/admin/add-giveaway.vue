<template>
  <div class="admin-container container">
    <div class="admin-header">
      <div class="header-left">
        <h1 class="page-title">Dodaj Nagradnu Igru</h1>
        <p class="subtitle">Kreiraj novu nagradnu igru za bazu.</p>
      </div>
      <div class="header-actions">
        <button @click="$router.push('/admin')" class="btn secondary-btn back-btn">Nazad</button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Čuvanje...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="giveaway-form">
      <div class="form-section">
        <h3>Osnovne Informacije</h3>
        
        <div class="form-group">
          <label for="title">Naslov *</label>
          <input type="text" id="title" v-model="form.title" required placeholder="Npr: Osvoji iPhone 15 Pro" />
        </div>

        <div class="form-group">
          <label for="brand">Brend *</label>
          <input type="text" id="brand" v-model="form.brand" required placeholder="Npr: Apple" />
        </div>

        <div class="form-group">
          <label for="brandLogoUrl">URL Logotipa Brend *</label>
          <input type="url" id="brandLogoUrl" v-model="form.brandLogoUrl" required placeholder="https://..." />
        </div>

        <div class="form-group">
          <label for="category">Kategorija *</label>
          <select id="category" v-model="form.category" required>
            <option value="">Izaberi kategoriju</option>
            <option v-for="cat in categories" :key="cat.slug" :value="cat.name">{{ cat.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="country">Zemlja *</label>
          <select id="country" v-model="form.country" required>
            <option value="RS">Srbija</option>
            <option value="HR">Hrvatska</option>
            <option value="BA">Bosna i Hercegovina</option>
            <option value="ME">Crna Gora</option>
            <option value="MK">Severna Makedonija</option>
          </select>
        </div>
      </div>

      <div class="form-section">
        <h3>Slika</h3>
        
        <div class="form-group">
          <label for="imageUrl">URL Slike *</label>
          <input type="url" id="imageUrl" v-model="form.imageUrl" required placeholder="https://..." />
          <p class="help-text">Ili uploaduj sliku:</p>
          <input type="file" @change="handleImageUpload" accept="image/*" />
          <p v-if="uploadingImage" class="uploading-text">Upload u toku...</p>
        </div>
      </div>

      <div class="form-section">
        <h3>Nagrada</h3>
        
        <div class="form-group">
          <label for="prize">Naziv Nagrade *</label>
          <input type="text" id="prize" v-model="form.prize" required placeholder="Npr: iPhone 15 Pro" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="prizeValue">Vrednost *</label>
            <input type="number" id="prizeValue" v-model="form.prizeValue" required min="0" step="0.01" />
          </div>
          <div class="form-group">
            <label for="currency">Valuta *</label>
            <select id="currency" v-model="form.currency" required>
              <option value="RSD">RSD</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Detalji</h3>
        
        <div class="form-group">
          <label for="description">Opis *</label>
          <textarea id="description" v-model="form.description" required rows="4" placeholder="Opis nagradne igre..."></textarea>
        </div>

        <div class="form-group">
          <label for="entryUrl">Link za Učešće *</label>
          <input type="url" id="entryUrl" v-model="form.entryUrl" required placeholder="https://..." />
        </div>
      </div>

      <div class="form-section">
        <h3>Datumi</h3>
        
        <div class="form-row">
          <div class="form-group">
            <label for="startDate">Datum Početka *</label>
            <input type="datetime-local" id="startDate" v-model="form.startDate" required />
          </div>
          <div class="form-group">
            <label for="endDate">Datum Završetka *</label>
            <input type="datetime-local" id="endDate" v-model="form.endDate" required />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Opcije</h3>
        
        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" v-model="form.isFeatured" />
            Istaknuto (Featured)
          </label>
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" v-model="form.isVerified" />
            Verifikovano
          </label>
        </div>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <div class="form-actions">
        <button type="button" @click="$router.push('/admin')" class="btn secondary-btn">Otkaži</button>
        <button type="submit" class="btn primary-btn" :disabled="loading">
          {{ loading ? 'Čuvanje...' : 'Sačuvaj' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useRuntimeConfig } from '#app';
import { useCategories } from '~/composables/useCategories';

// Server-side middleware guard
definePageMeta({
  middleware: 'auth'
});

const router = useRouter();
const auth = useAuth();
const config = useRuntimeConfig();
const { categories } = useCategories();

const form = ref({
  title: '',
  brand: '',
  brandLogoUrl: '',
  imageUrl: '',
  description: '',
  prize: '',
  prizeValue: 0,
  currency: 'RSD',
  country: 'RS',
  category: '',
  entryUrl: '',
  startDate: '',
  endDate: '',
  isFeatured: false,
  isVerified: false,
});

const loading = ref(false);
const error = ref('');
const uploadingImage = ref(false);

onMounted(async () => {
  // Ensure auth status is checked
  await auth.checkAuthStatus();
  
  // Fetch categories
  await categories.fetchCategories();
  
  // Verify admin role
  if (!auth.isAdmin.value) {
    router.push('/');
  }
});

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploadingImage.value = true;
  error.value = '';

  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await $fetch<{ url: string }>('/api/upload', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${auth.token.value}`
      }
    });

    form.value.imageUrl = response.url;
  } catch (err: any) {
    error.value = err.data?.error || 'Greška pri uploadu slike';
  } finally {
    uploadingImage.value = false;
  }
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    await $fetch('/api/admin/giveaways', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: form.value,
      headers: {
        Authorization: `Bearer ${auth.token.value}`
      }
    });

    router.push('/admin');
  } catch (err: any) {
    error.value = err.data?.error || 'Greška pri čuvanju';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.admin-container {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.admin-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color, #eaeaea);
  padding-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.page-title {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-muted);
}

.back-btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--surface-color, #fff);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color, #eaeaea);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.giveaway-form {
  background: var(--surface-color, #fff);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color, #eaeaea);
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color, #eaeaea);
  border-radius: 8px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(111, 66, 193, 0.1);
}

.help-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.uploading-text {
  font-size: 0.85rem;
  color: var(--primary-color);
  margin-top: 0.5rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
}

.error-msg {
  color: #dc3545;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #fee;
  border-radius: 8px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn {
  background: var(--primary-color);
  color: white;
}

.primary-btn:hover:not(:disabled) {
  background: var(--primary-hover);
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary-btn {
  background: var(--border-color, #eaeaea);
  color: var(--text-color);
}

.secondary-btn:hover {
  background: #d0d0d0;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
