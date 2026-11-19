<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    width?: string
    showClose?: boolean
    closeOnEsc?: boolean
    closeOnClickOverlay?: boolean
  }>(),
  {
    title: '',
    width: '480px',
    showClose: true,
    closeOnEsc: true,
    closeOnClickOverlay: true
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

const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    close()
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (props.modelValue && props.closeOnEsc && event.key === 'Escape') {
    close()
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (typeof document !== 'undefined') {
      if (val) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="m3-drawer-wrapper"
      role="dialog"
      aria-modal="true"
    >
      <!-- 半透明遮罩层 -->
      <Transition name="m3-drawer-scrim" appear>
        <div
          class="m3-drawer-scrim"
          aria-hidden="true"
          @click="handleOverlayClick"
        />
      </Transition>

      <!-- 抽屉本体 (桌面端右侧滑出，移动端底部滑出) -->
      <Transition name="m3-drawer-slide" appear>
        <div
          class="m3-drawer-panel"
          :style="{ '--drawer-width': width }"
        >
          <!-- 1. 固定顶部标题栏 -->
          <header class="m3-drawer-header">
            <div class="m3-drawer-title-group">
              <slot name="title">
                <h2 class="m3-drawer-title type-title-lg">{{ title }}</h2>
              </slot>
            </div>

            <button
              v-if="showClose"
              type="button"
              class="m3-drawer-close-btn md-state-layer"
              title="关闭抽屉"
              aria-label="关闭抽屉"
              @click="close"
            >
              <X :size="20" />
            </button>
          </header>

          <!-- 2. 可滚动内容区 -->
          <main class="m3-drawer-content">
            <slot />
          </main>

          <!-- 3. 固定底部操作栏 (可选) -->
          <footer v-if="$slots.footer" class="m3-drawer-footer">
            <slot name="footer" />
          </footer>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.m3-drawer-wrapper {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal, 50);
  display: flex;
  justify-content: flex-end;
}

/* 遮罩背景 */
.m3-drawer-scrim {
  position: absolute;
  inset: 0;
  z-index: var(--z-backdrop, 40);
  background-color: var(--md-sys-color-scrim, rgba(0, 0, 0, 0.45));
  opacity: 0.45;
  transition: opacity 0.3s ease;
}

/* 抽屉本体面板 */
.m3-drawer-panel {
  position: relative;
  width: var(--drawer-width, 480px);
  max-width: 100vw;
  height: 100%;
  background-color: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  box-shadow: var(--md-sys-elevation-level3, 0 8px 24px rgba(0, 0, 0, 0.2));
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1;
}

/* 顶部固定标题栏 */
.m3-drawer-header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface);
  flex-shrink: 0;
}

.m3-drawer-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.m3-drawer-title {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m3-drawer-close-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-surface-variant);
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  transition: color var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.m3-drawer-close-btn:hover {
  color: var(--md-sys-color-on-surface);
}

/* 可滚动内容区 */
.m3-drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* 底部操作区 */
.m3-drawer-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

/* 遮罩动画 */
.m3-drawer-scrim-enter-active,
.m3-drawer-scrim-leave-active {
  transition: opacity 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.m3-drawer-scrim-enter-from,
.m3-drawer-scrim-leave-to {
  opacity: 0;
}

/* 面板滑入滑出动画 (桌面端右侧滑出) */
.m3-drawer-slide-enter-active,
.m3-drawer-slide-leave-active {
  transition: transform 0.32s cubic-bezier(0.2, 0, 0, 1);
}

.m3-drawer-slide-enter-from,
.m3-drawer-slide-leave-to {
  transform: translateX(100%);
}

/* 移动端 (< 600px) 适配为底部抽屉 */
@media (max-width: 599.98px) {
  .m3-drawer-wrapper {
    align-items: flex-end;
    justify-content: center;
  }

  .m3-drawer-panel {
    width: 100% !important;
    max-height: 85vh;
    height: auto;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    border-bottom-left-radius: 0;
  }

  .m3-drawer-slide-enter-from,
  .m3-drawer-slide-leave-to {
    transform: translateY(100%);
  }
}
</style>
