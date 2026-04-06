import { Ticket } from '@/modules/ticket/model/ticket'
import type { TicketApi } from '@/modules/ticket/types/ticket'

export const mapTicket = (ticketData: TicketApi): Ticket => {
    return new Ticket(
            ticketData.id,
            ticketData.description,
            ticketData.contact_phone,
            ticketData.sender_id,
            ticketData.employee_id,
            ticketData.type_id,
            ticketData.type_name,
            ticketData.status_id,
            ticketData.status_name,
            ticketData.created_at,
            ticketData.sender_name
    )
}

export const mapTickets = (ticketsData: TicketApi[]): Ticket[] => {
    return ticketsData.map(mapTicket)
}