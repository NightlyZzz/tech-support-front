import type { PaginationMeta } from '@/types/common'

export interface TicketApi {
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

export interface TicketTypeOption {
    id: number
    name: string
}

export interface TicketStatusOption {
    id: number
    name: string
}

export interface TicketResponse {
    data: TicketApi
}

export interface TicketActionResponse {
    message?: string
    data?: TicketApi
}

export interface LookupResponse<TItem> {
    data: TItem[]
}

export interface PaginatedResponse<TItem> {
    data: TItem[]
    meta: PaginationMeta
}