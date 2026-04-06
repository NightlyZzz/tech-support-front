import { ref } from 'vue'
import { getAllTicketStatuses } from '@/modules/ticket/api/ticket.lookup'
import type { TicketStatusOption } from '@/modules/ticket/types/ticket'

export const useTicketStatuses = () => {
    const statuses = ref<TicketStatusOption[]>([])

    const loadStatuses = async (): Promise<void> => {
        const response = await getAllTicketStatuses()
        statuses.value = response.data ?? []
    }

    return {
        statuses,
        loadStatuses
    }
}