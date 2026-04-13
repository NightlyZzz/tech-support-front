import type { PaginationMeta } from '@/types/common'
import type { LookupItem } from '@/shared/types/lookup'

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
    employee_name?: string | null
}

export type TicketTypeOption = LookupItem

export type TicketStatusOption = LookupItem

export interface TicketResponse {
    data: TicketApi
}

export interface TicketActionResponse {
    message?: string
    data?: TicketApi
}

export interface PaginatedResponse<TItem> {
    data: TItem[]
    meta: PaginationMeta
}