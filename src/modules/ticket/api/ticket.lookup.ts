import { apiClient } from '@/shared/api/client'
import type { TicketStatusOption, TicketTypeOption } from '@/modules/ticket/types/ticket'
import type { LookupResponse } from '@/shared/types/lookup'

export const getAllTicketTypes = async (): Promise<LookupResponse<TicketTypeOption>> => {
    const response = await apiClient.get<LookupResponse<TicketTypeOption>>('/ticket/type/all')
    return response.data
}

export const getAllTicketStatuses = async (): Promise<LookupResponse<TicketStatusOption>> => {
    const response = await apiClient.get<LookupResponse<TicketStatusOption>>('/ticket/status/all')
    return response.data
}