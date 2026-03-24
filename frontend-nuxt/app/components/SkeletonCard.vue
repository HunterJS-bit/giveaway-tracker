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
        <div class="skeleton-text small"></div>
        <div class="skeleton-text small"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  min-height: 380px;
}

.skeleton-image-wrap {
  width: 100%;
  aspect-ratio: 16/10;
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
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
  margin-bottom: 12px;
}

.skeleton-text {
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-text.small {
  width: 60px;
}

.skeleton-text.title {
  height: 20px;
  margin-bottom: 8px;
}

.skeleton-text.title.short {
  width: 60%;
}

.skeleton-footer {
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

html.dark .skeleton-text,
html.dark .skeleton-image-wrap {
  background: linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%);
  background-size: 200% 100%;
}
</style>
