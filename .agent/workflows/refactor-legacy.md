---
description: 将存量旧项目迁移或渐进重构至 Material 3 视觉与零缺陷架构体系
---

请严格遵循 `.agent/rules/` 下的视觉与代码可靠性规范，执行存量旧项目的重构。在动手修改前，先向用户确认旧项目路径与改造模式（若已提供则直接输出迁移清单并执行）：

1. **确认改造路径**：
   - **模式 A（新底座重绘）**：保留旧项目 `api/` 与业务类型，使用本模板的 M3 组件重写页面视图。
   - **模式 B（存量渐进融入）**：保留旧项目复杂的第三方业务表单/表格库，套用本模板的 M3 壳层与 Token 体系。

2. **第三方 UI 库 CSS 变量桥接（模式 B 必做）**：
   - 若旧项目包含 `element-plus` 或 `ant-design-vue`，创建 `src/styles/legacy-bridge.css` 并在 `main.ts` 引入，将其主题变量（如 `--el-color-primary`、`--el-bg-color`、`--el-border-radius-base`）映射到本模板的 `--md-sys-color-*` 与 `--md-radius-*`，保证旧组件与 M3 壳层同色、同圆角且兼容暗黑模式。

3. **分阶段渐进迁移（每完成一阶段运行一次 `npm run check`）**：
   - **Stage 1（接口与类型清洗）**：迁移旧项目接口层，补全严格 TypeScript 类型定义，消除 `any`，增加异常捕获与防竞态逻辑。
   - **Stage 2（外壳与路由接管）**：将旧路由接入 `AdaptiveShell.vue` 或 `PortalShell.vue`，对齐导航菜单。
   - **Stage 3（视图 M3 化重构与表单原语清洗）**：
     - 按优先级逐页替换硬编码颜色、厚重阴影卡片与原生弹窗为 `MdCard`、`MdButton`、`AdaptiveModal` 与响应式栅格。
     - **表单与控件原语强制替换清单**：全局检索并强制替换所有原生 `<select>` 为 `MdSelect`、原生 `<input>` 为 `MdInput`，不得遗留任何未样式化的浏览器系统默认表单控件。
     - **筛选栏单行内联改造**：数据表格上方若存在“Label 在上 + 控件在下”的两行堆叠结构或外部包裹的厚重深灰卡片，必须彻底重构为**单行水平内联布局**（各控件高度严格统一锁定为 `var(--md-control-height-sm, 36px)`，筛选标签直接内嵌进 `MdSelect` 选项或作为 `MdInput` 的 `#prefix` 图标/占位符，严禁上下两行堆叠浪费垂直视野）。
