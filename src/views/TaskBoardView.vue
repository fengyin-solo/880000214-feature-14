<script setup>
import { computed, ref } from 'vue'

import PanelSection from '../components/common/PanelSection.vue'
import TaskTable from '../components/restoration/TaskTable.vue'
import EmptyState from '../components/common/EmptyState.vue'
import LoadingState from '../components/common/LoadingState.vue'
import { useAsyncResource } from '../composables/useAsyncResource'
import { fetchTasks } from '../services/restorationService'
import { riskMeta } from '../utils/restorationFormatters'

defineOptions({ name: 'TaskBoardView' })

const {
  data: tasks,
  loading,
  error,
  retry,
} = useAsyncResource(fetchTasks, { immediate: true })

// 筛选状态随 KeepAlive 保留：快速切换入口再回来仍是该筛选。
const activeRisk = ref('all')

const riskOptions = computed(() => [
  { value: 'all', label: '全部' },
  ...['high', 'medium', 'low'].map((value) => ({
    value,
    label: riskMeta(value).label,
  })),
])

const filteredTasks = computed(() => {
  const list = tasks.value ?? []
  return activeRisk.value === 'all'
    ? list
    : list.filter((item) => item.risk === activeRisk.value)
})
</script>

<template>
  <div class="view-stack">
    <PanelSection title="任务清单" badge="按风险排序">
      <template v-if="loading && !tasks">
        <LoadingState text="正在加载任务清单…" :blocks="5" />
      </template>

      <EmptyState
        v-else-if="error"
        tone="error"
        title="任务清单加载失败"
        :description="error"
        retry-text="重新加载任务"
        @retry="retry()"
      />

      <EmptyState
        v-else-if="!tasks.length"
        tone="empty"
        title="暂无修复任务"
        description="目前没有排入清单的修复任务。可以稍后重试，或先去批次档案查看待建档对象。"
        retry-text="重新加载"
        @retry="retry()"
      >
        <RouterLink class="goto-link" to="/batches">查看批次档案</RouterLink>
      </EmptyState>

      <template v-else>
        <div class="filter-bar" role="group" aria-label="按风险筛选任务">
          <button
            v-for="option in riskOptions"
            :key="option.value"
            type="button"
            class="filter-chip"
            :class="{ 'filter-chip--active': activeRisk === option.value }"
            :aria-pressed="activeRisk === option.value"
            @click="activeRisk = option.value"
          >
            {{ option.label }}
          </button>
        </div>

        <EmptyState
          v-if="!filteredTasks.length"
          tone="empty"
          size="sm"
          :title="`没有${riskMeta(activeRisk).label}风险任务`"
          description="当前筛选条件下没有任务。清除筛选可查看完整清单。"
          retry-text="清除筛选"
          @retry="activeRisk = 'all'"
        />
        <TaskTable v-else :rows="filteredTasks" />
      </template>
    </PanelSection>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.filter-chip {
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid rgba(93, 67, 34, 0.3);
  background: rgba(255, 255, 255, 0.7);
  color: #6a5439;
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

.filter-chip--active {
  background: #5d4322;
  border-color: #5d4322;
  color: #fff8eb;
}

.goto-link {
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

.goto-link:hover {
  background: rgba(255, 255, 255, 0.95);
}
</style>
