<script setup>
import { computed } from 'vue'

import PanelSection from '../components/common/PanelSection.vue'
import StatCard from '../components/common/StatCard.vue'
import EmptyState from '../components/common/EmptyState.vue'
import LoadingState from '../components/common/LoadingState.vue'
import BatchGrid from '../components/restoration/BatchGrid.vue'
import EnvironmentCards from '../components/restoration/EnvironmentCards.vue'
import HeroBanner from '../components/restoration/HeroBanner.vue'
import { useAsyncResource } from '../composables/useAsyncResource'
import { useRestorationOverview } from '../composables/useRestorationOverview'
import {
  fetchBatches,
  fetchEnvironment,
  fetchHero,
  fetchSteps,
  fetchTasks,
} from '../services/restorationService'

defineOptions({ name: 'DashboardView' })

// 各区块独立请求、独立失败，某一块加载失败不拖垮整页，且都可以单独重试。
const heroResource = useAsyncResource(fetchHero, { immediate: true })
const batchesResource = useAsyncResource(fetchBatches, { immediate: true })
const tasksResource = useAsyncResource(fetchTasks, { immediate: true })
const environmentResource = useAsyncResource(fetchEnvironment, { immediate: true })
const stepsResource = useAsyncResource(fetchSteps, { immediate: true })

const resources = [
  heroResource,
  batchesResource,
  tasksResource,
  environmentResource,
  stepsResource,
]
const loading = computed(() => resources.some((r) => r.loading.value))
const anyError = computed(() => resources.some((r) => r.error.value))

function retryAll() {
  resources.forEach((r) => {
    if (r.error.value) r.retry()
  })
}

const { batchCount, environmentCount, highRiskCount, ownerCount } =
  useRestorationOverview({
    batches: batchesResource.data,
    tasks: tasksResource.data,
    environment: environmentResource.data,
  })

const statCards = computed(() => [
  { label: '在册批次', value: batchCount.value },
  { label: '高风险任务', value: highRiskCount.value },
  { label: '环境指标', value: environmentCount.value },
  { label: '参与修复师', value: ownerCount.value },
])
</script>

<template>
  <div class="view-stack">
    <LoadingState
      v-if="heroResource.loading.value && !heroResource.data.value"
      text="正在加载修复总览…"
      :blocks="2"
    />
    <EmptyState
      v-else-if="heroResource.error.value"
      tone="error"
      title="修复总览加载失败"
      :description="heroResource.error.value"
      retry-text="重试加载总览"
      @retry="heroResource.retry()"
    />
    <HeroBanner v-else-if="heroResource.data.value" :hero="heroResource.data.value" />

    <section class="stats-grid">
      <StatCard
        v-for="card in statCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
      />
    </section>

    <EmptyState
      v-if="tasksResource.error.value"
      tone="error"
      size="sm"
      title="任务数据加载失败"
      :description="`${tasksResource.error.value} 上方统计可能未包含最新任务，可前往任务清单重试。`"
      retry-text="重试加载任务"
      @retry="tasksResource.retry()"
    >
      <RouterLink class="goto-link" to="/tasks">前往任务清单</RouterLink>
    </EmptyState>

    <section class="two-column">
      <PanelSection title="重点批次" badge="优先处理">
        <LoadingState v-if="batchesResource.loading.value" text="正在加载批次…" :blocks="2" />
        <EmptyState
          v-else-if="batchesResource.error.value"
          tone="error"
          size="sm"
          title="批次加载失败"
          :description="batchesResource.error.value"
          retry-text="重试"
          @retry="batchesResource.retry()"
        />
        <EmptyState
          v-else-if="!batchesResource.data.value?.length"
          tone="empty"
          size="sm"
          title="暂无重点批次"
          description="当前没有可展示的修复批次，稍后重新加载再看。"
          retry-text="重新加载"
          @retry="batchesResource.retry()"
        />
        <BatchGrid v-else :items="batchesResource.data.value" />
      </PanelSection>

      <PanelSection title="当日工序" badge="修复流程">
        <LoadingState v-if="stepsResource.loading.value" text="正在加载工序…" :blocks="3" />
        <EmptyState
          v-else-if="stepsResource.error.value"
          tone="error"
          size="sm"
          title="工序加载失败"
          :description="stepsResource.error.value"
          retry-text="重试"
          @retry="stepsResource.retry()"
        />
        <EmptyState
          v-else-if="!stepsResource.data.value?.length"
          tone="empty"
          size="sm"
          title="暂无当日工序"
          description="今天还没有排定修复工序。"
        />
        <ol v-else class="step-list">
          <li v-for="step in stepsResource.data.value" :key="step">{{ step }}</li>
        </ol>
      </PanelSection>
    </section>

    <PanelSection title="环境参数" badge="修复室 2">
      <LoadingState v-if="environmentResource.loading.value" text="正在加载环境参数…" :blocks="2" />
      <EmptyState
        v-else-if="environmentResource.error.value"
        tone="error"
        size="sm"
        title="环境参数加载失败"
        :description="environmentResource.error.value"
        retry-text="重试"
        @retry="environmentResource.retry()"
      />
      <EmptyState
        v-else-if="!environmentResource.data.value?.length"
        tone="empty"
        size="sm"
        title="暂无环境参数"
        description="修复室还没有上报温湿度等环境读数。"
      />
      <EnvironmentCards v-else :items="environmentResource.data.value" />
    </PanelSection>

    <EmptyState
      v-if="!loading && anyError"
      tone="error"
      size="sm"
      title="部分区块没有加载成功"
      description="可以在对应区块单独重试，也可以一次性重试所有失败区块。"
      retry-text="全部重试"
      @retry="retryAll"
    />
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.two-column {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
}

.step-list {
  margin: 0;
  padding-left: 20px;
  color: #5c4a33;
}

.step-list li + li {
  margin-top: 12px;
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

@media (max-width: 980px) {
  .stats-grid,
  .two-column {
    grid-template-columns: 1fr;
  }
}
</style>
