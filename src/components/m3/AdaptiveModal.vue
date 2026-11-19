<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    description?: string
    maxWidth?: string
  }>(),
  {
    title: '',
    description: '',
    maxWidth: '560px'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeydown)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeydown)
    }
  }
)

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="m3-modal-fade">
      <div v-if="modelValue" class="m3-modal-overlay" @click.self="close">
        <div
          class="m3-modal-surface"
          :style="{ '--modal-max-width': maxWidth }"
          role="dialog"
          aria-modal="true"
        >
          <!-- 移动端顶部手柄 (Drag Handle) -->
          <div class="m3-modal__drag-handle-container">
            <div class="m3-modal__drag-handle"></div>
          </div>

          <!-- 弹窗头部 -->
          <div class="m3-modal__header">
            <div class="m3-modal__header-text">
              <slot name="title">
                <h3 v-if="title" class="headline-small">{{ title }}</h3>
              </slot>
              <p v-if="description" class="body-medium m3-modal__desc">{{ description }}</p>
            </div>
            <button
              type="button"
              class="m3-modal__close-btn md-state-layer"
              aria-label="关闭"
              @click="close"
            >
              <X :size="20" />
            </button>
          </div>

          <!-- 弹窗主体内容 -->
          <div class="m3-modal__body">
            <slot />
          </div>

          <!-- 底部操作栏 -->
          <div v-if="$slots.actions" class="m3-modal__actions">
            <slot name="actions" :close="close" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.m3-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
}

/* 弹窗基底容器 */
.m3-modal-surface {
  position: fixed;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 30%, transparent);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized),
              opacity var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
}

.m3-modal__drag-handle-container {
  display: none;
  justify-content: center;
  align-items: center;
  padding: 12px 0 4px 0;
}

.m3-modal__drag-handle {
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background-color: var(--md-sys-color-outline-variant);
}

.m3-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 24px 16px 24px;
}

.m3-modal__header-text {
  flex: 1;
}

.m3-modal__desc {
  margin-top: 4px;
  color: var(--md-sys-color-on-surface-variant);
}

.m3-modal__close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--md-sys-shape-corner-full);
  color: var(--md-sys-color-on-surface-variant);
  flex-shrink: 0;
}
.m3-modal__close-btn:hover {
  color: var(--md-sys-color-on-surface);
}

.m3-modal__body {
  flex: 1;
  padding: 0 24px 16px 24px;
  overflow-y: auto;
}

.m3-modal__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px 24px 24px;
}

/* ==========================================================================
   双端形态适配：手机端 (< 600px) 为 Bottom Sheet
   ========================================================================== */
@media (max-width: 599.98px) {
  .m3-modal-overlay {
    align-items: flex-end;
    justify-content: stretch;
  }

  .m3-modal-surface {
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 85vh;
    border-radius: 28px 28px 0 0;
    padding-bottom: env(safe-area-inset-bottom, 16px);
  }

  .m3-modal__drag-handle-container {
    display: flex;
  }

  .m3-modal__header {
    padding: 8px 20px 12px 20px;
  }

  .m3-modal__body {
    padding: 0 20px 16px 20px;
  }

  .m3-modal__actions {
    padding: 12px 20px 16px 20px;
  }
}

/* ==========================================================================
   双端形态适配：PC & 平板端 (>= 600px) 为居中 Dialog
   ========================================================================== */
@media (min-width: 600px) {
  .m3-modal-overlay {
    align-items: center;
    justify-content: center;
  }

  .m3-modal-surface {
    position: relative;
    width: 100%;
    max-width: var(--modal-max-width, 560px);
    max-height: 85vh;
    border-radius: 28px;
  }
}

/* ==========================================================================
   动画过渡 (Transition)
   ========================================================================== */
.m3-modal-fade-enter-active,
.m3-modal-fade-leave-active {
  transition: opacity var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-modal-fade-enter-from,
.m3-modal-fade-leave-to {
  opacity: 0;
}

/* 手机端的抽屉滑入滑出 */
@media (max-width: 599.98px) {
  .m3-modal-fade-enter-from .m3-modal-surface,
  .m3-modal-fade-leave-to .m3-modal-surface {
    transform: translateY(100%);
  }
}

/* 电脑端的缩放淡入淡出 */
@media (min-width: 600px) {
  .m3-modal-fade-enter-from .m3-modal-surface,
  .m3-modal-fade-leave-to .m3-modal-surface {
    transform: scale(0.92);
    opacity: 0;
  }
}
</style>
