import {
  restorationBatches,
  restorationEnvironment,
  restorationHero,
  restorationSteps,
  restorationTasks,
} from './restorationData'

const SIMULATED_LATENCY = 260

// 通过 URL 查询参数 ?mockError=1 可以让每类数据的首次加载失败，
// 用于验证失败空态与重试流程；重试时会正常返回数据。
const mockErrorEnabled =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('mockError')
const failedOnce = new Set()

function shouldFail(key) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return true
  }
  if (!mockErrorEnabled || failedOnce.has(key)) {
    return false
  }
  failedOnce.add(key)
  return true
}

function simulate(key, produce) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail(key)) {
        reject(new Error('数据加载失败，请检查网络连接后重试。'))
        return
      }
      resolve(produce())
    }, SIMULATED_LATENCY)
  })
}

export function fetchRestorationOverview() {
  return simulate('overview', () => ({
    hero: { ...restorationHero },
    batches: restorationBatches.map((item) => ({ ...item })),
    environment: restorationEnvironment.map((item) => ({ ...item })),
    tasks: restorationTasks.map((item) => ({ ...item })),
    steps: [...restorationSteps],
  }))
}

export function fetchRestorationBatches() {
  return simulate('batches', () => restorationBatches.map((item) => ({ ...item })))
}

export function fetchRestorationTasks() {
  return simulate('tasks', () => restorationTasks.map((item) => ({ ...item })))
}
