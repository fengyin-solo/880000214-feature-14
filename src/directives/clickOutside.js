/**
 * v-click-outside：点击绑定元素之外时触发回调。
 * 用于窄屏展开后的导航面板，点击页面其它区域自动收起。
 */
export const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (
        el === event.target ||
        el.contains(event.target) ||
        // 切换按钮在面板之外，由按钮自身控制开合，这里忽略避免立即关回。
        event.target.closest('.nav-toggle')
      ) {
        return
      }
      binding.value?.(event)
    }
    // 延迟一帧注册，避免触发本次开合的同一 click 事件。
    requestAnimationFrame(() => {
      document.addEventListener('click', el._clickOutsideHandler)
    })
  },
  unmounted(el) {
    if (el._clickOutsideHandler) {
      document.removeEventListener('click', el._clickOutsideHandler)
      delete el._clickOutsideHandler
    }
  },
}
