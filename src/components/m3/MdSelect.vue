<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null | undefined
    options: SelectOption[]
    placeholder?: string
    size?: 'sm' | 'md'
    disabled?: boolean
    teleport?: boolean
  }>(),
  {
    placeholder: '请选择',
    size: 'md',
    disabled: false,
    teleport: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const isOpen = ref(false)
const placement = ref<'bottom' | 'top'>('bottom')
const selectRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref<Record<string, string>>({})

const selectedOption = computed(() => {
  return props.options.find((opt) => opt.value === props.modelValue)
})

const displayText = computed(() => {
  return selectedOption.value ? selectedOption.value.label : props.placeholder
})

const updateDropdownPosition = () => {
  if (!selectRef.value) return
  const rect = selectRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const estimatedMenuHeight = Math.min(props.options.length * 36 + 16, 220)

  const isTop = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow
  placement.value = isTop ? 'top' : 'bottom'

  if (props.teleport) {
    dropdownStyle.value = {
      position: 'fixed',
      left: `${rect.left}px`,
      minWidth: `${rect.width}px`,
      width: 'max-content',
      maxWidth: '320px',
      maxHeight: '220px',
      zIndex: 'var(--z-popover, 60)',
      ...(isTop
        ? { bottom: `${window.innerHeight - rect.top + 4}px` }
        : { top: `${rect.bottom + 4}px` })
    }
  }
}

const toggleOpen = () => {
  if (props.disabled) return
  if (!isOpen.value) {
    updateDropdownPosition()
    isOpen.value = true
    nextTick(() => {
      updateDropdownPosition()
    })
  } else {
    isOpen.value = false
  }
}

const selectOption = (opt: SelectOption) => {
  if (opt.disabled) return
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  const clickedInsideTrigger = selectRef.value ? selectRef.value.contains(target) : false
  const clickedInsideDropdown = dropdownRef.value ? dropdownRef.value.contains(target) : false
  if (!clickedInsideTrigger && !clickedInsideDropdown) {
    isOpen.value = false
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (!isOpen.value) return
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

const handleScrollOrResize = () => {
  if (isOpen.value) {
    updateDropdownPosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
  window.addEventListener('scroll', handleScrollOrResize, true)
  window.addEventListener('resize', handleScrollOrResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('scroll', handleScrollOrResize, true)
  window.removeEventListener('resize', handleScrollOrResize)
})
</script>

<template>
  <div
    ref="selectRef"
    :class="[
      'm3-select',
      `m3-select--${size}`,
      {
        'is-open': isOpen,
        'is-disabled': disabled
      }
    ]"
  >
    <!-- 触发按钮 -->
    <button
      type="button"
      class="m3-select-trigger md-state-layer"
      :class="{ 'has-value': !!selectedOption }"
      :disabled="disabled"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="toggleOpen"
    >
      <span class="m3-select-label">
        {{ displayText }}
      </span>
      <ChevronDown
        :size="size === 'sm' ? 14 : 16"
        class="m3-select-chevron"
        :class="{ 'is-flipped': isOpen }"
      />
    </button>

    <!-- 下拉菜单 (防父容器 overflow 裁剪与全局 z-index 阶梯) -->
    <Teleport to="body" :disabled="!teleport">
      <Transition name="m3-select-dropdown">
        <div
          v-if="isOpen"
          ref="dropdownRef"
          :class="['m3-select-dropdown', `placement-${placement}`, { 'is-teleported': teleport }]"
          :style="teleport ? dropdownStyle : undefined"
          role="listbox"
        >
          <ul class="m3-select-menu">
            <li
              v-for="opt in options"
              :key="opt.value"
              role="option"
              :aria-selected="opt.value === modelValue"
              :class="[
                'm3-select-option',
                'md-state-layer',
                {
                  'is-selected': opt.value === modelValue,
                  'is-disabled': opt.disabled
                }
              ]"
              @click="selectOption(opt)"
            >
              <span class="option-label" :title="opt.label">{{ opt.label }}</span>
              <Check
                v-if="opt.value === modelValue"
                :size="16"
                class="option-check"
              />
            </li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.m3-select {
  position: relative;
  display: inline-block;
  user-select: none;
  width: auto;
  vertical-align: middle;
}

/* 尺寸变体: md (表单默认) */
.m3-select--md {
  min-width: 140px;
}

.m3-select--md .m3-select-trigger {
  height: var(--md-control-height-md, 40px);
  padding: 0 14px;
  border-radius: var(--md-sys-shape-corner-medium, 12px);
  font-size: var(--md-type-body-size, 14px);
  line-height: var(--md-type-body-lh, 22px);
}

/* 尺寸变体: sm (表格/单行筛选栏专用) */
.m3-select--sm {
  min-width: 90px;
}

.m3-select--sm .m3-select-trigger {
  height: var(--md-control-height-sm, 36px);
  padding: 0 10px;
  border-radius: var(--md-sys-shape-corner-small, 8px);
  font-size: var(--md-type-meta-size, 12px);
  line-height: var(--md-type-meta-lh, 18px);
}

/* 触发器外观 */
.m3-select-trigger {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background-color: var(--md-sys-color-surface-container);
  border: 1px solid var(--md-sys-color-outline-variant);
  color: var(--md-sys-color-on-surface);
  cursor: pointer;
  outline: none;
  transition: all var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.m3-select-trigger:hover:not(:disabled) {
  background-color: var(--md-sys-color-surface-container-high);
  border-color: var(--md-sys-color-outline);
}

.m3-select.is-open .m3-select-trigger {
  border-color: var(--md-sys-color-primary);
  box-shadow: 0 0 0 1px var(--md-sys-color-primary);
}

.m3-select.is-disabled .m3-select-trigger {
  opacity: 0.38;
  cursor: not-allowed;
}

.m3-select-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.m3-select-chevron {
  color: var(--md-sys-color-on-surface-variant);
  flex-shrink: 0;
  transition: transform var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.m3-select-chevron.is-flipped {
  transform: rotate(180deg);
}

/* 下拉菜单定位与样式 */
.m3-select-dropdown {
  position: absolute;
  left: 0;
  min-width: 100%;
  width: max-content;
  max-width: 320px;
  max-height: 220px;
  background-color: var(--md-sys-color-surface-container-high);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 12px;
  box-shadow: var(--md-elevation-2);
  overflow-y: auto;
  z-index: var(--z-popover, 60);
  padding: 4px;
  box-sizing: border-box;
}

.placement-bottom {
  top: calc(100% + 4px);
}

.placement-top {
  bottom: calc(100% + 4px);
}

.m3-select-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* 菜单项 */
.m3-select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  box-sizing: border-box;
  border-radius: var(--md-sys-shape-corner-small, 8px);
  color: var(--md-sys-color-on-surface);
  font-size: var(--md-type-body-size, 14px);
  line-height: var(--md-type-body-lh, 22px);
  cursor: pointer;
  transition: background-color var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.m3-select-option:hover:not(.is-disabled) {
  background-color: var(--md-sys-color-surface-container-highest);
}

/* 选中态：使用 secondary-container 填充与加粗 */
.m3-select-option.is-selected {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 700;
}

.m3-select-option.is-selected .option-check {
  color: var(--md-sys-color-on-secondary-container);
}

.m3-select-option.is-disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.option-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
  text-align: left;
}

.option-check {
  flex-shrink: 0;
  margin-left: 8px;
  color: var(--md-sys-color-primary);
}

.text-primary {
  color: var(--md-sys-color-primary);
}

/* 下拉菜单动画 */
.m3-select-dropdown-enter-active,
.m3-select-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.m3-select-dropdown-enter-from,
.m3-select-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
