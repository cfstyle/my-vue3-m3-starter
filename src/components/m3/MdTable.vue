<script setup lang="ts" generic="T extends Record<string, unknown>">
import { ref, computed } from 'vue'
import {
  Check,
  Minus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Layers
} from 'lucide-vue-next'

export type SortOrder = 'asc' | 'desc' | null

export interface MdTableColumn<R = Record<string, unknown>> {
  key: keyof R | string
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  numeric?: boolean
}

const props = withDefaults(
  defineProps<{
    columns: MdTableColumn<T>[]
    data: T[]
    rowKey?: keyof T | ((row: T, index: number) => string | number)
    loading?: boolean
    skeletonRows?: number
    selectable?: boolean
    selected?: T[]
    emptyText?: string
    emptyDescription?: string
    hoverable?: boolean
  }>(),
  {
    rowKey: () => 'id',
    loading: false,
    skeletonRows: undefined,
    selectable: false,
    selected: () => [],
    emptyText: '暂无匹配数据',
    emptyDescription: '',
    hoverable: true
  }
)

const emit = defineEmits<{
  (e: 'update:selected', selected: T[]): void
  (e: 'selection-change', selected: T[]): void
  (e: 'sort-change', payload: { key: string; order: SortOrder }): void
  (e: 'row-click', row: T, index: number): void
}>()

defineSlots<{
  toolbar?: () => unknown
  empty?: () => unknown
  'empty-action'?: () => unknown
  loading?: () => unknown
  pagination?: () => unknown
  [key: `cell-${string}`]: (props: { row: T; value: unknown; index: number }) => unknown
}>()

// 内部排序状态
const sortKey = ref<string | null>(null)
const sortOrder = ref<SortOrder>(null)

const handleSort = (col: MdTableColumn<T>) => {
  const colKey = String(col.key)
  if (sortKey.value !== colKey) {
    sortKey.value = colKey
    sortOrder.value = 'asc'
  } else if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc'
  } else if (sortOrder.value === 'desc') {
    sortKey.value = null
    sortOrder.value = null
  } else {
    sortOrder.value = 'asc'
  }

  emit('sort-change', { key: colKey, order: sortOrder.value })
}

// 行 Key 获取
const getRowKey = (row: T, index: number): string | number => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row, index)
  }
  const key = props.rowKey as keyof T
  const val = row[key]
  return val !== undefined && val !== null ? (val as string | number) : index
}

// 选中状态推导与切换
const isRowSelected = (row: T, index: number): boolean => {
  const currentKey = getRowKey(row, index)
  return props.selected.some((item, i) => getRowKey(item, i) === currentKey)
}

const isAllSelected = computed(() => {
  if (props.data.length === 0) return false
  return props.data.every((row, idx) => isRowSelected(row, idx))
})

const isIndeterminate = computed(() => {
  if (props.data.length === 0) return false
  const selectedCount = props.data.filter((row, idx) => isRowSelected(row, idx)).length
  return selectedCount > 0 && selectedCount < props.data.length
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    emit('update:selected', [])
    emit('selection-change', [])
  } else {
    const nextSelected = [...props.data]
    emit('update:selected', nextSelected)
    emit('selection-change', nextSelected)
  }
}

const toggleRowSelection = (row: T, index: number) => {
  const selected = [...props.selected]
  const currentKey = getRowKey(row, index)
  const existingIndex = selected.findIndex((item, i) => getRowKey(item, i) === currentKey)
  if (existingIndex > -1) {
    selected.splice(existingIndex, 1)
  } else {
    selected.push(row)
  }
  emit('update:selected', selected)
  emit('selection-change', selected)
}

const handleRowClick = (row: T, index: number) => {
  emit('row-click', row, index)
}

// 格式化单元格回退文本
const formatCellValue = (val: unknown): string => {
  if (val === null || val === undefined) return '-'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

// 骨架屏占位行数计算（优先取 skeletonRows，否则保持与当前展示条数一致）
const computedSkeletonRows = computed(() => {
  if (typeof props.skeletonRows === 'number' && props.skeletonRows > 0) {
    return props.skeletonRows
  }
  return props.data.length > 0 ? props.data.length : 5
})

// 骨架屏各列相对尺寸与对齐计算（严禁写死大宽度撑破横向布局）
const getSkeletonColStyle = (col: MdTableColumn<T>) => {
  const isRight = col.align === 'right' || col.numeric
  const isCenter = col.align === 'center'
  const isActionCol = String(col.key).toLowerCase().includes('action')

  if (isActionCol) {
    return {
      width: '56px',
      marginLeft: isRight ? 'auto' : undefined,
      marginRight: isCenter ? 'auto' : undefined
    }
  }

  if (col.numeric) {
    return {
      width: '48px',
      marginLeft: 'auto'
    }
  }

  if (isCenter) {
    return {
      width: '60%',
      maxWidth: '80px',
      margin: '0 auto'
    }
  }

  return {
    width: '75%',
    maxWidth: '110px',
    marginLeft: isRight ? 'auto' : undefined
  }
}
</script>

<template>
  <div class="m3-table-wrapper">
    <!-- 1. 顶部工具栏插槽 (Toolbar: 左右分布) -->
    <header v-if="$slots.toolbar" class="m3-table-toolbar">
      <slot name="toolbar" />
    </header>

    <!-- 2. 表格主体容器 -->
    <div class="m3-table-scroll-container">
      <table class="m3-table">
        <thead class="m3-table-thead">
          <tr class="m3-table-th-row">
            <!-- 多选列表头 -->
            <th v-if="selectable" class="m3-table-th th-selection">
              <button
                type="button"
                role="checkbox"
                :aria-checked="isIndeterminate ? 'mixed' : isAllSelected"
                class="m3-checkbox md-state-layer"
                :class="{ 'is-checked': isAllSelected, 'is-indeterminate': isIndeterminate }"
                title="全选/取消全选"
                @click.stop="toggleSelectAll"
              >
                <Check v-if="isAllSelected" :size="13" stroke-width="3" class="m3-checkbox__icon" />
                <Minus v-else-if="isIndeterminate" :size="13" stroke-width="3" class="m3-checkbox__icon" />
              </button>
            </th>

            <!-- 业务列表头 -->
            <th
              v-for="col in columns"
              :key="String(col.key)"
              :class="[
                'm3-table-th',
                'type-meta',
                `align-${col.align || (col.numeric ? 'right' : 'left')}`,
                { 'is-sortable': col.sortable, 'is-active-sort': sortKey === String(col.key) }
              ]"
              :style="{ width: col.width }"
              @click="col.sortable && handleSort(col)"
            >
              <div class="th-content">
                <span class="th-title">{{ col.title }}</span>
                <span v-if="col.sortable" class="th-sort-icon">
                  <ArrowUp v-if="sortKey === String(col.key) && sortOrder === 'asc'" :size="14" />
                  <ArrowDown v-else-if="sortKey === String(col.key) && sortOrder === 'desc'" :size="14" />
                  <ArrowUpDown v-else :size="14" class="opacity-40" />
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="m3-table-tbody">
          <!-- 骨架屏占位行 -->
          <template v-if="loading">
            <slot name="loading">
              <tr
                v-for="i in computedSkeletonRows"
                :key="`skeleton-${i}`"
                class="m3-table-tr m3-table-tr--skeleton"
              >
                <td v-if="selectable" class="m3-table-td td-selection">
                  <div class="skeleton-box skeleton-box--checkbox" />
                </td>
                <td
                  v-for="col in columns"
                  :key="`skeleton-col-${String(col.key)}`"
                  class="m3-table-td"
                  :class="`align-${col.align || (col.numeric ? 'right' : 'left')}`"
                >
                  <div
                    class="skeleton-box"
                    :style="getSkeletonColStyle(col)"
                  />
                </td>
              </tr>
            </slot>
          </template>

          <!-- 空状态 -->
          <tr v-else-if="data.length === 0" class="m3-table-tr m3-table-tr--empty">
            <td :colspan="columns.length + (selectable ? 1 : 0)" class="m3-table-td td-empty">
              <slot name="empty">
                <div class="m3-table-empty">
                  <div class="empty-badge">
                    <Layers :size="32" class="text-secondary" />
                  </div>
                  <div class="empty-text-wrap">
                    <span class="type-body text-secondary font-medium">{{ emptyText }}</span>
                    <span v-if="emptyDescription" class="type-meta text-secondary">{{ emptyDescription }}</span>
                  </div>
                  <div v-if="$slots['empty-action']" class="empty-action-wrap">
                    <slot name="empty-action" />
                  </div>
                </div>
              </slot>
            </td>
          </tr>

          <!-- 真实数据行 -->
          <template v-else>
            <tr
              v-for="(row, rowIndex) in data"
              :key="getRowKey(row, rowIndex)"
              :class="[
                'm3-table-tr',
                {
                  'is-selected': selectable && isRowSelected(row, rowIndex),
                  'is-hoverable': hoverable
                }
              ]"
              @click="handleRowClick(row, rowIndex)"
            >
              <!-- 行选择 Checkbox -->
              <td v-if="selectable" class="m3-table-td td-selection" @click.stop>
                <button
                  type="button"
                  role="checkbox"
                  :aria-checked="isRowSelected(row, rowIndex)"
                  class="m3-checkbox md-state-layer"
                  :class="{ 'is-checked': isRowSelected(row, rowIndex) }"
                  @click="toggleRowSelection(row, rowIndex)"
                >
                  <Check v-if="isRowSelected(row, rowIndex)" :size="13" stroke-width="3" class="m3-checkbox__icon" />
                </button>
              </td>

              <!-- 单元格 -->
              <td
                v-for="col in columns"
                :key="String(col.key)"
                :class="[
                  'm3-table-td',
                  'type-body',
                  `align-${col.align || (col.numeric ? 'right' : 'left')}`,
                  { 'tabular-nums': col.numeric }
                ]"
              >
                <slot
                  :name="`cell-${String(col.key)}`"
                  :row="row"
                  :value="row[col.key as keyof T]"
                  :index="rowIndex"
                >
                  {{ formatCellValue(row[col.key as keyof T]) }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- 3. 底部分页插槽 (一体化无缝融合) -->
    <footer v-if="$slots.pagination" class="m3-table-footer">
      <slot name="pagination" />
    </footer>
  </div>
</template>

<style scoped>
.m3-table-wrapper {
  width: 100%;
  background-color: var(--md-sys-color-surface-container-lowest);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-radius-card, 16px);
  overflow: hidden;
  box-shadow: var(--md-sys-elevation-level1);
  display: flex;
  flex-direction: column;
}

/* 顶部工具栏 */
.m3-table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface);
  flex-wrap: wrap;
}

/* 表格横向滚动容器 */
.m3-table-scroll-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* 底部分页容器（一体化融合） */
.m3-table-footer {
  border-top: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container-lowest);
  padding: 0;
}

/* 表格本体 */
.m3-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

/* 表头行 */
.m3-table-thead {
  background-color: var(--md-sys-color-surface-container-low);
  user-select: none;
}

.m3-table-th-row {
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.m3-table-th {
  padding: 12px 16px;
  color: var(--md-sys-color-on-surface);
  font-weight: 700;
  white-space: nowrap;
  vertical-align: middle;
  transition: background-color var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.m3-table-th.is-sortable {
  cursor: pointer;
}

.m3-table-th.is-sortable:hover {
  background-color: var(--md-sys-color-surface-container);
}

.m3-table-th.is-active-sort {
  color: var(--md-sys-color-primary);
}

.th-content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.th-sort-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.opacity-40 {
  opacity: 0.4;
}

/* 对齐辅助类 */
.align-left {
  text-align: left;
}

.align-left .th-content {
  justify-content: flex-start;
}

.align-center {
  text-align: center;
}

.align-center .th-content {
  justify-content: center;
}

.align-right {
  text-align: right;
}

.align-right .th-content {
  justify-content: flex-end;
}

/* 多选列 */
.th-selection,
.td-selection {
  width: 48px;
  min-width: 48px;
  max-width: 48px;
  text-align: center;
  padding: 0 12px;
}

/* 自定义 M3 Checkbox */
.m3-checkbox {
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: var(--md-sys-shape-corner-extra-small, 4px);
  border: 2px solid var(--md-sys-color-outline);
  background-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  outline: none;
  transition: all var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
  color: var(--md-sys-color-on-primary);
  vertical-align: middle;
}

/* 36px × 36px M3 圆形 State Layer 隐式热区 */
.m3-checkbox::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 36px;
  height: 36px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  transform: translate(-50%, -50%);
  background-color: transparent;
  transition: background-color var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
  pointer-events: none;
}

.m3-checkbox:hover::before {
  background-color: var(--md-sys-color-primary);
  opacity: 0.08;
}

.m3-checkbox:active::before {
  opacity: 0.12;
}

.m3-checkbox:hover {
  border-color: var(--md-sys-color-primary);
}

.m3-checkbox.is-checked,
.m3-checkbox.is-indeterminate {
  background-color: var(--md-sys-color-primary);
  border-color: var(--md-sys-color-primary);
}

.m3-checkbox__icon {
  color: var(--md-sys-color-on-primary);
}

/* 数据行与骨架屏行严格统一固定行高（消除纵向跳动） */
.m3-table-tr {
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  height: 48px;
  box-sizing: border-box;
  transition: background-color var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
  background-color: transparent;
}

:global([data-context="portal"]) .m3-table-tr {
  height: 56px;
}

.m3-table-tr:last-child {
  border-bottom: none;
}

/* 行悬浮与选中态 */
.m3-table-tr.is-hoverable:hover {
  background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 4%, transparent);
}

.m3-table-tr.is-selected {
  background-color: color-mix(in srgb, var(--md-sys-color-secondary-container) 45%, transparent);
}

.m3-table-tr.is-selected:hover {
  background-color: color-mix(in srgb, var(--md-sys-color-secondary-container) 65%, transparent);
}

/* 单元格统一高度与内边距 */
.m3-table-td {
  padding: 0 16px;
  height: 48px;
  box-sizing: border-box;
  color: var(--md-sys-color-on-surface);
  vertical-align: middle;
}

:global([data-context="portal"]) .m3-table-td {
  height: 56px;
}

/* 骨架屏脉冲动画 */
.m3-table-tr--skeleton {
  pointer-events: none;
}

.skeleton-box {
  height: 14px;
  border-radius: var(--md-sys-shape-corner-small, 8px);
  background: linear-gradient(
    90deg,
    var(--md-sys-color-surface-container-high) 25%,
    var(--md-sys-color-surface-container-highest) 50%,
    var(--md-sys-color-surface-container-high) 75%
  );
  background-size: 200% 100%;
  animation: m3-skeleton-pulse 1.6s ease-in-out infinite;
  max-width: 100%;
  box-sizing: border-box;
}

.skeleton-box--checkbox {
  width: 18px;
  height: 18px;
  border-radius: var(--md-sys-shape-corner-extra-small, 4px);
  margin: 0 auto;
}

@keyframes m3-skeleton-pulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 空状态 (保证纵向充足高度与视觉居中，杜绝表体塌陷成细线) */
.m3-table-tr--empty {
  height: auto;
}

.m3-table-td.td-empty {
  padding: 64px 20px;
  height: auto;
  min-height: 220px;
  text-align: center;
}

.m3-table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 180px;
}

.empty-badge {
  width: 56px;
  height: 56px;
  border-radius: var(--md-sys-shape-corner-medium, 16px);
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-text-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.empty-action-wrap {
  margin-top: 6px;
}

.text-secondary {
  color: var(--md-sys-color-on-surface-variant);
}
</style>
