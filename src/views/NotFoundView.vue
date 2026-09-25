<script setup>
import { useRoute } from 'vue-router'
import EmptyState from '../components/common/EmptyState.vue'

const route = useRoute()
</script>

<template>
  <div class="view-stack">
    <EmptyState
      tone="not-found"
      title="没有找到这个地址"
      :description="`「${route.fullPath}」不对应任何工作台页面，可能是链接已失效或地址输入有误。三个正式入口仍然可以正常使用。`"
      retry-text="回到修复总览"
      @retry="$router.replace('/')"
    >
      <RouterLink class="alt-link" to="/batches">批次档案</RouterLink>
      <RouterLink class="alt-link" to="/tasks">任务清单</RouterLink>
    </EmptyState>
  </div>
</template>

<style scoped>
.alt-link {
  display: inline-flex;
  align-items: center;
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid rgba(93, 67, 34, 0.45);
  color: #5d4322;
  text-decoration: none;
  font-size: 0.88rem;
  background: rgba(255, 255, 255, 0.6);
}

.alt-link:hover {
  background: rgba(255, 255, 255, 0.95);
}
</style>
