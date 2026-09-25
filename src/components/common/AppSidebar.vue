<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import EmptyState from './EmptyState.vue'
import { vClickOutside } from '../../directives/clickOutside'
import { useWorkbenchNavigation } from '../../composables/useWorkbenchNavigation'

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})

const route = useRoute()
const { items, loading, error, retry } = useWorkbenchNavigation()

const menuOpen = ref(false)
const missingSelected = ref('')

function closeMenu() {
  menuOpen.value = false
}

function showMissing(item) {
  // 入口指向不存在的地址：不跳转、不产生错误高亮，就地给出说明并可重新校验。
  missingSelected.value = item.name || item.to
}

function revalidate() {
  missingSelected.value = ''
  retry()
}

const missingItem = computed(() =>
  items.value.find((item) => (item.name || item.to) === missingSelected.value),
)

// 成功导航后收起窄屏菜单，并清掉失效入口的残留提示。
watch(
  () => route.fullPath,
  () => {
    closeMenu()
    missingSelected.value = ''
  },
)
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <p class="brand-kicker">{{ title }}</p>
      <h1>{{ subtitle }}</h1>
    </div>

    <button
      type="button"
      class="nav-toggle"
      :aria-expanded="menuOpen"
      aria-controls="workbench-nav-panel"
      :aria-label="menuOpen ? '收起工作台入口菜单' : '展开工作台入口菜单'"
      @click="menuOpen = !menuOpen"
    >
      <span class="nav-toggle-icon" aria-hidden="true">
        <span class="nav-toggle-bar" />
        <span class="nav-toggle-bar" />
        <span class="nav-toggle-bar" />
      </span>
    </button>

    <div
      v-click-outside="closeMenu"
      id="workbench-nav-panel"
      class="nav-panel"
      :class="{ 'nav-panel--open': menuOpen }"
    >
      <div v-if="loading" class="nav-status" role="status" aria-live="polite">
        <span class="nav-status-text">
          <span class="nav-spinner" aria-hidden="true" />
          正在载入工作台入口…
        </span>
        <span
          v-for="n in 3"
          :key="n"
          class="nav-skeleton"
        />
      </div>

      <EmptyState
        v-else-if="error"
        tone="error"
        size="sm"
        title="导航入口加载失败"
        :description="error"
        retry-text="重新加载入口"
        @retry="retry"
      />

      <EmptyState
        v-else-if="items.length === 0"
        tone="empty"
        size="sm"
        title="没有可用的导航入口"
        description="服务暂未返回任何工作台入口，页面已保留在此处，不会产生错误高亮。"
        retry-text="重新加载入口"
        @retry="retry"
      />

      <template v-else>
        <nav class="nav" aria-label="工作台导航">
          <template v-for="item in items" :key="item.name || item.to">
            <RouterLink
              v-if="!item.missing"
              v-slot="{ isExactActive, navigate, href }"
              custom
              :to="item.to"
            >
              <a
                :href="href"
                :class="['nav-link', { 'nav-link--active': isExactActive }]"
                :aria-current="isExactActive ? 'page' : undefined"
                @click="(event) => { navigate(event); closeMenu() }"
              >
                {{ item.label }}
              </a>
            </RouterLink>
            <button
              v-else
              type="button"
              class="nav-link nav-link--missing"
              :title="`「${item.label}」暂无对应页面`"
              @click="showMissing(item)"
            >
              <span>{{ item.label }}</span>
              <span class="missing-tag">未开通</span>
            </button>
          </template>
        </nav>

        <EmptyState
          v-if="missingItem"
          tone="offline"
          size="sm"
          :title="`「${missingItem.label}」暂无对应页面`"
          :description="`入口 ${missingItem.to} 没有匹配的工作台页面，请稍后重试或联系管理员补建页面。`"
          retry-text="重新校验入口"
          @retry="revalidate"
        />
      </template>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  padding: 28px 20px;
  border-right: 1px solid rgba(79, 57, 32, 0.12);
  background: rgba(249, 243, 231, 0.95);
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

.nav-status {
  display: grid;
  gap: 10px;
  margin-top: 28px;
}

.nav-status-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #82684b;
}

.nav-spinner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(93, 67, 34, 0.25);
  border-top-color: #5d4322;
  animation: nav-spin 0.8s linear infinite;
}

.nav-skeleton {
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(
    100deg,
    rgba(223, 210, 188, 0.45) 30%,
    rgba(243, 235, 219, 0.9) 50%,
    rgba(223, 210, 188, 0.45) 70%
  );
  background-size: 200% 100%;
  animation: nav-shimmer 1.4s ease-in-out infinite;
}

@keyframes nav-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes nav-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-spinner {
    animation-duration: 1.6s;
  }

  .nav-skeleton {
    animation: none;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 14px;
  color: #6a5439;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid transparent;
  font: inherit;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
}

.nav-link--active {
  background: #5d4322;
  color: #fff8eb;
  border-color: #5d4322;
}

.nav-link--missing {
  border-style: dashed;
  border-color: rgba(145, 61, 47, 0.45);
  color: #913d2f;
  background: rgba(243, 215, 209, 0.35);
}

.nav-link--missing:hover {
  background: rgba(243, 215, 209, 0.6);
}

.missing-tag {
  font-size: 0.68rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f3d7d1;
  color: #913d2f;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.nav-panel :deep(.empty-state) {
  margin-top: 16px;
}

.nav-toggle {
  display: none;
}

@media (max-width: 980px) {
  .sidebar {
    width: auto;
    min-height: 0;
    height: auto;
    position: sticky;
    top: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px 16px;
    border-right: none;
    border-bottom: 1px solid rgba(79, 57, 32, 0.12);
    box-shadow: 0 4px 18px rgba(100, 73, 34, 0.08);
  }

  .brand h1 {
    font-size: 1.1rem;
  }

  .brand-kicker {
    margin-bottom: 2px;
    font-size: 0.66rem;
  }

  .nav-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 12px;
    border: 1px solid rgba(93, 67, 34, 0.35);
    background: rgba(255, 255, 255, 0.8);
    cursor: pointer;
  }

  .nav-toggle-icon {
    display: grid;
    gap: 4px;
  }

  .nav-toggle-bar {
    display: block;
    width: 18px;
    height: 2px;
    border-radius: 2px;
    background: #5d4322;
  }

  .nav-panel {
    display: none;
    flex-basis: 100%;
    order: 3;
    padding: 4px 2px 10px;
  }

  .nav-panel--open {
    display: block;
  }

  .nav {
    grid-template-columns: 1fr;
    margin-top: 0;
  }
}
</style>
