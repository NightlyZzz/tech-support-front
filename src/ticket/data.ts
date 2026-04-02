import { Ticket } from '@/ticket/ticket'

export const mapTicket = (data: any): Ticket => {
    return new Ticket(
            data.id,
            data.description,
            data.created_at,
            data.type_name,
            data.status_name,
            data.status_id,
            data.sender_name
    )
}

export const mapTickets = (data: any[]): Ticket[] => {
    return data.map(mapTicket)
}
