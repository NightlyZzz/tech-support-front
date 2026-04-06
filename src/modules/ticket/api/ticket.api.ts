import { apiClient } from '@/shared/api/client'
import type {
    PaginatedResponse,
    TicketActionResponse,
    TicketApi,
    TicketResponse
} from '@/modules/ticket/types/ticket'

export const getTicket = async (ticketId: number): Promise<TicketApi> => {
    const response = await apiClient.get<TicketResponse>(`/ticket/${ticketId}`)
    return response.data.data
}

export const getAllTickets = async (page = 1): Promise<PaginatedResponse<TicketApi>> => {
    const response = await apiClient.get<PaginatedResponse<TicketApi>>(`/ticket/all?page=${page}`)
    return response.data
}

export const getMyTickets = async (page = 1): Promise<PaginatedResponse<TicketApi>> => {
    const response = await apiClient.get<PaginatedResponse<TicketApi>>(`/ticket/my?page=${page}`)
    return response.data
}

export const createTicket = async <TPayload extends Record<string, unknown>>(data: TPayload): Promise<TicketActionResponse> => {
    const response = await apiClient.post<TicketActionResponse>('/ticket', data)
    return response.data
}

export const updateTicket = async <TPayload extends Record<string, unknown>>(
        ticketId: number,
        data: TPayload
): Promise<TicketActionResponse> => {
    const response = await apiClient.put<TicketActionResponse>(`/ticket/${ticketId}`, data)
    return response.data
}