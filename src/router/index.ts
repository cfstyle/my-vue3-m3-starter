import { createRouter, createWebHistory } from 'vue-router'
import AdaptiveShell from '@/layouts/AdaptiveShell.vue'
import PortalShell from '@/layouts/PortalShell.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 1. 后台管理工作台模式 (Admin Track)
    {
      path: '/',
      component: AdaptiveShell,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('@/views/AnalyticsView.vue')
        },
        {
          path: 'messages',
          name: 'messages',
          component: () => import('@/views/MessagesView.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue')
        },
        {
          path: 'playground',
          name: 'playground',
          component: () => import('@/views/UiPlaygroundView.vue')
        }
      ]
    },
    // 2. 官网展示模式 (Portal Track)
    {
      path: '/portal',
      component: PortalShell,
      children: [
        {
          path: '',
          name: 'portal-showcase',
          component: () => import('@/views/portal/PortalShowcaseView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
