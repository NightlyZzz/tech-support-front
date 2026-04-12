import { onMounted, type Ref } from 'vue'

export const useTicketPage = (
        loadTicket: () => Promise<void>,
        loadLogs: () => Promise<void>,
        loadStatuses: () => Promise<void>,
        canOpen: Ref<boolean>
) => {
    const loadAllData = async (): Promise<void> => {
        await loadTicket()

        if (!canOpen.value) {
            return
        }

        await Promise.all([loadLogs(), loadStatuses()])
    }

    onMounted(() => {
        void loadAllData()
    })

    return {
        loadAllData
    }
}