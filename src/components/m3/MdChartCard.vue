<script setup lang="ts" generic="T extends Record<string, any> = Record<string, any>">
import { ref, computed, type Component } from 'vue'
import { BarChart3, Table, Download } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import MdCard, { type CardVariant } from './MdCard.vue'
import MdTable, { type MdTableColumn } from './MdTable.vue'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    icon?: Component
    variant?: CardVariant
    columns?: MdTableColumn<T>[]
    data?: T[]
    exportFilename?: string
    allowTableToggle?: boolean
    rowKey?: keyof T | ((row: T, index: number) => string | number)
    emptyText?: string
  }>(),
  {
    subtitle: '',
    icon: undefined,
    variant: 'elevated',
    columns: undefined,
    data: undefined,
    exportFilename: 'chart-data.csv',
    allowTableToggle: true,
    rowKey: () => 'id' as keyof T,
    emptyText: '暂无数据'
  }
)

const emit = defineEmits<{
  (e: 'update:viewMode', mode: 'chart' | 'table'): void
}>()

const toast = useToast()
const viewMode = ref<'chart' | 'table'>('chart')

const setViewMode = (mode: 'chart' | 'table') => {
  viewMode.value = mode
  emit('update:viewMode', mode)
}

const resolvedColumns = computed<MdTableColumn<T>[]>(() => {
  if (props.columns && props.columns.length > 0) {
    return props.columns
  }
  if (props.data && props.data.length > 0 && props.data[0]) {
    return Object.keys(props.data[0]).map((key) => ({
      key: key as keyof T,
      title: key
    }))
  }
  return []
})

const exportCsv = () => {
  if (!props.data || props.data.length === 0) return

  const cols = resolvedColumns.value
  const header = cols.map((c) => `"${String(c.title).replace(/"/g, '""')}"`).join(',')
  const rows = props.data.map((row) => {
    return cols
      .map((c) => {
        const val = row[c.key as keyof T] ?? ''
        return `"${String(val).replace(/"/g, '""')}"`
      })
      .join(',')
  })

  // 增加 UTF-8 BOM 标头 (\uFEFF)，确保 Windows Excel / WPS 中文展示不乱码
  const csvContent = '\uFEFF' + [header, ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', props.exportFilename || 'chart-data.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  toast.success('CSV 数据已导出')
}

defineExpose({
  viewMode,
  exportCsv
})
</script>

<template>
  <MdCard :variant="variant" class="m3-chart-card">
    <!-- 顶部标题与工具栏 -->
    <template #header>
      <div class="m3-chart-card__header">
        <div class="m3-chart-card__title-group">
          <div v-if="icon" class="m3-chart-card__icon">
            <component :is="icon" :size="18" />
          </div>
          <div class="m3-chart-card__titles">
            <h3 class="m3-chart-card__title type-title-md">{{ title }}</h3>
            <p v-if="subtitle" class="m3-chart-card__subtitle type-meta text-secondary">{{ subtitle }}</p>
          </div>
          <slot name="header-start" />
        </div>

        <div class="m3-chart-card__actions">
          <slot name="actions" />

          <!-- 双态分段切换胶囊 (图表 / 数据表) -->
          <div
            v-if="allowTableToggle && data && data.length > 0"
            class="m3-segmented-control"
            role="tablist"
            aria-label="视图模式切换"
          >
            <button
              type="button"
              :class="['m3-segment-btn', 'md-state-layer', { 'is-active': viewMode === 'chart' }]"
              title="切换至可视化图表"
              aria-label="切换至可视化图表"
              @click="setViewMode('chart')"
            >
              <BarChart3 :size="15" />
              <span class="m3-segment-label type-meta">图表</span>
            </button>
            <button
              type="button"
              :class="['m3-segment-btn', 'md-state-layer', { 'is-active': viewMode === 'table' }]"
              title="切换至底层数据表"
              aria-label="切换至底层数据表"
              @click="setViewMode('table')"
            >
              <Table :size="15" />
              <span class="m3-segment-label type-meta">数据表</span>
            </button>
          </div>

          <!-- 轻量导出 CSV 按钮 -->
          <button
            v-if="data && data.length > 0"
            type="button"
            class="m3-chart-card__export-btn md-state-layer"
            title="导出为 CSV 文件"
            aria-label="导出为 CSV 文件"
            @click="exportCsv"
          >
            <Download :size="15" />
          </button>
        </div>
      </div>
    </template>

    <!-- 原位双视图容器 (严禁同时上下堆叠) -->
    <div class="m3-chart-card__body">
      <Transition name="m3-chart-fade" mode="out-in">
        <!-- 1. 可视化图表视图 (默认) -->
        <div v-if="viewMode === 'chart'" key="chart" class="m3-chart-card__chart-pane">
          <slot name="chart">
            <slot />
          </slot>
          <div v-if="$slots.footer" class="m3-chart-card__footer">
            <slot name="footer" />
          </div>
        </div>

        <!-- 2. 底层数据表格视图 (原位切换) -->
        <div v-else key="table" class="m3-chart-card__table-pane">
          <slot name="table">
            <MdTable
              :columns="resolvedColumns"
              :data="data || []"
              :row-key="rowKey"
              :empty-text="emptyText"
              hoverable
            />
          </slot>
        </div>
      </Transition>
    </div>
  </MdCard>
</template>

<style scoped>
.m3-chart-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.m3-chart-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
}

.m3-chart-card__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.m3-chart-card__icon {
  width: 36px;
  height: 36px;
  border-radius: var(--md-sys-shape-corner-medium, 12px);
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.m3-chart-card__titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.m3-chart-card__title {
  color: var(--md-sys-color-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.m3-chart-card__subtitle {
  margin: 0;
}

.m3-chart-card__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

/* M3 双态分段切换胶囊 */
.m3-segmented-control {
  display: inline-flex;
  align-items: center;
  padding: 3px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  background-color: var(--md-sys-color-surface-container-high);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.m3-segment-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 10px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  border: none;
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);
  cursor: pointer;
  user-select: none;
  transition: all var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.m3-segment-btn.is-active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 600;
  box-shadow: var(--md-elevation-1);
}

.m3-segment-btn:hover:not(.is-active) {
  color: var(--md-sys-color-on-surface);
}

.m3-chart-card__export-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  border: 1px solid var(--md-sys-color-outline-variant);
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface-variant);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.m3-chart-card__export-btn:hover {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  border-color: var(--md-sys-color-outline);
}

.m3-chart-card__body {
  position: relative;
  width: 100%;
}

.m3-chart-card__chart-pane {
  position: relative;
  width: 100%;
}

.m3-chart-card__table-pane {
  position: relative;
  width: 100%;
  overflow-x: auto;
}

.m3-chart-card__footer {
  width: 100%;
}

.m3-chart-fade-enter-active,
.m3-chart-fade-leave-active {
  transition: opacity 0.2s var(--md-easing-emphasized), transform 0.2s var(--md-easing-emphasized);
}

.m3-chart-fade-enter-from,
.m3-chart-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
