<script setup lang="ts">
import { MdCard, MdButton } from '@/components/m3'
import { Bell, CheckCheck, Info, AlertTriangle, Sparkles } from 'lucide-vue-next'

const notifications = [
  {
    id: 1,
    title: '系统架构升级通知',
    time: '10 分钟前',
    content: '前端已成功升级至 Material Design 3 体系，全端自适应响应式支持生效中。',
    type: 'primary',
    icon: Sparkles
  },
  {
    id: 2,
    title: '安全策略执行成功',
    time: '2 小时前',
    content: '所有 API 均已开启 TLS 1.3 及严格状态隔离机制。',
    type: 'info',
    icon: Info
  },
  {
    id: 3,
    title: '容量阈值预警解除',
    time: '昨天 18:30',
    content: '边缘计算节点自动完成横向弹性扩容，资源水位恢复至正常区间。',
    type: 'warning',
    icon: AlertTriangle
  }
]
</script>

<template>
  <div class="messages-view">
    <div class="page-header">
      <div>
        <h1 class="headline-medium">消息通知中心</h1>
        <p class="body-medium text-secondary">系统通知与业务实时动态</p>
      </div>
      <MdButton variant="text">
        <template #icon><CheckCheck /></template>
        全部标为已读
      </MdButton>
    </div>

    <div class="notifications-list">
      <MdCard
        v-for="item in notifications"
        :key="item.id"
        variant="elevated"
        class="notify-card"
      >
        <div class="notify-icon-box" :class="item.type">
          <component :is="item.icon" :size="20" />
        </div>
        <div class="notify-content">
          <div class="notify-title-row">
            <span class="title-medium">{{ item.title }}</span>
            <span class="label-small text-secondary">{{ item.time }}</span>
          </div>
          <p class="body-medium text-secondary">{{ item.content }}</p>
        </div>
      </MdCard>
    </div>
  </div>
</template>

<style scoped>
.messages-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.text-secondary {
  color: var(--md-sys-color-on-surface-variant);
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notify-card {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 20px;
}

.notify-icon-box {
  width: 40px;
  height: 40px;
  border-radius: var(--md-sys-shape-corner-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notify-icon-box.primary {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.notify-icon-box.info {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.notify-icon-box.warning {
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
}

.notify-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notify-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
