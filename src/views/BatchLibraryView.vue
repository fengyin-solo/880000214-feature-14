<script setup>
import { computed, ref } from 'vue'

import PanelSection from '../components/common/PanelSection.vue'
import EmptyState from '../components/common/EmptyState.vue'
import FilterChips from '../components/common/FilterChips.vue'
import BatchGrid from '../components/restoration/BatchGrid.vue'
import { fetchRestorationBatches } from '../data/restorationRepository'
import { useAsyncData } from '../composables/useAsyncData'
import { riskFilterOptions } from '../utils/restorationFormatters'

defineOptions({ name: 'BatchLibraryView' })

const { data: batches, pending, error, retry } = useAsyncData(
  fetchRestorationBatches,
)

const riskFilter = ref('all')

const filteredBatches = computed(() => {
  const list = batches.value ?? []
  if (riskFilter.value === 'all') {
    return list
  }
  return list.filter((item) => item.risk === riskFilter.value)
})

const hasAnyBatch = computed(() => (batches.value ?? []).length > 0)

function clearFilter() {
  riskFilter.value = 'all'
}
</script>

<template>
  <div class="view-stack">
    <PanelSection title="批次档案" badge="修复对象">
      <FilterChips
        v-model="riskFilter"
        label="风险筛选"
        :options="riskFilterOptions"
      />

      <p v-if="pending" class="view-hint" role="status">批次档案加载中…</p>

      <EmptyState
        v-else-if="error"
        title="批次档案加载失败"
        :description="`${error.message} 你可以重试加载，或稍后再回来查看。`"
        action-label="重试"
        @action="retry"
      />

      <EmptyState
        v-else-if="!hasAnyBatch"
        title="暂无批次档案"
        description="当前没有登记在册的修复批次，可重新加载确认最新数据。"
        action-label="重新加载"
        @action="retry"
      />

      <EmptyState
        v-else-if="!filteredBatches.length"
        title="没有符合条件的批次"
        description="当前风险筛选下暂无批次档案，可调整筛选条件后查看。"
        action-label="清除筛选"
        @action="clearFilter"
      />

      <BatchGrid v-else :items="filteredBatches" />
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
