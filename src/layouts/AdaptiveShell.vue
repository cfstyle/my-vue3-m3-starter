<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, type Component } from 'vue'
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
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
  AlignJustify,
  Rows3,
  Menu
} from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { MdSwitch, MdDrawer } from '@/components/m3'

interface NavItem {
  name: string
  label: string
  path: string
  icon: Component
  badge?: string | number
}

const navItems: NavItem[] = [
  { name: 'home', label: '概览', path: '/', icon: LayoutDashboard },
  { name: 'analytics', label: '数据', path: '/analytics', icon: BarChart3 },
  { name: 'messages', label: '消息', path: '/messages', icon: Bell, badge: 3 },
  { name: 'settings', label: '设置', path: '/settings', icon: Settings },
  { name: 'playground', label: '演练场', path: '/playground', icon: Sparkles }
]

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()

const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
const isRailCollapsed = ref(false)
const isMobileDrawerOpen = ref(false)

const toggleCollapse = () => {
  isRailCollapsed.value = !isRailCollapsed.value
}

const currentTitle = computed(() => {
  const current = navItems.find((item) => item.path === route.path)
  return current ? current.label : 'Material Design 3'
})

const navigateTo = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
}

const navigateAndCloseMobileDrawer = (path: string) => {
  isMobileDrawerOpen.value = false
  navigateTo(path)
}

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path + '/')
}

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchInputRef.value?.focus()
    searchInputRef.value?.select()
  }
}

onMounted(() => {
  themeStore.setLayoutContext('admin')
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div class="m3-shell">
    <!-- ====================================================================
         1. 手机端顶部应用栏 (Top App Bar, < 600px)
         ==================================================================== -->
    <header class="m3-mobile-top-bar">
      <div class="m3-mobile-top-bar__start">
        <button
          type="button"
          class="m3-icon-button md-state-layer m3-mobile-menu-btn"
          title="打开侧边导航抽屉"
          aria-label="打开侧边导航抽屉"
          @click="isMobileDrawerOpen = true"
        >
          <Menu :size="22" />
        </button>
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
         2. 平板端常驻导航轨 (Navigation Rail, 600px - 839px)
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
          :class="['m3-rail-btn', { 'is-active': isActive(item.path) }]"
          :title="item.label"
          @click="navigateTo(item.path)"
        >
          <div class="nav-icon-pill md-state-layer">
            <component :is="item.icon" :size="22" />
            <span v-if="item.badge" class="m3-badge rail-badge">{{ item.badge }}</span>
          </div>
          <span class="rail-label">{{ item.label }}</span>
        </button>
      </nav>

      <div class="m3-nav-rail__footer">
        <button
          type="button"
          class="m3-compact-action-btn md-state-layer"
          title="切换至官网展示模式 (/portal)"
          @click="router.push('/portal')"
        >
          <Globe :size="20" />
        </button>
        <button
          type="button"
          class="m3-compact-action-btn md-state-layer"
          title="切换深色/浅色主题"
          @click="themeStore.toggleTheme"
        >
          <Sun v-if="themeStore.isDark" :size="20" />
          <Moon v-else :size="20" />
        </button>
      </div>
    </aside>

    <!-- ====================================================================
         3. PC 宽屏端自适应抽屉 / 可折叠导航轨 (Drawer / Collapsible Rail, >= 840px)
         ==================================================================== -->
    <aside :class="['m3-nav-drawer', { 'is-collapsed': isRailCollapsed }]">
      <!-- 顶部品牌与折叠控制器 -->
      <div class="m3-drawer__header">
        <div class="m3-drawer__brand" @click="navigateTo('/')">
          <div class="m3-brand-badge">
            <Sparkles :size="22" />
          </div>
          <div v-show="!isRailCollapsed" class="m3-brand-text">
            <span class="title-medium">Material 3</span>
            <span class="body-small m3-brand-sub">Vue3 Adaptive</span>
          </div>
        </div>

        <button
          type="button"
          class="m3-collapse-btn md-state-layer"
          :title="isRailCollapsed ? '展开导航抽屉 (256px)' : '折叠为导航轨 (80px)'"
          @click="toggleCollapse"
        >
          <PanelLeftOpen v-if="isRailCollapsed" :size="18" />
          <PanelLeftClose v-else :size="18" />
        </button>
      </div>

      <!-- 导航列表项：展开态为横向全宽胶囊，收起态为 M3 标准 56×32px 纵向居中 Rail -->
      <nav class="m3-drawer__nav">
        <!-- 收起态 (Navigation Rail Mode: 80px 宽度) -->
        <template v-if="isRailCollapsed">
          <button
            v-for="item in navItems"
            :key="item.path"
            type="button"
            :class="['m3-rail-btn', { 'is-active': isActive(item.path) }]"
            :title="item.label"
            @click="navigateTo(item.path)"
          >
            <div class="nav-icon-pill md-state-layer">
              <component :is="item.icon" :size="22" />
              <!-- 未读角标：绝对定位在 56×32 胶囊右上角 top: 2px, right: 10px，不挤压图标 -->
              <span v-if="item.badge" class="m3-badge rail-badge">{{ item.badge }}</span>
            </div>
            <span class="rail-label">{{ item.label }}</span>
          </button>
        </template>

        <!-- 展开态 (Navigation Drawer Mode: 256px 宽度) -->
        <template v-else>
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
            <span v-if="item.badge" class="m3-badge drawer-badge">{{ item.badge }}</span>
          </button>
        </template>
      </nav>

      <!-- 抽屉底部操作区 (官网切换 + 浅/深色模式切换) -->
      <div class="m3-drawer__footer">
        <!-- 展开态底部：完整卡片 + MdSwitch -->
        <template v-if="!isRailCollapsed">
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

          <div
            class="m3-drawer__theme-switch"
            @click="themeStore.toggleTheme"
          >
            <div class="m3-drawer__theme-info">
              <component :is="themeStore.isDark ? Moon : Sun" :size="20" />
              <span class="label-large">{{ themeStore.isDark ? '深色模式' : '浅色模式' }}</span>
            </div>
            <MdSwitch
              :model-value="themeStore.isDark"
              @click.stop
              @update:model-value="themeStore.toggleTheme"
            >
              <template #checkedIcon><Moon :size="12" /></template>
              <template #uncheckedIcon><Sun :size="12" /></template>
            </MdSwitch>
          </div>
        </template>

        <!-- 收起态底部：统一 48px × 48px 居中圆角容器 + 悬浮提示 -->
        <template v-else>
          <div class="m3-rail-compact-footer">
            <button
              type="button"
              class="m3-compact-action-btn md-state-layer"
              title="切换至官网展示模式 (/portal)"
              @click="router.push('/portal')"
            >
              <Globe :size="20" />
            </button>
            <button
              type="button"
              class="m3-compact-action-btn md-state-layer"
              title="切换深色/浅色主题"
              @click="themeStore.toggleTheme"
            >
              <Sun v-if="themeStore.isDark" :size="20" />
              <Moon v-else :size="20" />
            </button>
          </div>
        </template>
      </div>
    </aside>

    <!-- ====================================================================
         4. 主内容视口区
         ==================================================================== -->
    <div :class="['m3-main-container', { 'is-rail-collapsed': isRailCollapsed }]">
      <!-- PC 端及平板端通用 Top Bar -->
      <header class="m3-desktop-top-bar">
        <!-- 胶囊搜索框 -->
        <div class="m3-search-bar">
          <Search :size="18" class="m3-search-bar__icon" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="搜索功能、数据或设置... (Ctrl+K)"
            class="m3-search-bar__input body-medium"
          />
          <div class="m3-search-bar__shortcut label-small">
            <Command :size="12" /> K
          </div>
        </div>

        <!-- 右侧操作区：4色HCT种子色快切 + 紧凑/舒适密度 + 明暗开关 + 用户头像 -->
        <div class="m3-desktop-top-bar__actions">
          <!-- 1. HCT 种子色快切圆点组 (6套主题小气泡：含银行与金融专属) -->
          <div class="m3-seed-picker" title="快速切换 HCT 主题种子色">
            <button
              v-for="preset in themeStore.THEME_PRESETS"
              :key="preset.id"
              type="button"
              :class="['m3-seed-dot', 'md-state-layer', { 'is-active': themeStore.seedColor.toLowerCase() === preset.hex.toLowerCase() }]"
              :style="{ backgroundColor: preset.hex }"
              :title="`${preset.name} · ${preset.category} (${preset.hex})`"
              @click="themeStore.setSeedColor(preset.hex)"
            />
          </div>

          <div class="m3-topbar-divider"></div>

          <!-- 2. 紧凑/舒适密度切换按钮 -->
          <button
            type="button"
            class="m3-icon-button md-state-layer"
            :title="themeStore.density === 'compact' ? '当前：紧凑密度 (点击切换舒适)' : '当前：舒适密度 (点击切换紧凑)'"
            @click="themeStore.setDensity(themeStore.density === 'compact' ? 'comfortable' : 'compact')"
          >
            <Rows3 v-if="themeStore.density === 'compact'" :size="18" />
            <AlignJustify v-else :size="18" />
          </button>

          <!-- 3. 明暗主题切换按钮 -->
          <button
            type="button"
            class="m3-icon-button md-state-layer"
            :title="themeStore.isDark ? '切换浅色模式' : '切换深色模式'"
            @click="themeStore.toggleTheme"
          >
            <Sun v-if="themeStore.isDark" :size="19" />
            <Moon v-else :size="19" />
          </button>

          <div class="m3-topbar-divider"></div>

          <!-- 4. 用户头像占位 -->
          <div class="m3-avatar-wrapper md-state-layer" title="当前登录：系统管理员 (Admin)">
            <div class="m3-avatar">
              <span class="label-medium">CF</span>
            </div>
          </div>
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

    <!-- ====================================================================
         6. 移动端侧边导航抽屉 (由顶部汉堡菜单唤起)
         ==================================================================== -->
    <MdDrawer
      v-model="isMobileDrawerOpen"
      title="导航菜单"
      width="300px"
    >
      <div class="m3-mobile-drawer-body">
        <div class="m3-mobile-drawer-brand" @click="navigateAndCloseMobileDrawer('/')">
          <div class="m3-brand-badge">
            <Sparkles :size="20" />
          </div>
          <div class="m3-brand-text">
            <span class="title-medium">Material 3</span>
            <span class="body-small text-secondary">Vue3 Adaptive</span>
          </div>
        </div>

        <nav class="m3-mobile-drawer-nav">
          <button
            v-for="item in navItems"
            :key="item.path"
            type="button"
            :class="['m3-drawer-item', 'md-state-layer', { 'is-active': isActive(item.path) }]"
            @click="navigateAndCloseMobileDrawer(item.path)"
          >
            <span class="m3-drawer-item__icon">
              <component :is="item.icon" :size="22" />
            </span>
            <span class="m3-drawer-item__label label-large">{{ item.label }}</span>
            <span v-if="item.badge" class="m3-badge drawer-badge">{{ item.badge }}</span>
          </button>
        </nav>

        <div class="m3-mobile-drawer-footer">
          <button
            type="button"
            class="m3-portal-switch-card md-state-layer"
            @click="navigateAndCloseMobileDrawer('/portal')"
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

          <div
            class="m3-drawer__theme-switch"
            @click="themeStore.toggleTheme"
          >
            <div class="m3-drawer__theme-info">
              <component :is="themeStore.isDark ? Moon : Sun" :size="20" />
              <span class="label-large">{{ themeStore.isDark ? '深色模式' : '浅色模式' }}</span>
            </div>
            <MdSwitch
              :model-value="themeStore.isDark"
              @click.stop
              @update:model-value="themeStore.toggleTheme"
            >
              <template #checkedIcon><Moon :size="12" /></template>
              <template #uncheckedIcon><Sun :size="12" /></template>
            </MdSwitch>
          </div>
        </div>
      </div>
    </MdDrawer>
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
  border-radius: var(--md-sys-shape-corner-medium, 12px);
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
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}
.m3-icon-button:hover {
  color: var(--md-sys-color-on-surface);
}

/* 消息角标 */
.m3-badge {
  position: absolute;
  padding: 0 4px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-error);
  color: var(--md-sys-color-on-error);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.m3-badge--small {
  top: 4px;
  right: 14px;
  min-width: 18px;
  height: 18px;
  font-size: var(--md-type-meta-size, 12px);
}

.drawer-badge {
  position: static;
  min-width: 18px;
  height: 18px;
  font-size: var(--md-type-meta-size, 12px);
  line-height: 18px;
  margin-left: auto;
}

/* 收起态 Rail 角标：精准浮于图标右上角，不挤压图标居中位置 */
.rail-badge {
  top: 2px;
  right: 10px;
  min-width: 16px;
  height: 16px;
  font-size: var(--md-type-meta-size, 12px);
  line-height: 16px;
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
  z-index: var(--z-header, 30);
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--md-sys-color-surface-container-high);
}

.m3-mobile-top-bar__start {
  display: flex;
  align-items: center;
  gap: 12px;
}

.m3-mobile-menu-btn {
  display: inline-flex;
  margin-right: -4px;
}

/* ================= 2. 平板端常驻导航轨 (Navigation Rail) ================= */
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
  z-index: var(--z-header, 30);
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

.m3-nav-rail__footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* ================= 3. PC 导航抽屉 / 折叠导航轨 ================= */
.m3-nav-drawer {
  display: none;
  width: 256px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--md-sys-color-surface-container-low);
  border-right: 1px solid var(--md-sys-color-outline-variant);
  flex-direction: column;
  padding: 20px 16px;
  z-index: var(--z-header, 30);
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.25s var(--md-easing-emphasized),
              padding 0.25s var(--md-easing-emphasized);
}

/* 收起态（Navigation Rail）宽度严格锁定为 80px */
.m3-nav-drawer.is-collapsed {
  width: 80px;
  padding: 20px 6px;
  align-items: center;
}

.m3-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 20px 8px;
  width: 100%;
}

/* 收起态顶部 Logo（40×40）与展开按钮（36×36）水平居中对齐 */
.m3-nav-drawer.is-collapsed .m3-drawer__header {
  flex-direction: column;
  gap: 12px;
  padding: 0 0 20px 0;
  align-items: center;
}

.m3-drawer__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.m3-nav-drawer.is-collapsed .m3-drawer__brand .m3-brand-badge {
  width: 40px;
  height: 40px;
}

.m3-brand-text {
  display: flex;
  flex-direction: column;
}

.m3-brand-sub {
  color: var(--md-sys-color-on-surface-variant);
}

.m3-collapse-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--md-sys-shape-corner-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-surface-variant);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}
.m3-collapse-btn:hover {
  color: var(--md-sys-color-on-surface);
}

.m3-drawer__nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  width: 100%;
}

.m3-nav-drawer.is-collapsed .m3-drawer__nav {
  align-items: center;
  gap: 12px;
}

/* --- 展开态抽屉项样式 (Drawer Items: 256px) --- */
.m3-drawer-item {
  position: relative;
  height: 52px;
  border-radius: var(--md-sys-shape-corner-full);
  display: flex;
  align-items: center;
  padding: 0 16px 0 18px;
  gap: 14px;
  color: var(--md-sys-color-on-surface-variant);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  width: 100%;
}

.m3-drawer-item:hover {
  color: var(--md-sys-color-on-surface);
}

.m3-drawer-item.is-active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 600;
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

/* --- 收起态 M3 标准 Navigation Rail 项样式 (80px) --- */
.m3-rail-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  width: 68px;
  background: transparent;
  border: none;
  cursor: pointer;
  user-select: none;
}

/* 标准 56×32px 激活胶囊容器 */
.nav-icon-pill {
  width: 56px;
  height: 32px;
  border-radius: var(--md-sys-shape-corner-full);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: var(--md-sys-color-on-surface-variant);
  background-color: transparent;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

/* 激活态：仅胶囊容器填充 secondary-container，图标变色 */
.m3-rail-btn.is-active .nav-icon-pill {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

/* 导航标签 */
.rail-label {
  font-size: 12px;
  line-height: 16px;
  color: var(--md-sys-color-on-surface-variant);
  font-weight: 500;
  transition: color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.m3-rail-btn.is-active .rail-label {
  color: var(--md-sys-color-on-surface);
  font-weight: 600;
}

/* --- 底部操作区 --- */
.m3-drawer__footer {
  padding-top: 16px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  display: flex;
  flex-direction: column;
  width: 100%;
}

.m3-nav-drawer.is-collapsed .m3-drawer__footer {
  align-items: center;
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
  border: none;
  cursor: pointer;
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

/* 收起态底部统一 48px × 48px 居中圆角容器 */
.m3-rail-compact-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.m3-compact-action-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--md-sys-shape-corner-medium, 16px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-surface-variant);
  background-color: var(--md-sys-color-surface-container);
  border: none;
  cursor: pointer;
  transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.m3-compact-action-btn:hover {
  color: var(--md-sys-color-on-surface);
  background-color: var(--md-sys-color-surface-container-high);
}

/* ================= 4. 主内容与 Top Bar ================= */
.m3-main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
  transition: margin-left 0.25s var(--md-easing-emphasized);
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
  z-index: var(--z-header, 30);
  border-bottom: 1px solid var(--md-sys-color-surface-container-high);
}

.m3-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 440px;
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
  gap: 10px;
}

/* 6色 HCT 种子色气泡 */
.m3-seed-picker {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-surface-container-low);
}

.m3-seed-dot {
  width: 18px;
  height: 18px;
  border-radius: var(--md-sys-shape-corner-full);
  border: none;
  box-shadow: inset 0 0 0 1px var(--md-sys-color-outline-variant);
  cursor: pointer;
  transition: transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard),
              box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
  position: relative;
  flex-shrink: 0;
  outline: none;
}

.m3-seed-dot:hover {
  transform: scale(1.15);
}

.m3-seed-dot.is-active {
  transform: scale(1.15);
  box-shadow: 0 0 0 2px var(--md-sys-color-surface), 0 0 0 4px var(--md-sys-color-primary), inset 0 0 0 1px var(--md-sys-color-outline-variant);
  z-index: 2;
}

.m3-seed-dot:focus-visible {
  box-shadow: 0 0 0 2px var(--md-sys-color-surface), 0 0 0 4px var(--md-sys-color-primary), inset 0 0 0 1px var(--md-sys-color-outline-variant);
  z-index: 2;
}

.m3-topbar-divider {
  width: 1px;
  height: 24px;
  background-color: var(--md-sys-color-outline-variant);
  margin: 0 4px;
}

/* 用户头像 */
.m3-avatar-wrapper {
  width: 40px;
  height: 40px;
  border-radius: var(--md-sys-shape-corner-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.m3-avatar {
  width: 34px;
  height: 34px;
  border-radius: var(--md-sys-shape-corner-full);
  background: linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary));
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: var(--md-sys-elevation-level1);
}

.m3-content-wrapper {
  flex: 1;
  padding: 24px 32px 48px 32px;
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
  z-index: var(--z-header, 30);
  align-items: center;
  justify-content: space-around;
}

/* ================= 6. 移动端侧边抽屉内部结构 ================= */
.m3-mobile-drawer-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.m3-mobile-drawer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  cursor: pointer;
}

.m3-mobile-drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.m3-mobile-drawer-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  margin-top: auto;
}

.m3-nav-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  background: none;
  border: none;
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
    margin-left: 80px !important;
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
    margin-left: 256px;
  }
  .m3-main-container.is-rail-collapsed {
    margin-left: 80px;
  }
  .m3-desktop-top-bar {
    display: flex;
  }
}

/* 顶部操作区窄屏自适应 (< 1024px & < 768px 防溢出防重叠) */
@media (max-width: 1023.98px) {
  .m3-desktop-top-bar {
    padding: 0 16px;
    gap: 12px;
  }
  .m3-search-bar {
    max-width: 260px;
    min-width: 140px;
    padding: 0 12px;
  }
  .m3-search-bar__shortcut {
    display: none;
  }
  .m3-seed-picker {
    gap: 4px;
    padding: 3px 5px;
  }
  .m3-seed-dot {
    width: 16px;
    height: 16px;
  }
  .m3-topbar-divider {
    margin: 0 2px;
  }
}

@media (max-width: 767.98px) {
  .m3-desktop-top-bar {
    padding: 0 12px;
    gap: 8px;
  }
  .m3-search-bar {
    max-width: 180px;
    min-width: 120px;
  }
  .m3-seed-picker {
    gap: 3px;
    padding: 2px 4px;
  }
  .m3-seed-dot {
    width: 14px;
    height: 14px;
  }
}
</style>
