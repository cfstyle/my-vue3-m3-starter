<script setup lang="ts">
import { ref } from 'vue'
import {
  MdButton,
  MdCard,
  MdSwitch,
  AdaptiveModal
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
  Info
} from 'lucide-vue-next'

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
  alert(`提交成功: ${demoInput.value || '未输入内容'}`)
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
</script>

<template>
  <div class="playground-view">
    <!-- 1. 顶部 Expressive 视觉张力大标题 + Token 透视开关 -->
    <section class="hero-section">
      <div class="hero-header-row">
        <div class="hero-title-area">
          <div class="hero-chip label-medium">
            <Sparkles :size="15" />
            <span>Material 3 Expressive 体系</span>
          </div>
          <h1 class="headline-large hero-title">
            高级质感与色彩撞色演练场
          </h1>
          <p class="body-large hero-subtitle">
            融合 Google Fonts <code>Plus Jakarta Sans</code> 排版张力、24px 柔润圆角、独立几何图标底座与高辨识度色彩容器撞色。
          </p>
        </div>

        <!-- Token 透视模式开关 (Inspect Mode Toggle) -->
        <div class="inspect-control-card">
          <div class="inspect-control-info">
            <div class="inspect-control-title">
              <Eye :size="18" class="text-primary" />
              <span class="label-large">Token 透视模式</span>
            </div>
            <span class="body-small text-secondary">
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
        <div class="section-tag label-medium">
          <Palette :size="14" />
          <span>色彩容器撞色与几何底座 (Color-Block & Geometry)</span>
        </div>
        <h2 class="headline-medium">高级色彩层级与微交互</h2>
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
            <div v-if="isInspectMode" class="token-inspect-chip label-small">
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
              :class="['tonal-trend-pill', 'label-medium', `tonal-trend-pill--${card.tonalTheme}`]"
            >
              <TrendingUp :size="14" />
              <span class="tabular-nums font-bold">{{ card.change }}</span>
            </div>
            <div
              v-else
              class="standard-trend-badge label-medium"
              :class="{ 'is-positive': card.isPositive }"
            >
              <TrendingUp v-if="card.isPositive" :size="14" />
              <span class="tabular-nums">{{ card.change }}</span>
            </div>
          </div>

          <div class="card-main-content">
            <span class="card-title label-large">{{ card.title }}</span>
            <span class="card-value display-small tabular-nums">{{ card.value }}</span>

            <!-- 商业级模式显示真实业务环比，透视模式显示底层说明 -->
            <span class="card-caption body-small">
              {{ isInspectMode ? `容器角色: ${card.variant}` : card.businessCaption }}
            </span>
          </div>
        </MdCard>
      </div>
    </section>

    <!-- 3. 五态卡片形态对比专区 -->
    <section class="demo-section">
      <div class="section-header">
        <div class="section-tag label-medium">
          <Layers :size="14" />
          <span>卡片形态对比 (MdCard Variants)</span>
        </div>
        <h2 class="headline-medium">五种 M3 标准与高饱和色块卡片</h2>
      </div>

      <div class="variants-grid">
        <MdCard variant="primary-tonal" clickable class="variant-preview-card">
          <div v-if="isInspectMode" class="token-inspect-chip label-small">
            <span>--md-sys-color-primary-container</span>
          </div>
          <span class="title-medium">Primary Tonal</span>
          <p class="body-small opacity-85">高饱和主色调容器，适合核心引导或重点业务看板，无边框设计。</p>
        </MdCard>

        <MdCard variant="tertiary-tonal" clickable class="variant-preview-card">
          <div v-if="isInspectMode" class="token-inspect-chip label-small">
            <span>--md-sys-color-tertiary-container</span>
          </div>
          <span class="title-medium">Tertiary Tonal</span>
          <p class="body-small opacity-85">高辨识度第三强调色容器，跟随动态 HCT 种子调和，带来活力与丰富层级。</p>
        </MdCard>

        <MdCard variant="elevated" clickable class="variant-preview-card">
          <div v-if="isInspectMode" class="token-inspect-chip label-small">
            <span>surface-container-low · elevation-1</span>
          </div>
          <span class="title-medium">Elevated</span>
          <p class="body-small text-secondary">经典 1 级阴影与低层容器，悬停平滑提升至 2 级阴影。</p>
        </MdCard>

        <MdCard variant="filled" clickable class="variant-preview-card">
          <div v-if="isInspectMode" class="token-inspect-chip label-small">
            <span>surface-container-highest</span>
          </div>
          <span class="title-medium">Filled</span>
          <p class="body-small text-secondary">最高容器层级，完全依托纯色块对比划分界面边界。</p>
        </MdCard>

        <MdCard variant="outlined" clickable class="variant-preview-card">
          <div v-if="isInspectMode" class="token-inspect-chip label-small">
            <span>surface + outline-variant (1px)</span>
          </div>
          <span class="title-medium">Outlined</span>
          <p class="body-small text-secondary">优雅细描边，背景通透，适用于平铺次要选项。</p>
        </MdCard>
      </div>
    </section>

    <!-- 4. 按钮变体与微交互展示区 -->
    <section class="demo-section">
      <MdCard variant="elevated" class="demo-card">
        <template #header>
          <div class="section-title-wrap">
            <div class="title-with-token">
              <h2 class="headline-small">M3 按钮原子组件 (带 Expressive 弹性微浮动效)</h2>
              <span v-if="isInspectMode" class="token-inspect-chip label-small">
                shape: 9999px · state-layer: 8%/12%
              </span>
            </div>
            <p class="body-medium text-secondary">
              支持 Filled / Tonal / Outlined / Text，全圆角 9999px，Hover 时弹性上浮 <code>translateY(-1px)</code>，配合 Hover 8% / Active 12% 状态层透明遮罩。
            </p>
          </div>
        </template>

        <div class="buttons-preview-group">
          <div class="button-row">
            <div class="button-row__title label-medium">基础四态</div>
            <div class="button-row__items">
              <MdButton variant="filled">Filled 填充按钮</MdButton>
              <MdButton variant="tonal">Tonal 色调按钮</MdButton>
              <MdButton variant="outlined">Outlined 描边按钮</MdButton>
              <MdButton variant="text">Text 文本按钮</MdButton>
            </div>
          </div>

          <div class="button-row">
            <div class="button-row__title label-medium">带线性图标 (lucide-vue-next)</div>
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
            <div class="button-row__title label-medium">禁用态 (Disabled)</div>
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
              <h2 class="headline-small">M3 触控开关原子组件 (MdSwitch)</h2>
              <span v-if="isInspectMode" class="token-inspect-chip label-small">
                track: 52×32px · thumb: 16px/24px
              </span>
            </div>
            <p class="body-medium text-secondary">
              标准 <code>52px × 32px</code> 轨道；未选中时滑块 <code>16px</code>（outline 边框与填充）；选中时轨道切换 primary，滑块平滑放大至 <code>24px</code>（on-primary 填充），内嵌可选指示图标。
            </p>
          </div>
        </template>

        <div class="button-row__items" style="gap: 28px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <MdSwitch v-model="switch1" />
            <span class="label-large">基础开关：{{ switch1 ? '开启' : '关闭' }}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <MdSwitch v-model="switch2">
              <template #checkedIcon><Check /></template>
            </MdSwitch>
            <span class="label-large">带勾号图标：{{ switch2 ? '已勾选' : '未勾选' }}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <MdSwitch v-model="switch3" disabled />
            <span class="label-large text-secondary">禁用状态 (Disabled)</span>
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
              <h2 class="headline-small">双端自适应模态框 (AdaptiveModal)</h2>
              <span v-if="isInspectMode" class="token-inspect-chip label-small">
                Mobile: Bottom Sheet (r: 28px top) · PC: Dialog (r: 28px)
              </span>
            </div>
            <p class="body-medium text-secondary">
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
              <div class="title-medium">手机端形态 (&lt; 600px)</div>
              <div class="body-small text-secondary">贴底抽屉，滑入手柄，贴合移动端原生单手手势操作</div>
            </div>
          </div>
          <div class="feature-divider"></div>
          <div class="feature-item">
            <div class="m3-geometric-badge" style="background-color: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container);">
              <Laptop :size="24" />
            </div>
            <div class="feature-text">
              <div class="title-medium">桌面端形态 (&gt;= 600px)</div>
              <div class="body-small text-secondary">居中模态对话框，支持 ESC 键与点击遮罩极速关闭</div>
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

    <!-- 自适应弹窗实例 -->
    <AdaptiveModal
      v-model="isModalOpen"
      title="M3 Expressive 设计验证"
      description="您可以尝试调整浏览器窗口宽度（拉大或缩小至 600px 以下），观察弹窗形态与交互的无缝转变。"
    >
      <div class="modal-content-demo">
        <div class="demo-form-field">
          <label class="label-large form-label">配置项名称</label>
          <input
            v-model="demoInput"
            type="text"
            placeholder="请输入测试参数或标签..."
            class="m3-text-field"
          />
        </div>

        <div class="demo-feature-checks">
          <div class="check-item">
            <CheckCircle2 :size="18" class="text-primary" />
            <span class="body-medium">引入 Google Fonts (Plus Jakarta Sans + Noto Sans SC)</span>
          </div>
          <div class="check-item">
            <CheckCircle2 :size="18" class="text-primary" />
            <span class="body-medium">已支持 Primary Tonal 与 Tertiary Tonal 高级色彩容器撞色</span>
          </div>
          <div class="check-item">
            <CheckCircle2 :size="18" class="text-primary" />
            <span class="body-medium">卡片圆角全量进化至 24px，集成 48px 几何独立图标底座</span>
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
  font-size: 11px;
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
  font-weight: 700;
  line-height: 1.1;
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
</style>
