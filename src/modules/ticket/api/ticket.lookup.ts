import { apiClient } from '@/shared/api/client'
import type {
    LookupResponse,
    TicketStatusOption,
    TicketTypeOption
} from '@/modules/ticket/types/ticket'

export const getAllTicketTypes = async (): Promise<LookupResponse<TicketTypeOption>> => {
    const response = await apiClient.get<LookupResponse<TicketTypeOption>>('/ticket/type/all')
    return response.data
}

export const getAllTicketStatuses = async (): Promise<LookupResponse<TicketStatusOption>> => {
    const response = await apiClient.get<LookupResponse<TicketStatusOption>>('/ticket/status/all')
    return response.data
}