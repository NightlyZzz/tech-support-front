import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export const toasts = ref<Toast[]>([])

let counter = 0

export const showToast = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
  const id = ++counter
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }, duration)
}
