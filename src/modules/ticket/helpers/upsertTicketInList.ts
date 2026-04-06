import { mapTicket } from '@/modules/ticket/model/mapTicket'
import type { TicketApi } from '@/modules/ticket/types/ticket'
import type { TicketListItem } from '@/modules/ticket/types/ticket-list-item'

type TicketListReference = {
    value: TicketListItem[]
}

export const upsertTicketInList = (
        tickets: TicketListReference,
        ticketData: TicketApi
): void => {
    const mappedTicket = mapTicket(ticketData)
    const existingTicketIndex = tickets.value.findIndex((ticketItem) => {
        return ticketItem.getId() === mappedTicket.getId()
    })

    if (existingTicketIndex === -1) {
        tickets.value = [mappedTicket, ...tickets.value]
        return
    }

    tickets.value = tickets.value.map((ticketItem, index) => {
        return index === existingTicketIndex ? mappedTicket : ticketItem
    })
}