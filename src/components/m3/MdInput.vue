<script setup lang="ts">
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    placeholder?: string
    size?: 'sm' | 'md'
    clearable?: boolean
    disabled?: boolean
    readonly?: boolean
    type?: string
    maxlength?: number
  }>(),
  {
    modelValue: '',
    placeholder: '',
    size: 'md',
    clearable: false,
    disabled: false,
    readonly: false,
    type: 'text',
    maxlength: undefined
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'input', value: string, event: Event): void
  (e: 'clear'): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'keydown', event: KeyboardEvent): void
}>()

defineSlots<{
  prefix?: () => unknown
  suffix?: () => unknown
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

const showClear = computed(() => {
  return (
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    props.modelValue !== '' &&
    props.modelValue !== null &&
    props.modelValue !== undefined
  )
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', target.value, event)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('change', target.value)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
  inputRef.value?.focus()
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({
  inputRef,
  focus,
  blur
})
</script>

<template>
  <div
    class="m3-input"
    :class="[
      `m3-input--${size}`,
      {
        'is-focused': isFocused,
        'is-disabled': disabled,
        'has-prefix': !!$slots.prefix,
        'has-suffix': !!$slots.suffix,
        'has-clear': showClear
      }
    ]"
  >
    <!-- 前置插槽 -->
    <span v-if="$slots.prefix" class="m3-input__prefix">
      <slot name="prefix" />
    </span>

    <!-- 原生单行输入核心 -->
    <input
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      class="m3-input__inner"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />

    <!-- 一键清空图标按钮 -->
    <button
      v-if="showClear"
      type="button"
      class="m3-input__clear md-state-layer"
      tabindex="-1"
      aria-label="清空输入"
      title="清空"
      @click.stop="handleClear"
    >
      <X :size="size === 'sm' ? 14 : 16" />
    </button>

    <!-- 后置插槽 -->
    <span v-if="$slots.suffix" class="m3-input__suffix">
      <slot name="suffix" />
    </span>
  </div>
</template>

<style scoped>
.m3-input {
  display: inline-flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  background-color: var(--md-sys-color-surface-container);
  border: 1px solid var(--md-sys-color-outline-variant);
  color: var(--md-sys-color-on-surface);
  transition: all var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.m3-input:hover:not(.is-disabled) {
  background-color: var(--md-sys-color-surface-container-high);
  border-color: var(--md-sys-color-outline);
}

.m3-input.is-focused {
  border-color: var(--md-sys-color-primary);
  box-shadow: 0 0 0 1px var(--md-sys-color-primary);
  background-color: var(--md-sys-color-surface-container-high);
}

.m3-input.is-disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.m3-input.is-disabled .m3-input__inner {
  cursor: not-allowed;
}

/* 尺寸变体: md (常规表单) */
.m3-input--md {
  height: var(--md-control-height-md, 40px);
  padding: 0 12px;
  border-radius: var(--md-sys-shape-corner-medium, 12px);
  gap: 8px;
  font-size: var(--md-type-body-size, 14px);
  line-height: var(--md-type-body-lh, 22px);
}

/* 尺寸变体: sm (后台紧凑表单 / 单行水平内联筛选栏专用) */
.m3-input--sm {
  height: var(--md-control-height-sm, 36px);
  padding: 0 10px;
  border-radius: var(--md-sys-shape-corner-small, 8px);
  gap: 6px;
  font-size: var(--md-type-meta-size, 12px);
  line-height: var(--md-type-meta-lh, 18px);
}

/* 原生输入控件 */
.m3-input__inner {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  background: transparent;
  outline: none;
  padding: 0;
  margin: 0;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.m3-input__inner::placeholder {
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0.6;
}

/* 前后置插槽与图标容器 */
.m3-input__prefix,
.m3-input__suffix {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--md-sys-color-on-surface-variant);
}

/* 一键清空图标按钮 */
.m3-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  border: none;
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);
  cursor: pointer;
  padding: 0;
  margin: 0;
  outline: none;
  transition: all var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.m3-input__clear:hover {
  color: var(--md-sys-color-on-surface);
  background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent);
}

.m3-input__clear:active {
  background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent);
}
</style>
