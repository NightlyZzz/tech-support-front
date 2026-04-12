import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
    id: number
    message: string
    type: ToastType
}

export const toasts = ref<ToastItem[]>([])