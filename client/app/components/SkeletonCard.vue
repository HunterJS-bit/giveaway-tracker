<template>
  <div class="skeleton-card">
    <div class="skeleton-image-wrap"></div>
    <div class="skeleton-content">
      <div class="skeleton-meta">
        <div class="skeleton-text small"></div>
        <div class="skeleton-text small"></div>
      </div>
      <div class="skeleton-text title"></div>
      <div class="skeleton-text title short"></div>
      <div class="skeleton-footer">
        <div class="skeleton-text tiny"></div>
        <div class="skeleton-text tiny"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  display: flex;
  flex-direction: column;
  min-height: 390px;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
}

.skeleton-image-wrap {
  width: 100%;
  aspect-ratio: 16 / 10;
  background: linear-gradient(100deg, var(--bg-muted) 20%, var(--surface-2) 40%, var(--bg-muted) 60%);
  background-size: 200% 100%;
  animation: loading 1.4s infinite linear;
}

.skeleton-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.skeleton-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.skeleton-text {
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(100deg, var(--bg-muted) 20%, var(--surface-2) 40%, var(--bg-muted) 60%);
  background-size: 200% 100%;
  animation: loading 1.4s infinite linear;
}

.skeleton-text.small {
  width: 70px;
}

.skeleton-text.title {
  height: 20px;
  margin-bottom: 9px;
}

.skeleton-text.title.short {
  width: 62%;
}

.skeleton-text.tiny {
  width: 84px;
  height: 12px;
}

.skeleton-footer {
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
