<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/common/AppHeader.vue'
import AppSidebar from './components/common/AppSidebar.vue'
import { useRouteScrollMemory } from './composables/useRouteScrollMemory'

const appMain = ref(null)
useRouteScrollMemory(appMain)
</script>

<template>
  <div class="app-shell">
    <AppSidebar
      title="Conservation Desk"
      subtitle="古籍虫蛀修复"
    />
    <div ref="appMain" class="app-main">
      <AppHeader
        eyebrow="Studio Console"
        title="文献修复流程工作台"
        description="修复总览、批次档案与任务清单各自保留查看位置；地址异常、数据缺失或加载失败时均有明确空态与重试入口。"
      />
      <RouterView v-slot="{ Component }">
        <KeepAlive :include="['DashboardView', 'BatchLibraryView', 'TaskBoardView']">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </div>
  </div>
</template>
