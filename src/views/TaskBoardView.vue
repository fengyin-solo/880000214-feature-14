<script setup>
import { computed, ref } from 'vue'

import PanelSection from '../components/common/PanelSection.vue'
import EmptyState from '../components/common/EmptyState.vue'
import FilterChips from '../components/common/FilterChips.vue'
import TaskTable from '../components/restoration/TaskTable.vue'
import { fetchRestorationTasks } from '../data/restorationRepository'
import { useAsyncData } from '../composables/useAsyncData'
import { riskFilterOptions } from '../utils/restorationFormatters'

defineOptions({ name: 'TaskBoardView' })

const { data: tasks, pending, error, retry } = useAsyncData(
  fetchRestorationTasks,
)

const riskFilter = ref('all')

const filteredTasks = computed(() => {
  const list = tasks.value ?? []
  if (riskFilter.value === 'all') {
    return list
  }
  return list.filter((item) => item.risk === riskFilter.value)
})

const hasAnyTask = computed(() => (tasks.value ?? []).length > 0)

function clearFilter() {
  riskFilter.value = 'all'
}
</script>

<template>
  <div class="view-stack">
    <PanelSection title="任务清单" badge="按风险排序">
      <FilterChips
        v-model="riskFilter"
        label="风险筛选"
        :options="riskFilterOptions"
      />

      <p v-if="pending" class="view-hint" role="status">任务清单加载中…</p>

      <EmptyState
        v-else-if="error"
        title="任务清单加载失败"
        :description="`${error.message} 你可以重试加载，或稍后再回来查看。`"
        action-label="重试"
        @action="retry"
      />

      <EmptyState
        v-else-if="!hasAnyTask"
        title="暂无修复任务"
        description="当前没有待处理的修复任务，可重新加载确认最新数据。"
        action-label="重新加载"
        @action="retry"
      />

      <EmptyState
        v-else-if="!filteredTasks.length"
        title="没有符合条件的任务"
        description="当前风险筛选下暂无修复任务，可调整筛选条件后查看。"
        action-label="清除筛选"
        @action="clearFilter"
      />

      <TaskTable v-else :rows="filteredTasks" />
    </PanelSection>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
}

.view-hint {
  margin: 0;
  padding: 28px;
  text-align: center;
  color: #82684b;
  border: 1px dashed rgba(121, 88, 47, 0.3);
  border-radius: 20px;
}
</style>
