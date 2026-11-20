<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  MdButton,
  MdCard,
  MdInput,
  MdSwitch,
  AdaptiveModal,
  MdTable,
  MdPagination,
  MdSelect,
  MdDrawer,
  MdTooltip,
  useToast,
  type MdTableColumn
} from '@/components/m3'
import {
  Users,
  ShieldCheck,
  HardDrive,
  TrendingUp,
  SlidersHorizontal,
  Plus,
  Send,
  ExternalLink,
  Laptop,
  Smartphone,
  CheckCircle2,
  Sparkles,
  Zap,
  Layers,
  Palette,
  Check,
  Eye,
  Info,
  Search,
  RotateCw,
  Server,
  RotateCcw,
  HelpCircle
} from 'lucide-vue-next'

const toast = useToast()

const switch1 = ref(true)
const switch2 = ref(false)
const switch3 = ref(true)

// Token 透视模式 (Inspect Mode)
const isInspectMode = ref(false)

const isModalOpen = ref(false)
const demoInput = ref('')

const openModal = () => {
  isModalOpen.value = true
}

const handleConfirm = () => {
  toast.success(`提交成功: ${demoInput.value || '未输入内容'}`)
  isModalOpen.value = false
}

// 4 组 M3 Expressive 指标数据
const expressiveCards = [
  {
    title: '全平台活跃用户',
    value: '48,290',
    change: '+18.4%',
    isPositive: true,
    icon: Users,
    variant: 'primary-tonal' as const,
    businessCaption: '环比上周新增 +7,520 注册组织席位',
    tokenBadge: 'primary-tonal · r: 24px',
    isTonalColor: true,
    tonalTheme: 'primary'
  },
  {
    title: '边缘存储吞吐量',
    value: '1.24 GB/s',
    change: '+32.6%',
    isPositive: true,
    icon: Zap,
    variant: 'tertiary-tonal' as const,
    businessCaption: '流量峰值达到集群边缘承载能力的 82.4%',
    tokenBadge: 'tertiary-tonal · r: 24px',
    isTonalColor: true,
    tonalTheme: 'tertiary'
  },
  {
    title: '系统可用性 SLI',
    value: '99.99%',
    change: '稳定运行',
    isPositive: true,
    icon: ShieldCheck,
    variant: 'elevated' as const,
    businessCaption: '全链路服务达标，过去 30 天无不可用异常',
    tokenBadge: 'surface-container-low · elevation-1',
    isTonalColor: false
  },
  {
    title: '微服务调度健康',
    value: '98.2%',
    change: '+4.1%',
    isPositive: true,
    icon: HardDrive,
    variant: 'filled' as const,
    businessCaption: '128 个计算节点负载均衡健康分配',
    tokenBadge: 'surface-container-highest · r: 24px',
    isTonalColor: false
  }
]

// ============================================================================
// 7. MdTable 业务节点监控数据与状态控制
// ============================================================================
interface NodeRecord {
  id: string
  name: string
  region: string
  qps: number
  latency: number
  status: 'healthy' | 'warning' | 'isolated'
  updatedAt: string
}

const allNodes: NodeRecord[] = [
  {
    id: 'NODE-8012',
    name: 'API Gateway Cluster 01',
    region: 'cn-east-1 (上海)',
    qps: 18450,
    latency: 24,
    status: 'healthy',
    updatedAt: '2026-11-19 20:15:30'
  },
  {
    id: 'NODE-8013',
    name: 'Auth Token Verifier',
    region: 'cn-east-1 (上海)',
    qps: 9240,
    latency: 18,
    status: 'healthy',
    updatedAt: '2026-11-19 20:15:28'
  },
  {
    id: 'NODE-8021',
    name: 'Dynamic Theme Renderer',
    region: 'cn-north-2 (北京)',
    qps: 6410,
    latency: 68,
    status: 'warning',
    updatedAt: '2026-11-19 20:14:55'
  },
  {
    id: 'NODE-8035',
    name: 'Edge Compute Sandbox 03',
    region: 'cn-south-1 (广州)',
    qps: 12890,
    latency: 32,
    status: 'healthy',
    updatedAt: '2026-11-19 20:15:10'
  },
  {
    id: 'NODE-8044',
    name: 'Audit Log Stream Sink',
    region: 'cn-north-2 (北京)',
    qps: 3420,
    latency: 120,
    status: 'isolated',
    updatedAt: '2026-11-19 20:13:42'
  },
  {
    id: 'NODE-8052',
    name: 'HCT Color Matrix Worker',
    region: 'cn-east-2 (杭州)',
    qps: 15600,
    latency: 28,
    status: 'healthy',
    updatedAt: '2026-11-19 20:15:32'
  },
  {
    id: 'NODE-8068',
    name: 'Realtime Metrics Influx',
    region: 'cn-south-1 (广州)',
    qps: 22100,
    latency: 42,
    status: 'healthy',
    updatedAt: '2026-11-19 20:15:31'
  },
  {
    id: 'NODE-8079',
    name: 'WAF Rule Evaluator',
    region: 'cn-east-1 (上海)',
    qps: 8750,
    latency: 55,
    status: 'warning',
    updatedAt: '2026-11-19 20:15:02'
  },
  {
    id: 'NODE-8088',
    name: 'Bento Grid Static Cache',
    region: 'cn-north-1 (北京)',
    qps: 31200,
    latency: 12,
    status: 'healthy',
    updatedAt: '2026-11-19 20:15:35'
  },
  {
    id: 'NODE-8095',
    name: 'Adaptive Modal Dispatcher',
    region: 'cn-east-2 (杭州)',
    qps: 4500,
    latency: 29,
    status: 'healthy',
    updatedAt: '2026-11-19 20:15:20'
  }
]

const tableColumns: MdTableColumn<NodeRecord>[] = [
  { key: 'id', title: '节点标识', width: '130px' },
  { key: 'name', title: '集群服务实例', width: '220px' },
  { key: 'region', title: '部署地域', width: '150px' },
  { key: 'qps', title: '吞吐 QPS', width: '120px', align: 'right', numeric: true, sortable: true },
  { key: 'latency', title: '响应时延', width: '120px', align: 'right', numeric: true, sortable: true },
  { key: 'status', title: '运行状态', width: '110px', align: 'center' },
  { key: 'updatedAt', title: '最后上报时间', width: '180px' },
  { key: 'actions', title: '操作', width: '130px', align: 'right' }
]

const selectedNodes = ref<NodeRecord[]>([])
const tableSearch = ref('')
const statusFilter = ref<'all' | 'healthy' | 'warning' | 'isolated'>('all')
const currentPage = ref(1)
const pageSize = ref(5)
const sortField = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc' | null>(null)
const isTableLoading = ref(false)

const handleSortChange = (payload: { key: string; order: 'asc' | 'desc' | null }) => {
  sortField.value = payload.order ? payload.key : null
  sortOrder.value = payload.order
}

const simulateReload = () => {
  isTableLoading.value = true
  setTimeout(() => {
    isTableLoading.value = false
  }, 700)
}

const filteredNodes = computed(() => {
  let list = allNodes.filter((item) => {
    const matchSearch =
      !tableSearch.value ||
      item.id.toLowerCase().includes(tableSearch.value.toLowerCase()) ||
      item.name.toLowerCase().includes(tableSearch.value.toLowerCase()) ||
      item.region.toLowerCase().includes(tableSearch.value.toLowerCase())

    const matchStatus = statusFilter.value === 'all' || item.status === statusFilter.value
    return matchSearch && matchStatus
  })

  if (sortField.value && sortOrder.value) {
    const field = sortField.value as keyof NodeRecord
    const order = sortOrder.value
    list = [...list].sort((a, b) => {
      const valA = a[field]
      const valB = b[field]
      if (typeof valA === 'number' && typeof valB === 'number') {
        return order === 'asc' ? valA - valB : valB - valA
      }
      return order === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    })
  }

  return list
})

const pagedNodes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredNodes.value.slice(start, start + pageSize.value)
})

const resetTableFilters = () => {
  tableSearch.value = ''
  statusFilter.value = 'all'
  currentPage.value = 1
}

// 抽屉详情状态
const isDrawerOpen = ref(false)
const activeDetailNode = ref<NodeRecord | null>(null)
const drawerRoutingStrategy = ref('least-load')

// 批量确认弹窗状态
const isBatchModalOpen = ref(false)

const handleNodeInspect = (row: NodeRecord) => {
  activeDetailNode.value = row
  isDrawerOpen.value = true
}

const handleDrawerRestart = () => {
  if (activeDetailNode.value) {
    toast.success(`节点 [${activeDetailNode.value.id}] 正在优雅重启...`)
    isDrawerOpen.value = false
  }
}

const handleDrawerReloadConfig = () => {
  if (activeDetailNode.value) {
    toast.info(`节点 [${activeDetailNode.value.id}] 最新配置已重载成功`)
  }
}

const handleOpenBatchModal = () => {
  if (selectedNodes.value.length === 0) return
  isBatchModalOpen.value = true
}

const handleConfirmBatchRestart = () => {
  const count = selectedNodes.value.length
  const ids = selectedNodes.value.map((n) => n.id).join(', ')
  toast.success(`批量重启任务已下发（共 ${count} 个节点: ${ids}）`)
  selectedNodes.value = []
  isBatchModalOpen.value = false
}
</script>

<template>
  <div class="playground-view">
    <!-- 1. 顶部 Expressive 视觉张力大标题 + Token 透视开关 -->
    <section class="hero-section">
      <div class="hero-header-row">
        <div class="hero-title-area">
          <div class="hero-chip type-meta">
            <Sparkles :size="15" />
            <span>Material 3 Expressive 体系</span>
          </div>
          <h1 class="hero-title type-title-lg">
            高级质感与色彩撞色演练场
          </h1>
          <p class="hero-subtitle type-body">
            融合 Google Fonts <code>Plus Jakarta Sans</code> 排版张力、24px 柔润圆角、独立几何图标底座与高辨识度色彩容器撞色。
          </p>
        </div>

        <!-- Token 透视模式开关 (Inspect Mode Toggle) -->
        <div class="inspect-control-card">
          <div class="inspect-control-info">
            <div class="inspect-control-title">
              <Eye :size="18" class="text-primary" />
              <span class="type-body font-medium">Token 透视模式</span>
            </div>
            <span class="type-meta text-secondary">
              {{ isInspectMode ? '已开启：标注各组件底层 Token' : '已关闭：呈现纯净商业级页面效果' }}
            </span>
          </div>
          <MdSwitch v-model="isInspectMode" />
        </div>
      </div>
    </section>

    <!-- 2. 色彩撞色指标卡片群 (带 48px x 48px 几何底座 + 高对比纯净胶囊徽章) -->
    <section class="cards-showcase">
      <div class="section-header">
        <div class="section-tag type-meta">
          <Palette :size="14" />
          <span>色彩容器撞色与几何底座 (Color-Block & Geometry)</span>
        </div>
        <h2 class="type-title-md">高级色彩层级与微交互</h2>
      </div>

      <div class="expressive-grid">
        <MdCard
          v-for="(card, index) in expressiveCards"
          :key="index"
          :variant="card.variant"
          clickable
          class="expressive-card"
        >
          <!-- 开启透视模式时的 Token 悬浮标签 -->
          <Transition name="token-fade">
            <div v-if="isInspectMode" class="token-inspect-chip type-meta">
              <Info :size="12" />
              <span>{{ card.tokenBadge }}</span>
            </div>
          </Transition>

          <div class="card-top-row">
            <!-- 独立 48px x 48px, 16px 圆角几何图标底座 -->
            <div
              class="m3-geometric-badge"
              :class="`m3-geometric-badge--${card.variant}`"
            >
              <component :is="card.icon" :size="24" />
            </div>

            <!-- 右上角趋势徽章：彩色 Tonal 使用纯净白底/容器底 + 对应主色深字，提升通透对比度 -->
            <div
              v-if="card.isTonalColor"
              :class="['tonal-trend-pill', 'type-meta', `tonal-trend-pill--${card.tonalTheme}`]"
            >
              <TrendingUp :size="14" />
              <span class="tabular-nums font-bold">{{ card.change }}</span>
            </div>
            <div
              v-else
              class="standard-trend-badge type-meta"
              :class="{ 'is-positive': card.isPositive }"
            >
              <TrendingUp v-if="card.isPositive" :size="14" />
              <span class="tabular-nums font-bold">{{ card.change }}</span>
            </div>
          </div>

          <div class="card-main-content">
            <span class="card-title type-body font-medium">{{ card.title }}</span>
            <span class="card-value type-display tabular-nums">{{ card.value }}</span>

            <!-- 商业级模式显示真实业务环比，透视模式显示底层说明 -->
            <span class="card-caption type-meta">
              {{ isInspectMode ? `容器角色: ${card.variant}` : card.businessCaption }}
            </span>
          </div>
        </MdCard>
      </div>
    </section>

    <!-- 3. 五态卡片形态对比专区 -->
    <section class="demo-section">
      <div class="section-header">
        <div class="section-tag type-meta">
          <Layers :size="14" />
          <span>卡片形态对比 (MdCard Variants)</span>
        </div>
        <h2 class="type-title-md">五种 M3 标准与高饱和色块卡片</h2>
      </div>

      <div class="variants-grid">
        <MdCard variant="primary-tonal" clickable class="variant-preview-card">
          <div v-if="isInspectMode" class="token-inspect-chip type-meta">
            <span>--md-sys-color-primary-container</span>
          </div>
          <span class="type-title-md">Primary Tonal</span>
          <p class="type-body opacity-85">高饱和主色调容器，适合核心引导或重点业务看板，无边框设计。</p>
        </MdCard>

        <MdCard variant="tertiary-tonal" clickable class="variant-preview-card">
          <div v-if="isInspectMode" class="token-inspect-chip type-meta">
            <span>--md-sys-color-tertiary-container</span>
          </div>
          <span class="type-title-md">Tertiary Tonal</span>
          <p class="type-body opacity-85">高辨识度第三强调色容器，跟随动态 HCT 种子调和，带来活力与丰富层级。</p>
        </MdCard>

        <MdCard variant="elevated" clickable class="variant-preview-card">
          <div v-if="isInspectMode" class="token-inspect-chip type-meta">
            <span>surface-container-low · elevation-1</span>
          </div>
          <span class="type-title-md">Elevated</span>
          <p class="type-body text-secondary">经典 1 级阴影与低层容器，悬停平滑提升至 2 级阴影。</p>
        </MdCard>

        <MdCard variant="filled" clickable class="variant-preview-card">
          <div v-if="isInspectMode" class="token-inspect-chip type-meta">
            <span>surface-container-highest</span>
          </div>
          <span class="type-title-md">Filled</span>
          <p class="type-body text-secondary">最高容器层级，完全依托纯色块对比划分界面边界。</p>
        </MdCard>

        <MdCard variant="outlined" clickable class="variant-preview-card">
          <div v-if="isInspectMode" class="token-inspect-chip type-meta">
            <span>surface + outline-variant (1px)</span>
          </div>
          <span class="type-title-md">Outlined</span>
          <p class="type-body text-secondary">优雅细描边，背景通透，适用于平铺次要选项。</p>
        </MdCard>
      </div>
    </section>

    <!-- 4. 按钮变体与微交互展示区 -->
    <section class="demo-section">
      <MdCard variant="elevated" class="demo-card">
        <template #header>
          <div class="section-title-wrap">
            <div class="title-with-token">
              <h2 class="type-title-md">M3 按钮原子组件 (带 Expressive 弹性微浮动效)</h2>
              <span v-if="isInspectMode" class="token-inspect-chip type-meta">
                shape: 9999px · state-layer: 8%/12%
              </span>
            </div>
            <p class="type-body text-secondary">
              支持 Filled / Tonal / Outlined / Text，全圆角 9999px，Hover 时弹性上浮 <code>translateY(-1px)</code>，配合 Hover 8% / Active 12% 状态层透明遮罩。
            </p>
          </div>
        </template>

        <div class="buttons-preview-group">
          <div class="button-row">
            <div class="button-row__title type-meta font-medium">基础四态</div>
            <div class="button-row__items">
              <MdButton variant="filled">Filled 填充按钮</MdButton>
              <MdButton variant="tonal">Tonal 色调按钮</MdButton>
              <MdButton variant="outlined">Outlined 描边按钮</MdButton>
              <MdButton variant="text">Text 文本按钮</MdButton>
            </div>
          </div>

          <div class="button-row">
            <div class="button-row__title type-meta font-medium">带线性图标 (lucide-vue-next)</div>
            <div class="button-row__items">
              <MdButton variant="filled">
                <template #icon><Plus /></template>
                新建记录
              </MdButton>
              <MdButton variant="tonal">
                <template #icon><Send /></template>
                发送指令
              </MdButton>
              <MdButton variant="outlined">
                <template #icon><SlidersHorizontal /></template>
                高级过滤
              </MdButton>
              <MdButton variant="text">
                <template #trailingIcon><ExternalLink /></template>
                了解详情
              </MdButton>
            </div>
          </div>

          <div class="button-row">
            <div class="button-row__title type-meta font-medium">禁用态 (Disabled)</div>
            <div class="button-row__items">
              <MdButton variant="filled" disabled>Filled 禁用</MdButton>
              <MdButton variant="tonal" disabled>Tonal 禁用</MdButton>
              <MdButton variant="outlined" disabled>Outlined 禁用</MdButton>
              <MdButton variant="text" disabled>Text 禁用</MdButton>
            </div>
          </div>
        </div>
      </MdCard>
    </section>

    <!-- 5. M3 Switch 触控开关原子组件 -->
    <section class="demo-section">
      <MdCard variant="elevated" class="demo-card">
        <template #header>
          <div class="section-title-wrap">
            <div class="title-with-token">
              <h2 class="type-title-md">M3 触控开关原子组件 (MdSwitch)</h2>
              <span v-if="isInspectMode" class="token-inspect-chip type-meta">
                track: 52×32px · thumb: 16px/24px
              </span>
            </div>
            <p class="type-body text-secondary">
              标准 <code>52px × 32px</code> 轨道；未选中时滑块 <code>16px</code>（outline 边框与填充）；选中时轨道切换 primary，滑块平滑放大至 <code>24px</code>（on-primary 填充），内嵌可选指示图标。
            </p>
          </div>
        </template>

        <div class="button-row__items" style="gap: 28px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <MdSwitch v-model="switch1" />
            <span class="type-body font-medium">基础开关：{{ switch1 ? '开启' : '关闭' }}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <MdSwitch v-model="switch2">
              <template #checkedIcon><Check /></template>
            </MdSwitch>
            <span class="type-body font-medium">带勾号图标：{{ switch2 ? '已勾选' : '未勾选' }}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <MdSwitch v-model="switch3" disabled />
            <span class="type-body font-medium text-secondary">禁用状态 (Disabled)</span>
          </div>
        </div>
      </MdCard>
    </section>

    <!-- 6. 双端自适应弹窗交互演示区 -->
    <section class="demo-section">
      <MdCard variant="outlined" class="demo-card">
        <template #header>
          <div class="section-title-wrap">
            <div class="title-with-token">
              <h2 class="type-title-md">双端自适应模态框 (AdaptiveModal)</h2>
              <span v-if="isInspectMode" class="token-inspect-chip type-meta">
                Mobile: Bottom Sheet (r: 28px top) · PC: Dialog (r: 28px)
              </span>
            </div>
            <p class="type-body text-secondary">
              在手机端 (&lt; 600px) 自动从底部滑出为 <b>Bottom Sheet</b>（顶部圆角 28px + 拖拽手柄）；在 PC 端 (&gt;= 600px) 自动呈现为屏幕居中的 <b>Dialog</b>（全圆角 28px）。
            </p>
          </div>
        </template>

        <div class="modal-feature-box">
          <div class="feature-item">
            <div class="m3-geometric-badge" style="background-color: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container);">
              <Smartphone :size="24" />
            </div>
            <div class="feature-text">
              <div class="type-title-md">手机端形态 (&lt; 600px)</div>
              <div class="type-meta text-secondary">贴底抽屉，滑入手柄，贴合移动端原生单手手势操作</div>
            </div>
          </div>
          <div class="feature-divider"></div>
          <div class="feature-item">
            <div class="m3-geometric-badge" style="background-color: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container);">
              <Laptop :size="24" />
            </div>
            <div class="feature-text">
              <div class="type-title-md">桌面端形态 (&gt;= 600px)</div>
              <div class="type-meta text-secondary">居中模态对话框，支持 ESC 键与点击遮罩极速关闭</div>
            </div>
          </div>
        </div>

        <template #actions>
          <MdButton variant="filled" @click="openModal">
            <template #icon><Sparkles /></template>
            打开自适应弹窗体验
          </MdButton>
        </template>
      </MdCard>
    </section>

    <!-- 7. 轻量级全泛型数据表格与分页 (MdTable & MdPagination) -->
    <section class="demo-section">
      <div class="section-header">
        <div class="section-tag type-meta">
          <Server :size="14" />
          <span>全泛型原子组件套件 (MdTable & MdPagination)</span>
        </div>
        <div class="title-with-token">
          <h2 class="type-title-md">轻量级数据表格与交互分页</h2>
          <span v-if="isInspectMode" class="token-inspect-chip type-meta">
            table: surface-container-lowest · outline-variant · selected: secondary-container(45%)
          </span>

          <!-- Rich Tooltip: 指标与 SLA 口径说明 -->
          <MdTooltip
            variant="rich"
            title="集群审计 SLA 与统计口径说明"
            placement="bottom"
          >
            <button
              type="button"
              class="help-tooltip-trigger md-state-layer"
              aria-label="查看统计口径说明"
            >
              <HelpCircle :size="16" />
            </button>
            <template #content>
              <div class="tooltip-sla-info">
                <p class="type-body text-secondary">
                  数据源来自全网边缘探测心跳流，吞吐 QPS 采用过去 60 秒滑动窗口加权平均；响应时延为 P99 聚合值。
                </p>
                <div class="sla-pills">
                  <span class="type-meta text-primary font-bold">✓ 审计等级: Tier-1 核心集群</span>
                  <span class="type-meta text-secondary">· 自动心跳间隔 5s</span>
                </div>
              </div>
            </template>
          </MdTooltip>
        </div>
        <p class="type-body text-secondary">
          零第三方臃肿依赖，采用 Vue 3 泛型 <code>generic="T extends Record&lt;string, unknown&gt;"</code> 深度类型约束。支持列排序、多选行 State Layer 高亮、骨架屏加载、自定义单元格插槽与一体化底部分页器。
        </p>
      </div>

      <!-- 表格主体 -->
      <MdTable
        v-model:selected="selectedNodes"
        :columns="tableColumns"
        :data="pagedNodes"
        :loading="isTableLoading"
        :skeleton-rows="pagedNodes.length > 0 ? pagedNodes.length : pageSize"
        selectable
        empty-text="暂无匹配数据"
        empty-description="未检索到符合条件的集群节点，请尝试调整搜索关键字或切换状态过滤"
        @sort-change="handleSortChange"
      >
        <!-- 工具栏 -->
        <template #toolbar>
          <div class="table-toolbar-left">
            <MdInput
              v-model="tableSearch"
              size="sm"
              placeholder="搜索节点标识、集群或地域..."
              clearable
              class="table-search-input-field"
            >
              <template #prefix>
                <Search :size="14" class="text-secondary" />
              </template>
            </MdInput>

            <!-- 状态快速过滤微胶囊 -->
            <div class="status-filter-capsules">
              <button
                type="button"
                class="filter-pill type-meta md-state-layer"
                :class="{ 'is-active': statusFilter === 'all' }"
                @click="statusFilter = 'all'"
              >
                全部 ({{ allNodes.length }})
              </button>
              <button
                type="button"
                class="filter-pill type-meta md-state-layer"
                :class="{ 'is-active': statusFilter === 'healthy' }"
                @click="statusFilter = 'healthy'"
              >
                健康
              </button>
              <button
                type="button"
                class="filter-pill type-meta md-state-layer"
                :class="{ 'is-active': statusFilter === 'warning' }"
                @click="statusFilter = 'warning'"
              >
                告警
              </button>
              <button
                type="button"
                class="filter-pill type-meta md-state-layer"
                :class="{ 'is-active': statusFilter === 'isolated' }"
                @click="statusFilter = 'isolated'"
              >
                已隔离
              </button>
            </div>
          </div>

          <div class="table-toolbar-right">
            <!-- 批量操作（触发二次确认弹窗） -->
            <MdButton
              v-if="selectedNodes.length > 0"
              variant="tonal"
              @click="handleOpenBatchModal"
            >
              <template #icon><RotateCcw /></template>
              批量重启 ({{ selectedNodes.length }})
            </MdButton>

            <!-- 模拟骨架屏重载 -->
            <MdButton variant="outlined" @click="simulateReload">
              <template #icon><RotateCw :class="{ 'spin-anim': isTableLoading }" /></template>
              刷新数据
            </MdButton>
          </div>
        </template>

        <!-- 自定义节点标识插槽 -->
        <template #cell-id="{ value }">
          <span class="type-body font-mono text-primary font-bold">{{ value }}</span>
        </template>

        <!-- 自定义响应时延插槽 -->
        <template #cell-latency="{ value }">
          <span
            class="tabular-nums font-bold"
            :class="Number(value) > 60 ? 'text-warning' : 'text-success'"
          >
            {{ value }} ms
          </span>
        </template>

        <!-- 自定义运行状态插槽 -->
        <template #cell-status="{ value }">
          <span
            class="status-capsule type-meta"
            :class="`status-capsule--${value}`"
          >
            {{ value === 'healthy' ? '健康就绪' : value === 'warning' ? '负载偏高' : '网络隔离' }}
          </span>
        </template>

        <!-- 自定义最后更新时间 -->
        <template #cell-updatedAt="{ value }">
          <span class="type-meta text-secondary tabular-nums">{{ value }}</span>
        </template>

        <!-- 自定义操作栏插槽 -->
        <template #cell-actions="{ row }">
          <div class="row-actions-group">
            <MdTooltip content="打开侧边抽屉进行实时深度诊断" placement="top">
              <button
                type="button"
                class="action-text-btn type-meta md-state-layer"
                @click="handleNodeInspect(row)"
              >
                详情诊断
              </button>
            </MdTooltip>
          </div>
        </template>

        <!-- 空状态操作插槽 (当检索结果为 0 时提供重置) -->
        <template #empty-action>
          <MdButton
            v-if="statusFilter !== 'all' || tableSearch"
            variant="tonal"
            @click="resetTableFilters"
          >
            重置筛选条件
          </MdButton>
        </template>

        <!-- 底部分页器无缝一体化插槽 -->
        <template #pagination>
          <MdPagination
            v-model:page="currentPage"
            v-model:pageSize="pageSize"
            :total="filteredNodes.length"
            :page-size-options="[5, 10, 20]"
          />
        </template>
      </MdTable>
    </section>

    <!-- 自适应弹窗实例 -->
    <AdaptiveModal
      v-model="isModalOpen"
      title="M3 Expressive 设计验证"
      description="您可以尝试调整浏览器窗口宽度（拉大或缩小至 600px 以下），观察弹窗形态与交互的无缝转变。"
    >
      <div class="modal-content-demo">
        <div class="demo-form-field">
          <label class="form-label type-body font-medium">配置项名称</label>
          <MdInput
            v-model="demoInput"
            size="md"
            placeholder="请输入测试参数或标签..."
            clearable
          />
        </div>

        <div class="demo-feature-checks">
          <div class="check-item">
            <CheckCircle2 :size="18" class="text-primary" />
            <span class="type-body">引入 Google Fonts (Plus Jakarta Sans + Noto Sans SC)</span>
          </div>
          <div class="check-item">
            <CheckCircle2 :size="18" class="text-primary" />
            <span class="type-body">已支持 Primary Tonal 与 Tertiary Tonal 高级色彩容器撞色</span>
          </div>
          <div class="check-item">
            <CheckCircle2 :size="18" class="text-primary" />
            <span class="type-body">卡片圆角全量进化至 24px，集成 48px 几何独立图标底座</span>
          </div>
        </div>
      </div>

      <template #actions="{ close }">
        <MdButton variant="text" @click="close">
          取消
        </MdButton>
        <MdButton variant="filled" @click="handleConfirm">
          确认提交
        </MdButton>
      </template>
    </AdaptiveModal>

    <!-- 8. 节点详情侧边抽屉 (MdDrawer) -->
    <MdDrawer
      v-model="isDrawerOpen"
      :title="activeDetailNode ? `节点详情: ${activeDetailNode.id}` : '节点诊断详情'"
      :width="'500px'"
    >
      <div v-if="activeDetailNode" class="drawer-detail-body">
        <!-- 核心状态卡片 -->
        <div class="drawer-status-card">
          <div class="status-indicator-row">
            <span
              class="status-capsule type-meta"
              :class="`status-capsule--${activeDetailNode.status}`"
            >
              {{ activeDetailNode.status === 'healthy' ? '健康就绪' : activeDetailNode.status === 'warning' ? '负载偏高' : '网络隔离' }}
            </span>
            <span class="type-meta text-secondary tabular-nums">
              上报时间: {{ activeDetailNode.updatedAt }}
            </span>
          </div>
          <h3 class="type-title-md drawer-node-name">{{ activeDetailNode.name }}</h3>
          <p class="type-meta text-secondary font-mono">{{ activeDetailNode.id }} · {{ activeDetailNode.region }}</p>
        </div>

        <!-- 关键性能指标网格 -->
        <div class="drawer-metrics-grid">
          <div class="metric-item">
            <div class="metric-label type-meta text-secondary">吞吐 QPS</div>
            <div class="metric-value type-display tabular-nums text-primary">{{ activeDetailNode.qps.toLocaleString() }}</div>
            <div class="metric-sub type-meta text-secondary">峰值承载 45,000</div>
          </div>
          <div class="metric-item">
            <div class="metric-label type-meta text-secondary">P99 时延</div>
            <div
              class="metric-value type-display tabular-nums"
              :class="activeDetailNode.latency > 60 ? 'text-warning' : 'text-success'"
            >
              {{ activeDetailNode.latency }} <span class="type-meta font-normal">ms</span>
            </div>
            <div class="metric-sub type-meta text-secondary">SLA 目标 &lt; 50ms</div>
          </div>
        </div>

        <!-- 运行诊断项目列表 -->
        <div class="drawer-audit-list">
          <h4 class="type-title-md drawer-subhead">运行环境诊断项</h4>
          <div class="audit-item">
            <span class="type-body text-secondary">容器底层编排</span>
            <span class="type-body font-mono font-medium">Kubernetes v1.30.2</span>
          </div>
          <div class="audit-item">
            <span class="type-body text-secondary">TLS 证书有效期</span>
            <span class="type-body text-success font-medium">剩余 286 天 (正常)</span>
          </div>
          <div class="audit-item">
            <span class="type-body text-secondary">GC 回收停顿</span>
            <span class="type-body font-mono">1.2ms (ZGC 并发)</span>
          </div>
          <div class="audit-item">
            <span class="type-body text-secondary">WAF 防护策略</span>
            <span class="type-body font-medium">严格拦截模式 (已启用)</span>
          </div>
          <div class="audit-item audit-item--select">
            <div class="audit-item__label-group">
              <span class="type-body text-secondary">调度策略 (嵌套防裁剪)</span>
              <MdTooltip content="修改策略将实时同步至网关路由层，无须中断现有连接" placement="top">
                <HelpCircle :size="14" class="text-secondary cursor-help" />
              </MdTooltip>
            </div>
            <MdSelect
              v-model="drawerRoutingStrategy"
              :options="[
                { label: '自适应最小负载 (Default)', value: 'least-load' },
                { label: '同机房低时延优先', value: 'same-az' },
                { label: '灰度流量镜像观测', value: 'canary-mirror' }
              ]"
              size="sm"
            />
          </div>
        </div>
      </div>

      <!-- 抽屉底部操作栏 -->
      <template #footer>
        <div class="drawer-footer-actions">
          <MdButton variant="outlined" @click="handleDrawerReloadConfig">
            热重载配置
          </MdButton>
          <MdButton variant="filled" @click="handleDrawerRestart">
            重启当前节点
          </MdButton>
        </div>
      </template>
    </MdDrawer>

    <!-- 9. 批量重启二次确认弹窗 (AdaptiveModal) -->
    <AdaptiveModal
      v-model="isBatchModalOpen"
      title="确认批量重启节点？"
      description="批量重启将使选中的节点在集群中轮询隔离并重启服务，期间流量将自动调度至同地域备份节点。"
    >
      <div class="batch-confirm-content">
        <p class="type-body text-on-surface">
          即将重启以下 <strong class="text-primary font-bold">{{ selectedNodes.length }}</strong> 个服务节点：
        </p>
        <div class="selected-nodes-chips">
          <span
            v-for="node in selectedNodes"
            :key="node.id"
            class="node-chip type-meta font-mono"
          >
            {{ node.id }} ({{ node.name }})
          </span>
        </div>
      </div>
      <template #actions>
        <MdButton variant="text" @click="isBatchModalOpen = false">取消</MdButton>
        <MdButton variant="filled" @click="handleConfirmBatchRestart">确认重启</MdButton>
      </template>
    </AdaptiveModal>
  </div>
</template>

<style scoped>
.playground-view {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* 顶部 Hero 区域 */
.hero-section {
  padding: 8px 0 4px 0;
}

.hero-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.hero-title-area {
  flex: 1;
  min-width: 280px;
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  margin-bottom: 16px;
  font-weight: 600;
}

.hero-title {
  color: var(--md-sys-color-on-surface);
  margin-bottom: 12px;
}

.hero-subtitle {
  color: var(--md-sys-color-on-surface-variant);
  max-width: 820px;
  line-height: 1.6;
}

.hero-subtitle code {
  padding: 2px 6px;
  border-radius: var(--md-sys-shape-corner-extra-small);
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-primary);
  font-family: monospace;
}

/* Token 透视控制卡片 */
.inspect-control-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 18px;
  border-radius: var(--md-sys-shape-corner-large);
  background-color: var(--md-sys-color-surface-container-high);
  border: 1px solid var(--md-sys-color-outline-variant);
  box-shadow: var(--md-sys-elevation-level1);
}

.inspect-control-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.inspect-control-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--md-sys-color-on-surface);
}

/* Token 透视微徽章 */
.token-inspect-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: rgba(0, 0, 0, 0.72);
  color: #ffffff;
  font-family: monospace;
  font-size: var(--md-type-meta-size, 12px);
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 10;
  backdrop-filter: blur(8px);
}

[data-theme="dark"] .token-inspect-chip {
  background-color: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.title-with-token {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  position: relative;
}

.title-with-token .token-inspect-chip {
  position: static;
}

.token-fade-enter-active,
.token-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.token-fade-enter-from,
.token-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 模块公共 Header */
.section-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--md-sys-color-primary);
  font-weight: 600;
}

/* 4 列 Expressive 卡片 */
.expressive-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .expressive-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 599.98px) {
  .expressive-grid {
    grid-template-columns: 1fr;
  }
}

.expressive-card {
  min-height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* 几何图标底座 */
.m3-geometric-badge {
  width: 48px;
  height: 48px;
  border-radius: var(--md-sys-shape-corner-medium, 16px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.m3-geometric-badge--primary-tonal {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.m3-geometric-badge--tertiary-tonal {
  background-color: var(--md-sys-color-tertiary);
  color: var(--md-sys-color-on-tertiary);
}

.m3-geometric-badge--elevated {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.m3-geometric-badge--filled {
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-primary);
}

/* 高通透纯净白底趋势微胶囊 (针对 Primary/Tertiary Tonal) */
.tonal-trend-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-surface-container-lowest);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.tonal-trend-pill--primary {
  color: var(--md-sys-color-primary);
}

.tonal-trend-pill--tertiary {
  color: var(--md-sys-color-tertiary);
}

/* 标准普通徽章 */
.standard-trend-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
}

.standard-trend-badge.is-positive {
  color: #1b873f;
  background-color: rgba(27, 135, 63, 0.12);
}

[data-theme="dark"] .standard-trend-badge.is-positive {
  color: #4ade80;
  background-color: rgba(74, 222, 128, 0.15);
}

.card-main-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  opacity: 0.88;
}

.card-value {
  margin: 4px 0 2px 0;
}

.card-caption {
  opacity: 0.78;
  line-height: 1.4;
}

/* 五态卡片对比网格 */
.variants-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .variants-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 599.98px) {
  .variants-grid {
    grid-template-columns: 1fr;
  }
}

.variant-preview-card {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  position: relative;
}

.opacity-85 {
  opacity: 0.88;
  line-height: 1.5;
}

/* 演示区卡片 */
.demo-section {
  width: 100%;
}

.demo-card {
  padding: 28px;
}

.section-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title-wrap code {
  padding: 2px 6px;
  border-radius: var(--md-sys-shape-corner-extra-small);
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-primary);
  font-family: monospace;
}

.text-secondary {
  color: var(--md-sys-color-on-surface-variant);
}

.text-primary {
  color: var(--md-sys-color-primary);
}

/* 按钮展示群组 */
.buttons-preview-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
}

.button-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.button-row__title {
  color: var(--md-sys-color-on-surface-variant);
}

.button-row__items {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
}

/* 弹窗特性展示盒 */
.modal-feature-box {
  display: flex;
  align-items: center;
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--md-sys-shape-corner-large);
  padding: 24px;
  margin-top: 12px;
  gap: 24px;
}

@media (max-width: 599.98px) {
  .modal-feature-box {
    flex-direction: column;
    align-items: flex-start;
  }
  .feature-divider {
    width: 100% !important;
    height: 1px !important;
  }
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.feature-divider {
  width: 1px;
  height: 48px;
  background-color: var(--md-sys-color-outline-variant);
}

/* 弹窗内部样式 */
.modal-content-demo {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 8px;
}

.demo-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  color: var(--md-sys-color-on-surface);
}

.m3-text-field {
  height: 48px;
  border-radius: var(--md-sys-shape-corner-medium);
  border: 1px solid var(--md-sys-color-outline);
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  padding: 0 16px;
  font-size: 14px;
  outline: none;
  transition: border-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.m3-text-field:focus {
  border-color: var(--md-sys-color-primary);
  border-width: 2px;
}

.demo-feature-checks {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: var(--md-sys-color-surface-container);
  border-radius: var(--md-sys-shape-corner-large);
}

.check-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--md-sys-color-on-surface);
}

/* ================= 7. 表格与分页展示区增强样式 ================= */
.table-toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  flex: 1;
}

.table-toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-search-input-field {
  min-width: 260px;
  max-width: 340px;
}

.status-filter-capsules {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  background-color: var(--md-sys-color-surface-container);
}

.filter-pill {
  padding: 4px 10px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  border: none;
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);
  cursor: pointer;
  font-weight: 500;
  transition: all var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.filter-pill.is-active {
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  font-weight: 700;
  box-shadow: var(--md-sys-elevation-level1);
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.text-success {
  color: #1b873f;
}

[data-theme="dark"] .text-success {
  color: #4ade80;
}

.text-warning {
  color: #e37400;
}

[data-theme="dark"] .text-warning {
  color: #fdd663;
}

.status-capsule {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  font-weight: 600;
}

.status-capsule--healthy {
  background-color: rgba(27, 135, 63, 0.12);
  color: #1b873f;
}

[data-theme="dark"] .status-capsule--healthy {
  background-color: rgba(74, 222, 128, 0.16);
  color: #4ade80;
}

.status-capsule--warning {
  background-color: rgba(227, 116, 0, 0.12);
  color: #e37400;
}

[data-theme="dark"] .status-capsule--warning {
  background-color: rgba(253, 214, 99, 0.16);
  color: #fdd663;
}

.status-capsule--isolated {
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
}

.action-text-btn {
  border: none;
  background: transparent;
  color: var(--md-sys-color-primary);
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--md-sys-shape-corner-small, 8px);
}

/* 富文本 Tooltip 触发按钮与 SLA 气泡 */
.help-tooltip-trigger {
  width: 28px;
  height: 28px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  border: none;
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
}

.help-tooltip-trigger:hover {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-primary);
}

.tooltip-sla-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sla-pills {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 6px;
  border-top: 1px dashed var(--md-sys-color-outline-variant);
}

/* 抽屉详情主体布局 */
.drawer-detail-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.drawer-status-card {
  padding: 16px;
  border-radius: var(--md-radius-card, 16px);
  background-color: var(--md-sys-color-surface-container);
  border: 1px solid var(--md-sys-color-outline-variant);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-indicator-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.drawer-node-name {
  color: var(--md-sys-color-on-surface);
  margin: 0;
}

.drawer-metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.metric-item {
  padding: 14px 16px;
  border-radius: 12px;
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  color: var(--md-sys-color-on-surface-variant);
}

.metric-value {
  margin: 0;
  line-height: 1.1;
}

.metric-sub {
  margin-top: 2px;
}

.drawer-audit-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.drawer-subhead {
  color: var(--md-sys-color-on-surface);
  margin-bottom: 4px;
}

.audit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 8px;
  background-color: var(--md-sys-color-surface-container-lowest);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.audit-item__label-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cursor-help {
  cursor: help;
}

.drawer-footer-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}

/* 批量二次确认弹窗内部 */
.batch-confirm-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selected-nodes-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 160px;
  overflow-y: auto;
  padding: 10px;
  border-radius: 12px;
  background-color: var(--md-sys-color-surface-container-low);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.node-chip {
  padding: 4px 8px;
  border-radius: 6px;
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 600;
}

.spin-anim {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
