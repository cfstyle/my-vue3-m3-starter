<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    disabled?: boolean
    name?: string
    id?: string
  }>(),
  {
    modelValue: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const isChecked = computed(() => props.modelValue)

const toggle = () => {
  if (props.disabled) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}

const onKeyDown = (e: KeyboardEvent) => {
  if (props.disabled) return
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    toggle()
  }
}
</script>

<template>
  <button
    :id="id"
    type="button"
    role="switch"
    :aria-checked="isChecked"
    :disabled="disabled"
    :class="[
      'm3-switch',
      {
        'is-checked': isChecked,
        'is-disabled': disabled
      }
    ]"
    @click="toggle"
    @keydown="onKeyDown"
  >
    <!-- 轨道 (Track) -->
    <div class="m3-switch__track">
      <!-- 滑块 (Thumb) -->
      <div class="m3-switch__thumb">
        <!-- 滑块内嵌可选图标 -->
        <span v-if="isChecked && $slots.checkedIcon" class="m3-switch__icon">
          <slot name="checkedIcon" />
        </span>
        <span v-else-if="!isChecked && $slots.uncheckedIcon" class="m3-switch__icon">
          <slot name="uncheckedIcon" />
        </span>
        <span v-else-if="$slots.icon" class="m3-switch__icon">
          <slot name="icon" :checked="isChecked" />
        </span>
      </div>
    </div>
  </button>
</template>

<style scoped>
.m3-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  user-select: none;
  outline: none;
  vertical-align: middle;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
}

.m3-switch:focus-visible .m3-switch__track {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

/* ================= 轨道 Track (52px x 32px) ================= */
.m3-switch__track {
  position: relative;
  width: 52px;
  height: 32px;
  box-sizing: border-box;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  background-color: var(--md-sys-color-surface-container-highest);
  border: 2px solid var(--md-sys-color-outline);
  transition: background-color 0.25s var(--md-easing-emphasized),
              border-color 0.25s var(--md-easing-emphasized);
}

/* 选中状态轨道 */
.m3-switch.is-checked .m3-switch__track {
  background-color: var(--md-sys-color-primary);
  border-color: var(--md-sys-color-primary);
}

/* ================= 滑块 Thumb (未选中 16px -> 选中 24px) ================= */
.m3-switch__thumb {
  position: absolute;
  top: 6px;
  left: 6px;
  width: 16px;
  height: 16px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  background-color: var(--md-sys-color-outline);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: transform 0.25s var(--md-easing-emphasized),
              width 0.2s var(--md-easing-emphasized),
              height 0.2s var(--md-easing-emphasized),
              top 0.2s var(--md-easing-emphasized),
              left 0.2s var(--md-easing-emphasized),
              background-color 0.25s var(--md-easing-emphasized);
}

/* 选中状态滑块放大并平滑位移 */
.m3-switch.is-checked .m3-switch__thumb {
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  transform: translateX(20px);
  background-color: var(--md-sys-color-on-primary);
}

/* Hover 状态下轻微扩大 */
.m3-switch:hover:not(.is-disabled) .m3-switch__thumb {
  box-shadow: 0 0 0 6px rgba(0, 0, 0, 0.04);
}
[data-theme="dark"] .m3-switch:hover:not(.is-disabled) .m3-switch__thumb {
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.06);
}

/* Active 挤压手感 (M3 Expressive) */
.m3-switch:active:not(.is-disabled) .m3-switch__thumb {
  width: 26px;
}
.m3-switch.is-checked:active:not(.is-disabled) .m3-switch__thumb {
  transform: translateX(18px);
}

/* 内嵌图标 */
.m3-switch__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
}

.m3-switch__icon :deep(svg) {
  width: 12px;
  height: 12px;
}

.m3-switch:not(.is-checked) .m3-switch__icon {
  color: var(--md-sys-color-surface-container-highest);
}

.m3-switch.is-checked .m3-switch__icon {
  color: var(--md-sys-color-on-primary-container);
}

/* ================= 禁用状态 Disabled ================= */
.m3-switch.is-disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.m3-switch.is-disabled .m3-switch__track {
  background-color: rgba(29, 27, 32, 0.12);
  border-color: rgba(29, 27, 32, 0.12);
}

[data-theme="dark"] .m3-switch.is-disabled .m3-switch__track {
  background-color: rgba(230, 224, 233, 0.12);
  border-color: rgba(230, 224, 233, 0.12);
}
</style>
