<script setup lang="ts">
export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text'

withDefaults(
  defineProps<{
    variant?: ButtonVariant
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'filled',
    disabled: false,
    type: 'button'
  }
)

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['m3-button', `m3-button--${variant}`, 'md-state-layer', { 'is-disabled': disabled }]"
    @click="$emit('click', $event)"
  >
    <span v-if="$slots.icon" class="m3-button__icon">
      <slot name="icon" />
    </span>
    <span class="m3-button__label label-large">
      <slot />
    </span>
    <span v-if="$slots.trailingIcon" class="m3-button__trailing-icon">
      <slot name="trailingIcon" />
    </span>
  </button>
</template>

<style scoped>
.m3-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  box-sizing: border-box;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  user-select: none;
  white-space: nowrap;
  vertical-align: middle;
  text-decoration: none;
  transition: transform 0.2s cubic-bezier(0.2, 0.0, 0, 1.0),
              box-shadow 0.2s cubic-bezier(0.2, 0.0, 0, 1.0),
              background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  border: 1px solid transparent;

  /* PC 端紧凑高度 36px */
  height: 36px;
  padding: 0 16px;
}

.m3-button:hover:not(.is-disabled) {
  transform: translateY(-1px);
}

.m3-button:active:not(.is-disabled) {
  transform: translateY(0);
}

/* 移动端高度 40px */
@media (max-width: 599.98px) {
  .m3-button {
    height: 40px;
    padding: 0 20px;
  }
}

.m3-button__icon,
.m3-button__trailing-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
}

.m3-button__icon :deep(svg),
.m3-button__trailing-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.m3-button__label {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
}

/* ================= Variants ================= */

/* Filled Button */
.m3-button--filled {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  box-shadow: var(--md-sys-elevation-level0);
}
.m3-button--filled:hover:not(.is-disabled) {
  box-shadow: var(--md-sys-elevation-level1);
}

/* Tonal Button */
.m3-button--tonal {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  box-shadow: var(--md-sys-elevation-level0);
}
.m3-button--tonal:hover:not(.is-disabled) {
  box-shadow: var(--md-sys-elevation-level1);
}

/* Outlined Button */
.m3-button--outlined {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  border-color: var(--md-sys-color-outline);
}
.m3-button--outlined:focus-visible:not(.is-disabled) {
  border-color: var(--md-sys-color-primary);
}

/* Text Button */
.m3-button--text {
  background-color: transparent;
  color: var(--md-sys-color-primary);
  padding: 0 12px;
}

/* ================= Disabled State ================= */
.m3-button.is-disabled {
  cursor: not-allowed;
  pointer-events: none;
}
.m3-button--filled.is-disabled,
.m3-button--tonal.is-disabled {
  background-color: rgba(29, 27, 32, 0.12);
  color: rgba(29, 27, 32, 0.38);
  box-shadow: none;
}
[data-theme="dark"] .m3-button--filled.is-disabled,
[data-theme="dark"] .m3-button--tonal.is-disabled {
  background-color: rgba(230, 224, 233, 0.12);
  color: rgba(230, 224, 233, 0.38);
}

.m3-button--outlined.is-disabled {
  border-color: rgba(29, 27, 32, 0.12);
  color: rgba(29, 27, 32, 0.38);
}
[data-theme="dark"] .m3-button--outlined.is-disabled {
  border-color: rgba(230, 224, 233, 0.12);
  color: rgba(230, 224, 233, 0.38);
}

.m3-button--text.is-disabled {
  color: rgba(29, 27, 32, 0.38);
}
[data-theme="dark"] .m3-button--text.is-disabled {
  color: rgba(230, 224, 233, 0.38);
}
</style>
