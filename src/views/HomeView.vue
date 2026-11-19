<script setup lang="ts">
import { useRouter } from 'vue-router'
import { MdButton, MdCard } from '@/components/m3'
import { Sparkles, ArrowRight } from 'lucide-vue-next'

const router = useRouter()

const goToPlayground = () => {
  router.push('/playground')
}
</script>

<template>
  <div class="home-view">
    <!-- 顶部业务标题栏 -->
    <header class="page-header">
      <h1 class="headline-large">工作台概览</h1>
      <p class="body-large text-secondary">
        Material Design 3 纯净工程底座已就绪，可在此开始构建你的核心业务。
      </p>
    </header>

    <!-- 欢迎与起步指引卡片 -->
    <section class="starter-section">
      <MdCard variant="elevated" class="welcome-card">
        <template #header>
          <div class="welcome-card__header">
            <div class="badge-icon">
              <Sparkles :size="20" />
            </div>
            <div>
              <h2 class="title-large">开箱即用的 M3 架构</h2>
              <span class="body-small text-secondary">已配置双端自适应外壳、主题切换及 Design Tokens</span>
            </div>
          </div>
        </template>

        <div class="welcome-card__body">
          <p class="body-medium">
            当前页面为业务默认起步页。你可以直接修改本文件编写业务逻辑，也可以查阅组件演练场获取 <code>MdButton</code>、<code>MdCard</code>、<code>AdaptiveModal</code> 等基础组件的用法与参数示例。
          </p>
        </div>

        <template #actions>
          <MdButton variant="tonal" @click="goToPlayground">
            <template #icon><Sparkles /></template>
            打开组件演练场 (/playground)
            <template #trailingIcon><ArrowRight /></template>
          </MdButton>
        </template>
      </MdCard>

      <!-- 预留的业务空白容器插槽 -->
      <div class="empty-workspace-slot">
        <span class="body-medium text-secondary">业务内容区域（可在此放置你的图表、列表或看板）</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
}

.text-secondary {
  color: var(--md-sys-color-on-surface-variant);
}

.starter-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-card {
  padding: 24px;
}

.welcome-card__header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.badge-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--md-sys-shape-corner-medium);
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.welcome-card__body {
  margin-top: 8px;
  line-height: 1.6;
}

.welcome-card__body code {
  padding: 2px 6px;
  border-radius: var(--md-sys-shape-corner-extra-small);
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-primary);
  font-family: monospace;
}

.empty-workspace-slot {
  min-height: 280px;
  border: 2px dashed var(--md-sys-color-outline-variant);
  border-radius: var(--md-sys-shape-corner-large);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--md-sys-color-surface-container-lowest);
}
</style>
