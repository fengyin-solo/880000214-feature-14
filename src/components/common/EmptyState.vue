<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  actionLabel: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="empty-state" role="status">
    <svg
      class="empty-icon"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="10"
        width="32"
        height="28"
        rx="4"
        stroke="currentColor"
        stroke-width="2.5"
      />
      <path
        d="M8 20h32"
        stroke="currentColor"
        stroke-width="2.5"
      />
      <path
        d="M18 6v8M30 6v8"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <path
        d="M18 29h12"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </svg>
    <h3>{{ title }}</h3>
    <p v-if="description">{{ description }}</p>
    <button
      v-if="actionLabel"
      type="button"
      class="empty-action"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 36px 20px;
  text-align: center;
  border: 1px dashed rgba(121, 88, 47, 0.3);
  border-radius: 20px;
  background: rgba(251, 245, 234, 0.6);
}

.empty-icon {
  width: 44px;
  height: 44px;
  color: #a3875e;
}

h3 {
  margin: 0;
  font-size: 1.05rem;
}

p {
  margin: 0;
  max-width: 30rem;
  color: #6a5439;
}

.empty-action {
  margin-top: 6px;
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  background: #5d4322;
  color: #fff8eb;
  font: inherit;
  cursor: pointer;
}

.empty-action:hover {
  background: #4a3319;
}

.empty-action:focus-visible {
  outline: 2px solid #2d2418;
  outline-offset: 2px;
}
</style>
