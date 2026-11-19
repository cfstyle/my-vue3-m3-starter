<script setup lang="ts">
import { ref } from 'vue'
import {
  MdButton,
  MdCard,
  AdaptiveModal
} from '@/components/m3'
import {
  Users,
  Activity,
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
  Sparkles
} from 'lucide-vue-next'

const isModalOpen = ref(false)
const demoInput = ref('')

const openModal = () => {
  isModalOpen.value = true
}

const handleConfirm = () => {
  alert(`提交成功: ${demoInput.value || '未输入内容'}`)
  isModalOpen.value = false
}

// 4 组响应式指标数据
const stats = [
  {
    title: '全平台活跃用户',
    value: '48,290',
    change: '+18.4%',
    isPositive: true,
    icon: Users,
    variant: 'elevated' as const,
    containerClass: 'surface-container-low'
  },
  {
    title: '今日 API 吞吐量',
    value: '1.24M',
    change: '+9.2%',
    isPositive: true,
    icon: Activity,
    variant: 'filled' as const,
    containerClass: 'surface-container'
  },
  {
    title: '系统可用性 SLI',
    value: '99.99%',
    change: '稳定',
    isPositive: true,
    icon: ShieldCheck,
    variant: 'outlined' as const,
    containerClass: 'surface'
  },
  {
    title: '边缘存储利用率',
    value: '38.6%',
    change: '-2.1%',
    isPositive: false,
    icon: HardDrive,
    variant: 'elevated' as const,
    containerClass: 'surface-container-high'
  }
]
</script>

<template>
  <div class="playground-view">
    <!-- 顶部标题区 -->
    <section class="welcome-section">
      <div class="welcome-header">
        <div class="welcome-chip label-medium">
          <Sparkles :size="14" />
          <span>开发参考演练场 (Playground)</span>
        </div>
        <h1 class="headline-large welcome-title">Material Design 3 组件规范展示</h1>
        <p class="body-large welcome-subtitle">
          在此测试和参考 M3 原子组件 (`MdButton`、`MdCard`、`AdaptiveModal`) 以及 Design Tokens 配色规范。
        </p>
      </div>
    </section>

    <!-- 1. 4 列响应式数据指标卡片 (M3 色调分层) -->
    <section class="stats-grid">
      <MdCard
        v-for="(item, index) in stats"
        :key="index"
        :variant="item.variant"
        class="stat-card"
        :class="item.containerClass"
      >
        <div class="stat-card__header">
          <span class="stat-card__title label-large">{{ item.title }}</span>
          <div class="stat-card__icon-badge">
            <component :is="item.icon" :size="20" />
          </div>
        </div>
        <div class="stat-card__body">
          <span class="stat-card__value display-small">{{ item.value }}</span>
          <div class="stat-card__trend label-medium" :class="{ 'is-positive': item.isPositive }">
            <TrendingUp :size="16" />
            <span>{{ item.change }} 较昨日</span>
          </div>
        </div>
      </MdCard>
    </section>

    <!-- 2. M3 基础按钮变体展示区 -->
    <section class="demo-section">
      <MdCard variant="elevated" class="demo-card">
        <template #header>
          <div class="section-title-wrap">
            <h2 class="title-large">M3 按钮原子组件 (MdButton)</h2>
            <p class="body-medium text-secondary">
              支持 Filled / Tonal / Outlined / Text 四种形态，全圆角 9999px，集成 Hover 8% / Active 12% 状态层透明遮罩
            </p>
          </div>
        </template>

        <div class="buttons-preview-group">
          <div class="button-row">
            <div class="button-row__title label-medium">基础四态</div>
            <div class="button-row__items">
              <MdButton variant="filled">
                Filled 填充按钮
              </MdButton>
              <MdButton variant="tonal">
                Tonal 色调按钮
              </MdButton>
              <MdButton variant="outlined">
                Outlined 描边按钮
              </MdButton>
              <MdButton variant="text">
                Text 文本按钮
              </MdButton>
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

    <!-- 3. 双端自适应弹窗交互演示区 -->
    <section class="demo-section">
      <MdCard variant="outlined" class="demo-card">
        <template #header>
          <div class="section-title-wrap">
            <h2 class="title-large">双端自适应模态框 (AdaptiveModal)</h2>
            <p class="body-medium text-secondary">
              在手机端 (&lt; 600px) 自动从底部滑出为 <b>Bottom Sheet</b>（顶部圆角 28px + 拖拽手柄）；在 PC 端 (&gt;= 600px) 自动呈现为屏幕居中的 <b>Dialog</b>（全圆角 28px）。
            </p>
          </div>
        </template>

        <div class="modal-feature-box">
          <div class="feature-item">
            <div class="feature-icon"><Smartphone :size="24" /></div>
            <div class="feature-text">
              <div class="title-medium">手机端形态 (&lt; 600px)</div>
              <div class="body-small text-secondary">底部抽屉，滑入手柄，贴合移动端手势操作规范</div>
            </div>
          </div>
          <div class="feature-divider"></div>
          <div class="feature-item">
            <div class="feature-icon"><Laptop :size="24" /></div>
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
      title="自适应设计验证"
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
            <span class="body-medium">已连接 M3 全局系统颜色 Token</span>
          </div>
          <div class="check-item">
            <CheckCircle2 :size="18" class="text-primary" />
            <span class="body-medium">支持深浅色无闪烁平滑换肤</span>
          </div>
          <div class="check-item">
            <CheckCircle2 :size="18" class="text-primary" />
            <span class="body-medium">Vue 3 Composition API + TypeScript 完整类型推断</span>
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
  gap: 28px;
}

.welcome-section {
  padding: 8px 0;
}

.welcome-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  margin-bottom: 12px;
}

.welcome-title {
  color: var(--md-sys-color-on-surface);
  font-weight: 600;
  margin-bottom: 6px;
}

.welcome-subtitle {
  color: var(--md-sys-color-on-surface-variant);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 599.98px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  padding: 20px;
  border-radius: var(--md-sys-shape-corner-large);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-card.surface-container-low {
  background-color: var(--md-sys-color-surface-container-low);
}

.stat-card.surface-container {
  background-color: var(--md-sys-color-surface-container);
}

.stat-card.surface {
  background-color: var(--md-sys-color-surface);
}

.stat-card.surface-container-high {
  background-color: var(--md-sys-color-surface-container-high);
}

.stat-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-card__title {
  color: var(--md-sys-color-on-surface-variant);
}

.stat-card__icon-badge {
  width: 36px;
  height: 36px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card__value {
  color: var(--md-sys-color-on-surface);
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: 8px;
}

.stat-card__trend {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--md-sys-color-on-surface-variant);
}

.stat-card__trend.is-positive {
  color: #1b873f;
}
[data-theme="dark"] .stat-card__trend.is-positive {
  color: #4ade80;
}

.demo-section {
  width: 100%;
}

.demo-card {
  padding: 24px;
}

.section-title-wrap {
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

.buttons-preview-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 12px;
}

.button-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.button-row__title {
  color: var(--md-sys-color-on-surface-variant);
}

.button-row__items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.modal-feature-box {
  display: flex;
  align-items: center;
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: var(--md-sys-shape-corner-medium);
  padding: 20px;
  margin-top: 8px;
  gap: 20px;
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
  gap: 14px;
  flex: 1;
}

.feature-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--md-sys-shape-corner-medium);
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-divider {
  width: 1px;
  height: 40px;
  background-color: var(--md-sys-color-outline-variant);
}

.modal-content-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  border-radius: var(--md-sys-shape-corner-small);
  border: 1px solid var(--md-sys-color-outline);
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  padding: 0 14px;
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
  gap: 10px;
  padding: 12px;
  background-color: var(--md-sys-color-surface-container);
  border-radius: var(--md-sys-shape-corner-medium);
}

.check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--md-sys-color-on-surface);
}
</style>
