<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import MdSelect, { type SelectOption } from './MdSelect.vue'

const props = withDefaults(
  defineProps<{
    page: number
    pageSize: number
    total: number
    pageSizeOptions?: number[]
    disabled?: boolean
  }>(),
  {
    pageSizeOptions: () => [10, 20, 50],
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
  (e: 'change', payload: { page: number; pageSize: number }): void
}>()

// 将页容量数字列表转为 MdSelect 的选项数组
const sizeOptions = computed<SelectOption[]>(() => {
  return props.pageSizeOptions.map((opt) => ({
    label: `${opt} 条/页`,
    value: opt
  }))
})

// 总页数计算
const totalPages = computed(() => {
  if (props.total <= 0 || props.pageSize <= 0) return 1
  return Math.ceil(props.total / props.pageSize)
})

// 分页列表计算（智能折叠与省略）
const pageList = computed<(number | string)[]>(() => {
  const current = props.page
  const total = totalPages.value

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }

  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, '...', current - 1, current, current + 1, '...', total]
})

const handlePageChange = (newPage: number) => {
  if (props.disabled) return
  if (newPage < 1 || newPage > totalPages.value || newPage === props.page) return
  emit('update:page', newPage)
  emit('change', { page: newPage, pageSize: props.pageSize })
}

const handlePageSizeChange = (val: string | number) => {
  const newSize = Number(val)
  if (newSize === props.pageSize) return

  emit('update:pageSize', newSize)
  // 如果切换条数后当前页超出总页数，自适应重置
  const maxPage = Math.ceil(props.total / newSize) || 1
  const validPage = Math.min(props.page, maxPage)
  emit('update:page', validPage)
  emit('change', { page: validPage, pageSize: newSize })
}
</script>

<template>
  <nav class="m3-pagination" aria-label="数据表格分页导航">
    <!-- 左侧：总数与每页条数选择器 -->
    <div class="m3-pagination__left">
      <span class="type-meta text-secondary">
        共 <strong class="tabular-nums font-bold text-on-surface">{{ total }}</strong> 条记录
      </span>

      <div class="page-size-selector">
        <MdSelect
          :model-value="pageSize"
          :options="sizeOptions"
          size="sm"
          :disabled="disabled"
          @update:model-value="handlePageSizeChange"
        />
      </div>
    </div>

    <!-- 右侧：上一页、页码胶囊与下一页 -->
    <div class="m3-pagination__right">
      <!-- 上一页按钮 -->
      <button
        type="button"
        class="pagination-nav-btn md-state-layer"
        :class="{ 'is-disabled': page <= 1 || disabled }"
        :disabled="page <= 1 || disabled"
        title="上一页"
        aria-label="上一页"
        @click="handlePageChange(page - 1)"
      >
        <ChevronLeft :size="18" />
      </button>

      <!-- 页码胶囊群 -->
      <div class="pagination-pages">
        <template v-for="(item, idx) in pageList" :key="`page-${idx}`">
          <!-- 省略符号 -->
          <span
            v-if="item === '...'"
            class="pagination-ellipsis type-meta tabular-nums text-secondary"
          >
            ···
          </span>

          <!-- 真实数字页码胶囊 -->
          <button
            v-else
            type="button"
            :class="[
              'pagination-page-btn',
              'type-meta',
              'tabular-nums',
              'md-state-layer',
              {
                'is-active': item === page,
                'is-disabled': disabled
              }
            ]"
            :disabled="disabled"
            :aria-current="item === page ? 'page' : undefined"
            @click="handlePageChange(Number(item))"
          >
            {{ item }}
          </button>
        </template>
      </div>

      <!-- 下一页按钮 -->
      <button
        type="button"
        class="pagination-nav-btn md-state-layer"
        :class="{ 'is-disabled': page >= totalPages || disabled }"
        :disabled="page >= totalPages || disabled"
        title="下一页"
        aria-label="下一页"
        @click="handlePageChange(page + 1)"
      >
        <ChevronRight :size="18" />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.m3-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  width: 100%;
  flex-wrap: wrap;
  user-select: none;
}

.m3-pagination__left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.text-secondary {
  color: var(--md-sys-color-on-surface-variant);
}

.text-on-surface {
  color: var(--md-sys-color-on-surface);
}

.page-size-selector {
  display: inline-flex;
  align-items: center;
}

/* 右侧分页按钮群 */
.m3-pagination__right {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 36px × 36px 圆形导航按钮 */
.pagination-nav-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: var(--md-sys-color-on-surface-variant);
  border: none;
  cursor: pointer;
  outline: none;
  transition: all var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.pagination-nav-btn:hover:not(.is-disabled) {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
}

.pagination-nav-btn.is-disabled {
  opacity: 0.38;
  cursor: not-allowed;
  pointer-events: none;
}

/* 页码胶囊容器 */
.pagination-pages {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border-radius: var(--md-sys-shape-corner-full, 9999px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: var(--md-sys-color-on-surface);
  border: none;
  cursor: pointer;
  outline: none;
  font-weight: 500;
  transition: all var(--md-sys-motion-duration-short2) var(--md-easing-emphasized);
}

.pagination-page-btn:hover:not(.is-active):not(.is-disabled) {
  background-color: var(--md-sys-color-surface-container-high);
}

/* 激活态：使用 secondary-container 与 on-secondary-container 加粗 */
.pagination-page-btn.is-active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 700;
}

.pagination-page-btn.is-disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 36px;
}
</style>
