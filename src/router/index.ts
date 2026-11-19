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

// Web 安全防范：协议合法性校验，拦截恶意伪协议重定向
router.beforeEach((to, _from, next) => {
  if (to.query.redirect) {
    const redirectUrl = String(to.query.redirect)
    if (/^\s*(javascript|data|vbscript):/i.test(redirectUrl)) {
      next({ path: '/' })
      return
    }
  }
  next()
})

export default router
