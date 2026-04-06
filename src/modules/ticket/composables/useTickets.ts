import { ref } from 'vue'
import { mapTickets } from '@/modules/ticket/model/mapTicket'
import type { Ticket } from '@/modules/ticket/model/ticket'
import type { PaginationMeta } from '@/types/common'
import type { PaginatedResponse, TicketApi } from '@/modules/ticket/types/ticket'

type LoadTicketsApi = (page: number) => Promise<PaginatedResponse<TicketApi>>
type SetPaginationMeta = (meta: PaginationMeta) => void

export const useTickets = (loadTicketsApi: LoadTicketsApi) => {
    const tickets = ref<Ticket[]>([])

    const load = async (page: number, setPaginationMeta: SetPaginationMeta): Promise<void> => {
        const responseData = await loadTicketsApi(page)
        tickets.value = mapTickets(responseData.data)
        setPaginationMeta(responseData.meta)
    }

    return {
        tickets,
        load
    }
}