import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export type Toast = {
    id: number
    message: string
    type: ToastType
}

export const toasts = ref<Toast[]>([])