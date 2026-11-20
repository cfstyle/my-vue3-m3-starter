---
trigger: always_on
---

# Vue 3 + Material Design 3 技术栈开发规范与铁律

本规则文件为当前项目的强制性开发铁律，所有 AI 助手、代码生成器以及协作者在新增、重构或修改代码时必须 100% 遵守：

## 1. 核心技术栈与架构规范
- **语言与组件规范**：必须全量采用 Vue 3 Composition API，所有组件与页面必须使用 `<script setup lang="ts">` 编写，严禁使用 Options API 或普通 `<script>`。
- **图标规范**：全局统一使用现代线性图标库 `lucide-vue-next`，严禁随意引入第三方未统一样式的图标库，严禁手写散乱的硬编码 inline SVG。
- **状态管理**：复杂全局状态统一由 `Pinia` 存储管理，主题状态挂载在 `useThemeStore` 中。

## 2. 双轨路由与布局外壳体系 (Dual-Track Layouts)
本项目原生支持**“后台管理工作台”**与**“产品展示官网”**双轨共存模式，二者共享底层 Design Tokens 与 M3 原子组件：
- **后台管理模式 (`src/layouts/AdaptiveShell.vue`)**：适合数据看板、复杂交互与管理后台系统：
  - 手机端 (`< 600px` Compact)：强制使用底部 80px Navigation Bar + 64px 顶栏 + 底部滑出抽屉（Bottom Sheet）。
  - 平板端 (`600px - 839px` Medium)：左侧 80px 窄边导航轨（Navigation Rail）。
  - 宽屏端 (`>= 840px` Expanded)：左侧 260px 展开导航抽屉（Navigation Drawer）+ 居中内容区域（最大宽度 1280px）。
- **官网展示模式 (`src/layouts/PortalShell.vue`)**：适合产品官网、品牌展示与 C 端应用：
  - 去掉常驻侧边栏，释放 100% 横向视野。
  - 采用顶部居中悬浮毛玻璃胶囊导航栏（`backdrop-filter: blur(20px)`，圆角 `9999px`）。
  - 包含超大圆角 Hero Banner（`36px` 圆角）、非对称 Bento Grid 网格布局与标准 M3 页脚。
- **业务项目选型**：日后基于本脚手架开新项目时，可根据业务场景在 `AdaptiveShell` 与 `PortalShell` 之间二选一为主入口，亦可保持双轨混合共存。

## 3. 设计规范与色彩约束（严禁硬编码颜色）
- **禁止硬编码颜色**：严禁在 CSS/style 中直接使用 `#fff`, `#333`, `rgb(...)` 等硬编码颜色代码。
- **严禁使用 Tailwind 冷蓝灰（No Tailwind Slate/Gray）**：严禁在组件或页面中直接使用 Tailwind 的 `bg-slate-*`、`text-slate-*`、`border-slate-*` 或 `bg-gray-*`（这些默认色阶带有冷蓝底色，会破坏 Studio 极简主题与 HCT 动态主题的纯正色彩），所有背景与边框必须通过 `var(--md-sys-color-surface-container-*)` 与 `var(--md-sys-color-outline-variant)` 引用。
- **严格遵循 M3 Tokens**：所有颜色属性必须使用 `src/styles/m3-tokens.css` 中声明的标准语义化 CSS 变量：
  - 背景与容器：`var(--md-sys-color-surface)`, `var(--md-sys-color-surface-container-low)`, `var(--md-sys-color-surface-container)`, `var(--md-sys-color-surface-container-high)`, `var(--md-sys-color-surface-container-highest)`。
  - 前景与文字：`var(--md-sys-color-on-surface)`, `var(--md-sys-color-on-surface-variant)`。
  - 强调色与撞色：`var(--md-sys-color-primary)`, `var(--md-sys-color-on-primary)`, `var(--md-sys-color-primary-container)`, `var(--md-sys-color-tertiary)`, `var(--md-sys-color-tertiary-container)` 等。
  - 描边线：`var(--md-sys-color-outline)`, `var(--md-sys-color-outline-variant)`。
  - 圆角统一采用：`var(--md-sys-shape-corner-*)`，卡片默认推荐 `24px`。
- **状态层规范**：交互元素必须使用 `.md-state-layer` 工具类，以确保 Hover (8%) 与 Active (12%) 透明遮罩反馈的统一。

## 4. 组件复用原则
- 基础组件一律优先复用 `src/components/m3/` 目录下的原子组件：
  - `MdButton`: 支持 filled / tonal / outlined / text，全圆角 9999px，含 M3 Expressive 微动效。
  - `MdCard`: 支持 elevated / filled / outlined / primary-tonal / tertiary-tonal 五种形态，默认 24px 圆角。
  - `MdInput` & `MdSelect`: 原生输入与选择原语，支持 `sm`（36px 单行紧凑筛选专用）与 `md`（40px 表单专用）尺寸，支持 `clearable`、前置插槽与防裁剪 Teleport，与 `MdButton` 实现 100% 像素级等高对齐。
  - `MdSwitch`: 标准 52×32px 轨道，未选 16px 滑块，选中 24px 放大并支持勾选图标。
  - `AdaptiveModal`: 移动端底部滑出 Bottom Sheet，PC 端居中 Dialog 自动适配弹窗。
  - `MdDrawer`: 移动端底部抽屉、桌面端右侧滑出抽屉，内置固定头尾与滚动穿透防护。
  - `MdTooltip` & `MdSnackbar`: 纯文本微胶囊与富文本 SLA 帮助气泡，以及全局 Toast 通知套件。
  - `MdTable` & `MdPagination`: 零第三方依赖、Vue 3 全泛型约束的轻量表格与分页套件，支持多选、排序、骨架屏与插槽定制。
  - `MdChartCard`: 标准 M3 图表容器，内置双态分段原位切换（可视化图表 / 底层明细表）与零依赖 UTF-8 BOM CSV 导出套件。
- **单行水平内联筛选栏原则**：表格上方的筛选工具栏必须使用单行水平内联布局（所有控件高度统一为 `36px`），严禁使用两行垂直堆叠结构或外包深灰大卡片。
- **禁止私自引入重型 UI 库**（如 Element Plus、Ant Design Vue 等），保持项目的纯粹与轻量性。常规列表使用 `MdTable`，超复杂交互仅允许套用 `@tanstack/vue-table` 无头逻辑。
