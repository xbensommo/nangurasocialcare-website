<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="n in store.notifications"
      :key="n.id"
      :class="['p-4 rounded-lg shadow-lg cursor-pointer', classes(n.type)]"
      @click="store.dismissNotification(n.id)"
    >
      {{ n.message }}
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/appStore'
const store = useAppStore()
const classes = (type) => ({
  success: 'bg-[var(--color-success)]',
  error: 'bg-[var(--color-danger)]',
  info: 'bg-[var(--color-primary)]',
  warning: 'bg-[var(--color-accent)]',
}[type] || 'bg-[var(--color-neutral)]')
</script>
