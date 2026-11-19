<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Sparkles,
  Sun,
  Moon,
  ArrowRight,
  Menu,
  X,
  ExternalLink,
  Github,
  LayoutDashboard
} from 'lucide-vue-next'
import { MdButton } from '@/components/m3'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const themeStore = useThemeStore()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

const navLinks = [
  { label: '核心视觉', href: '#hero' },
  { label: 'Bento 架构', href: '#bento' },
  { label: '组件生态', href: '#components' },
  { label: '在线演练场', path: '/playground' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleLinkClick = (link: { label: string; href?: string; path?: string }) => {
  mobileMenuOpen.value = false
  if (link.path) {
    router.push(link.path)
  } else if (link.href) {
    const el = document.querySelector(link.href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

const goToAdmin = () => {
  router.push('/')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="portal-shell">
    <!-- 顶部居中悬浮半透明毛玻璃胶囊导航栏 -->
    <header class="portal-header-wrapper" :class="{ 'is-scrolled': isScrolled }">
      <nav class="portal-pill-nav">
        <!-- 左侧 Brand Logo -->
        <div class="portal-brand" @click="router.push('/portal')">
          <div class="portal-brand__badge">
            <Sparkles :size="20" />
          </div>
          <span class="title-medium portal-brand__name">Material 3</span>
          <span class="portal-brand__tag label-small">Expressive</span>
        </div>

        <!-- 中间链接群 (桌面端) -->
        <ul class="portal-nav-links">
          <li v-for="link in navLinks" :key="link.label">
            <a
              href="javascript:void(0)"
              class="portal-nav-link label-large md-state-layer"
              @click="handleLinkClick(link)"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>

        <!-- 右侧操作区 -->
        <div class="portal-nav-actions">
          <button
            type="button"
            class="portal-icon-btn md-state-layer"
            :title="themeStore.isDark ? '切换浅色模式' : '切换深色模式'"
            @click="themeStore.toggleTheme"
          >
            <Sun v-if="themeStore.isDark" :size="19" />
            <Moon v-else :size="19" />
          </button>

          <!-- 主操作按钮：返回后台模板 -->
          <MdButton variant="filled" class="admin-entry-btn" @click="goToAdmin">
            <template #icon><LayoutDashboard /></template>
            返回后台模式
          </MdButton>

          <!-- 手机端汉堡按钮 -->
          <button
            type="button"
            class="mobile-menu-toggle md-state-layer"
            aria-label="打开菜单"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <X v-if="mobileMenuOpen" :size="22" />
            <Menu v-else :size="22" />
          </button>
        </div>
      </nav>

      <!-- 手机端折叠抽屉菜单 -->
      <Transition name="portal-menu">
        <div v-if="mobileMenuOpen" class="mobile-nav-drawer">
          <div class="mobile-nav-links">
            <a
              v-for="link in navLinks"
              :key="link.label"
              href="javascript:void(0)"
              class="mobile-nav-item label-large"
              @click="handleLinkClick(link)"
            >
              <span>{{ link.label }}</span>
              <ArrowRight :size="16" />
            </a>
          </div>

          <div class="mobile-nav-footer">
            <MdButton variant="tonal" class="w-full" @click="goToAdmin">
              <template #icon><LayoutDashboard /></template>
              返回后台管理模式
            </MdButton>
          </div>
        </div>
      </Transition>
    </header>

    <!-- 官网主体页面内容 -->
    <main class="portal-main">
      <router-view />
    </main>

    <!-- 官网精致页脚 (Footer) -->
    <footer class="portal-footer">
      <div class="portal-footer__inner">
        <div class="footer-top-row">
          <div class="footer-brand">
            <div class="portal-brand__badge">
              <Sparkles :size="20" />
            </div>
            <div class="footer-brand__text">
              <span class="title-medium">Material Design 3</span>
              <span class="body-small text-secondary">Vue 3 Dual-Track通用脚手架 (Admin + Portal)</span>
            </div>
          </div>

          <div class="footer-links-grid">
            <div class="footer-col">
              <span class="label-large footer-col__title">架构与模式</span>
              <router-link to="/" class="body-medium footer-link">后台管理模式 (Admin)</router-link>
              <router-link to="/portal" class="body-medium footer-link">官网展示模式 (Portal)</router-link>
              <router-link to="/playground" class="body-medium footer-link">组件演练场 (Playground)</router-link>
            </div>

            <div class="footer-col">
              <span class="label-large footer-col__title">核心资源</span>
              <a href="https://m3.material.io" target="_blank" rel="noopener noreferrer" class="body-medium footer-link">
                <span>Material 3 官网</span>
                <ExternalLink :size="14" />
              </a>
              <a href="https://github.com/cfstyle/my-vue3-m3-starter" target="_blank" rel="noopener noreferrer" class="body-medium footer-link">
                <span>GitHub 仓库</span>
                <Github :size="14" />
              </a>
            </div>
          </div>
        </div>

        <div class="footer-divider"></div>

        <div class="footer-bottom-row">
          <p class="body-small text-secondary">
            © 2026 Material 3 Vue Starter. MIT License. 释放全端自适应响应式生产力。
          </p>
          <div class="footer-theme-toggle">
            <span class="body-small text-secondary">当前主题：{{ themeStore.isDark ? '深色模式' : '浅色模式' }}</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.portal-shell {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  position: relative;
}

/* ================= 顶部悬浮胶囊导航 ================= */
.portal-header-wrapper {
  position: sticky;
  top: 16px;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.portal-pill-nav {
  width: 100%;
  max-width: 1080px;
  height: 60px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: rgba(254, 247, 255, 0.78);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--md-sys-color-outline-variant);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 20px;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

[data-theme="dark"] .portal-pill-nav {
  background-color: rgba(20, 18, 24, 0.82);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
}

.portal-header-wrapper.is-scrolled .portal-pill-nav {
  box-shadow: var(--md-sys-elevation-level3);
}

/* 品牌 Logo */
.portal-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.portal-brand__badge {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary));
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--md-sys-elevation-level1);
}

.portal-brand__name {
  font-weight: 700;
  letter-spacing: -0.01em;
}

.portal-brand__tag {
  padding: 2px 8px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 600;
}

/* 中间导航链接 (桌面端) */
.portal-nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
}

.portal-nav-link {
  padding: 8px 16px;
  border-radius: var(--md-sys-shape-corner-full);
  color: var(--md-sys-color-on-surface-variant);
  transition: color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.portal-nav-link:hover {
  color: var(--md-sys-color-on-surface);
}

/* 右侧操作栏 */
.portal-nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.portal-icon-btn {
  width: 38px;
  height: 38px;
  border-radius: var(--md-sys-shape-corner-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-surface-variant);
}

.portal-icon-btn:hover {
  color: var(--md-sys-color-on-surface);
}

.mobile-menu-toggle {
  display: none;
  width: 38px;
  height: 38px;
  border-radius: var(--md-sys-shape-corner-full);
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-surface);
}

/* 手机端下拉菜单 */
.mobile-nav-drawer {
  position: absolute;
  top: 72px;
  left: 20px;
  right: 20px;
  background-color: var(--md-sys-color-surface-container-high);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 24px;
  padding: 16px;
  box-shadow: var(--md-sys-elevation-level3);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 16px;
  color: var(--md-sys-color-on-surface);
}

.mobile-nav-item:hover {
  background-color: var(--md-sys-color-surface-container-highest);
}

.w-full {
  width: 100%;
}

/* 动效 */
.portal-menu-enter-active,
.portal-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.portal-menu-enter-from,
.portal-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ================= 官网主体区 ================= */
.portal-main {
  flex: 1;
  width: 100%;
  padding-bottom: 60px;
}

/* ================= 官网页脚 (Footer) ================= */
.portal-footer {
  width: 100%;
  background-color: var(--md-sys-color-surface-container-low);
  border-top: 1px solid var(--md-sys-color-outline-variant);
  padding: 60px 24px 32px 24px;
  margin-top: auto;
}

.portal-footer__inner {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.footer-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 40px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.footer-brand__text {
  display: flex;
  flex-direction: column;
}

.footer-links-grid {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-col__title {
  color: var(--md-sys-color-on-surface);
}

.footer-link {
  color: var(--md-sys-color-on-surface-variant);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.footer-link:hover {
  color: var(--md-sys-color-primary);
}

.footer-divider {
  width: 100%;
  height: 1px;
  background-color: var(--md-sys-color-outline-variant);
}

.footer-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.text-secondary {
  color: var(--md-sys-color-on-surface-variant);
}

/* 响应式断点控制 */
@media (max-width: 768px) {
  .portal-nav-links {
    display: none;
  }
  .admin-entry-btn {
    display: none;
  }
  .mobile-menu-toggle {
    display: inline-flex;
  }
}

@media (max-width: 599.98px) {
  .portal-header-wrapper {
    padding: 0 12px;
    top: 8px;
  }
  .portal-pill-nav {
    height: 54px;
    padding: 0 12px 0 16px;
  }
  .footer-top-row {
    flex-direction: column;
    gap: 28px;
  }
}
</style>
