<script setup lang="ts">
export type CardVariant = 'elevated' | 'filled' | 'outlined' | 'tonal' | 'primary-tonal' | 'tertiary-tonal'

withDefaults(
  defineProps<{
    variant?: CardVariant
    clickable?: boolean
  }>(),
  {
    variant: 'elevated',
    clickable: false
  }
)

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <div
    :class="[
      'm3-card',
      `m3-card--${variant}`,
      {
        'is-clickable': clickable
      }
    ]"
    @click="clickable ? $emit('click', $event) : undefined"
  >
    <div v-if="$slots.header" class="m3-card__header">
      <slot name="header" />
    </div>

    <div class="m3-card__content">
      <slot />
    </div>

    <div v-if="$slots.actions" class="m3-card__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.m3-card {
  position: relative;
  box-sizing: border-box;
  border-radius: var(--md-radius-card, 20px);
  padding: var(--md-card-padding, 20px);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s var(--md-easing-emphasized),
              box-shadow 0.25s var(--md-easing-emphasized),
              border-color 0.25s var(--md-easing-emphasized),
              background-color var(--md-sys-motion-duration-short4) var(--md-easing-emphasized);
  overflow: hidden;
  isolation: isolate;
}

/* ================= M3 State Layer (状态层) ================= */
.m3-card.is-clickable {
  cursor: pointer;
  user-select: none;
}

.m3-card.is-clickable::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-color: currentColor;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
  z-index: 1;
}

.m3-card.is-clickable:hover::after {
  opacity: 0.08;
}

.m3-card.is-clickable:active::after {
  opacity: 0.12;
}

.m3-card.is-clickable:hover {
  transform: translateY(-2px);
}

.m3-card.is-clickable:active {
  transform: translateY(0);
}

.m3-card__header {
  margin-bottom: 14px;
  position: relative;
  z-index: 2;
}

.m3-card__content {
  flex: 1;
  position: relative;
  z-index: 2;
}

.m3-card__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 8px;
  position: relative;
  z-index: 2;
}

/* ================= Card Variants ================= */

/* 1. Elevated Card (极通透微光微阴影，杜绝厚重视效) */
.m3-card--elevated {
  background-color: var(--md-sys-color-surface-container-lowest);
  color: var(--md-sys-color-on-surface);
  border: 1px solid color-mix(in srgb, var(--md-sys-color-outline-variant) 35%, transparent);
  box-shadow: var(--md-elevation-1);
}

.m3-card--elevated.is-clickable:hover {
  box-shadow: var(--md-elevation-2);
  border-color: color-mix(in srgb, var(--md-sys-color-outline-variant) 60%, transparent);
}

/* 2. Filled Card (无边框纯净填充) */
.m3-card--filled {
  background-color: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-on-surface);
  border: 1px solid transparent;
  box-shadow: none;
}

.m3-card--filled.is-clickable:hover {
  box-shadow: var(--md-elevation-1);
}

/* 3. Tonal Card (Secondary Container 柔和色调) */
.m3-card--tonal {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  border: 1px solid transparent;
  box-shadow: none;
}

.m3-card--tonal.is-clickable:hover {
  box-shadow: var(--md-elevation-1);
}

/* 4. Primary Tonal Card (Primary Container 紫调高饱和容器) */
.m3-card--primary-tonal {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border: 1px solid transparent;
  box-shadow: none;
}

.m3-card--primary-tonal.is-clickable:hover {
  box-shadow: var(--md-elevation-1);
}

/* 5. Tertiary Tonal Card (Tertiary Container 青绿撞色容器) */
.m3-card--tertiary-tonal {
  background-color: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
  border: 1px solid transparent;
  box-shadow: none;
}

.m3-card--tertiary-tonal.is-clickable:hover {
  box-shadow: var(--md-elevation-1);
}

/* 6. Outlined Card (轻质通透描边) */
.m3-card--outlined {
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
  box-shadow: none;
}

.m3-card--outlined.is-clickable:hover {
  border-color: var(--md-sys-color-outline);
  box-shadow: var(--md-elevation-1);
}
</style>
