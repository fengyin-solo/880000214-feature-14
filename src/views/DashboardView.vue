<script setup>
import { computed } from 'vue'

import PanelSection from '../components/common/PanelSection.vue'
import StatCard from '../components/common/StatCard.vue'
import EmptyState from '../components/common/EmptyState.vue'
import BatchGrid from '../components/restoration/BatchGrid.vue'
import EnvironmentCards from '../components/restoration/EnvironmentCards.vue'
import HeroBanner from '../components/restoration/HeroBanner.vue'
import { restorationHero } from '../data/restorationData'
import { fetchRestorationOverview } from '../data/restorationRepository'
import { useAsyncData } from '../composables/useAsyncData'
import { useRestorationOverview } from '../composables/useRestorationOverview'

defineOptions({ name: 'DashboardView' })

const { data: overview, pending, error, retry } = useAsyncData(
  fetchRestorationOverview,
)

const { batchCount, environmentCount, highRiskCount, ownerCount } =
  useRestorationOverview(overview)

const statCards = computed(() => [
  { label: '在册批次', value: batchCount.value },
  { label: '高风险任务', value: highRiskCount.value },
  { label: '环境指标', value: environmentCount.value },
  { label: '参与修复师', value: ownerCount.value },
])

const batches = computed(() => overview.value?.batches ?? [])
const steps = computed(() => overview.value?.steps ?? [])
const environment = computed(() => overview.value?.environment ?? [])
</script>

<template>
  <div class="view-stack">
    <HeroBanner :hero="restorationHero" />

    <p v-if="pending" class="view-hint" role="status">修复总览加载中…</p>

    <EmptyState
      v-else-if="error"
      title="修复总览加载失败"
      :description="`${error.message} 你可以重试加载，或稍后再回来查看。`"
      action-label="重试"
      @action="retry"
    />

    <template v-else>
      <section class="stats-grid">
        <StatCard
          v-for="card in statCards"
          :key="card.label"
          :label="card.label"
          :value="card.value"
        />
      </section>

      <section class="two-column">
        <PanelSection title="重点批次" badge="优先处理">
          <EmptyState
            v-if="!batches.length"
            title="暂无重点批次"
            description="当前没有需要优先处理的修复批次，可重新加载确认最新数据。"
            action-label="重新加载"
            @action="retry"
          />
          <BatchGrid v-else :items="batches" />
        </PanelSection>

        <PanelSection title="当日工序" badge="修复流程">
          <EmptyState
            v-if="!steps.length"
            title="暂无工序安排"
            description="当日工序尚未发布，可重新加载获取最新安排。"
            action-label="重新加载"
            @action="retry"
          />
          <ol v-else class="step-list">
            <li v-for="step in steps" :key="step">{{ step }}</li>
          </ol>
        </PanelSection>
      </section>

      <PanelSection title="环境参数" badge="修复室 2">
        <EmptyState
          v-if="!environment.length"
          title="暂无环境参数"
          description="修复室环境数据暂未上报，可重新加载获取最新读数。"
          action-label="重新加载"
          @action="retry"
        />
        <EnvironmentCards v-else :items="environment" />
      </PanelSection>
    </template>
  </div>
</template>

<style scoped>
.view-stack {
  display: grid;
  gap: 24px;
}

.view-hint {
  margin: 0;
  padding: 28px;
  text-align: center;
  color: #82684b;
  border: 1px dashed rgba(121, 88, 47, 0.3);
  border-radius: 20px;
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

@media (max-width: 980px) {
  .stats-grid,
  .two-column {
    grid-template-columns: 1fr;
  }
}
</style>
