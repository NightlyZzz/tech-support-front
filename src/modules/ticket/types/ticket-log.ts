export type TicketLog = {
    id: number
    message: string
    created_at: string
    sender_id: number | null
    employee_id: number | null
    sender_name: string
}