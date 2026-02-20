import { ref, computed } from 'vue'

const notifications = ref([])
let counter = 0

export function useNotificationActions() {
  const dismissNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const notify = (message, type = 'info', duration = 5000) => {
    const id = counter++
    notifications.value.push({ id, message, type })
    setTimeout(() => dismissNotification(id), duration)
  }

  return {
    notifications: computed(() => notifications.value),
    success: (m, d) => notify(m, 'success', d),
    error: (m, d) => notify(m, 'error', d),
    info: (m, d) => notify(m, 'info', d),
    warning: (m, d) => notify(m, 'warning', d),
    dismissNotification,
  }
  
}
