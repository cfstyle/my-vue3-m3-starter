# Material Design 3 视觉与 Token 架构规范 (M3 Design System)

本文档定义当前项目及后续基于本 Template 衍生项目必须严格遵循的 M3 视觉设计与 Token 契约：

## 1. 颜色与 Token 契约（零硬编码原则）
- **严禁硬编码颜色**：严禁在 template、style 或 ts 逻辑中使用 `#fff`, `#000`, `rgb(...)`, `hsl(...)` 等原始色值。
- **动态 HCT 色板**：所有颜色全部来自 `@material/material-color-utilities` 动态计算注入的 CSS 语义变量：
  - **背景与分层容器**：
    - 页面基底：`var(--md-sys-color-surface)`
    - 低层容器：`var(--md-sys-color-surface-container-low)`
    - 标准容器：`var(--md-sys-color-surface-container)`
    - 高层容器：`var(--md-sys-color-surface-container-high)`
    - 最高层容器：`var(--md-sys-color-surface-container-highest)`
    - 最低纯色微容器：`var(--md-sys-color-surface-container-lowest)`
  - **前景色与排版文本**：
    - 主要文本：`var(--md-sys-color-on-surface)`
    - 次级/弱化文本：`var(--md-sys-color-on-surface-variant)`
    - 禁用态文本：`rgba(..., 0.38)` 或 `var(--md-sys-color-on-surface)` 配透明度
  - **强调色序列 (Primary / Secondary / Tertiary)**：
    - 主强调：`var(--md-sys-color-primary)`, `var(--md-sys-color-on-primary)`, `var(--md-sys-color-primary-container)`, `var(--md-sys-color-on-primary-container)`
    - 次级强调：`var(--md-sys-color-secondary)`, `var(--md-sys-color-secondary-container)`
    - 第三强调色（撞色焦点）：`var(--md-sys-color-tertiary)`, `var(--md-sys-color-on-tertiary)`, `var(--md-sys-color-tertiary-container)`
  - **描边**：
    - 标准描边：`var(--md-sys-color-outline)`
    - 柔和微描边：`var(--md-sys-color-outline-variant)`

## 2. 形状、圆角与投影约束
- **禁止重阴影 (No Heavy Drop Shadows)**：
  - M3 依靠不同层次的容器背景色（`surface-container-*`）和微描边（`outline-variant`）划分空间边界。
  - 阴影仅允许使用轻量变量：`var(--md-sys-elevation-level1)` 至 `level3`，禁止手写黑糊粗重的 CSS `box-shadow`。
- **大曲率柔润圆角**：
  - 卡片标准圆角：`var(--md-sys-shape-corner-large, 24px)`。
  - 官网 Hero Banner：`36px`。
  - 按钮与微交互药丸：`var(--md-sys-shape-corner-full, 9999px)`。
  - 图标独立几何底座：`12px - 16px`。

## 3. 双端自适应与双密度约束 (Responsive & Density)
- **断点系统**：
  - Compact 手机端 (`< 600px`)：64px 顶栏 + 80px 底部导航栏（Bottom Navigation Bar）+ 底部抽屉模态（Bottom Sheet）。
  - Medium 平板端 (`600px - 839px`)：80px 窄边导航轨（Navigation Rail）。
  - Expanded PC 宽屏端 (`>= 840px`)：支持 256px 导航抽屉（Drawer）与 80px 紧凑导航轨（Rail）之间自由平滑折叠。
- **双密度设计 (Density Modes)**：
  - `comfortable`（舒适模式）：适用于日常浏览与官网形态，内边距宽松，行高舒适。
  - `compact`（紧凑模式）：适用于高密度数据表格、高频后台操作与监控看板，紧凑排列，提高信息密度。
- **数字显示**：
  - 所有指标、金钱、计数、版本号强制挂载 `.tabular-nums` 等宽特性，防止数字跳动。

## 4. 图标与状态层
- 全局单一图标库：`lucide-vue-next`。
- 交互状态层：所有可点击控件统一应用 `.md-state-layer`（Hover 8%、Active 12% 半透明反馈）。
