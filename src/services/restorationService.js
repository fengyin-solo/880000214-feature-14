import {
  restorationBatches,
  restorationEnvironment,
  restorationHero,
  restorationNavigation,
  restorationSteps,
  restorationTasks,
} from '../data/restorationData'

// 模拟接口延迟，便于观察加载态；快速切换时旧请求晚返回由调用方丢弃。
const DEFAULT_DELAY = 320

function delay(ms = DEFAULT_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 开发/演示时可通过地址栏注入异常，验证空态与重试，例如：
//   /tasks?demo=fail   该页数据请求失败
//   /?demo=fail-nav    导航入口加载失败
//   /?demo=missing-nav 某个导航入口指向未注册地址
//   /?demo=empty       该页数据为空
//   /?demo=slow        拉长加载时间，方便快速切换验证竞态
function demoFlags() {
  if (typeof window === 'undefined') return new Set()
  return new Set(
    new URLSearchParams(window.location.search).get('demo')?.split(',') ?? [],
  )
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

async function respond(resource, value) {
  const flags = demoFlags()
  await delay(flags.has('slow') ? 1600 : DEFAULT_DELAY)
  if (flags.has('fail')) {
    throw new Error(`「${resource}」数据加载失败，请稍后重试。`)
  }
  return flags.has('empty') ? [] : clone(value)
}

export function fetchHero() {
  return respond('修复总览', restorationHero).then((hero) =>
    Array.isArray(hero) ? null : hero,
  )
}

export function fetchBatches() {
  return respond('批次档案', restorationBatches)
}

export function fetchTasks() {
  return respond('任务清单', restorationTasks)
}

export function fetchEnvironment() {
  return respond('环境参数', restorationEnvironment)
}

export function fetchSteps() {
  return respond('当日工序', restorationSteps)
}

export async function fetchNavigation() {
  const flags = demoFlags()
  await delay(flags.has('slow') ? 1200 : 200)

  if (flags.has('fail-nav')) {
    throw new Error('工作台导航入口加载失败，请稍后重试。')
  }

  if (flags.has('missing-nav')) {
    // 模拟后端误发了一个没有对应页面的入口。
    return [
      ...clone(restorationNavigation),
      { name: 'archive-room', label: '纸库调度', to: '/archive-room' },
    ]
  }

  return clone(restorationNavigation)
}
