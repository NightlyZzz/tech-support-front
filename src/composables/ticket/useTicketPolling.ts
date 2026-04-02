import { onMounted, onUnmounted } from 'vue'

export const useTicketPolling = (callback: () => Promise<void>, intervalMs = 3000) => {
  let interval: ReturnType<typeof setInterval>

  onMounted(() => {
    interval = setInterval(callback, intervalMs)
  })

  onUnmounted(() => {
    clearInterval(interval)
  })
}
