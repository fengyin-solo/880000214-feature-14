<script setup>
import { computed } from 'vue'

const props = defineProps({
  // empty：没有数据；error：加载失败；not-found：地址不存在；offline：入口失效
  tone: {
    type: String,
    default: 'empty',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  retryText: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md', // 'md' | 'sm'
  },
})

const emit = defineEmits(['retry'])

const presets = {
  empty: { glyph: '∅', label: '暂无内容' },
  error: { glyph: '!', label: '加载失败' },
  'not-found': { glyph: '?', label: '页面不存在' },
  offline: { glyph: '×', label: '入口暂不可用' },
}

const preset = computed(() => presets[props.tone] ?? presets.empty)
</script>

<template>
  <div :class="['empty-state', `empty-state--${tone}`, `empty-state--${size}`]" role="status">
    <span class="empty-glyph" aria-hidden="true">{{ preset.glyph }}</span>
    <p class="empty-kicker">{{ preset.label }}</p>
    <h4>{{ title }}</h4>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <div v-if="retryText || $slots.default" class="empty-actions">
      <button
        v-if="retryText"
        type="button"
        class="empty-retry"
        @click="emit('retry')"
      >
        ↻ {{ retryText }}
      </button>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 10px;
  padding: 40px 24px;
  border: 1px dashed rgba(109, 80, 40, 0.28);
  border-radius: 20px;
  background: rgba(255, 251, 245, 0.72);
  color: #6a5439;
}

.empty-state--sm {
  padding: 24px 14px;
  gap: 8px;
  border-radius: 16px;
}

.empty-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #efe2ca;
  color: #7e6038;
  font-size: 1.3rem;
  font-weight: 700;
}

.empty-state--error .empty-glyph {
  background: #f3d7d1;
  color: #913d2f;
}

.empty-state--not-found .empty-glyph {
  background: #e6dcc8;
  color: #5d4322;
}

.empty-state--offline .empty-glyph {
  background: #f3d7d1;
  color: #913d2f;
}

.empty-state--sm .empty-glyph {
  width: 32px;
  height: 32px;
  font-size: 1rem;
}

.empty-kicker {
  margin: 0;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #82684b;
}

h4 {
  margin: 0;
  font-size: 1.05rem;
  color: #3d2f1d;
}

.empty-state--sm h4 {
  font-size: 0.92rem;
}

.empty-description {
  margin: 0;
  max-width: 30rem;
  font-size: 0.9rem;
}

.empty-state--sm .empty-description {
  font-size: 0.8rem;
}

.empty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 6px;
}

.empty-retry {
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid #5d4322;
  background: #5d4322;
  color: #fff8eb;
  font: inherit;
  font-size: 0.88rem;
  cursor: pointer;
}

.empty-retry:hover {
  background: #6f5128;
}
</style>
