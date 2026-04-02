import { onMounted } from 'vue'
import router from '@/router'
import { useTicketPolling } from '@/composables/ticket/useTicketPolling'

export const useTicketPage = (
  loadTicket: () => Promise<void>,
  loadLogs: () => Promise<void>,
  loadStatuses: () => Promise<void>,
  canOpen: any
) => {
  const loadAllData = async (): Promise<void> => {
    await loadTicket()

    if (!canOpen.value) {
      await router.push({ name: 'all-tickets' })
      return
    }

    await loadLogs()
    await loadStatuses()
  }

  onMounted(loadAllData)

  useTicketPolling(loadAllData, 3000)

  return {
    loadAllData
  }
}
