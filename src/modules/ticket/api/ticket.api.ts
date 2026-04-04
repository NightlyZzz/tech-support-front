import { apiClient } from '@/shared/api/client'
import type { TicketApi, PaginatedResponse } from '@/types/ticket'

export const getTicket = async (id: number): Promise<TicketApi> => {
    const response = await apiClient.get('/ticket/' + id)
    return response.data.data
}

export const getAllTickets = async (page = 1): Promise<PaginatedResponse<TicketApi>> => {
    const response = await apiClient.get('/ticket/all?page=' + page)
    return response.data
}

export const getMyTickets = async (page = 1): Promise<PaginatedResponse<TicketApi>> => {
    const response = await apiClient.get('/ticket/my?page=' + page)
    return response.data
}

export const createTicket = async (data: any): Promise<any> => {
    const response = await apiClient.post('/ticket', data)
    return response.data
}

export const updateTicket = async (id: number, data: any): Promise<any> => {
    const response = await apiClient.put('/ticket/' + id, data)
    return response.data
}