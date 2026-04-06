<template>
  <div class="admin-container container">
    <div class="admin-header">
      <h1 class="page-title">Admin Dashboard</h1>
      <p class="subtitle">Review and manage pending giveaway submissions.</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading pending submissions...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchSubmissions" class="btn primary-btn">Retry</button>
    </div>

    <div v-else-if="submissions.length === 0" class="empty-state">
      <p>No pending submissions to review. 🎉</p>
    </div>

    <div v-else class="submissions-list">
      <div v-for="sub in submissions" :key="sub.id" class="submission-card">
        <div class="submission-info">
          <span class="url-label">Submitted URL:</span>
          <a :href="sub.url" target="_blank" rel="noopener noreferrer" class="url-link">{{ sub.url }}</a>
          <span class="date">{{ new Date(sub.createdAt).toLocaleString() }}</span>
        </div>
        
        <div class="submission-actions">
          <button @click="approveSubmission(sub.id)" class="btn approve-btn" :disabled="sub.processing">
            {{ sub.processing ? '...' : 'Approve' }}
          </button>
          <button @click="rejectSubmission(sub.id)" class="btn reject-btn" :disabled="sub.processing">
            {{ sub.processing ? '...' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useRuntimeConfig } from '#app';

interface Submission {
  id: string;
  url: string;
  status: string;
  createdAt: string;
  processing?: boolean;
}

const submissions = ref<Submission[]>([]);
const loading = ref(true);
const error = ref('');

const auth = useAuth();
const router = useRouter();
const config = useRuntimeConfig();

onMounted(async () => {
  // Client side guard
  if (!auth.isAdmin.value) {
    router.replace('/');
    return;
  }
  await fetchSubmissions();
});

const fetchSubmissions = async () => {
  loading.value = true;
  error.value = '';
  try {
    const data = await $fetch<Submission[]>('/api/admin/submissions', {
      baseURL: config.public.apiBase,
      headers: {
        Authorization: `Bearer ${auth.token.value}`
      }
    });
    submissions.value = data || [];
  } catch (err: any) {
    if (err.response?.status === 403 || err.response?.status === 401) {
      router.replace('/');
    }
    error.value = 'Failed to load submissions. Ensure you have admin privileges.';
  } finally {
    loading.value = false;
  }
};

const handleAction = async (id: string, action: 'approve' | 'reject') => {
  const subIndex = submissions.value.findIndex(s => s.id === id);
  if (subIndex === -1) return;
  
  submissions.value[subIndex].processing = true;
  
  try {
    await $fetch(`/api/admin/submissions/${id}/${action}`, {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token.value}`
      }
    });
    
    // Remove from list
    submissions.value.splice(subIndex, 1);
  } catch (err) {
    alert(`Failed to ${action} submission.`);
    submissions.value[subIndex].processing = false;
  }
};

const approveSubmission = (id: string) => handleAction(id, 'approve');
const rejectSubmission = (id: string) => handleAction(id, 'reject');

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
}

.page-title {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-muted);
}

.loading-state, .error-state, .empty-state {
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

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.submission-card {
  background: var(--surface-color, #fff);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.submission-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
}

.url-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.url-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.url-link:hover {
  text-decoration: underline;
}

.date {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.submission-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.approve-btn {
  background-color: #10b981;
  color: #fff;
}

.approve-btn:hover:not(:disabled) {
  background-color: #059669;
}

.reject-btn {
  background-color: #ef4444;
  color: #fff;
}

.reject-btn:hover:not(:disabled) {
  background-color: #dc2626;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .submission-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .submission-actions {
    width: 100%;
  }
  
  .submission-actions .btn {
    flex: 1;
  }
}
</style>
