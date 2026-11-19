<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  Sparkles,
  ArrowRight,
  Palette,
  Layers,
  Smartphone,
  Laptop,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Zap,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-vue-next'
import { MdButton, MdCard } from '@/components/m3'

const router = useRouter()

const goToPlayground = () => {
  router.push('/playground')
}

const goToAdmin = () => {
  router.push('/')
}
</script>

<template>
  <div class="portal-showcase">
    <!-- ====================================================================
         1. Hero Section (超大 36px 圆角双色渐变主视觉区)
         ==================================================================== -->
    <section id="hero" class="hero-container">
      <div class="hero-banner">
        <!-- 左侧文本与操作 -->
        <div class="hero-content">
          <div class="hero-tag label-medium">
            <Sparkles :size="15" />
            <span>Google Material 3 Expressive 体系</span>
          </div>

          <h1 class="hero-heading">
            Design for emotion.<br />
            Built for scale.
          </h1>

          <p class="hero-desc body-large">
            面向未来的通用前端脚手架。一套语义化 Design Tokens，完美兼顾<b>“数据密集型后台工作台”</b>与<b>“高视觉张力产品官网”</b>的双轨架构。
          </p>

          <div class="hero-actions">
            <MdButton variant="filled" class="hero-btn" @click="goToPlayground">
              <template #icon><Sparkles /></template>
              探索组件演练场
              <template #trailingIcon><ArrowRight /></template>
            </MdButton>

            <MdButton variant="tonal" class="hero-btn" @click="goToAdmin">
              <template #icon><LayoutDashboard /></template>
              切换后台管理模式
            </MdButton>
          </div>

          <!-- 底部特性点缀 -->
          <div class="hero-features-list">
            <div class="feat-item body-small">
              <CheckCircle2 :size="16" class="text-tertiary" />
              <span>零硬编码颜色</span>
            </div>
            <div class="feat-item body-small">
              <CheckCircle2 :size="16" class="text-tertiary" />
              <span>双端自适应断点</span>
            </div>
            <div class="feat-item body-small">
              <CheckCircle2 :size="16" class="text-tertiary" />
              <span>Plus Jakarta Sans 排版</span>
            </div>
          </div>
        </div>

        <!-- 右侧 M3 Expressive 抽象几何插画 (SVG) -->
        <div class="hero-art-wrapper">
          <svg
            class="hero-art-svg"
            viewBox="0 0 540 460"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <!-- 渐变定义 -->
              <linearGradient id="m3GradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="var(--md-sys-color-primary)" stop-opacity="0.9" />
                <stop offset="100%" stop-color="var(--md-sys-color-primary-container)" />
              </linearGradient>

              <linearGradient id="m3GradTertiary" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="var(--md-sys-color-tertiary)" stop-opacity="0.85" />
                <stop offset="100%" stop-color="var(--md-sys-color-tertiary-container)" />
              </linearGradient>

              <linearGradient id="m3GradSecondary" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stop-color="var(--md-sys-color-secondary-container)" />
                <stop offset="100%" stop-color="var(--md-sys-color-surface-container-high)" />
              </linearGradient>

              <filter id="m3Glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="24" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- 背景环境氛围光球 -->
            <circle cx="360" cy="180" r="140" fill="url(#m3GradTertiary)" opacity="0.35" filter="url(#m3Glow)" />
            <circle cx="180" cy="280" r="160" fill="url(#m3GradPrimary)" opacity="0.25" filter="url(#m3Glow)" />

            <!-- 几何形态 1: M3 Expressive 四叶草 / 弯曲多边花瓣 (Curved Clover) -->
            <path
              d="M 270,70 
                 C 320,70 340,110 340,150 
                 C 380,150 420,170 420,220 
                 C 420,270 380,290 340,290 
                 C 340,330 320,370 270,370 
                 C 220,370 200,330 200,290 
                 C 160,290 120,270 120,220 
                 C 120,170 160,150 200,150 
                 C 200,110 220,70 270,70 Z"
              fill="url(#m3GradPrimary)"
              class="art-shape-float-1"
            />

            <!-- 几何形态 2: 旋转次级平滑圆角方块 (Super-ellipse) -->
            <rect
              x="250"
              y="160"
              width="180"
              height="180"
              rx="54"
              transform="rotate(18 250 160)"
              fill="url(#m3GradTertiary)"
              class="art-shape-float-2"
            />

            <!-- 几何形态 3: 悬浮胶囊指示器 -->
            <g class="art-badge-float">
              <rect
                x="80"
                y="110"
                width="168"
                height="56"
                rx="28"
                fill="var(--md-sys-color-surface-container-highest)"
                stroke="var(--md-sys-color-outline-variant)"
                stroke-width="1.5"
              />
              <circle cx="112" cy="138" r="14" fill="var(--md-sys-color-primary)" />
              <text
                x="136"
                y="143"
                fill="var(--md-sys-color-on-surface)"
                font-family="Plus Jakarta Sans, sans-serif"
                font-size="14"
                font-weight="600"
              >
                M3 Expressive
              </text>
            </g>

            <!-- 几何形态 4: 底部悬浮信息胶囊 -->
            <g class="art-badge-float-delayed">
              <rect
                x="280"
                y="310"
                width="196"
                height="64"
                rx="32"
                fill="var(--md-sys-color-surface)"
                stroke="var(--md-sys-color-outline-variant)"
                stroke-width="1.5"
              />
              <circle cx="316" cy="342" r="16" fill="var(--md-sys-color-tertiary)" />
              <text
                x="344"
                y="338"
                fill="var(--md-sys-color-on-surface)"
                font-family="Plus Jakarta Sans, sans-serif"
                font-size="13"
                font-weight="700"
              >
                Dual-Track Mode
              </text>
              <text
                x="344"
                y="354"
                fill="var(--md-sys-color-on-surface-variant)"
                font-family="Plus Jakarta Sans, sans-serif"
                font-size="11"
              >
                Admin + Portal
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         2. Bento Grid Section (非对称错落网格)
         ==================================================================== -->
    <section id="bento" class="bento-container">
      <div class="section-title-wrap">
        <div class="section-tag label-medium">
          <Layers :size="15" />
          <span>非对称网格系统 (Asymmetric Bento Grid)</span>
        </div>
        <h2 class="display-small section-heading">
          打破呆板平铺，重塑视觉节奏
        </h2>
        <p class="body-large text-secondary section-sub">
          借由错落的大色块、大圆角与空间留白，呈现如 Google 官网般呼吸感强烈的界面韵律。
        </p>
      </div>

      <div class="bento-grid">
        <!-- Bento 1: 跨 2 列大卡片 (Primary Tonal + 顶部几何封面) -->
        <MdCard variant="primary-tonal" clickable class="bento-card bento-col-2">
          <div class="bento-cover-art">
            <svg class="cover-svg" viewBox="0 0 560 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="80" cy="80" r="60" fill="rgba(255,255,255,0.22)" />
              <rect x="180" y="20" width="120" height="120" rx="36" fill="rgba(255,255,255,0.18)" transform="rotate(15 180 20)" />
              <path d="M 360,20 Q 420,140 480,20 T 540,140" stroke="rgba(255,255,255,0.25)" stroke-width="12" stroke-linecap="round" fill="none" />
            </svg>
          </div>
          <div class="bento-inner-content">
            <span class="label-large text-uppercase">Dynamic Color Architecture</span>
            <h3 class="headline-medium">Material You 动态调色算法</h3>
            <p class="body-medium">
              基于色调调色板算法推演，全局严禁硬编码颜色。自动建立 5 级 Surface 容器、主色/辅助色对比序列，无论是明艳高对比或是温润柔光，皆由 CSS Token 纯粹驱动。
            </p>
          </div>
        </MdCard>

        <!-- Bento 2: 1 列高饱和 Tertiary Tonal 撞色卡片 -->
        <MdCard variant="tertiary-tonal" clickable class="bento-card">
          <div class="m3-geometric-badge" style="background-color: rgba(0, 104, 116, 0.18); color: var(--md-sys-color-tertiary);">
            <Zap :size="26" />
          </div>
          <div class="bento-inner-content">
            <h3 class="headline-small">24px - 36px 柔润圆角</h3>
            <p class="body-medium">
              弱化生硬锐利的像素细线，全量启用 M3 规范的大曲率几何外壳，带来极致温润的现代触觉。
            </p>
          </div>
        </MdCard>

        <!-- Bento 3: 1 列 Elevated 微浮雕卡片 -->
        <MdCard variant="elevated" clickable class="bento-card">
          <div class="m3-geometric-badge" style="background-color: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container);">
            <Palette :size="26" />
          </div>
          <div class="bento-inner-content">
            <h3 class="headline-small">100% Token 昼夜双模</h3>
            <p class="body-medium text-secondary">
              集成首屏防闪白内联探针与 LocalStorage 记忆。平滑渐变色彩过渡，夜间模式舒适不刺眼。
            </p>
          </div>
        </MdCard>

        <!-- Bento 4: 跨 2 列横向通栏卡片 (Filled 色阶分层) -->
        <MdCard variant="filled" clickable class="bento-card bento-col-2">
          <div class="bento-row-layout">
            <div class="m3-geometric-badge" style="background-color: var(--md-sys-color-primary-container); color: var(--md-sys-color-primary);">
              <LayoutDashboard :size="26" />
            </div>
            <div class="bento-inner-content">
              <span class="label-large text-primary">Dual-Track Architecture</span>
              <h3 class="headline-small">双轨共存架构：后台管理 + 官网展示</h3>
              <p class="body-medium text-secondary">
                无需在管理系统与展示官网之间建立两套项目脚手架。一套工程代码即可二选一或同时使用 <code>AdaptiveShell</code> 与 <code>PortalShell</code>。
              </p>
            </div>
          </div>
        </MdCard>
      </div>
    </section>

    <!-- ====================================================================
         3. Components Section (组件与微交互快速预览)
         ==================================================================== -->
    <section id="components" class="components-preview-container">
      <MdCard variant="outlined" class="preview-hero-card">
        <div class="preview-card-inner">
          <div class="preview-text">
            <div class="section-tag label-medium">
              <Sliders :size="15" />
              <span>开箱即用的原子组件库</span>
            </div>
            <h2 class="headline-medium">响应式原子组件随时调用</h2>
            <p class="body-large text-secondary">
              <code>MdButton</code>、<code>MdCard</code>、<code>AdaptiveModal</code>，全量采用 Composition API 与 TypeScript 类型声明。
            </p>
            <div class="preview-actions">
              <MdButton variant="filled" @click="goToPlayground">
                <template #icon><Sparkles /></template>
                立即进入完整演练场
                <template #trailingIcon><ArrowRight /></template>
              </MdButton>
            </div>
          </div>

          <div class="preview-demo-interactive">
            <div class="interactive-sample-box">
              <div class="sample-title label-medium">按钮四态微交互预览</div>
              <div class="sample-buttons">
                <MdButton variant="filled">Filled 按钮</MdButton>
                <MdButton variant="tonal">Tonal 按钮</MdButton>
                <MdButton variant="outlined">Outlined 按钮</MdButton>
                <MdButton variant="text">Text 按钮</MdButton>
              </div>
            </div>
          </div>
        </div>
      </MdCard>
    </section>
  </div>
</template>

<style scoped>
.portal-showcase {
  display: flex;
  flex-direction: column;
  gap: 72px;
  width: 100%;
}

/* ================= 1. Hero 视觉横幅 ================= */
.hero-container {
  max-width: 1120px;
  margin: 24px auto 0 auto;
  padding: 0 20px;
  width: 100%;
}

.hero-banner {
  border-radius: 36px;
  padding: 56px 56px;
  background: radial-gradient(
      circle at 85% 20%,
      var(--md-sys-color-tertiary-container) 0%,
      transparent 45%
    ),
    radial-gradient(
      circle at 15% 85%,
      var(--md-sys-color-primary-container) 0%,
      transparent 55%
    ),
    var(--md-sys-color-surface-container-low);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: var(--md-sys-elevation-level1);
}

.hero-content {
  flex: 1.15;
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 2;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 600;
  width: fit-content;
}

.hero-heading {
  font-size: 3.25rem;
  line-height: 1.12;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--md-sys-color-on-surface);
}

.hero-desc {
  color: var(--md-sys-color-on-surface-variant);
  max-width: 520px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.hero-btn {
  height: 44px;
  padding: 0 24px;
}

.hero-features-list {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.feat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--md-sys-color-on-surface);
  font-weight: 500;
}

.text-tertiary {
  color: var(--md-sys-color-tertiary);
}

/* 右侧抽象插画 */
.hero-art-wrapper {
  flex: 0.95;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.hero-art-svg {
  width: 100%;
  max-width: 460px;
  height: auto;
  overflow: visible;
}

/* 动效 */
.art-shape-float-1 {
  animation: floatArt1 8s ease-in-out infinite alternate;
  transform-origin: center;
}

.art-shape-float-2 {
  animation: floatArt2 10s ease-in-out infinite alternate;
  transform-origin: center;
}

.art-badge-float {
  animation: floatBadge 6s ease-in-out infinite alternate;
}

.art-badge-float-delayed {
  animation: floatBadge 7s ease-in-out 1.5s infinite alternate;
}

@keyframes floatArt1 {
  0% { transform: scale(1) rotate(0deg); }
  100% { transform: scale(1.05) rotate(6deg); }
}

@keyframes floatArt2 {
  0% { transform: scale(1) rotate(18deg); }
  100% { transform: scale(0.96) rotate(12deg); }
}

@keyframes floatBadge {
  0% { transform: translateY(0); }
  100% { transform: translateY(-8px); }
}

/* ================= 2. Bento Grid 网格 ================= */
.bento-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.section-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
}

.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--md-sys-color-primary);
  font-weight: 600;
}

.section-heading {
  color: var(--md-sys-color-on-surface);
}

.section-sub {
  max-width: 680px;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.bento-card {
  padding: 32px;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bento-col-2 {
  grid-column: span 2;
}

.bento-cover-art {
  height: 120px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 8px;
}

.cover-svg {
  width: 100%;
  height: 100%;
}

.bento-inner-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  opacity: 0.8;
}

.bento-row-layout {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

/* ================= 3. Components Preview ================= */
.components-preview-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.preview-hero-card {
  padding: 44px;
  border-radius: 32px;
  background-color: var(--md-sys-color-surface-container-low);
}

.preview-card-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

.preview-text {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.preview-actions {
  margin-top: 10px;
}

.preview-demo-interactive {
  flex: 1;
  display: flex;
  justify-content: center;
}

.interactive-sample-box {
  width: 100%;
  max-width: 380px;
  background-color: var(--md-sys-color-surface);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid var(--md-sys-color-outline-variant);
  box-shadow: var(--md-sys-elevation-level1);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sample-title {
  color: var(--md-sys-color-on-surface-variant);
}

.sample-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 通用辅助类 */
.text-secondary {
  color: var(--md-sys-color-on-surface-variant);
}

.text-primary {
  color: var(--md-sys-color-primary);
}

/* ================= 响应式调整 ================= */
@media (max-width: 900px) {
  .hero-banner {
    flex-direction: column;
    padding: 36px 28px;
  }
  .hero-heading {
    font-size: 2.5rem;
  }
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-col-2 {
    grid-column: span 1;
  }
  .preview-card-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 599.98px) {
  .hero-banner {
    border-radius: 28px;
    padding: 28px 20px;
  }
  .hero-heading {
    font-size: 2rem;
  }
  .bento-card {
    padding: 24px;
    border-radius: 24px;
  }
}
</style>
