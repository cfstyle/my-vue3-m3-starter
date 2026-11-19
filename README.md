# Material Design 3 双端自适应通用 Web 脚手架

基于 **Vite + Vue 3 (`<script setup lang="ts">`) + Vue Router + Pinia + Lucide Icons** 构建的轻量、现代化、开箱即用的 Material Design 3 双端自适应 Web 脚手架模板。

---

## 🛠️ 技术栈与规范

- **核心框架**：Vue 3 (全量 Composition API + `<script setup lang="ts">`)
- **构建工具**：Vite 6
- **路由管理**：Vue Router 4
- **状态管理**：Pinia
- **图标系统**：`lucide-vue-next`（现代线性图标库）
- **设计规范**：严格遵循 Google Material Design 3 (Material You) 规范

---

## 📁 核心目录与架构说明

```
my-vue3-m3-starter/
├── .agent/rules/
│   └── vue3-m3-stack.md       # 项目级 AI 开发铁律（限制组件规范、颜色 Token、路由继承）
├── src/
│   ├── components/
│   │   └── m3/                # M3 原子基础组件库
│   │       ├── MdButton.vue      # 按钮（filled / tonal / outlined / text，全圆角 9999px）
│   │       ├── MdCard.vue        # 卡片（elevated / filled / outlined / primary-tonal / tertiary-tonal）
│   │       ├── AdaptiveModal.vue # 响应式弹窗（手机端 Bottom Sheet / PC 居中 Dialog）
│   │       └── index.ts          # 统一导出
│   ├── layouts/
│   │   ├── AdaptiveShell.vue  # 双端自适应外壳（抽屉 Drawer / 窄轨 Rail / 底部栏 Bar）
│   │   └── PortalShell.vue    # 官网级展示外壳（顶部居中悬浮毛玻璃胶囊导航 + 精致页脚）
│   ├── stores/
│   │   └── theme.ts           # Pinia 主题管理 Store（支持深/浅色模式切换与持久化）
│   ├── styles/
│   │   ├── m3-tokens.css      # M3 标准语义化 Design Tokens（Surface 分层、颜色、圆角、状态层）
│   │   └── main.css           # 全局样式重置与排版规范
│   ├── views/
│   │   ├── HomeView.vue          # 纯净业务起步页（后台管理默认主页）
│   │   ├── UiPlaygroundView.vue  # M3 组件与动效参考演练场（/playground）
│   │   ├── portal/
│   │   │   └── PortalShowcaseView.vue # M3 官网级视觉示范页（/portal，Hero + Bento Grid）
│   │   ├── AnalyticsView.vue     # 示例数据分析页
│   │   ├── MessagesView.vue      # 示例消息中心页
│   │   └── SettingsView.vue      # 示例偏好与系统设置页
│   ├── App.vue
│   └── main.ts
```

---

## 🌐 双轨共存通用架构 (Admin + Portal)

本工程支持一套底层 Token 与组件库驱动两种主流产品形态：
1. **后台管理工作台模式 (`AdaptiveShell`)**：默认根路径 `/`，提供桌面抽屉、平板导航轨、移动端底栏的完整工作台框架。在左侧边栏底部附带一键切换至官网页面的入口。
2. **官网级展示模式 (`PortalShell`)**：访问路径 `/portal`，提供居中悬浮毛玻璃胶囊导航栏（100% 宽度视野）、36px 超大圆角 Hero Banner、非对称 Bento Grid 与现代 M3 页脚。右侧内置快速回到后台的动作按钮。
3. **开新项目建议**：可根据产品属性直接删除其中一个外壳作为单一纯净项目，亦可保持双轨混合使用。

---

## 📐 双端自适应响应式断点体系

| 断点区间 | 设备模式 | 布局表现 |
| :--- | :--- | :--- |
| **`< 600px`** (Compact) | 手机端 | 底部固定 80px `Navigation Bar`（带胶囊指示器）+ 顶部 64px `Top App Bar`；弹窗自动呈现为底部滑出的 `Bottom Sheet`（顶部圆角 28px + 拖拽手柄）。 |
| **`600px - 839px`** (Medium) | 平板端 | 左侧固定 80px 窄边 `Navigation Rail`（图标 + 短标签）；弹窗呈现为屏幕居中 `Dialog`。 |
| **`>= 840px`** (Expanded) | 桌面端 | 左侧固定 260px 展开式 `Navigation Drawer`，顶部集成胶囊搜索栏，内容区居中限宽 1280px。 |

---

## 🎨 深色模式 (Dark Theme)

- 采用语义化 Token 系统驱动，通过 `document.documentElement.dataset.theme = 'dark' | 'light'` 切换。
- `index.html` 内置防闪白初始化脚本，结合用户偏好持久化（`localStorage`）与系统级媒体查询。
- 业务样式严禁硬编码颜色值（`#fff` / `#000`），必须使用 `var(--md-sys-color-*)`。

---

## 🧪 组件演练场 (Playground)

项目内置了完整的 M3 组件演练与交互参考页：
- 访问路径：`http://localhost:5173/playground`
- 包含 `MdButton` 四态、`MdCard` 三种色调分层形态、`AdaptiveModal` 双端自动转换测试用例。

---

## 🚀 启动与构建

```bash
# 1. 安装项目依赖
npm install

# 2. 启动本地开发服务器
npm run dev

# 3. TypeScript 类型校验与生产环境打包
npm run build

# 4. 预览生产构建结果
npm run preview
```
