import { nextTick } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 按入口路径记忆主内容区的页面滚动位置。
 *
 * - 桌面端滚动发生在 .app-main，窄屏（max-width: 980px）退回整页滚动，
 *   保存/恢复时自动识别当前真正在滚动的容器；
 * - 离开当前入口前存下位置，新入口渲染完成后恢复到上次位置，首次访问回到顶部；
 * - 视图内部滚动容器（如窄屏表格横向滚动）随 KeepAlive 缓存的 DOM
 *   一并保留，无需这里处理。
 */
export function useRouteScrollMemory(scrollerRef) {
  const router = useRouter()
  const positions = new Map()

  function scrollHost() {
    const el = scrollerRef?.value
    // 元素本身可滚动时（桌面）使用它，否则使用文档滚动根（窄屏整页滚动）。
    if (el && el.scrollHeight > el.clientHeight) return el
    return document.scrollingElement
  }

  function saveCurrent() {
    positions.set(router.currentRoute.value.path, scrollHost().scrollTop)
  }

  function restore(key) {
    // 等缓存视图挂载/激活并完成布局后再定位，避免高度未定时恢复错位。
    nextTick(() => {
      requestAnimationFrame(() => {
        const host = scrollHost()
        host.scrollTop = positions.has(key) ? positions.get(key) : 0
      })
    })
  }

  router.beforeEach(() => {
    saveCurrent()
  })

  router.afterEach((to) => {
    restore(to.path)
  })

  return { positions }
}
