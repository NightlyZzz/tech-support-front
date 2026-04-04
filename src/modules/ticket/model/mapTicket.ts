import { Ticket } from '@/modules/ticket/model/ticket'

type TicketApi = {
    id: number
    description: string
    contact_phone: string
    sender_id: number
    employee_id: number | null
    type_id: number
    type_name: string
    status_id: number
    status_name: string
    created_at: string
    sender_name: string
}

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