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
- **状态胶囊防折行铁律 (Badge & Tag No-Wrap Guard)**：所有状态胶囊（Badge / Tag / Pill）必须强制声明 `whitespace-nowrap shrink-0`（或使用全局 `.type-badge`），从样式底层与结构上禁止出现挤压换行、多行断字的残损徽章。

## 5. 5 级双端模数排印音阶铁律 (Modular Type Scale)
全站彻底废弃散落的 `11px`、`32px`、`48px` 等非标字号，所有业务页面必须严格使用 5 级语义字阶体系，严禁在 template 或 style 中手写非标字号：
- **5 级语义层级（通过 `[data-context="admin"]` 与 `[data-context="portal"]` 自动切换）**：
  - **Tier 1 `.type-display`（视觉焦点）**：
    - Admin 下 `26px`（行高 `32px`，用于 KPI 核心大数字，强制开启 `tabular-nums`，字重 `700`，字距 `-0.02em`）；
    - Portal 下 `42px`（行高 `50px`，用于首屏 Hero 主标题，字重 `700`，字距 `-0.02em`）。
  - **Tier 2 `.type-title-lg`（页面/区块标题）**：
    - Admin 下 `20px`（行高 `28px`，用于页面顶部 H1 如“工作台概览”，字重 `700`，字距 `-0.015em`）；
    - Portal 下 `28px`（行高 `36px`，用于 Bento 区块 H2，字重 `700`，字距 `-0.015em`）。
  - **Tier 3 `.type-title-md`（卡片/模块标题）**：
    - Admin 下 `16px`（行高 `24px`，字重 `600`）；
    - Portal 下 `20px`（行高 `28px`，字重 `600`）。
  - **Tier 4 `.type-body`（主力正文与列表主行）**：
    - Admin 下 `14px`（行高 `22px`，默认字重 `400`，搭配 `.font-medium` 用于列表主行与 KPI 指标名称）；
    - Portal 下 `15px`（行高 `24px`，默认字重 `400`）。
  - **Tier 5 `.type-meta`（辅助元数据与徽章）**：
    - Admin 下 `12px`（行高 `18px`，字重 `500`）；
    - Portal 下 `13px`（行高 `18px`，字重 `500`）。
    - 用于时间戳、次要说明、状态胶囊与 Eyebrow 眉标。
- **排印铁律底线**：
  - ❌ **严禁低于 12px**：全站禁止出现小于 `12px` 的字号，坚决杜绝 10px/11px 蚂蚁小字。
  - ❌ **严禁跨度失控**：后台单页字号总跨度严格收敛在 `2.2x` 以内（26px / 12px = 2.16x），前台官网单页字号总跨度收敛在 `3.23x`（42px / 13px），彻底消除“巨型标题 + 蚂蚁小字”的严重断层。

## 6. 表格与复杂列表选型分层约定 (Table & Data Grid Strategy)
为了保持脚手架极致轻量（零多余依赖）与长期设计系统的纯粹性，对于数据表格实施两级分层选型约定：
- **第一层（常规业务列表，90% 场景）**：
  - 必须 100% 优先复用轻量内置的原子组件 `MdTable` 与 `MdPagination`（位于 `src/components/m3/`）。
  - 支持 Vue 3 泛型类型安全、表头排序、多选行、骨架屏 Loading、空状态插槽以及单元格插槽定制。
  - **一体化分页契约**：分页器应当通过 `#pagination` 插槽无缝嵌套于 `MdTable` 卡片底部统一呈现，以 `1px solid var(--md-sys-color-outline-variant)` 分割，杜绝分页器独立悬浮导致的设计撕裂。
  - 外观严格遵循 M3 视觉契约：`surface-container-lowest` 背景、`outline-variant` 细边框与 `radius-card` 圆角，数据行高 48px，选中行使用 `secondary-container` 45% 透明度高亮。
- **第二层（高复杂度重型数据交互场景）**：
  - 仅当业务明确需要复杂**列冻结（Pinning）**、**列宽实时拖拽（Resizing）**、**百万级虚拟滚动行（Virtualization）**或复杂树形分组时，才按需引入 `@tanstack/vue-table` 作为底层无头（Headless）状态逻辑引擎。
  - **严禁直接引入第三方全量 UI 库**（如 Element Plus、Ant Design Vue、Naive UI 等自带样式的 Table 组件），必须套用 `MdTable` 的视觉外壳与 CSS Tokens，确保全站设计系统不被污染破坏。

## 7. 基础交互小组件铁律 (Interactive Primitives Standard)
所有基础交互组件已在 `src/components/m3/` 全量完备导出，业务代码与新增页面严禁违背以下契约：
- **严禁使用原生 `<select>`**：所有单选下拉场景必须使用 `MdSelect`（支持 `sm` 尺寸用于分页条、`md` 尺寸用于表单），内置上下防溢出定位与 M3 菜单规范，彻底消除浏览器默认系统直角蓝框。
- **严禁阻塞式原生弹框 (`alert` / `confirm` / `prompt`)**：
  - 轻量反馈与异步通知：必须统一调用 `useToast()` 命令式方法（`toast.info`、`toast.success`、`toast.warning`、`toast.error`），通过挂载在 `App.vue` 的全局 `<MdSnackbar />` 平滑滑入呈现。
  - 破坏性操作二次确认：必须使用 `AdaptiveModal` 对话框，自适应 PC 端居中与移动端底部 Bottom Sheet。
- **严禁使用原生 HTML `title` 属性作为交互提示**：
  - 图标与精简快捷提示：统一使用 `<MdTooltip variant="plain">`，展示反色微胶囊与轻量淡入动画。
  - 帮助说明与 SLA 口径：统一使用 `<MdTooltip variant="rich">`，配合 `?` 图标展示带标题、卡片底色与阴影的富文本浮层，支持 ESC 与外部点击自动关闭。
- **侧边业务详情与诊断操作**：
  - 侧边详情与复杂表单：统一使用 `MdDrawer`（Side Sheet），桌面端右侧 480px~520px 平滑滑出，移动端适配为底部抽屉，内置固定头尾与滚动穿透防护。

## 8. 零布局偏移铁律 (Zero CLS Standard)
- **骨架屏与真实内容几何一致性**：所有异步加载状态（骨架屏 Skeleton / 加载占位 Spinner）必须与真实呈现内容保持严格相同的容器尺寸、行数与列宽分配，严禁在刷新或切换分页时引发界面高度塌陷或横向滚动条闪烁。
- **表格刷新防抖动契约**：
  - **纵向高度锁定**：数据表格在刷新或切页时，骨架屏行数必须严格锚定当前页展示条数（通过 `:skeleton-rows="pageSize"` 或当前实际条数动态计算），严禁写死固定行数；数据行 `<tr>`、`<td>` 与骨架行必须锁定严格一致的固定行高（Admin 紧凑模式统一 `48px`，Portal 模式统一 `56px`）与内边距，加载前后表格总高度必须达到 0px 像素级无缝过渡。
  - **横向宽度锁定**：骨架占位条必须使用相对比例与最大宽度约束（如文本列 `w-3/4 max-w-[110px]`、数值列 `w-12 ml-auto`、操作列 `w-14 ml-auto`），严禁使用过宽固定宽度撑破单元格，确保骨架屏完整渲染包括首尾多选/操作列在内的全部列，杜绝横向滚动条瞬间闪烁。




