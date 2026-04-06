import { toasts } from './toastStore'

export type ToastType = 'success' | 'error' | 'info'

const DEFAULT_TOAST_DURATION = 3000

export const showToast = (
        message: string,
        type: ToastType = 'info',
        duration = DEFAULT_TOAST_DURATION
): void => {
    const normalizedMessage = message.trim()

    if (!normalizedMessage) {
        return
    }

    const toastId = Date.now() + Math.floor(Math.random() * 1000)

    toasts.value.push({
        id: toastId,
        message: normalizedMessage,
        type
    })

    if (duration <= 0) {
        return
    }

    window.setTimeout(() => {
        removeToast(toastId)
    }, duration)
}

export const removeToast = (toastId: number): void => {
    const toastIndex = toasts.value.findIndex((toastItem) => toastItem.id === toastId)

    if (toastIndex === -1) {
        return
    }

    toasts.value.splice(toastIndex, 1)
}