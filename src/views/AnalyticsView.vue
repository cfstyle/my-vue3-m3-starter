<script setup lang="ts">
import { ref, computed } from 'vue'
import { MdCard, MdButton } from '@/components/m3'
import {
  TrendingUp,
  Filter,
  Download,
  Zap,
  Activity,
  CheckCircle2,
  ShieldAlert,
  Layers
} from 'lucide-vue-next'

interface MetricPoint {
  day: string
  date: string
  fullDate: string
  requests: number // 次数
  requestsDisplay: string
  successRate: number // 百分比 (0 - 100)
  avgLatency: number // 毫秒
  isPeak?: boolean
  status2xx: number
  status3xx: number
  status4xx: number
  status5xx: number
}

// 7天时序指标数据源
const raw7dData: MetricPoint[] = [
  {
    day: '周一',
    date: '11-13',
    fullDate: '2026-11-13 (周一)',
    requests: 420500,
    requestsDisplay: '420.5K',
    successRate: 99.82,
    avgLatency: 45,
    status2xx: 412000,
    status3xx: 6000,
    status4xx: 2100,
    status5xx: 400
  },
  {
    day: '周二',
    date: '11-14',
    fullDate: '2026-11-14 (周二)',
    requests: 562300,
    requestsDisplay: '562.3K',
    successRate: 99.75,
    avgLatency: 48,
    status2xx: 551000,
    status3xx: 8500,
    status4xx: 2300,
    status5xx: 500
  },
  {
    day: '周三',
    date: '11-15',
    fullDate: '2026-11-15 (周三)',
    requests: 714800,
    requestsDisplay: '714.8K',
    successRate: 99.91,
    avgLatency: 39,
    status2xx: 703000,
    status3xx: 9800,
    status4xx: 1800,
    status5xx: 200
  },
  {
    day: '周四',
    date: '11-16',
    fullDate: '2026-11-16 (周四)',
    requests: 645100,
    requestsDisplay: '645.1K',
    successRate: 99.68,
    avgLatency: 52,
    status2xx: 631000,
    status3xx: 10500,
    status4xx: 3100,
    status5xx: 500
  },
  {
    day: '周五',
    date: '11-17',
    fullDate: '2026-11-17 (周五)',
    requests: 882400,
    requestsDisplay: '882.4K',
    successRate: 99.88,
    avgLatency: 41,
    status2xx: 868000,
    status3xx: 11000,
    status4xx: 2900,
    status5xx: 500
  },
  {
    day: '周六',
    date: '11-18',
    fullDate: '2026-11-18 (周六)',
    requests: 821900,
    requestsDisplay: '821.9K',
    successRate: 99.94,
    avgLatency: 36,
    status2xx: 811000,
    status3xx: 9200,
    status4xx: 1500,
    status5xx: 200
  },
  {
    day: '周日',
    date: '11-19',
    fullDate: '2026-11-19 (周日)',
    requests: 980200,
    requestsDisplay: '980.2K',
    successRate: 99.89,
    avgLatency: 38,
    isPeak: true,
    status2xx: 965000,
    status3xx: 12000,
    status4xx: 2800,
    status5xx: 400
  }
]

// 周期微胶囊
type PeriodKey = '7d' | '30d' | '90d'
const activePeriod = ref<PeriodKey>('7d')
const periods = [
  { key: '7d' as PeriodKey, label: '7 天' },
  { key: '30d' as PeriodKey, label: '30 天' },
  { key: '90d' as PeriodKey, label: '90 天' }
]

const periodSummary = computed(() => {
  if (activePeriod.value === '30d') {
    return { total: '21.4 M', success: '99.88%', trend: '+14.2%' }
  }
  if (activePeriod.value === '90d') {
    return { total: '68.2 M', success: '99.91%', trend: '+22.6%' }
  }
  return { total: '5.03 M', success: '99.85%', trend: '+18.4%' }
})

// 图表交互 Hover 状态索引 (默认高亮峰值周日索引 6)
const hoveredIndex1 = ref<number | null>(6)
const hoveredIndex2 = ref<number | null>(6)

// ============================================================================
// 图表 1: 双 Y 轴 SVG 几何映射计算 (680 × 260)
// ============================================================================
const C1_VIEW_W = 680
const C1_VIEW_H = 260
const C1_PAD_L = 52
const C1_PAD_R = 48
const C1_PAD_T = 20
const C1_PAD_B = 40
const C1_PLOT_W = C1_VIEW_W - C1_PAD_L - C1_PAD_R // 580
const C1_PLOT_H = C1_VIEW_H - C1_PAD_T - C1_PAD_B // 200
const C1_BASELINE = C1_PAD_T + C1_PLOT_H // 220
const C1_STEP = C1_PLOT_W / raw7dData.length // 82.857
const C1_MAX_REQ = 1000000 // 1.0M

// 计算图表 1 柱体与折线点
const c1Items = computed(() => {
  return raw7dData.map((d, i) => {
    const cx = C1_PAD_L + (i + 0.5) * C1_STEP
    const barW = 32
    const barX = cx - barW / 2
    const barH = (d.requests / C1_MAX_REQ) * C1_PLOT_H
    const barY = C1_BASELINE - barH

    // 成功率折线点映射：0% - 100% 纵向映射
    // (为了突出在 99%~100% 区间的起伏，采用视觉放大的平滑映射：99.0% - 100.0%)
    const minRate = 99.0
    const maxRate = 100.0
    const rateRatio = Math.max(0, Math.min(1, (d.successRate - minRate) / (maxRate - minRate)))
    const lineY = C1_PAD_T + (1 - rateRatio) * (C1_PLOT_H * 0.75) + 10

    return {
      ...d,
      cx,
      barX,
      barW,
      barY,
      barH,
      lineY
    }
  })
})

// 平滑三阶贝塞尔曲线生成
const c1LinePath = computed(() => {
  const pts = c1Items.value.map((item) => ({ x: item.cx, y: item.lineY }))
  if (pts.length === 0) return ''
  const first = pts[0]
  if (!first) return ''
  let d = `M ${first.x.toFixed(1)} ${first.y.toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i]
    const p1 = pts[i + 1]
    if (!p0 || !p1) continue
    const mx = (p0.x + p1.x) / 2
    d += ` C ${mx.toFixed(1)} ${p0.y.toFixed(1)}, ${mx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`
  }
  return d
})

// 曲线下方微光渐变区域闭合
const c1AreaPath = computed(() => {
  const pts = c1Items.value.map((item) => ({ x: item.cx, y: item.lineY }))
  if (pts.length === 0) return ''
  const first = pts[0]
  const last = pts[pts.length - 1]
  if (!first || !last) return ''
  return `${c1LinePath.value} L ${last.x.toFixed(1)} ${C1_BASELINE} L ${first.x.toFixed(1)} ${C1_BASELINE} Z`
})

// 当前高亮数据项
const hoveredPoint1 = computed(() => {
  if (hoveredIndex1.value === null) return null
  return c1Items.value[hoveredIndex1.value] ?? null
})

// ============================================================================
// 图表 2: 多系列堆叠 SVG 柱状图计算 (380 × 260)
// ============================================================================
const C2_VIEW_W = 380
const C2_VIEW_H = 260
const C2_PAD_L = 44
const C2_PAD_R = 16
const C2_PAD_T = 20
const C2_PAD_B = 40
const C2_PLOT_W = C2_VIEW_W - C2_PAD_L - C2_PAD_R // 320
const C2_PLOT_H = C2_VIEW_H - C2_PAD_T - C2_PAD_B // 200
const C2_BASELINE = C2_PAD_T + C2_PLOT_H // 220
const C2_STEP = C2_PLOT_W / raw7dData.length // 45.714

const c2Items = computed(() => {
  return raw7dData.map((d, i) => {
    const cx = C2_PAD_L + (i + 0.5) * C2_STEP
    const barW = 22
    const barX = cx - barW / 2
    const total = d.status2xx + d.status3xx + d.status4xx + d.status5xx
    const totalH = (total / C1_MAX_REQ) * C2_PLOT_H

    // 堆叠各段高度 (为低频异常段赋予最小视觉高度 3px，确保不失真)
    const h5 = Math.max(3, (d.status5xx / total) * totalH)
    const h4 = Math.max(3, (d.status4xx / total) * totalH)
    const h3 = Math.max(4, (d.status3xx / total) * totalH)
    const h2 = Math.max(8, totalH - h3 - h4 - h5)

    const y2 = C2_BASELINE - h2
    const y3 = y2 - h3
    const y4 = y3 - h4
    const y5 = y4 - h5

    return {
      ...d,
      cx,
      barX,
      barW,
      total,
      seg2: { y: y2, h: h2 },
      seg3: { y: y3, h: h3 },
      seg4: { y: y4, h: h4 },
      seg5: { y: y5, h: h5 }
    }
  })
})

const hoveredPoint2 = computed(() => {
  if (hoveredIndex2.value === null) return null
  return c2Items.value[hoveredIndex2.value] ?? null
})

// Y 轴刻度标签
const c1LeftYTicks = ['1.0M', '750K', '500K', '250K', '0']
const c1RightYTicks = ['100%', '99.75%', '99.5%', '99.25%', '99.0%']
const c2YTicks = ['1.0M', '750K', '500K', '250K', '0']
</script>

<template>
  <div class="analytics-view">
    <!-- 页面标题与顶部操作栏 -->
    <div class="page-header">
      <div>
        <h1 class="type-title-lg">数据分析中心</h1>
        <p class="type-body text-secondary">Google AI Studio 级全维度实时流量与性能监控</p>
      </div>
      <div class="header-actions">
        <!-- 周期切换微胶囊 -->
        <div class="period-switcher">
          <button
            v-for="p in periods"
            :key="p.key"
            type="button"
            class="period-capsule type-meta md-state-layer"
            :class="{ 'is-active': activePeriod === p.key }"
            @click="activePeriod = p.key"
          >
            {{ p.label }}
          </button>
        </div>

        <MdButton variant="outlined">
          <template #icon><Filter :size="16" /></template>
          高级筛选
        </MdButton>
        <MdButton variant="filled">
          <template #icon><Download :size="16" /></template>
          导出报表
        </MdButton>
      </div>
    </div>

    <!-- 主图表网格区 -->
    <div class="analytics-grid">
      <!-- ====================================================================
           1. 左侧：API / 业务请求总览 (双 Y 轴组合 SVG 图表)
           ==================================================================== -->
      <MdCard variant="elevated" class="chart-card">
        <template #header>
          <div class="card-title-bar">
            <div class="card-title-group">
              <span class="type-title-md">API / 业务请求总览</span>
              <span class="type-meta text-secondary">吞吐量 & 成功率</span>
            </div>

            <!-- 顶部轻量 KPI 摘要 -->
            <div class="throughput-summary">
              <div class="summary-item">
                <span class="type-meta text-secondary">总吞吐量</span>
                <span class="type-title-md tabular-nums font-bold">{{ periodSummary.total }}</span>
              </div>
              <div class="summary-item">
                <span class="type-meta text-secondary">平均成功率</span>
                <span class="type-title-md tabular-nums font-bold text-success">{{ periodSummary.success }}</span>
              </div>
              <div class="summary-pill type-meta whitespace-nowrap shrink-0">
                <TrendingUp :size="14" />
                <span class="tabular-nums">{{ periodSummary.trend }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- 双 Y 轴 SVG 绘图容器 -->
        <div class="svg-chart-container">
          <!-- 悬浮准星卡片 (Floating Tooltip) -->
          <div
            v-if="hoveredPoint1"
            class="chart-tooltip-floating"
            :style="{
              left: `${(hoveredPoint1.cx / C1_VIEW_W) * 100}%`,
              transform: hoveredPoint1.cx > (C1_VIEW_W / 2) ? 'translate(-105%, 8px)' : 'translate(12px, 8px)'
            }"
          >
            <div class="tooltip-header">
              <span class="type-body font-bold whitespace-nowrap">{{ hoveredPoint1.fullDate }}</span>
              <span v-if="hoveredPoint1.isPeak" class="peak-tag type-meta whitespace-nowrap shrink-0">吞吐峰值</span>
            </div>
            <div class="tooltip-divider"></div>
            <div class="tooltip-metrics">
              <div class="metric-row">
                <span class="legend-shape shape-square bg-primary"></span>
                <span class="type-meta text-secondary whitespace-nowrap">请求吞吐量</span>
                <span class="type-meta tabular-nums font-bold ml-auto whitespace-nowrap">
                  {{ hoveredPoint1.requests.toLocaleString() }} 次
                </span>
              </div>
              <div class="metric-row">
                <span class="legend-shape shape-circle bg-success"></span>
                <span class="type-meta text-secondary whitespace-nowrap">接口成功率</span>
                <span class="type-meta tabular-nums font-bold text-success ml-auto whitespace-nowrap">
                  {{ hoveredPoint1.successRate }}%
                </span>
              </div>
              <div class="metric-row">
                <Activity :size="12" class="text-secondary" />
                <span class="type-meta text-secondary whitespace-nowrap">平均时延</span>
                <span class="type-meta tabular-nums font-bold ml-auto whitespace-nowrap">
                  {{ hoveredPoint1.avgLatency }} ms
                </span>
              </div>
            </div>
          </div>

          <!-- 原生 SVG 双轴图表 -->
          <svg
            :viewBox="`0 0 ${C1_VIEW_W} ${C1_VIEW_H}`"
            class="chart-svg"
            preserveAspectRatio="xMidYMid meet"
            @mouseleave="hoveredIndex1 = 6"
          >
            <defs>
              <!-- 成功率折线下方柔和微光渐变 -->
              <linearGradient id="c1SuccessAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--chart-success)" stop-opacity="0.16" />
                <stop offset="100%" stop-color="var(--chart-success)" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- 1. 背景水平极细参考网格线 (5 等分) -->
            <g class="svg-grid-lines">
              <line
                v-for="(tick, idx) in c1LeftYTicks"
                :key="tick"
                :x1="C1_PAD_L"
                :y1="C1_PAD_T + idx * 50"
                :x2="C1_VIEW_W - C1_PAD_R"
                :y2="C1_PAD_T + idx * 50"
                stroke="var(--md-sys-color-outline-variant)"
                stroke-width="1"
                stroke-dasharray="3 3"
                opacity="0.5"
              />
            </g>

            <!-- 2. 左侧 Y 轴刻度文字 (吞吐量) -->
            <g class="svg-y-axis-left">
              <text
                v-for="(tick, idx) in c1LeftYTicks"
                :key="tick"
                :x="C1_PAD_L - 8"
                :y="C1_PAD_T + idx * 50 + 4"
                text-anchor="end"
                class="svg-axis-text label-small tabular-nums"
              >
                {{ tick }}
              </text>
            </g>

            <!-- 3. 右侧 Y 轴刻度文字 (成功率) -->
            <g class="svg-y-axis-right">
              <text
                v-for="(tick, idx) in c1RightYTicks"
                :key="tick"
                :x="C1_VIEW_W - C1_PAD_R + 8"
                :y="C1_PAD_T + idx * 50 + 4"
                text-anchor="start"
                class="svg-axis-text label-small tabular-nums text-success"
              >
                {{ tick }}
              </text>
            </g>

            <!-- 4. 吞吐量柱状图 -->
            <g class="svg-bars-group">
              <g
                v-for="(item, idx) in c1Items"
                :key="item.day"
                class="svg-bar-unit"
              >
                <rect
                  :x="item.barX"
                  :y="item.barY"
                  :width="item.barW"
                  :height="item.barH"
                  rx="4"
                  ry="4"
                  :class="[
                    'svg-bar-rect',
                    {
                      'is-peak': item.isPeak,
                      'is-active': hoveredIndex1 === idx
                    }
                  ]"
                />
              </g>
            </g>

            <!-- 5. 成功率平滑折线与区域渐变 -->
            <path :d="c1AreaPath" fill="url(#c1SuccessAreaGrad)" />
            <path
              :d="c1LinePath"
              fill="none"
              stroke="var(--chart-success)"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- 6. 成功率数据锚点圆圈 -->
            <g class="svg-line-points">
              <circle
                v-for="(item, idx) in c1Items"
                :key="item.day"
                :cx="item.cx"
                :cy="item.lineY"
                :r="hoveredIndex1 === idx ? 5 : 3.5"
                fill="var(--chart-success)"
                stroke="var(--md-sys-color-surface)"
                stroke-width="2"
                class="svg-line-point"
              />
            </g>

            <!-- 7. 垂直虚线交互准星 (Crosshair) -->
            <line
              v-if="hoveredPoint1"
              :x1="hoveredPoint1.cx"
              :y1="C1_PAD_T"
              :x2="hoveredPoint1.cx"
              :y2="C1_BASELINE"
              stroke="var(--md-sys-color-primary)"
              stroke-width="1.2"
              stroke-dasharray="3 3"
              class="svg-crosshair"
            />

            <!-- 8. X 轴时间标签 -->
            <g class="svg-x-axis">
              <text
                v-for="(item, idx) in c1Items"
                :key="item.day"
                :x="item.cx"
                :y="C1_BASELINE + 18"
                text-anchor="middle"
                :class="['svg-x-text', 'label-small', { 'is-active': hoveredIndex1 === idx }]"
              >
                {{ item.day }}
              </text>
              <text
                v-for="item in c1Items"
                :key="item.date"
                :x="item.cx"
                :y="C1_BASELINE + 32"
                text-anchor="middle"
                class="svg-x-subtext label-small text-secondary tabular-nums"
              >
                {{ item.date }}
              </text>
            </g>

            <!-- 9. 鼠标触发透明交互感应区 (防抖拾取) -->
            <rect
              v-for="(item, idx) in c1Items"
              :key="idx"
              :x="C1_PAD_L + idx * C1_STEP"
              :y="C1_PAD_T"
              :width="C1_STEP"
              :height="C1_PLOT_H"
              fill="transparent"
              class="svg-hitbox"
              @mouseenter="hoveredIndex1 = idx"
            />
          </svg>
        </div>

        <!-- 底部图例说明与信息摘要 -->
        <div class="chart-legend-row">
          <div class="legend-item type-meta text-secondary whitespace-nowrap shrink-0">
            <span class="legend-shape shape-square bg-primary"></span>
            <span>请求吞吐量 (Throughput, 默认主色)</span>
          </div>
          <div class="legend-item type-meta text-secondary whitespace-nowrap shrink-0">
            <span class="legend-shape shape-circle bg-success"></span>
            <span>接口成功率 (Success Rate, 语义绿)</span>
          </div>
          <div class="legend-item type-meta text-secondary ml-auto whitespace-nowrap shrink-0">
            <Zap :size="14" class="text-primary" />
            <span>实时聚合 · 采样周期 1m</span>
          </div>
        </div>
      </MdCard>

      <!-- ====================================================================
           2. 右侧：异常与状态分布 (多系列堆叠 SVG 柱状图)
           ==================================================================== -->
      <MdCard variant="elevated" class="chart-card">
        <template #header>
          <div class="card-title-bar">
            <div class="card-title-group">
              <span class="type-title-md">异常与状态分布</span>
              <span class="type-meta text-secondary whitespace-nowrap">HTTP Code 堆叠</span>
            </div>
            <div class="summary-pill success type-meta font-bold whitespace-nowrap shrink-0">
              <CheckCircle2 :size="14" />
              <span class="tabular-nums">可用性 99.89%</span>
            </div>
          </div>
        </template>

        <!-- 堆叠柱状图 SVG 绘图区 -->
        <div class="svg-chart-container">
          <!-- 悬浮准星卡片 (Floating Tooltip) -->
          <div
            v-if="hoveredPoint2"
            class="chart-tooltip-floating"
            :style="{
              left: `${(hoveredPoint2.cx / C2_VIEW_W) * 100}%`,
              transform: hoveredPoint2.cx > (C2_VIEW_W / 2) ? 'translate(-105%, 8px)' : 'translate(12px, 8px)'
            }"
          >
            <div class="tooltip-header">
              <span class="type-body font-bold whitespace-nowrap">{{ hoveredPoint2.fullDate }}</span>
            </div>
            <div class="tooltip-divider"></div>
            <div class="tooltip-metrics">
              <div class="metric-row">
                <span class="legend-shape shape-circle bg-success"></span>
                <span class="type-meta text-secondary whitespace-nowrap">2xx 正常响应</span>
                <span class="type-meta tabular-nums font-bold text-success ml-auto whitespace-nowrap">
                  {{ hoveredPoint2.status2xx.toLocaleString() }}
                </span>
              </div>
              <div class="metric-row">
                <span class="legend-shape shape-square bg-secondary"></span>
                <span class="type-meta text-secondary whitespace-nowrap">3xx 缓存重定向</span>
                <span class="type-meta tabular-nums font-bold ml-auto whitespace-nowrap">
                  {{ hoveredPoint2.status3xx.toLocaleString() }}
                </span>
              </div>
              <div class="metric-row">
                <span class="legend-shape shape-diamond bg-warning"></span>
                <span class="type-meta text-secondary whitespace-nowrap">4xx 客户端异常</span>
                <span class="type-meta tabular-nums font-bold text-warning ml-auto whitespace-nowrap">
                  {{ hoveredPoint2.status4xx.toLocaleString() }}
                </span>
              </div>
              <div class="metric-row">
                <span class="legend-shape shape-triangle bg-error"></span>
                <span class="type-meta text-secondary whitespace-nowrap">5xx 服务端错误</span>
                <span class="type-meta tabular-nums font-bold text-error ml-auto whitespace-nowrap">
                  {{ hoveredPoint2.status5xx.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>

          <!-- 原生 SVG 堆叠图 -->
          <svg
            :viewBox="`0 0 ${C2_VIEW_W} ${C2_VIEW_H}`"
            class="chart-svg"
            preserveAspectRatio="xMidYMid meet"
            @mouseleave="hoveredIndex2 = 6"
          >
            <!-- 1. 背景水平极细虚线 -->
            <g class="svg-grid-lines">
              <line
                v-for="(tick, idx) in c2YTicks"
                :key="tick"
                :x1="C2_PAD_L"
                :y1="C2_PAD_T + idx * 50"
                :x2="C2_VIEW_W - C2_PAD_R"
                :y2="C2_PAD_T + idx * 50"
                stroke="var(--md-sys-color-outline-variant)"
                stroke-width="1"
                stroke-dasharray="3 3"
                opacity="0.5"
              />
            </g>

            <!-- 2. Y 轴刻度文字 -->
            <g class="svg-y-axis-left">
              <text
                v-for="(tick, idx) in c2YTicks"
                :key="tick"
                :x="C2_PAD_L - 8"
                :y="C2_PAD_T + idx * 50 + 4"
                text-anchor="end"
                class="svg-axis-text label-small tabular-nums"
              >
                {{ tick }}
              </text>
            </g>

            <!-- 3. 多系列堆叠柱体 (2xx -> 3xx -> 4xx -> 5xx) -->
            <g class="svg-stacked-bars">
              <g
                v-for="(item, idx) in c2Items"
                :key="item.day"
                :class="['svg-stack-unit', { 'is-active': hoveredIndex2 === idx }]"
              >
                <!-- 2xx 成功 (底部) -->
                <rect
                  :x="item.barX"
                  :y="item.seg2.y"
                  :width="item.barW"
                  :height="item.seg2.h"
                  fill="var(--chart-success)"
                  class="stack-seg"
                />
                <!-- 3xx 缓存 (第二层) -->
                <rect
                  :x="item.barX"
                  :y="item.seg3.y"
                  :width="item.barW"
                  :height="item.seg3.h"
                  fill="var(--md-sys-color-secondary)"
                  class="stack-seg"
                />
                <!-- 4xx 客户端错误 (第三层) -->
                <rect
                  :x="item.barX"
                  :y="item.seg4.y"
                  :width="item.barW"
                  :height="item.seg4.h"
                  fill="var(--chart-warning)"
                  class="stack-seg"
                />
                <!-- 5xx 服务端错误 (顶层带圆角) -->
                <rect
                  :x="item.barX"
                  :y="item.seg5.y"
                  :width="item.barW"
                  :height="item.seg5.h"
                  rx="3"
                  ry="3"
                  fill="var(--chart-error)"
                  class="stack-seg"
                />
              </g>
            </g>

            <!-- 4. 垂直虚线交互准星 (Crosshair) -->
            <line
              v-if="hoveredPoint2"
              :x1="hoveredPoint2.cx"
              :y1="C2_PAD_T"
              :x2="hoveredPoint2.cx"
              :y2="C2_BASELINE"
              stroke="var(--md-sys-color-primary)"
              stroke-width="1.2"
              stroke-dasharray="3 3"
              class="svg-crosshair"
            />

            <!-- 5. X 轴时间标签 -->
            <g class="svg-x-axis">
              <text
                v-for="(item, idx) in c2Items"
                :key="item.day"
                :x="item.cx"
                :y="C2_BASELINE + 18"
                text-anchor="middle"
                :class="['svg-x-text', 'label-small', { 'is-active': hoveredIndex2 === idx }]"
              >
                {{ item.day }}
              </text>
              <text
                v-for="item in c2Items"
                :key="item.date"
                :x="item.cx"
                :y="C2_BASELINE + 32"
                text-anchor="middle"
                class="svg-x-subtext label-small text-secondary tabular-nums"
              >
                {{ item.date }}
              </text>
            </g>

            <!-- 6. 交互感应透明矩形 -->
            <rect
              v-for="(item, idx) in c2Items"
              :key="idx"
              :x="C2_PAD_L + idx * C2_STEP"
              :y="C2_PAD_T"
              :width="C2_STEP"
              :height="C2_PLOT_H"
              fill="transparent"
              class="svg-hitbox"
              @mouseenter="hoveredIndex2 = idx"
            />
          </svg>
        </div>

        <!-- 底部形状编码四态图例 -->
        <div class="chart-legend-row">
          <div class="legend-item type-meta text-secondary whitespace-nowrap shrink-0">
            <span class="legend-shape shape-circle bg-success"></span>
            <span>2xx 成功</span>
          </div>
          <div class="legend-item type-meta text-secondary whitespace-nowrap shrink-0">
            <span class="legend-shape shape-square bg-secondary"></span>
            <span>3xx 缓存</span>
          </div>
          <div class="legend-item type-meta text-secondary whitespace-nowrap shrink-0">
            <span class="legend-shape shape-diamond bg-warning"></span>
            <span>4xx 客户端</span>
          </div>
          <div class="legend-item type-meta text-secondary whitespace-nowrap shrink-0">
            <span class="legend-shape shape-triangle bg-error"></span>
            <span>5xx 服务端</span>
          </div>
        </div>
      </MdCard>
    </div>

    <!-- 底部辅助监控行：各端自适应占比与安全风控 -->
    <div class="analytics-subgrid">
      <MdCard variant="filled" class="chart-card">
        <template #header>
          <div class="card-title-bar">
            <div class="card-title-group">
              <Layers :size="18" class="text-primary" />
              <span class="type-title-md">终端自适应流量占比</span>
            </div>
            <span class="type-meta text-secondary whitespace-nowrap">全端响应</span>
          </div>
        </template>
        <div class="ratio-list">
          <div class="ratio-item">
            <div class="ratio-label">
              <span class="type-body font-medium">桌面宽屏 (Expanded &gt;= 840px)</span>
              <span class="type-body tabular-nums font-bold">54%</span>
            </div>
            <div class="ratio-bar-track">
              <div class="ratio-bar-fill" style="width: 54%;"></div>
            </div>
          </div>

          <div class="ratio-item">
            <div class="ratio-label">
              <span class="type-body font-medium">移动终端 (Compact &lt; 600px)</span>
              <span class="type-body tabular-nums font-bold">36%</span>
            </div>
            <div class="ratio-bar-track">
              <div class="ratio-bar-fill secondary" style="width: 36%;"></div>
            </div>
          </div>

          <div class="ratio-item">
            <div class="ratio-label">
              <span class="type-body font-medium">平板窄边 (Medium 600px - 839px)</span>
              <span class="type-body tabular-nums font-bold">10%</span>
            </div>
            <div class="ratio-bar-track">
              <div class="ratio-bar-fill tertiary" style="width: 10%;"></div>
            </div>
          </div>
        </div>
      </MdCard>

      <MdCard variant="outlined" class="chart-card">
        <template #header>
          <div class="card-title-bar">
            <div class="card-title-group">
              <ShieldAlert :size="18" class="text-primary" />
              <span class="type-title-md">安全风控与防火墙拦截</span>
            </div>
            <span class="type-meta text-success font-medium whitespace-nowrap">正常防护中</span>
          </div>
        </template>
        <div class="security-stats-grid">
          <div class="security-stat-box">
            <span class="type-meta text-secondary">今日 WAF 拦截</span>
            <span class="type-title-md tabular-nums font-bold text-warning">1,428 次</span>
            <span class="type-meta text-secondary">环比下降 4.2%</span>
          </div>
          <div class="security-stat-box">
            <span class="type-meta text-secondary">CC / 频控限制</span>
            <span class="type-title-md tabular-nums font-bold">382 次</span>
            <span class="type-meta text-secondary">自动隔离 15m</span>
          </div>
          <div class="security-stat-box">
            <span class="type-meta text-secondary">平均鉴权延迟</span>
            <span class="type-title-md tabular-nums font-bold text-success">3.2 ms</span>
            <span class="type-meta text-secondary">边缘节点校验</span>
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
  /* 语义化图表配色系统 (适配明暗主题) */
  --chart-success: #188038;
  --chart-success-bg: rgba(24, 128, 56, 0.12);
  --chart-warning: #e37400;
  --chart-warning-bg: rgba(227, 116, 0, 0.12);
  --chart-error: #d93025;
  --chart-error-bg: rgba(217, 48, 37, 0.12);
}

[data-theme="dark"] .analytics-view {
  --chart-success: #81c995;
  --chart-success-bg: rgba(129, 201, 149, 0.16);
  --chart-warning: #fdd663;
  --chart-warning-bg: rgba(253, 214, 99, 0.16);
  --chart-error: #f28b82;
  --chart-error-bg: rgba(242, 139, 130, 0.16);
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
  flex-wrap: wrap;
}

/* 周期切换微胶囊 */
.period-switcher {
  display: inline-flex;
  align-items: center;
  padding: 3px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-surface-container-high);
}

.period-capsule {
  padding: 6px 14px;
  border-radius: var(--md-sys-shape-corner-full);
  border: none;
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.period-capsule.is-active {
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  font-weight: 700;
  box-shadow: var(--md-sys-elevation-level1);
}

.text-secondary {
  color: var(--md-sys-color-on-surface-variant);
}

.text-primary {
  color: var(--md-sys-color-primary);
}

.text-success {
  color: var(--chart-success);
}

.text-warning {
  color: var(--chart-warning);
}

.text-error {
  color: var(--chart-error);
}

.bg-primary {
  background-color: var(--md-sys-color-primary) !important;
}

.bg-secondary {
  background-color: var(--md-sys-color-secondary) !important;
}

.bg-success {
  background-color: var(--chart-success) !important;
}

.bg-warning {
  background-color: var(--chart-warning) !important;
}

.bg-error {
  background-color: var(--chart-error) !important;
}

.font-bold {
  font-weight: 700;
}

.ml-auto {
  margin-left: auto;
}

/* 主网格排版 */
.analytics-grid {
  display: grid;
  grid-template-columns: 1.85fr 1.15fr;
  gap: 20px;
}

.analytics-subgrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 1080px) {
  .analytics-grid,
  .analytics-subgrid {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  padding: 24px;
}

.card-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  gap: 12px;
}

.card-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 顶部吞吐摘要 */
.throughput-summary {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.summary-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--chart-success-bg);
  color: var(--chart-success);
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

.summary-pill.warning {
  background-color: var(--chart-warning-bg);
  color: var(--chart-warning);
}

.summary-pill.success {
  background-color: var(--chart-success-bg);
  color: var(--chart-success);
}

/* ================= SVG 图表容器与浮动 Tooltip ================= */
.svg-chart-container {
  position: relative;
  width: 100%;
  margin-top: 18px;
  overflow: visible;
}

.chart-svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}

/* 坐标轴刻度文字 */
.svg-axis-text {
  fill: var(--md-sys-color-on-surface-variant);
  font-size: var(--md-type-meta-size, 12px);
  user-select: none;
}

.svg-x-text {
  fill: var(--md-sys-color-on-surface-variant);
  font-size: var(--md-type-meta-size, 12px);
  font-weight: 500;
  user-select: none;
  transition: fill 0.2s ease, font-weight 0.2s ease;
}

.svg-x-text.is-active {
  fill: var(--md-sys-color-primary);
  font-weight: 700;
}

.svg-x-subtext {
  fill: var(--md-sys-color-on-surface-variant);
  font-size: var(--md-type-meta-size, 12px);
  user-select: none;
  opacity: 0.8;
}

/* 柱状图矩形微动效 */
.svg-bar-rect {
  fill: var(--md-sys-color-primary-container);
  transition: fill 0.2s ease, opacity 0.2s ease, transform 0.2s ease;
  transform-origin: bottom;
}

.svg-bar-rect.is-peak {
  fill: var(--md-sys-color-primary);
}

.svg-bar-rect.is-active {
  fill: var(--md-sys-color-primary);
  opacity: 0.95;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

[data-theme="dark"] .svg-bar-rect.is-peak,
[data-theme="dark"] .svg-bar-rect.is-active {
  fill: color-mix(in srgb, var(--md-sys-color-primary) 78%, transparent);
}

.svg-line-point {
  transition: r 0.15s ease;
}

.svg-crosshair {
  pointer-events: none;
}

.svg-hitbox {
  cursor: pointer;
}

/* 堆叠柱体动效 */
.stack-seg {
  transition: opacity 0.2s ease;
}

.svg-stack-unit.is-active .stack-seg {
  opacity: 0.95;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
}

/* 悬浮准星卡片 (Floating Tooltip) */
.chart-tooltip-floating {
  position: absolute;
  top: 6px;
  padding: 10px 14px;
  border-radius: var(--md-sys-shape-corner-medium, 16px);
  background-color: var(--md-sys-color-surface-container-highest);
  border: 1px solid var(--md-sys-color-outline-variant);
  box-shadow: var(--md-sys-elevation-level2);
  color: var(--md-sys-color-on-surface);
  pointer-events: none;
  z-index: 20;
  min-width: 228px;
  width: max-content;
  backdrop-filter: blur(12px);
  transition: left 0.15s ease, transform 0.15s ease;
}

.tooltip-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  white-space: nowrap;
}

.peak-tag {
  padding: 2px 8px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  font-weight: 700;
  font-size: var(--md-type-meta-size, 12px);
  white-space: nowrap;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}

.tooltip-divider {
  width: 100%;
  height: 1px;
  background-color: var(--md-sys-color-outline-variant);
  margin: 6px 0 8px 0;
  opacity: 0.6;
}

.tooltip-metrics {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-row {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

/* 底部图例 */
.chart-legend-row {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* 形状编码图例 (Circle / Square / Diamond / Triangle) */
.legend-shape {
  width: 10px;
  height: 10px;
  display: inline-block;
  flex-shrink: 0;
}

.legend-shape.shape-circle {
  border-radius: var(--md-sys-shape-corner-full);
}

.legend-shape.shape-square {
  border-radius: 2px;
}

.legend-shape.shape-diamond {
  transform: rotate(45deg) scale(0.85);
  border-radius: 1px;
}

.legend-shape.shape-triangle {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 9px solid var(--chart-error);
  background-color: transparent !important;
}

/* 终端自适应进度条列表 */
.ratio-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 16px;
}

.ratio-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ratio-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  transition: width 0.4s var(--md-easing-emphasized);
}

.ratio-bar-fill.secondary {
  background-color: var(--md-sys-color-secondary);
}

.ratio-bar-fill.tertiary {
  background-color: var(--md-sys-color-tertiary);
}

/* 安全风控指标块 */
.security-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 16px;
}

@media (max-width: 640px) {
  .security-stats-grid {
    grid-template-columns: 1fr;
  }
}

.security-stat-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border-radius: var(--md-sys-shape-corner-medium, 16px);
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
}
</style>
