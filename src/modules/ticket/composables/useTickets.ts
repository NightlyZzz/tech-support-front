import { ref } from 'vue'
import { mapTickets } from '@/modules/ticket/model/mapTicket'
import type { Ticket } from '@/modules/ticket/model/ticket'
import type { PaginatedResponse, TicketApi } from '@/types/ticket'

type ApiFunction = (page: number) => Promise<PaginatedResponse<TicketApi>>
type SetMetaFunction = (meta: any) => void

export const useTickets = (api: ApiFunction) => {
    const tickets = ref<Ticket[]>([])

    const load = async (page: number, setMeta: SetMetaFunction): Promise<void> => {
        const responseJson = await api(page)
        tickets.value = mapTickets(responseJson.data)
        setMeta(responseJson.meta)
    }

    return {
        tickets,
        load
    }
}