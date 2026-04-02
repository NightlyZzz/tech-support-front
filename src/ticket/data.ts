import { Ticket } from '@/ticket/ticket'

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

export const mapTicket = (data: TicketApi): Ticket => {
    return new Ticket(
            data.id,
            data.description,
            data.contact_phone,
            data.sender_id,
            data.employee_id,
            data.type_id,
            data.type_name,
            data.status_id,
            data.status_name,
            data.created_at,
            data.sender_name
    )
}

export const mapTickets = (data: TicketApi[]): Ticket[] => {
    return data.map(mapTicket)
}