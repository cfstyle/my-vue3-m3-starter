<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

export type TooltipTrigger = 'hover' | 'click'
export type TooltipVariant = 'plain' | 'rich'
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

const props = withDefaults(
  defineProps<{
    trigger?: TooltipTrigger
    variant?: TooltipVariant
    placement?: TooltipPlacement
    title?: string
    content?: string
    disabled?: boolean
    teleport?: boolean
  }>(),
  {
    trigger: 'hover',
    variant: 'plain',
    placement: 'top',
    title: '',
    content: '',
    disabled: false,
    teleport: true
  }
)

const isVisible = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const tooltipStyle = ref<Record<string, string>>({})

let hoverTimeout: number | null = null

const updateTooltipPosition = () => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const gap = 8

  if (props.teleport) {
    if (props.placement === 'bottom') {
      tooltipStyle.value = {
        position: 'fixed',
        top: `${rect.bottom + gap}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)',
        zIndex: 'var(--z-popover, 60)'
      }
    } else if (props.placement === 'left') {
      tooltipStyle.value = {
        position: 'fixed',
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.left - gap}px`,
        transform: 'translate(-100%, -50%)',
        zIndex: 'var(--z-popover, 60)'
      }
    } else if (props.placement === 'right') {
      tooltipStyle.value = {
        position: 'fixed',
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.right + gap}px`,
        transform: 'translateY(-50%)',
        zIndex: 'var(--z-popover, 60)'
      }
    } else {
      // top (default)
      tooltipStyle.value = {
        position: 'fixed',
        bottom: `${window.innerHeight - rect.top + gap}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)',
        zIndex: 'var(--z-popover, 60)'
      }
    }
  }
}

const showTooltip = () => {
  if (props.disabled) return
  if (hoverTimeout) {
    window.clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  updateTooltipPosition()
  isVisible.value = true
}

const hideTooltip = () => {
  if (hoverTimeout) {
    window.clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  isVisible.value = false
}

const handleMouseEnter = () => {
  if (props.trigger !== 'hover') return
  hoverTimeout = window.setTimeout(() => {
    showTooltip()
  }, 120)
}

const handleMouseLeave = () => {
  if (props.trigger !== 'hover') return
  if (hoverTimeout) {
    window.clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  hideTooltip()
}

const handleFocus = () => {
  if (props.trigger === 'hover') {
    showTooltip()
  }
}

const handleBlur = () => {
  if (props.trigger === 'hover') {
    hideTooltip()
  }
}

const handleClick = () => {
  if (props.disabled) return
  if (props.trigger === 'click') {
    if (!isVisible.value) {
      showTooltip()
    } else {
      hideTooltip()
    }
  }
}

const handleDocClick = (e: MouseEvent) => {
  if (props.trigger !== 'click' || !isVisible.value) return
  const target = e.target as Node
  const inContainer = containerRef.value ? containerRef.value.contains(target) : false
  const inTooltip = tooltipRef.value ? tooltipRef.value.contains(target) : false
  if (!inContainer && !inTooltip) {
    hideTooltip()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isVisible.value) {
    hideTooltip()
  }
}

const handleScrollOrResize = () => {
  if (isVisible.value) {
    updateTooltipPosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocClick)
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', handleScrollOrResize, true)
  window.addEventListener('resize', handleScrollOrResize)
})

onUnmounted(() => {
  if (hoverTimeout) {
    window.clearTimeout(hoverTimeout)
  }
  document.removeEventListener('click', handleDocClick)
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', handleScrollOrResize, true)
  window.removeEventListener('resize', handleScrollOrResize)
})
</script>

<template>
  <div
    ref="containerRef"
    class="m3-tooltip-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusin="handleFocus"
    @focusout="handleBlur"
    @click="handleClick"
  >
    <!-- 触发区插槽 -->
    <div class="m3-tooltip-trigger">
      <slot />
    </div>

    <!-- 提示气泡弹层 (防父容器 overflow 裁剪与全局 z-index 阶梯) -->
    <Teleport to="body" :disabled="!teleport">
      <Transition name="m3-tooltip-pop">
        <div
          v-if="isVisible"
          ref="tooltipRef"
          class="m3-tooltip"
          :class="[
            `is-${variant}`,
            `placement-${placement}`,
            { 'is-teleported': teleport }
          ]"
          :style="teleport ? tooltipStyle : undefined"
          role="tooltip"
          @click.stop
        >
          <!-- 纯文本/胶囊提示 (Plain) -->
          <template v-if="variant === 'plain'">
            <slot name="content">
              <span class="plain-text type-meta">{{ content }}</span>
            </slot>
          </template>

          <!-- 富文本帮助卡片 (Rich) -->
          <template v-else>
            <div v-if="title || $slots.title" class="rich-header">
              <slot name="title">
                <h4 class="rich-title type-title-md">{{ title }}</h4>
              </slot>
            </div>
            <div class="rich-body type-body">
              <slot name="content">
                <p class="rich-text">{{ content }}</p>
              </slot>
            </div>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.m3-tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

.m3-tooltip-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 提示层公用基底 */
.m3-tooltip {
  position: absolute;
  z-index: var(--z-popover, 60);
  pointer-events: auto;
  transition: opacity 150ms var(--md-easing-emphasized), transform 150ms var(--md-easing-emphasized);
}

/* 1. Plain 纯色微胶囊 */
.m3-tooltip.is-plain {
  padding: 4px 8px;
  border-radius: 6px;
  background-color: var(--md-sys-color-inverse-surface);
  color: var(--md-sys-color-inverse-on-surface);
  font-size: var(--md-type-meta-size, 12px);
  line-height: var(--md-type-meta-lh, 18px);
  white-space: nowrap;
  box-shadow: var(--md-sys-elevation-level1);
  pointer-events: none;
}

.plain-text {
  color: var(--md-sys-color-inverse-on-surface);
  font-weight: 500;
}

/* 2. Rich 富文本帮助气泡 */
.m3-tooltip.is-rich {
  min-width: 220px;
  max-width: 320px;
  padding: 16px;
  border-radius: 16px;
  background-color: var(--md-sys-color-surface-container-highest);
  border: 1px solid var(--md-sys-color-outline-variant);
  color: var(--md-sys-color-on-surface);
  box-shadow: var(--md-sys-elevation-level2);
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.rich-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rich-title {
  color: var(--md-sys-color-on-surface);
  font-weight: 600;
  margin: 0;
}

.rich-body {
  color: var(--md-sys-color-on-surface-variant);
  margin: 0;
}

.rich-text {
  margin: 0;
  line-height: 1.5;
}

/* 四向定位偏移与箭头指引 */
.placement-top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.placement-bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.placement-left {
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.placement-right {
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

/* 动效过渡 */
.m3-tooltip-pop-enter-from,
.m3-tooltip-pop-leave-to {
  opacity: 0;
}

.placement-top.m3-tooltip-pop-enter-from,
.placement-top.m3-tooltip-pop-leave-to {
  transform: translate(-50%, 4px);
}

.placement-bottom.m3-tooltip-pop-enter-from,
.placement-bottom.m3-tooltip-pop-leave-to {
  transform: translate(-50%, -4px);
}

.placement-left.m3-tooltip-pop-enter-from,
.placement-left.m3-tooltip-pop-leave-to {
  transform: translate(4px, -50%);
}

.placement-right.m3-tooltip-pop-enter-from,
.placement-right.m3-tooltip-pop-leave-to {
  transform: translate(-4px, -50%);
}
</style>
