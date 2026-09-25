<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
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
  <aside class="sidebar">
    <div class="brand">
      <p class="brand-kicker">{{ title }}</p>
      <h1>{{ subtitle }}</h1>
    </div>
    <nav v-if="validItems.length" class="nav" aria-label="主导航">
      <RouterLink
        v-for="item in validItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
      >
        <span v-if="item.icon" class="nav-icon" aria-hidden="true">
          {{ item.icon }}
        </span>
        {{ item.label }}
      </RouterLink>
    </nav>
    <p v-else class="nav-empty">暂无可用入口，请检查导航配置后刷新。</p>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  padding: 28px 20px;
  border-right: 1px solid rgba(79, 57, 32, 0.12);
  background: rgba(249, 243, 231, 0.9);
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand-kicker {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #82684b;
  font-size: 0.76rem;
}

.brand h1 {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.1;
}

.nav {
  display: grid;
  gap: 10px;
  margin-top: 28px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  color: #6a5439;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.72);
}

.nav-icon {
  line-height: 1;
}

.nav-link.router-link-active {
  background: #5d4322;
  color: #fff8eb;
}

.nav-empty {
  margin: 28px 0 0;
  padding: 14px;
  border: 1px dashed rgba(121, 88, 47, 0.3);
  border-radius: 14px;
  color: #82684b;
  font-size: 0.84rem;
}

@media (max-width: 980px) {
  .sidebar {
    display: none;
  }
}
</style>
