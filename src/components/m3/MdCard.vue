<script setup lang="ts">
export type CardVariant = 'elevated' | 'filled' | 'outlined'

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
        'is-clickable': clickable,
        'md-state-layer': clickable
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
  border-radius: var(--md-sys-shape-corner-large, 16px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
  overflow: hidden;
}

.m3-card.is-clickable {
  cursor: pointer;
  user-select: none;
}

.m3-card__header {
  margin-bottom: 12px;
}

.m3-card__content {
  flex: 1;
}

.m3-card__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 8px;
}

/* Elevated Card */
.m3-card--elevated {
  background-color: var(--md-sys-color-surface-container-low);
  box-shadow: var(--md-sys-elevation-level1);
}
.m3-card--elevated.is-clickable:hover {
  box-shadow: var(--md-sys-elevation-level2);
}

/* Filled Card */
.m3-card--filled {
  background-color: var(--md-sys-color-surface-container-highest);
  box-shadow: var(--md-sys-elevation-level0);
}
.m3-card--filled.is-clickable:hover {
  box-shadow: var(--md-sys-elevation-level1);
}

/* Outlined Card */
.m3-card--outlined {
  background-color: var(--md-sys-color-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
  box-shadow: var(--md-sys-elevation-level0);
}
.m3-card--outlined.is-clickable:hover {
  box-shadow: var(--md-sys-elevation-level1);
}
</style>
