import { ref } from 'vue'
import { getAllTicketStatuses } from '@/api/ticket.api.ts'

export type TicketStatusOption = {
    id: number
    name: string
}

export const useTicketStatuses = () => {
    const statuses = ref<TicketStatusOption[]>([])

    const loadStatuses = async (): Promise<void> => {
        const data = await getAllTicketStatuses()
        statuses.value = data ?? []
    }

    return {
        statuses,
        loadStatuses
    }
}