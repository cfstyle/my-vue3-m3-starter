# Agent Instructions & Guidelines (Codex / Universal AI Entrypoint)

This repository enforces strict design tokens, architecture patterns, and reliability standards for all AI coding assistants (including OpenAI Codex, GitHub Copilot, and Claude Code).

---

## 1. Mandatory Rule Inheritance (事前铁律继承)

Before writing or modifying any code in this repository, you **MUST** read and strictly adhere to the following rules:

1. **Design System & M3 Stack**: [`.agent/rules/m3-design-system.md`](.agent/rules/m3-design-system.md) (and [`.agent/rules/vue3-m3-stack.md`](.agent/rules/vue3-m3-stack.md))
   - Strictly Vue 3 `<script setup lang="ts">` + Composition API.
   - Global icon system: `lucide-vue-next` only. No random third-party icon libraries or inline SVGs.
   - **Zero Hardcoded Colors**: Strictly use `var(--md-sys-color-*)` tokens from `src/styles/m3-tokens.css`.
   - Atomic components: Reuse `MdButton`, `MdCard`, `MdSwitch`, and `AdaptiveModal` from `src/components/m3/`. No heavy UI frameworks (Element Plus, Ant Design Vue, etc.) unless running legacy migration.
   - Interactive feedback: Use `.md-state-layer` utility classes for hover/active feedback.

2. **Zero-Defect Code Reliability**: [`.agent/rules/modern-web-reliability.md`](.agent/rules/modern-web-reliability.md)
   - Follow Google `modern-web-guidance` core principles for web reliability.
   - **Race Condition Prevention**: All concurrent/high-frequency async requests must use `AbortController` or sequence IDs. All promises must have explicit error boundaries and fallback state.
   - **Memory Leak Prevention**: Timers (`setInterval`/`setTimeout`), DOM listeners, and Observers (`ResizeObserver`/`IntersectionObserver`) must be cleaned up in `onUnmounted` or `onScopeDispose`.
   - **Defensive Boundary Validation**: Validate all backend APIs, URL queries, and `localStorage` inputs before deep property access.
   - **Reactive Purity**: `computed` must be pure and free of side effects; never mutate props directly.

3. **Global Pattern Sweep (举一反三全局连带修复铁律)**: [`.agent/rules/m3-design-system.md`](.agent/rules/m3-design-system.md) (Section 10)
   - Mandatory full-codebase grep & concurrent fix whenever an anti-pattern, raw HTML control (e.g. native `<select>` / `<input>`), or hardcoded color (`bg-slate-*`, `#hex`) is identified. Never patch only a single file in isolation.

---

## 2. Standard Workflow Dispatch (标准工作流映射)

When receiving high-level tasks, match and execute the corresponding workflow step-by-step:

- **Initialize New Project (`new-project` / "初始化新项目")**:
  - Read and strictly execute [`.agent/workflows/new-project.md`](.agent/workflows/new-project.md).
  - Confirm project title, lock HCT seed theme ID, choose layout mode (`admin` / `portal` / `dual`), restrict `/playground` to DEV mode, and build core business views.

- **Refactor / Migrate Legacy Code (`refactor-legacy` / "重构旧项目" / "迁移旧代码")**:
  - Read and strictly execute [`.agent/workflows/refactor-legacy.md`](.agent/workflows/refactor-legacy.md).
  - Choose between Mode A (fresh M3 rewrite) or Mode B (progressive M3 bridge with `src/styles/legacy-bridge.css`), followed by 3-stage migration (types -> shells -> views).

---

## 3. Delivery & Verification Gate (交付自检铁律)

After any code modification, the AI assistant **MUST** run the check script and ensure zero errors:

```bash
npm run check
# Runs: vue-tsc --noEmit && eslint src --ext .ts,.vue
```

- **Strict Prohibitions**:
  - ❌ Never use `any` or `@ts-ignore` to silence type errors.
  - ❌ Never hardcode raw hex/rgb color values (e.g. `#fff`, `#1890ff`, `rgb(...)`) in CSS or template styles.
  - ❌ Never introduce undocumented third-party component libraries.
  - ❌ Never deliver code with unhandled promise rejections or lingering background intervals.

---

## 4. Global Pattern Sweep (举一反三全局连带修复铁律)

- **触发条件 (Trigger Condition)**：
  - 每当用户指出某个页面存在样式不规范、组件未替换（如残留原生 `<select>` / `<input>`、未替换的原生弹窗或提示）、颜色硬编码（如 `bg-slate-*`、`text-slate-*`、`#hex`）或交互缺陷时，**严禁仅局限于当前单个文件进行局部修补**。
- **强制动作 (Mandatory Action)**：
  1. **全库代码检索**：AI 必须在修复当前文件的同时，立即使用全局代码检索工具（如 Grep / 正则扫描）扫描整个 `src/` 目录下的所有 `.vue` 与 `.ts` 文件。
  2. **一次性连带同步修复**：找出全站所有存在相同反模式的页面与组件，一次性同步修复并保持全项目规范一致性，杜绝“修一处漏十处”的低效打补丁。
  3. **修复清单汇报**：在最终交付回复中，必须明确列出所有受影响并已连带修复的文件清单及修复摘要。

