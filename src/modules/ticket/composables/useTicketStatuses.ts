import { ref } from 'vue'
import { getAllTicketStatuses } from '@/modules/ticket/api/ticket.lookup'

export type TicketStatusOption = {
    id: number
    name: string
}

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