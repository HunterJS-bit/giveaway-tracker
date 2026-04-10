<script setup lang="ts">
const props = defineProps<{
  giveawayId: string
}>();

const config = useRuntimeConfig();

interface Comment {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
}

const userName = ref('');
const content = ref('');
const isSubmitting = ref(false);
const submitError = ref<string | null>(null);

const { data: comments, refresh, pending } = await useAsyncData<Comment[]>(
  `comments-${props.giveawayId}`,
  () => $fetch(`${config.public.apiBase}/api/giveaways/${props.giveawayId}/comments`)
);

const submitComment = async () => {
  if (!userName.value || !content.value) return;
  
  isSubmitting.value = true;
  submitError.value = null;
  
  try {
    await $fetch(`${config.public.apiBase}/api/giveaways/${props.giveawayId}/comments`, {
      method: 'POST',
      body: {
        userName: userName.value,
        content: content.value
      }
    });
    
    // Reset form and refresh list
    content.value = '';
    await refresh();
  } catch (err: any) {
    console.error('Error posting comment:', err);
    submitError.value = 'Greška pri slanju komentara.';
  } finally {
    isSubmitting.value = false;
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="comment-section glass">
    <h3>Komentari ({{ comments?.length || 0 }})</h3>
    
    <!-- Comment Form -->
    <form @submit.prevent="submitComment" class="comment-form">
      <div class="form-group">
        <input 
          v-model="userName" 
          type="text" 
          placeholder="Vaše ime" 
          required 
          class="form-input"
        />
      </div>
      <div class="form-group">
        <textarea 
          v-model="content" 
          placeholder="Napišite komentar..." 
          required 
          class="form-textarea"
          rows="3"
        ></textarea>
      </div>
      <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
        {{ isSubmitting ? 'Slanje...' : 'Postavi komentar' }}
      </button>
      <p v-if="submitError" class="error-text">{{ submitError }}</p>
    </form>

    <hr class="divider" />

    <!-- Comments List -->
    <div v-if="pending" class="loading-comments">
      Učitavanje komentara...
    </div>
    <div v-else-if="comments && comments.length > 0" class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="comment-author">{{ comment.userName }}</span>
          <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
        </div>
        <div class="comment-content">
          {{ comment.content }}
        </div>
      </div>
    </div>
    <div v-else class="empty-comments">
      Još uvek nema komentara. Budite prvi koji će prokomentarisati!
    </div>
  </div>
</template>

<style scoped>
.comment-section {
  margin-top: 40px;
  padding: 30px;
  border-radius: var(--radius-md);
}

h3 {
  font-size: 22px;
  margin-bottom: 24px;
  font-weight: 700;
}

.comment-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-sm);
  background: white;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--accent-pink);
}

.divider {
  border: 0;
  border-top: 1px solid #edf2f7;
  margin: 30px 0;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  padding-bottom: 20px;
  border-bottom: 1px solid #f7fafc;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 700;
  color: var(--text-main);
}

.comment-date {
  font-size: 12px;
  color: var(--text-muted);
}

.comment-content {
  line-height: 1.6;
  color: var(--text-main);
}

.empty-comments, .loading-comments {
  text-align: center;
  color: var(--text-muted);
  padding: 20px 0;
}

.error-text {
  color: #e53e3e;
  font-size: 14px;
  margin-top: 10px;
}
</style>
