<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="filter-chips" role="group" :aria-label="label">
    <span class="filter-label">{{ label }}</span>
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="['filter-chip', { 'filter-chip--active': option.value === modelValue }]"
      :aria-pressed="option.value === modelValue"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.filter-label {
  font-size: 0.82rem;
  color: #82684b;
  letter-spacing: 0.06em;
}

.filter-chip {
  padding: 7px 14px;
  border: 1px solid rgba(109, 80, 40, 0.25);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #6a5439;
  font: inherit;
  font-size: 0.86rem;
  cursor: pointer;
}

.filter-chip:hover {
  border-color: rgba(109, 80, 40, 0.5);
}

.filter-chip--active {
  background: #5d4322;
  border-color: #5d4322;
  color: #fff8eb;
}

.filter-chip:focus-visible {
  outline: 2px solid #2d2418;
  outline-offset: 2px;
}
</style>
