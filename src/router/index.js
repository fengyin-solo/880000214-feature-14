import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import BatchLibraryView from '../views/BatchLibraryView.vue'
import TaskBoardView from '../views/TaskBoardView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/batches',
    name: 'batches',
    component: BatchLibraryView,
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TaskBoardView,
  },
  {
    // 任何未登记地址都进入明确的 404 空态，而不是白屏。
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 页面滚动位置由 useRouteScrollMemory 按入口记忆与恢复，
  // 这里返回 false，避免框架强制回顶部覆盖已记忆的位置。
  scrollBehavior() {
    return false
  },
})

export default router
