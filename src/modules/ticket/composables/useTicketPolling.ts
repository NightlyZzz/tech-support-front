import { onMounted, onUnmounted } from 'vue'

export const useTicketPolling = (
        callback: () => Promise<void>,
        intervalMs = 3000
) => {
    let pollingInterval: ReturnType<typeof setInterval> | null = null

    onMounted(() => {
        pollingInterval = setInterval(() => {
            callback()
        }, intervalMs)
    })

    onUnmounted(() => {
        if (pollingInterval) {
            clearInterval(pollingInterval)
        }
    })
}