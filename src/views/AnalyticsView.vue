<script setup lang="ts">
import { MdCard, MdButton } from '@/components/m3'
import { BarChart2, TrendingUp, Filter, Download } from 'lucide-vue-next'
</script>

<template>
  <div class="analytics-view">
    <div class="page-header">
      <div>
        <h1 class="headline-medium">数据分析中心</h1>
        <p class="body-medium text-secondary">全维度实时流量与性能监控</p>
      </div>
      <div class="header-actions">
        <MdButton variant="outlined">
          <template #icon><Filter /></template>
          筛选周期
        </MdButton>
        <MdButton variant="filled">
          <template #icon><Download /></template>
          导出报表
        </MdButton>
      </div>
    </div>

    <div class="analytics-grid">
      <MdCard variant="elevated" class="chart-card">
        <template #header>
          <div class="card-title-bar">
            <span class="title-medium">周访问吞吐趋势</span>
            <span class="label-medium text-secondary">近 7 天</span>
          </div>
        </template>
        <div class="chart-placeholder">
          <BarChart2 :size="48" class="text-secondary" />
          <span class="body-medium text-secondary">数据可视化渲染区 (基于 M3 配色调色板)</span>
        </div>
      </MdCard>

      <MdCard variant="filled" class="chart-card">
        <template #header>
          <div class="card-title-bar">
            <span class="title-medium">各端自适应占比</span>
            <span class="label-medium text-secondary">实时</span>
          </div>
        </template>
        <div class="ratio-list">
          <div class="ratio-item">
            <div class="ratio-label">
              <span class="body-medium">桌面宽屏 (>= 840px)</span>
              <span class="label-large">54%</span>
            </div>
            <div class="ratio-bar-track">
              <div class="ratio-bar-fill" style="width: 54%;"></div>
            </div>
          </div>

          <div class="ratio-item">
            <div class="ratio-label">
              <span class="body-medium">移动移动端 (&lt; 600px)</span>
              <span class="label-large">36%</span>
            </div>
            <div class="ratio-bar-track">
              <div class="ratio-bar-fill secondary" style="width: 36%;"></div>
            </div>
          </div>

          <div class="ratio-item">
            <div class="ratio-label">
              <span class="body-medium">平板窄边 (600px - 839px)</span>
              <span class="label-large">10%</span>
            </div>
            <div class="ratio-bar-track">
              <div class="ratio-bar-fill tertiary" style="width: 10%;"></div>
            </div>
          </div>
        </div>
      </MdCard>
    </div>
  </div>
</template>

<style scoped>
.analytics-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.text-secondary {
  color: var(--md-sys-color-on-surface-variant);
}

.analytics-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

@media (max-width: 839.98px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  padding: 20px;
}

.card-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-placeholder {
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 2px dashed var(--md-sys-color-outline-variant);
  border-radius: var(--md-sys-shape-corner-medium);
  margin-top: 12px;
}

.ratio-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 12px;
}

.ratio-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ratio-label {
  display: flex;
  justify-content: space-between;
}

.ratio-bar-track {
  height: 8px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-surface-container);
  overflow: hidden;
}

.ratio-bar-fill {
  height: 100%;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-primary);
}

.ratio-bar-fill.secondary {
  background-color: var(--md-sys-color-secondary);
}

.ratio-bar-fill.tertiary {
  background-color: var(--md-sys-color-tertiary);
}
</style>
