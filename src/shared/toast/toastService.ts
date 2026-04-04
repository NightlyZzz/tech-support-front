import { toasts } from './toastStore'

export type ToastType = 'success' | 'error' | 'info'

export const showToast = (
        message: string,
        type: ToastType = 'info',
        duration = 3000
): void => {
    const toastId = Date.now()

    toasts.value.push({
        id: toastId,
        message,
        type
    })

    if (duration <= 0) {
        return
    }

    setTimeout(() => {
        removeToast(toastId)
    }, duration)
}

export const removeToast = (toastId: number): void => {
    const toastIndex = toasts.value.findIndex(toastItem => toastItem.id === toastId)

    if (toastIndex !== -1) {
        toasts.value.splice(toastIndex, 1)
    }
}