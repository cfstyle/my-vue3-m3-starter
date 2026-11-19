<script setup lang="ts">
import { MdCard, MdButton } from '@/components/m3'
import { useThemeStore } from '@/stores/theme'
import { Sun, Moon, Palette, Monitor, Shield, Smartphone } from 'lucide-vue-next'

const themeStore = useThemeStore()
</script>

<template>
  <div class="settings-view">
    <div class="page-header">
      <h1 class="headline-medium">偏好与系统设置</h1>
      <p class="body-medium text-secondary">个性化配置应用外观与运行参数</p>
    </div>

    <div class="settings-list">
      <!-- 主题外观设置 -->
      <MdCard variant="elevated" class="setting-card">
        <template #header>
          <div class="setting-card__header">
            <Palette :size="22" class="text-primary" />
            <span class="title-medium">主题与外观 (Material You)</span>
          </div>
        </template>

        <div class="theme-options">
          <div
            class="theme-box"
            :class="{ 'is-selected': !themeStore.isDark }"
            @click="themeStore.setTheme('light')"
          >
            <div class="theme-preview light">
              <Sun :size="24" />
            </div>
            <span class="label-large">浅色模式</span>
          </div>

          <div
            class="theme-box"
            :class="{ 'is-selected': themeStore.isDark }"
            @click="themeStore.setTheme('dark')"
          >
            <div class="theme-preview dark">
              <Moon :size="24" />
            </div>
            <span class="label-large">深色模式</span>
          </div>
        </div>
      </MdCard>

      <!-- 双端断点说明 -->
      <MdCard variant="outlined" class="setting-card">
        <template #header>
          <div class="setting-card__header">
            <Monitor :size="22" class="text-primary" />
            <span class="title-medium">断点规范与响应式设计</span>
          </div>
        </template>

        <div class="breakpoints-table">
          <div class="bp-row">
            <span class="bp-name label-large">Compact (手机端)</span>
            <span class="bp-range body-medium">&lt; 600px</span>
            <span class="bp-desc body-small text-secondary">底部 80px 导航栏 + 64px 顶栏 + 底部滑动抽屉</span>
          </div>
          <div class="bp-row">
            <span class="bp-name label-large">Medium (平板端)</span>
            <span class="bp-range body-medium">600px - 839px</span>
            <span class="bp-desc body-small text-secondary">左侧 80px 窄边导航轨 + 居中对话框</span>
          </div>
          <div class="bp-row">
            <span class="bp-name label-large">Expanded (桌面端)</span>
            <span class="bp-range body-medium">&gt;= 840px</span>
            <span class="bp-desc body-small text-secondary">左侧 260px 展开导航抽屉 + 居中阅读区域</span>
          </div>
        </div>
      </MdCard>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.text-secondary {
  color: var(--md-sys-color-on-surface-variant);
}

.text-primary {
  color: var(--md-sys-color-primary);
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-card {
  padding: 20px 24px;
}

.setting-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-options {
  display: flex;
  gap: 20px;
  margin-top: 12px;
}

.theme-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px;
  border-radius: var(--md-sys-shape-corner-medium);
  border: 2px solid transparent;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.theme-box.is-selected {
  border-color: var(--md-sys-color-primary);
  background-color: var(--md-sys-color-surface-container);
}

.theme-preview {
  width: 100px;
  height: 64px;
  border-radius: var(--md-sys-shape-corner-small);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.theme-box:hover .theme-preview {
  transform: scale(1.04);
}

.theme-preview.light {
  background-color: #fef7ff;
  color: #6750a4;
  border: 1px solid #cac4d0;
}

.theme-preview.dark {
  background-color: #141218;
  color: #d0bcff;
  border: 1px solid #49454f;
}

.breakpoints-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.bp-row {
  display: grid;
  grid-template-columns: 160px 140px 1fr;
  align-items: center;
  padding: 12px 14px;
  border-radius: var(--md-sys-shape-corner-small);
  background-color: var(--md-sys-color-surface-container-low);
}

@media (max-width: 600px) {
  .bp-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
