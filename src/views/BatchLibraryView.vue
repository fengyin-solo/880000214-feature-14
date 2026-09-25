<script setup>
import { computed, ref } from 'vue'

import PanelSection from '../components/common/PanelSection.vue'
import BatchGrid from '../components/restoration/BatchGrid.vue'
import EmptyState from '../components/common/EmptyState.vue'
import LoadingState from '../components/common/LoadingState.vue'
import { useAsyncResource } from '../composables/useAsyncResource'
import { fetchBatches } from '../services/restorationService'
import { riskMeta } from '../utils/restorationFormatters'

defineOptions({ name: 'BatchLibraryView' })

const {
  data: batches,
  loading,
  error,
  retry,
} = useAsyncResource(fetchBatches, { immediate: true })

// 筛选与滚动位置：组件被 KeepAlive 缓存，切走再切回时保持不变。
const activeRisk = ref('all')

const riskOptions = computed(() => [
  { value: 'all', label: '全部' },
  ...['high', 'medium', 'low'].map((value) => ({
    value,
    label: riskMeta(value).label,
  })),
])

const filteredBatches = computed(() => {
  const list = batches.value ?? []
  return activeRisk.value === 'all'
    ? list
    : list.filter((item) => item.risk === activeRisk.value)
})
</script>

<template>
  <div class="view-stack">
    <PanelSection title="批次档案" badge="修复对象">
      <template v-if="loading && !batches">
        <LoadingState text="正在加载批次档案…" :blocks="4" />
      </template>

      <EmptyState
        v-else-if="error"
        tone="error"
        title="批次档案加载失败"
        :description="error"
        retry-text="重新加载批次"
        @retry="retry()"
      />

      <EmptyState
        v-else-if="!batches.length"
        tone="empty"
        title="暂无批次档案"
        description="服务端目前没有任何批次数据。可以稍后重试，或确认档案是否已建档。"
        retry-text="重新加载"
        @retry="retry()"
      />

      <template v-else>
        <div class="filter-bar" role="group" aria-label="按风险筛选批次">
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
          v-if="!filteredBatches.length"
          tone="empty"
          size="sm"
          :title="`没有${activeRisk === 'all' ? '' : riskMeta(activeRisk).label}风险批次`"
          description="当前筛选条件下没有档案。换个风险等级，或清除筛选查看全部批次。"
          retry-text="清除筛选"
          @retry="activeRisk = 'all'"
        />
        <BatchGrid v-else :items="filteredBatches" />
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
</style>
