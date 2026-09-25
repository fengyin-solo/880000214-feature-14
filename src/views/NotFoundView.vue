<script setup>
import { useRoute, useRouter } from 'vue-router'

import EmptyState from '../components/common/EmptyState.vue'
import { restorationNavigation } from '../data/restorationData'

defineOptions({ name: 'NotFoundView' })

const route = useRoute()
const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="not-found">
    <EmptyState
      title="页面不存在"
      :description="`没有找到地址 ${route.fullPath} 对应的页面，链接可能已失效或输入有误。`"
      action-label="返回修复总览"
      @action="goHome"
    >
      <nav class="not-found-links" aria-label="可用入口">
        <RouterLink
          v-for="item in restorationNavigation"
          :key="item.to"
          :to="item.to"
          class="not-found-link"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </EmptyState>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 640px;
  margin: 0 auto;
}

.not-found-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 6px;
}

.not-found-link {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(109, 80, 40, 0.25);
  background: rgba(255, 255, 255, 0.72);
  color: #6a5439;
  text-decoration: none;
  font-size: 0.86rem;
}

.not-found-link:hover {
  border-color: rgba(109, 80, 40, 0.5);
}
</style>
