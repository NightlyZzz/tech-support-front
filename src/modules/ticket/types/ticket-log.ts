export interface TicketLog {
    id: number
    message: string
    ticket_id: number
    created_at: string
    sender_id: number | null
    employee_id: number | null
    sender_name: string
    employee_name?: string | null
    author_name?: string
    is_employee_message?: boolean
}