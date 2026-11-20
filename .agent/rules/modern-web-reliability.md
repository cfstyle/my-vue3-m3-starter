# 现代 Web 高可靠性与零缺陷编码铁律 (Modern Web Reliability)

本规范遵循 Google `modern-web-guidance` 工程规范中关于“现代 Web 应用高可靠性与零代码缺陷”的核心原则，作为本仓库的强制性代码质量铁律，所有 AI 助手、代码生成器及协作者在新增、重构或修改代码时必须 100% 遵守：

---

## 1. 异步与竞态防护 (Concurrency & Race-Condition Immunity)
- **并发与高频防竞态**：高频搜索、筛选切换、Tabs 切换或分页等并发请求，必须通过 `AbortController` 取消前序未决请求，或使用递增请求序列号（Request ID）判定最新响应，禁止过时异步响应覆盖最新状态。
- **显式异常兜底**：所有 `async/await` 操作及 Promise 必须具备显式的 `try...catch` 错误捕获、超时控制与降级状态提示（如错误提示卡片、重试按钮），禁止留存未捕获的悬空 Promise（Unhandled Rejection）。

---

## 2. 生命周期与泄漏免疫 (Lifecycle & Memory-Leak Immunity)
- **成对注册与注销**：凡在 Vue 组件或 Composable 中注册的副作用：
  - 定时器：`setInterval` / `setTimeout`
  - 浏览器事件：`window.addEventListener` / `document.addEventListener`
  - 观察器：`ResizeObserver` / `IntersectionObserver` / `MutationObserver`
  - 必须在 `onUnmounted` 或 `onScopeDispose` 中显式清除（成对注销），杜绝内存泄漏与后台幽灵执行。
- **全局状态副作用隔离**：Pinia Store 与全局事件总线中严禁遗留跨生命周期的未解绑监听器。

---

## 3. 防御性边界校验 (Defensive Boundary Validation)
- **外部输入零信任**：来自后端接口响应、URL Query / Params、`localStorage` / `sessionStorage` 的数据一律视为不可信任的外部输入。
- **深度索引与空安全**：
  - 开启 TypeScript `"noUncheckedIndexedAccess": true`，访问数组索引（如 `arr[0]`）或动态键值对象前，必须进行安全判空或提供默认值兜底（`arr[0] ?? defaultItem`）。
  - 深层对象嵌套访问强制使用可选链（`?.`）与空值合并运算符（`??`），严禁引发运行时 `Cannot read properties of undefined`。
  - 读取 `localStorage.getItem` 必须包含 `try...catch`（防止隐身模式或配额满报错）并校验返回值合法性。

---

## 4. 响应式纯净度 (Reactivity Purity)
- **计算属性纯净度**：`computed` 必须是纯函数，严禁在计算属性中产生副作用（如修改其他 `ref`、派发异步请求、修改 DOM、操作 Storage 等）。
- **单向数据流铁律**：严禁在子组件中直接修改 `props` 传入的属性；如果需要修改，必须通过 `defineEmits` 向上派发事件（如 `v-model` 或 `update:*`）。
- **类型安全零妥协**：严禁使用 `any`、`unknown as any` 以及 `@ts-ignore` 掩盖类型冲突；必须书写严密的 interface / type 定义。

---

## 5. Web 安全与路由健壮性 (Web Security & Safe Navigation)
- **XSS 防护**：全局禁止直接使用 `v-html`；若业务确需渲染富文本，必须先经过 DOMPurify 净化过滤。
- **协议白名单校验**：所有动态外链跳转或 `window.open` 之前，必须进行 URL 协议合法性白名单校验（仅允许 `http:`、`https:` 或站内相对路径），防范 `javascript:` 伪协议 XSS。
- **外链安全属性**：所有 `target="_blank"` 链接必须同时具备 `rel="noopener noreferrer"`。

---

## 6. 交付自检闭环 (Verification Loop)
- **举一反三全局连带修复 (Global Pattern Sweep)**：当发现任何一处代码违背规范、组件替换不彻底（如遗留原生 `<select>` / `<input>`）或存在样式/交互缺陷时，严禁单点局部打补丁；必须使用全局检索扫描全库 `src/`，一次性连带同步根治所有同类缺陷。
- **静态拦截门禁**：每次新增组件、页面或修改业务逻辑后，必须执行 `npm run check`（包含 `vue-tsc --noEmit` 全量类型检查与 ESLint 代码质量扫描）。
- **零报错交付**：交付前必须确保 `npm run check` 退出码为 0，零 TypeScript 类型报错，零 ESLint 规约报错。
