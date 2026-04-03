import { onMounted, type Ref } from 'vue'
import router from '@/router'
import { useTicketPolling } from '@/composables/ticket/useTicketPolling'

export const useTicketPage = (
        loadTicket: () => Promise<void>,
        loadLogs: () => Promise<void>,
        loadStatuses: () => Promise<void>,
        canOpen: Ref<boolean>
) => {
    const loadAllData = async (): Promise<void> => {
        await loadTicket()

        if (!canOpen.value) {
            await router.push({ name: 'all-tickets' })
            return
        }

        await Promise.all([
            loadLogs(),
            loadStatuses()
        ])
    }

    onMounted(loadAllData)

    useTicketPolling(loadAllData, 3000)

    return {
        loadAllData
    }
}