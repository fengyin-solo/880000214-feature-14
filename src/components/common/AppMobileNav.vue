<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const validItems = computed(() =>
  props.items.filter((item) => item && item.to && item.label),
)
</script>

<template>
  <nav class="mobile-nav" aria-label="主导航">
    <template v-if="validItems.length">
      <RouterLink
        v-for="item in validItems"
        :key="item.to"
        :to="item.to"
        class="mobile-link"
      >
        <span v-if="item.icon" class="mobile-icon" aria-hidden="true">
          {{ item.icon }}
        </span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </template>
    <p v-else class="mobile-empty">暂无可用入口</p>
  </nav>
</template>

<style scoped>
.mobile-nav {
  display: none;
}

@media (max-width: 980px) {
  .mobile-nav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 4px;
    padding: 8px 10px calc(8px + env(safe-area-inset-bottom, 0px));
    background: rgba(249, 243, 231, 0.96);
    border-top: 1px solid rgba(79, 57, 32, 0.14);
    backdrop-filter: blur(6px);
  }

  .mobile-link {
    display: grid;
    justify-items: center;
    gap: 3px;
    padding: 8px 4px;
    border-radius: 12px;
    color: #6a5439;
    text-decoration: none;
    font-size: 0.78rem;
  }

  .mobile-icon {
    font-size: 1.05rem;
    line-height: 1;
  }

  .mobile-link.router-link-active {
    background: #5d4322;
    color: #fff8eb;
  }

  .mobile-empty {
    margin: 0;
    padding: 10px;
    text-align: center;
    color: #82684b;
    font-size: 0.84rem;
  }
}
</style>
