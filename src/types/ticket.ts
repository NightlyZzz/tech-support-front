export type TicketApi = {
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

export type TicketLog = {
    id: number
    message: string
    created_at: string
    sender_id: number | null
    employee_id: number | null
    sender_name: string
}

export type PaginationMeta = {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export type PaginatedResponse<T> = {
    data: T[]
    meta: PaginationMeta
}