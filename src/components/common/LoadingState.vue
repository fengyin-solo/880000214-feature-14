<script setup>
defineProps({
  text: {
    type: String,
    default: '正在加载…',
  },
  // skeleton 区块数量
  blocks: {
    type: Number,
    default: 3,
  },
})
</script>

<template>
  <div class="loading-state" role="status" aria-live="polite">
    <span class="loading-text">
      <span class="loading-spinner" aria-hidden="true" />
      {{ text }}
    </span>
    <div
      v-for="n in blocks"
      :key="n"
      class="loading-block"
      :style="{ width: n === blocks ? '72%' : '100%' }"
    />
  </div>
</template>

<style scoped>
.loading-state {
  display: grid;
  gap: 12px;
  padding: 24px;
  border: 1px solid rgba(109, 80, 40, 0.12);
  border-radius: 20px;
  background: rgba(255, 251, 245, 0.72);
}

.loading-text {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.86rem;
  color: #82684b;
}

.loading-spinner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(93, 67, 34, 0.25);
  border-top-color: #5d4322;
  animation: loading-spin 0.8s linear infinite;
}

.loading-block {
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(
    100deg,
    rgba(223, 210, 188, 0.5) 30%,
    rgba(243, 235, 219, 0.9) 50%,
    rgba(223, 210, 188, 0.5) 70%
  );
  background-size: 200% 100%;
  animation: loading-shimmer 1.4s ease-in-out infinite;
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes loading-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation-duration: 1.6s;
  }

  .loading-block {
    animation: none;
  }
}
</style>
