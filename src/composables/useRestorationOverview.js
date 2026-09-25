import { computed, toValue } from 'vue'

/**
 * 总览页统计口径。source 可以是数组、ref 或 getter；
 * 数据未加载完成时按 0 计，避免显示陈旧数字。
 */
export function useRestorationOverview(source) {
  const batches = computed(() => toValue(source.batches) ?? [])
  const tasks = computed(() => toValue(source.tasks) ?? [])
  const environment = computed(() => toValue(source.environment) ?? [])

  const batchCount = computed(() => batches.value.length)
  const highRiskCount = computed(
    () => tasks.value.filter((item) => item.risk === 'high').length,
  )
  const environmentCount = computed(() => environment.value.length)
  const ownerCount = computed(
    () => new Set(tasks.value.map((item) => item.owner)).size,
  )

  return {
    batchCount,
    highRiskCount,
    environmentCount,
    ownerCount,
  }
}
