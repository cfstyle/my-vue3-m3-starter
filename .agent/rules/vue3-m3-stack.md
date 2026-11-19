---
trigger: always_on
---

# Vue 3 + Material Design 3 技术栈开发规范与铁律

本规则文件为当前项目的强制性开发铁律，所有 AI 助手、代码生成器以及协作者在新增、重构或修改代码时必须 100% 遵守：

## 1. 核心技术栈与架构规范
- **语言与组件规范**：必须全量采用 Vue 3 Composition API，所有组件与页面必须使用 `<script setup lang="ts">` 编写，严禁使用 Options API 或普通 `<script>`。
- **图标规范**：全局统一使用现代线性图标库 `lucide-vue-next`，严禁随意引入第三方未统一样式的图标库，严禁手写散乱的硬编码 inline SVG。
- **状态管理**：复杂全局状态统一由 `Pinia` 存储管理，主题状态挂载在 `useThemeStore` 中。

## 2. 路由与自适应布局外壳
- **外壳继承**：所有新建业务页面必须挂载在 `src/layouts/AdaptiveShell.vue` 路由体系的 children 下，严格遵循 M3 双端响应式断点体系：
  - 手机端 (`< 600px` Compact)：强制使用底部 80px Navigation Bar + 64px 顶栏 + 底部滑出抽屉（Bottom Sheet）。
  - 平板端 (`600px - 839px` Medium)：左侧 80px 窄边导航轨（Navigation Rail）。
  - 宽屏端 (`>= 840px` Expanded)：左侧 260px 展开导航抽屉（Navigation Drawer）+ 居中内容区域（最大宽度 1280px）。

## 3. 设计规范与色彩约束（严禁硬编码颜色）
- **禁止硬编码颜色**：严禁在 CSS/style 中直接使用 `#fff`, `#333`, `rgb(...)` 等硬编码颜色代码。
- **严格遵循 M3 Tokens**：所有颜色属性必须使用 `src/styles/m3-tokens.css` 中声明的标准语义化 CSS 变量：
  - 背景与容器：`var(--md-sys-color-surface)`, `var(--md-sys-color-surface-container-low)`, `var(--md-sys-color-surface-container)`, `var(--md-sys-color-surface-container-high)`, `var(--md-sys-color-surface-container-highest)`。
  - 前景与文字：`var(--md-sys-color-on-surface)`, `var(--md-sys-color-on-surface-variant)`。
  - 强调色：`var(--md-sys-color-primary)`, `var(--md-sys-color-on-primary)`, `var(--md-sys-color-secondary-container)` 等。
  - 描边线：`var(--md-sys-color-outline)`, `var(--md-sys-color-outline-variant)`。
  - 圆角统一采用：`var(--md-sys-shape-corner-*)`。
- **状态层规范**：交互元素必须使用 `.md-state-layer` 工具类，以确保 Hover (8%) 与 Active (12%) 透明遮罩反馈的统一。

## 4. 组件复用原则
- 基础组件一律优先复用 `src/components/m3/` 目录下的原子组件：
  - `MdButton`: 支持 filled / tonal / outlined / text，全圆角 9999px。
  - `MdCard`: 支持 elevated / filled / outlined 三种标准卡片形态。
  - `AdaptiveModal`: 移动端底部滑出 Bottom Sheet，PC 端居中 Dialog 自动适配弹窗。
- **禁止私自引入重型 UI 库**（如 Element Plus、Ant Design Vue 等），保持项目的纯粹与轻量性。
