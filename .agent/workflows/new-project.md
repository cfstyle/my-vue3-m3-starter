---
description: 基于 Material 3 Dual-Track 模板初始化新项目并搭建首批业务模块
---

请严格遵循 `.agent/rules/` 下的视觉规范与现代 Web 零缺陷工程准则，执行新项目初始化与业务开发。在开始写代码前，先向用户确认以下 `[方括号]` 配置项（若用户已在对话中提供则直接执行）：

1. **项目基础信息与主题锁定**：
   - 将应用标题、Logo 副标题及页脚版权信息更新为 `[项目名称]`。
   - 在 `src/stores/theme.ts` 中将默认种子色锁定为 `[主题ID：aurora-purple / deep-teal / business-blue / forest-green / institutional-navy / wealth-amber]`。
   - 设置默认布局形态为 `[admin（纯后台） | portal（纯官网） | dual（前后台双轨）]`；若为单端项目，隐藏对应的模式切换入口。
   - 限制 `UiPlaygroundView.vue`（`/playground`）仅在 `import.meta.env.DEV` 开发环境下可访问，避免打包进生产环境。

2. **重构导航与路由（`src/router/index.ts` & `AdaptiveShell.vue`）**：
   - 按用户提供的业务模块清单重构路由与侧边栏导航，图标统一使用 `lucide-vue-next`，保留 `/settings` 外观设置页。

3. **开发首批核心业务页面**：
   - 严格复用 `MdCard`、`MdButton`、`MdSwitch`、`AdaptiveModal` 与 `var(--md-sys-color-*)` 语义变量（禁止硬编码颜色与重阴影）。
   - 所有数值指标添加 `.tabular-nums` 等宽对齐；所有异步请求必须配备 `AbortController` 防竞态与显式错误降级状态。

4. **交付自检**：
   - 完成后运行 `npm run check` 确保 `vue-tsc` 与 ESLint 零报错通过。
