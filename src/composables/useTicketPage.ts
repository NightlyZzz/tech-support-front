import { onMounted } from 'vue'
import { useTicketPolling } from '@/composables/useTicketPolling'

export const useTicketPage = (
  loadTicket: () => Promise<void>,
  loadLogs: () => Promise<void>,
  loadStatuses: () => Promise<void>
) => {
  const loadAllData = async (): Promise<void> => {
    await loadTicket()
    await loadLogs()
    await loadStatuses()
  }

  onMounted(loadAllData)

  useTicketPolling(loadAllData, 3000)

  return {
    loadAllData
  }
}
