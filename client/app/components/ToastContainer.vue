<script setup lang="ts">
import { useToast } from '~/composables/useToast';
const { toasts, removeToast } = useToast();
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="toast-item glass" 
        :class="toast.type"
        @click="removeToast(toast.id)"
      >
        <span class="toast-icon">
          {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}
        </span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  min-width: 280px;
  padding: 15px 20px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.toast-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: white;
}

.success .toast-icon { background: #10b981; }
.error .toast-icon { background: #ef4444; }
.info .toast-icon { background: #3b82f6; }

.toast-message {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

/* Transitions */
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
</style>
