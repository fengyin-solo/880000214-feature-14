import { onMounted, ref } from 'vue'

export function useAsyncData(loader) {
  const data = ref(null)
  const pending = ref(false)
  const error = ref(null)
  let attempt = 0

  async function load() {
    const current = ++attempt
    pending.value = true
    error.value = null
    try {
      const result = await loader()
      if (current === attempt) {
        data.value = result
      }
    } catch (err) {
      if (current === attempt) {
        error.value = err instanceof Error ? err : new Error(String(err))
      }
    } finally {
      if (current === attempt) {
        pending.value = false
      }
    }
  }

  onMounted(load)

  return {
    data,
    pending,
    error,
    retry: load,
  }
}
