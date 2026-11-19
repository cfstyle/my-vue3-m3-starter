<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboard,
  BarChart3,
  Bell,
  Settings,
  Sun,
  Moon,
  Search,
  Sparkles,
  Command,
  Globe,
  ArrowUpRight
} from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { MdSwitch } from '@/components/m3'

interface NavItem {
  name: string
  label: string
  path: string
  icon: any
  badge?: string | number
}

const navItems: NavItem[] = [
  { name: 'home', label: '概览', path: '/', icon: LayoutDashboard },
  { name: 'analytics', label: '数据', path: '/analytics', icon: BarChart3 },
  { name: 'messages', label: '消息', path: '/messages', icon: Bell, badge: 3 },
  { name: 'settings', label: '设置', path: '/settings', icon: Settings }
]

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()

const searchQuery = ref('')

const currentTitle = computed(() => {
  const current = navItems.find((item) => item.path === route.path)
  return current ? current.label : 'Material Design 3'
})

const navigateTo = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
}

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

onMounted(() => {
  themeStore.setLayoutContext('admin')
})
</script>

<template>
  <div class="m3-shell">
    <!-- ====================================================================
         1. 手机端顶部应用栏 (Top App Bar, < 600px)
         ==================================================================== -->
    <header class="m3-mobile-top-bar">
      <div class="m3-mobile-top-bar__start">
        <div class="m3-brand-badge">
          <Sparkles :size="20" />
        </div>
        <h1 class="title-large m3-mobile-top-bar__title">{{ currentTitle }}</h1>
      </div>
      <div class="m3-mobile-top-bar__end">
        <button
          type="button"
          class="m3-icon-button md-state-layer"
          title="切换至官网展示模式 (/portal)"
          @click="router.push('/portal')"
        >
          <Globe :size="20" />
        </button>
        <button
          type="button"
          class="m3-icon-button md-state-layer"
          :title="themeStore.isDark ? '切换浅色模式' : '切换深色模式'"
          @click="themeStore.toggleTheme"
        >
          <Sun v-if="themeStore.isDark" :size="20" />
          <Moon v-else :size="20" />
        </button>
      </div>
    </header>

    <!-- ====================================================================
         2. 平板端导航轨 (Navigation Rail, 600px - 839px)
         ==================================================================== -->
    <aside class="m3-nav-rail">
      <div class="m3-nav-rail__header">
        <div class="m3-brand-badge">
          <Sparkles :size="22" />
        </div>
      </div>

      <nav class="m3-nav-rail__items">
        <button
          v-for="item in navItems"
          :key="item.path"
          type="button"
          :class="['m3-rail-item', { 'is-active': isActive(item.path) }]"
          @click="navigateTo(item.path)"
        >
          <div class="m3-rail-item__indicator md-state-layer">
            <component :is="item.icon" :size="22" />
            <span v-if="item.badge" class="m3-badge">{{ item.badge }}</span>
          </div>
          <span class="m3-rail-item__label label-medium">{{ item.label }}</span>
        </button>
      </nav>

      <div class="m3-nav-rail__footer">
        <button
          type="button"
          class="m3-icon-button md-state-layer"
          title="切换至官网展示模式 (/portal)"
          @click="router.push('/portal')"
        >
          <Globe :size="20" />
        </button>
        <button
          type="button"
          class="m3-icon-button md-state-layer"
          :title="themeStore.isDark ? '切换浅色模式' : '切换深色模式'"
          @click="themeStore.toggleTheme"
        >
          <Sun v-if="themeStore.isDark" :size="20" />
          <Moon v-else :size="20" />
        </button>
      </div>
    </aside>

    <!-- ====================================================================
         3. PC 宽屏端导航抽屉 (Navigation Drawer, >= 840px)
         ==================================================================== -->
    <aside class="m3-nav-drawer">
      <div class="m3-drawer__brand">
        <div class="m3-brand-badge">
          <Sparkles :size="22" />
        </div>
        <div class="m3-brand-text">
          <span class="title-medium">Material 3</span>
          <span class="body-small m3-brand-sub">Vue3 Adaptive</span>
        </div>
      </div>

      <nav class="m3-drawer__nav">
        <button
          v-for="item in navItems"
          :key="item.path"
          type="button"
          :class="['m3-drawer-item', 'md-state-layer', { 'is-active': isActive(item.path) }]"
          @click="navigateTo(item.path)"
        >
          <span class="m3-drawer-item__icon">
            <component :is="item.icon" :size="22" />
          </span>
          <span class="m3-drawer-item__label label-large">{{ item.label }}</span>
          <span v-if="item.badge" class="m3-badge">{{ item.badge }}</span>
        </button>
      </nav>

      <div class="m3-drawer__footer">
        <button
          type="button"
          class="m3-portal-switch-card md-state-layer"
          @click="router.push('/portal')"
        >
          <div class="m3-portal-switch-icon">
            <Globe :size="18" />
          </div>
          <div class="m3-portal-switch-text">
            <span class="label-large">官网展示模式</span>
            <span class="body-small text-secondary">切换至 C 端展示页</span>
          </div>
          <ArrowUpRight :size="16" class="m3-portal-switch-arrow" />
        </button>

        <div class="m3-drawer__theme-switch" @click="themeStore.toggleTheme">
          <div class="m3-drawer__theme-info">
            <component :is="themeStore.isDark ? Moon : Sun" :size="20" />
            <span class="label-large">{{ themeStore.isDark ? '深色模式' : '浅色模式' }}</span>
          </div>
          <MdSwitch :model-value="themeStore.isDark" />
        </div>
      </div>
    </aside>

    <!-- ====================================================================
         4. 主内容视口区
         ==================================================================== -->
    <div class="m3-main-container">
      <!-- PC 端及平板端通用 Top Bar (集成胶囊搜索框) -->
      <header class="m3-desktop-top-bar">
        <div class="m3-search-bar">
          <Search :size="18" class="m3-search-bar__icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索功能、数据或设置..."
            class="m3-search-bar__input body-medium"
          />
          <div class="m3-search-bar__shortcut label-small">
            <Command :size="12" /> K
          </div>
        </div>

        <div class="m3-desktop-top-bar__actions">
          <button
            type="button"
            class="m3-icon-button md-state-layer"
            :title="themeStore.isDark ? '切换浅色模式' : '切换深色模式'"
            @click="themeStore.toggleTheme"
          >
            <Sun v-if="themeStore.isDark" :size="20" />
            <Moon v-else :size="20" />
          </button>
        </div>
      </header>

      <!-- 实际页面视图挂载点 -->
      <main class="m3-content-wrapper">
        <div class="m3-content-constrain">
          <router-view />
        </div>
      </main>
    </div>

    <!-- ====================================================================
         5. 手机端底部导航栏 (Navigation Bar, < 600px)
         ==================================================================== -->
    <nav class="m3-bottom-nav">
      <button
        v-for="item in navItems"
        :key="item.path"
        type="button"
        :class="['m3-nav-bar-item', { 'is-active': isActive(item.path) }]"
        @click="navigateTo(item.path)"
      >
        <div class="m3-nav-indicator md-state-layer">
          <component :is="item.icon" :size="22" />
          <span v-if="item.badge" class="m3-badge m3-badge--small">{{ item.badge }}</span>
        </div>
        <span class="m3-nav-bar-item__label label-medium">{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.m3-shell {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: var(--md-sys-color-surface);
  position: relative;
}

/* ================= 通用原子装饰 ================= */
.m3-brand-badge {
  width: 36px;
  height: 36px;
  border-radius: var(--md-sys-shape-corner-medium);
  background: linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary));
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--md-sys-elevation-level1);
  flex-shrink: 0;
}

.m3-icon-button {
  width: 40px;
  height: 40px;
  border-radius: var(--md-sys-shape-corner-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-surface-variant);
  transition: color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}
.m3-icon-button:hover {
  color: var(--md-sys-color-on-surface);
}

.m3-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-error);
  color: var(--md-sys-color-on-error);
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.m3-badge--small {
  top: 4px;
  right: 14px;
}

/* ================= 1. 手机端顶部应用栏 ================= */
.m3-mobile-top-bar {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  padding: 0 16px;
  z-index: 50;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--md-sys-color-surface-container-high);
}

.m3-mobile-top-bar__start {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ================= 2. 平板端导航轨 (Navigation Rail) ================= */
.m3-nav-rail {
  display: none;
  width: 80px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--md-sys-color-surface);
  border-right: 1px solid var(--md-sys-color-outline-variant);
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  z-index: 60;
}

.m3-nav-rail__header {
  margin-bottom: 24px;
}

.m3-nav-rail__items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  flex: 1;
}

.m3-rail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 68px;
  background: none;
  cursor: pointer;
}

.m3-rail-item__indicator {
  position: relative;
  width: 56px;
  height: 32px;
  border-radius: var(--md-sys-shape-corner-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-surface-variant);
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-rail-item.is-active .m3-rail-item__indicator {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.m3-rail-item__label {
  color: var(--md-sys-color-on-surface-variant);
}

.m3-rail-item.is-active .m3-rail-item__label {
  color: var(--md-sys-color-on-surface);
  font-weight: 700;
}

/* ================= 3. PC 导航抽屉 (Navigation Drawer) ================= */
.m3-nav-drawer {
  display: none;
  width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--md-sys-color-surface-container-low);
  border-right: 1px solid var(--md-sys-color-outline-variant);
  flex-direction: column;
  padding: 24px 16px;
  z-index: 60;
  overflow-y: auto;
}

.m3-drawer__brand {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 12px 24px 12px;
}

.m3-brand-text {
  display: flex;
  flex-direction: column;
}

.m3-brand-sub {
  color: var(--md-sys-color-on-surface-variant);
}

.m3-drawer__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.m3-drawer-item {
  position: relative;
  height: 56px;
  border-radius: var(--md-sys-shape-corner-full);
  display: flex;
  align-items: center;
  padding: 0 16px 0 20px;
  gap: 14px;
  color: var(--md-sys-color-on-surface-variant);
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  width: 100%;
}

.m3-drawer-item:hover {
  color: var(--md-sys-color-on-surface);
}

.m3-drawer-item.is-active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.m3-drawer-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.m3-drawer-item__label {
  flex: 1;
  text-align: left;
}

.m3-drawer__footer {
  padding-top: 16px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  display: flex;
  flex-direction: column;
}

.m3-portal-switch-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--md-sys-shape-corner-medium, 16px);
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  margin-bottom: 12px;
  text-align: left;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease;
}

.m3-portal-switch-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--md-sys-elevation-level1);
}

.m3-portal-switch-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--md-sys-shape-corner-small, 8px);
  background-color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

[data-theme="dark"] .m3-portal-switch-icon {
  background-color: rgba(0, 0, 0, 0.25);
}

.m3-portal-switch-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.m3-portal-switch-arrow {
  opacity: 0.7;
}

.m3-drawer__theme-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: var(--md-sys-shape-corner-large);
  background-color: var(--md-sys-color-surface-container);
  cursor: pointer;
  user-select: none;
}

.m3-drawer__theme-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--md-sys-color-on-surface);
}

.m3-switch-toggle {
  width: 44px;
  height: 24px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-surface-container-highest);
  position: relative;
  transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-switch-toggle.is-active {
  background-color: var(--md-sys-color-primary);
}

.m3-switch-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-outline);
  transition: transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard),
              background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-switch-toggle.is-active .m3-switch-thumb {
  transform: translateX(20px);
  background-color: var(--md-sys-color-on-primary);
}

/* ================= 4. 主内容与 Top Bar ================= */
.m3-main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
  transition: margin-left var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-standard);
}

.m3-desktop-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 32px;
  background-color: var(--md-sys-color-surface);
  position: sticky;
  top: 0;
  z-index: 40;
}

.m3-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 480px;
  height: 48px;
  background-color: var(--md-sys-color-surface-container-high);
  border-radius: var(--md-sys-shape-corner-full);
  padding: 0 18px;
  color: var(--md-sys-color-on-surface-variant);
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-search-bar:focus-within {
  box-shadow: var(--md-sys-elevation-level2);
  background-color: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-on-surface);
}

.m3-search-bar__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--md-sys-color-on-surface);
}

.m3-search-bar__shortcut {
  display: flex;
  align-items: center;
  gap: 2px;
  background-color: var(--md-sys-color-surface-container);
  padding: 2px 8px;
  border-radius: var(--md-sys-shape-corner-small);
  color: var(--md-sys-color-on-surface-variant);
}

.m3-desktop-top-bar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.m3-content-wrapper {
  flex: 1;
  padding: 16px 32px 48px 32px;
}

.m3-content-constrain {
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

/* ================= 5. 手机底部导航栏 ================= */
.m3-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: var(--md-sys-color-surface-container);
  border-top: 1px solid var(--md-sys-color-outline-variant);
  padding-bottom: env(safe-area-inset-bottom, 0);
  z-index: 50;
  align-items: center;
  justify-content: space-around;
}

.m3-nav-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  background: none;
  cursor: pointer;
  padding: 4px 0;
}

.m3-nav-indicator {
  position: relative;
  width: 64px;
  height: 32px;
  border-radius: var(--md-sys-shape-corner-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-surface-variant);
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-nav-bar-item.is-active .m3-nav-indicator {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.m3-nav-bar-item__label {
  color: var(--md-sys-color-on-surface-variant);
}

.m3-nav-bar-item.is-active .m3-nav-bar-item__label {
  color: var(--md-sys-color-on-surface);
  font-weight: 700;
}

/* ==========================================================================
   自适应响应式断点规则
   ========================================================================== */

/* 手机端: < 600px */
@media (max-width: 599.98px) {
  .m3-mobile-top-bar {
    display: flex;
  }
  .m3-bottom-nav {
    display: flex;
  }
  .m3-desktop-top-bar {
    display: none;
  }
  .m3-nav-rail,
  .m3-nav-drawer {
    display: none;
  }
  .m3-main-container {
    margin-left: 0 !important;
    padding-top: 64px;
    padding-bottom: 80px;
  }
  .m3-content-wrapper {
    padding: 16px 16px 32px 16px;
  }
}

/* 平板端: 600px - 839px */
@media (min-width: 600px) and (max-width: 839.98px) {
  .m3-nav-rail {
    display: flex;
  }
  .m3-main-container {
    margin-left: 80px;
  }
  .m3-desktop-top-bar {
    display: flex;
    padding: 0 24px;
  }
  .m3-content-wrapper {
    padding: 16px 24px 36px 24px;
  }
}

/* PC 宽屏端: >= 840px */
@media (min-width: 840px) {
  .m3-nav-drawer {
    display: flex;
  }
  .m3-main-container {
    margin-left: 260px;
  }
  .m3-desktop-top-bar {
    display: flex;
  }
}
</style>
