import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { fetchNavigation } from '../services/restorationService'
import { useAsyncResource } from './useAsyncResource'

/**
 * 工作台侧边导航：
 * - 加载 / 失败 / 成功 三态，失败时侧边栏展示错误态与“重新加载”；
 * - 每个入口与路由表逐一校验，指向不存在地址的入口被标记为 missing，
 *   点击不跳转，直接给出空态说明，不会产生错误的高亮。
 */
export function useWorkbenchNavigation() {
  const router = useRouter()
  const {
    data: entries,
    loading,
    error,
    load,
    retry,
  } = useAsyncResource(fetchNavigation, { immediate: true })

  function resolveTarget(entry) {
    try {
      const resolved = entry.name
        ? router.resolve({ name: entry.name })
        : router.resolve(entry.to)
      if (!resolved.name || resolved.name === 'not-found') return null
      return resolved
    } catch {
      // 名称/路径无法匹配任何已注册路由（router.resolve 对未知名会抛错）。
      return null
    }
  }

  const items = computed(() =>
    (entries.value ?? []).map((entry) => {
      const resolved = resolveTarget(entry)
      return {
        ...entry,
        missing: !resolved,
        resolvedTo: resolved
          ? { path: resolved.path, query: resolved.query, hash: resolved.hash }
          : null,
      }
    }),
  )

  return { items, loading, error, reload: load, retry }
}
