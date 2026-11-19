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

        <!-- 种子色切换区 (HCT 动态色板) -->
        <div class="seed-colors-section">
          <span class="label-large seed-title">HCT 动态种子色切换 (Tone 90 容器平衡)</span>
          <div class="seed-colors-grid">
            <button
              v-for="preset in themeStore.seedPresets"
              :key="preset.key"
              type="button"
              class="seed-color-pill md-state-layer"
              :class="{ 'is-active': themeStore.seedColor === preset.hex }"
              @click="themeStore.setSeedColor(preset.hex)"
            >
              <span class="seed-swatch" :style="{ backgroundColor: preset.hex }"></span>
              <span class="label-large">{{ preset.name }}</span>
            </button>
          </div>
        </div>

        <!-- 场景与密度切换区 -->
        <div class="context-density-section">
          <div class="setting-sub-group">
            <span class="label-large seed-title">场景预设 (Context Preset)</span>
            <div class="seed-colors-grid">
              <button
                type="button"
                class="seed-color-pill md-state-layer"
                :class="{ 'is-active': themeStore.layoutContext === 'admin' }"
                @click="themeStore.setLayoutContext('admin')"
              >
                <span class="label-large">后台工作台 (Admin, 16px 圆角)</span>
              </button>
              <button
                type="button"
                class="seed-color-pill md-state-layer"
                :class="{ 'is-active': themeStore.layoutContext === 'portal' }"
                @click="themeStore.setLayoutContext('portal')"
              >
                <span class="label-large">产品展示官网 (Portal, 24px 圆角)</span>
              </button>
            </div>
          </div>

          <div class="setting-sub-group">
            <span class="label-large seed-title">布局密度 (Density)</span>
            <div class="seed-colors-grid">
              <button
                type="button"
                class="seed-color-pill md-state-layer"
                :class="{ 'is-active': themeStore.density === 'comfortable' }"
                @click="themeStore.setDensity('comfortable')"
              >
                <span class="label-large">舒适 (Comfortable)</span>
              </button>
              <button
                type="button"
                class="seed-color-pill md-state-layer"
                :class="{ 'is-active': themeStore.density === 'compact' }"
                @click="themeStore.setDensity('compact')"
              >
                <span class="label-large">紧凑 (Compact)</span>
              </button>
            </div>
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

.seed-colors-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.context-density-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.setting-sub-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.seed-title {
  color: var(--md-sys-color-on-surface);
  font-weight: 600;
}

.seed-colors-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.seed-color-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
  transition: all 0.2s ease;
}

.seed-color-pill.is-active {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border-color: var(--md-sys-color-primary);
  font-weight: 600;
}

.seed-swatch {
  width: 18px;
  height: 18px;
  border-radius: var(--md-sys-shape-corner-full);
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1px var(--md-sys-color-outline-variant);
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
