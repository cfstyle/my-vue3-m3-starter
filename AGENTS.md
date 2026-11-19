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
