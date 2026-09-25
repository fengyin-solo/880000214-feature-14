import { computed } from 'vue'

export function useRestorationOverview(overview) {
  const batches = computed(() => overview.value?.batches ?? [])
  const tasks = computed(() => overview.value?.tasks ?? [])
  const environment = computed(() => overview.value?.environment ?? [])

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
