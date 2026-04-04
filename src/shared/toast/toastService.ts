import { toasts } from './toastStore'

export type ToastType = 'success' | 'error' | 'info'

export const showToast = (
        message: string,
        type: ToastType = 'info',
        duration = 3000
): void => {
    const id = Date.now()

    toasts.value.push({
        id,
        message,
        type
    })

    if (duration <= 0) {
        return
    }

    setTimeout(() => {
        removeToast(id)
    }, duration)
}

export const removeToast = (id: number): void => {
    const index = toasts.value.findIndex(t => t.id === id)

    if (index !== -1) {
        toasts.value.splice(index, 1)
    }
}