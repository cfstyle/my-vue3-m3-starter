<script setup lang="ts">
import { useToast, type ToastType } from '@/composables/useToast'
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X
} from 'lucide-vue-next'

const { toasts, dismiss } = useToast()

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return CheckCircle2
    case 'warning':
      return AlertTriangle
    case 'error':
      return XCircle
    case 'info':
    default:
      return Info
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="m3-snackbar-container" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="m3-toast">
        <div
          v-for="item in toasts"
          :key="item.id"
          :class="['m3-snackbar-item', `m3-snackbar--${item.type}`]"
          role="alert"
        >
          <!-- 状态指示图标 -->
          <span class="m3-snackbar__icon">
            <component :is="getIcon(item.type)" :size="20" />
          </span>

          <!-- 消息正文 -->
          <span class="m3-snackbar__text type-body font-medium">
            {{ item.message }}
          </span>

          <!-- 关闭按钮 -->
          <button
            type="button"
            class="m3-snackbar__close md-state-layer"
            title="关闭通知"
            aria-label="关闭通知"
            @click="dismiss(item.id)"
          >
            <X :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.m3-snackbar-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: var(--z-toast, 70);
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  max-width: 420px;
  width: calc(100vw - 48px);
}

.m3-snackbar-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--md-sys-shape-corner-medium, 16px);
  background-color: var(--md-sys-color-inverse-surface);
  color: var(--md-sys-color-inverse-on-surface);
  box-shadow: var(--md-sys-elevation-level3, 0 8px 16px rgba(0, 0, 0, 0.16));
  border: 1px solid var(--md-sys-color-outline-variant);
  transition: all var(--md-sys-motion-duration-medium1, 250ms) var(--md-easing-emphasized);
}

.m3-snackbar__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.m3-snackbar--success .m3-snackbar__icon {
  color: #4ade80;
}

[data-theme="light"] .m3-snackbar--success .m3-snackbar__icon {
  color: #1b873f;
}

.m3-snackbar--warning .m3-snackbar__icon {
  color: #fdd663;
}

[data-theme="light"] .m3-snackbar--warning .m3-snackbar__icon {
  color: #e37400;
}

.m3-snackbar--error .m3-snackbar__icon {
  color: var(--md-sys-color-error);
}

.m3-snackbar--info .m3-snackbar__icon {
  color: var(--md-sys-color-inverse-primary);
}

.m3-snackbar__text {
  flex: 1;
  word-break: break-word;
  line-height: 1.4;
}

.m3-snackbar__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  color: var(--md-sys-color-inverse-on-surface);
  opacity: 0.8;
  cursor: pointer;
  background: transparent;
  border: none;
  flex-shrink: 0;
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.m3-snackbar__close:hover {
  opacity: 1;
}

/* 动效过渡 */
.m3-toast-enter-active,
.m3-toast-leave-active {
  transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.m3-toast-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

.m3-toast-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(0.92);
}

@media (max-width: 599.98px) {
  .m3-snackbar-container {
    top: 16px;
    right: 16px;
    left: 16px;
    width: auto;
  }
}
</style>
