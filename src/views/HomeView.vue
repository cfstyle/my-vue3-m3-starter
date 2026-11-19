<script setup lang="ts">
import { useRouter } from 'vue-router'
import { MdButton, MdCard } from '@/components/m3'
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
  RefreshCw
} from 'lucide-vue-next'

const router = useRouter()

const goToPlayground = () => {
  router.push('/playground')
}

// 顶部 3 组轻量商业指标卡
const kpiStats = [
  {
    title: '全平台活跃会话',
    value: '42,850',
    trend: '+14.2%',
    isPositive: true,
    icon: Activity,
    badgeBg: 'var(--md-sys-color-primary-container)',
    badgeColor: 'var(--md-sys-color-primary)'
  },
  {
    title: '实时吞吐峰值',
    value: '1.85 GB/s',
    trend: '+8.6%',
    isPositive: true,
    icon: Zap,
    badgeBg: 'var(--md-sys-color-tertiary-container)',
    badgeColor: 'var(--md-sys-color-tertiary)'
  },
  {
    title: '服务可用性 SLI',
    value: '99.98%',
    trend: '稳定运行',
    isPositive: true,
    icon: ShieldCheck,
    badgeBg: 'var(--md-sys-color-secondary-container)',
    badgeColor: 'var(--md-sys-color-secondary)'
  }
]

// 模拟最近系统动态与任务列表
const recentActivities = [
  {
    id: 1,
    title: '动态 HCT 调色系统初始化',
    category: '设计系统',
    user: 'Design System Engine',
    time: '刚刚',
    status: '就绪',
    statusType: 'success'
  },
  {
    id: 2,
    title: '自适应双轨外壳 (Adaptive + Portal) 路由挂载',
    category: '布局架构',
    user: 'Route Manager',
    time: '12 分钟前',
    status: '成功',
    statusType: 'success'
  },
  {
    id: 3,
    title: '多断点响应式抽屉与导航轨平滑折叠构建',
    category: 'UI 交互',
    user: 'Navigation Kernel',
    time: '36 分钟前',
    status: '成功',
    statusType: 'success'
  },
  {
    id: 4,
    title: 'M3 Tokens 语义化变量全量注入 :root 容器',
    category: '色彩引擎',
    user: 'Material Theme Store',
    time: '1 小时前',
    status: '完成',
    statusType: 'neutral'
  }
]
</script>

<template>
  <div class="home-view">
    <!-- 顶部业务标题栏 -->
    <header class="page-header">
      <div class="page-header__main">
        <h1 class="headline-large">工作台概览</h1>
        <p class="body-large text-secondary">
          Material Design 3 纯净工程底座已就绪，已融合 HCT 调色算法与双轨自适应外壳。
        </p>
      </div>

      <div class="page-header__actions">
        <MdButton variant="tonal" @click="goToPlayground">
          <template #icon><Sparkles /></template>
          组件演练场
          <template #trailingIcon><ArrowRight /></template>
        </MdButton>
      </div>
    </header>

    <!-- 1. 顶部 3 张轻量业务指标卡 -->
    <section class="kpi-grid">
      <MdCard
        v-for="(kpi, index) in kpiStats"
        :key="index"
        variant="elevated"
        clickable
        class="kpi-card"
      >
        <div class="kpi-card__top">
          <div
            class="kpi-badge"
            :style="{ backgroundColor: kpi.badgeBg, color: kpi.badgeColor }"
          >
            <component :is="kpi.icon" :size="20" />
          </div>

          <div class="kpi-trend label-medium" :class="{ 'is-positive': kpi.isPositive }">
            <TrendingUp v-if="kpi.isPositive" :size="14" />
            <span class="tabular-nums">{{ kpi.trend }}</span>
          </div>
        </div>

        <div class="kpi-card__bottom">
          <span class="kpi-label label-medium">{{ kpi.title }}</span>
          <span class="kpi-val display-small tabular-nums">{{ kpi.value }}</span>
        </div>
      </MdCard>
    </section>

    <!-- 2. 下方极简、可直接复用的最近动态/任务列表卡片 -->
    <section class="activity-section">
      <MdCard variant="elevated" class="activity-card">
        <template #header>
          <div class="activity-header">
            <div class="activity-header__text">
              <div class="activity-title-row">
                <Layers :size="20" class="text-primary" />
                <h2 class="title-large">最近业务动态与就绪任务</h2>
              </div>
              <span class="body-small text-secondary">
                实时追踪核心模块状态与生命周期事件，开箱即用的轻量看板骨架。
              </span>
            </div>

            <div class="activity-header__action">
              <button
                type="button"
                class="refresh-button md-state-layer"
                title="刷新状态"
              >
                <RefreshCw :size="16" />
              </button>
            </div>
          </div>
        </template>

        <!-- 列表内容区 -->
        <div class="activity-list">
          <div
            v-for="item in recentActivities"
            :key="item.id"
            class="activity-item md-state-layer"
          >
            <div class="activity-item__left">
              <div
                class="status-indicator"
                :class="`status-indicator--${item.statusType}`"
              >
                <CheckCircle2 v-if="item.statusType === 'success'" :size="16" />
                <Clock v-else :size="16" />
              </div>
              <div class="activity-item__info">
                <span class="body-medium activity-item__title">{{ item.title }}</span>
                <div class="activity-item__meta body-small text-secondary">
                  <span class="meta-tag">{{ item.category }}</span>
                  <span class="meta-dot">·</span>
                  <span>{{ item.user }}</span>
                </div>
              </div>
            </div>

            <div class="activity-item__right">
              <span class="status-pill label-small" :class="`status-pill--${item.statusType}`">
                {{ item.status }}
              </span>
              <span class="body-small text-secondary tabular-nums">{{ item.time }}</span>
            </div>
          </div>
        </div>

        <template #actions>
          <div class="activity-footer">
            <span class="body-small text-secondary">
              显示最新 4 条动态 · 完整审计与监控已就绪
            </span>
            <MdButton variant="text" @click="goToPlayground">
              查看全部组件
              <template #trailingIcon><ArrowUpRight /></template>
            </MdButton>
          </div>
        </template>
      </MdCard>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 顶部页眉 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding: 4px 0;
}

.page-header__main {
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

/* 1. 顶部 3 列 KPI 卡片 */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 839.98px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}

.kpi-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}

.kpi-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-badge {
  width: 40px;
  height: 40px;
  border-radius: var(--md-sys-shape-corner-medium, 12px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
  font-weight: 600;
}

.kpi-trend.is-positive {
  background-color: rgba(27, 135, 63, 0.12);
  color: #1b873f;
}

[data-theme="dark"] .kpi-trend.is-positive {
  background-color: rgba(74, 222, 128, 0.16);
  color: #4ade80;
}

.kpi-card__bottom {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-label {
  color: var(--md-sys-color-on-surface-variant);
}

.kpi-val {
  font-weight: 700;
  color: var(--md-sys-color-on-surface);
  line-height: 1.15;
}

/* 2. 动态与任务列表卡片 */
.activity-section {
  width: 100%;
}

.activity-card {
  padding: 24px;
}

.activity-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.activity-header__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--md-sys-color-on-surface);
}

.refresh-button {
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

.refresh-button:hover {
  color: var(--md-sys-color-on-surface);
}

.activity-list {
  display: flex;
  flex-direction: column;
  divide-y: 1px solid var(--md-sys-color-outline-variant);
  margin-top: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 12px;
  border-radius: var(--md-sys-shape-corner-medium, 12px);
  gap: 16px;
  transition: background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.activity-item:hover {
  background-color: var(--md-sys-color-surface-container-high);
}

.activity-item__left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.status-indicator {
  width: 28px;
  height: 28px;
  border-radius: var(--md-sys-shape-corner-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-indicator--success {
  background-color: rgba(27, 135, 63, 0.12);
  color: #1b873f;
}

[data-theme="dark"] .status-indicator--success {
  background-color: rgba(74, 222, 128, 0.16);
  color: #4ade80;
}

.status-indicator--neutral {
  background-color: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-on-surface-variant);
}

.activity-item__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.activity-item__title {
  color: var(--md-sys-color-on-surface);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-item__meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-tag {
  color: var(--md-sys-color-primary);
  font-weight: 500;
}

.meta-dot {
  opacity: 0.5;
}

.activity-item__right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.status-pill {
  padding: 2px 10px;
  border-radius: var(--md-sys-shape-corner-full);
  font-weight: 600;
}

.status-pill--success {
  background-color: rgba(27, 135, 63, 0.12);
  color: #1b873f;
}

[data-theme="dark"] .status-pill--success {
  background-color: rgba(74, 222, 128, 0.16);
  color: #4ade80;
}

.status-pill--neutral {
  background-color: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-on-surface-variant);
}

.activity-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 8px;
}
</style>
