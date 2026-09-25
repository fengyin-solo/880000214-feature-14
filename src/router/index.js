import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import BatchLibraryView from '../views/BatchLibraryView.vue'
import TaskBoardView from '../views/TaskBoardView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { getScrollPosition, saveScrollPosition } from '../utils/scrollMemory'

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
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    const cached = getScrollPosition(to.fullPath)
    if (typeof cached === 'number') {
      return { top: cached }
    }
    return { top: 0 }
  },
})

router.beforeEach((to, from) => {
  if (from.fullPath !== to.fullPath) {
    saveScrollPosition(from.fullPath, window.scrollY)
  }
})

export default router
