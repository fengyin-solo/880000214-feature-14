import { ref, shallowRef } from 'vue'

/**
 * 管理一份异步资源的 加载 / 成功 / 失败 三态。
 *
 * - 每次 load 递增请求序号，快速连续触发时只有最后一次请求能落地，
 *   避免慢请求晚返回后覆盖新数据。
 * - 失败时保留旧数据与否由调用方决定（本项目失败直接展示错误态）。
 */
export function useAsyncResource(loader, options = {}) {
  const { immediate = false } = options

  const data = shallowRef(null)
  const loading = ref(immediate)
  const error = ref('')
  const loaded = ref(false)
  let requestId = 0

  async function load() {
    const currentId = ++requestId
    loading.value = true
    error.value = ''

    try {
      const result = await loader()
      // 已被更新的请求取代，丢弃本次结果。
      if (currentId !== requestId) return result
      data.value = result
      loaded.value = true
      return result
    } catch (err) {
      if (currentId !== requestId) return undefined
      error.value =
        err instanceof Error && err.message
          ? err.message
          : '数据加载失败，请稍后重试。'
    } finally {
      if (currentId === requestId) {
        loading.value = false
      }
    }
    return undefined
  }

  function retry() {
    return load()
  }

  if (immediate) {
    load()
  }

  return { data, loading, error, loaded, load, retry }
}
