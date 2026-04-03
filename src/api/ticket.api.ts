import { apiClient } from '@/api/client'
import type { TicketApi, PaginatedResponse } from '@/types/ticket'
import type { TicketLog } from '@/types/ticket'

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

export const getAllTicketTypes = async (): Promise<any> => {
    const response = await apiClient.get('/ticket/type/all')
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

export const getTicketLogs = async (ticketId: number): Promise<TicketLog[]> => {
    const response = await apiClient.get('/ticket/log/' + ticketId)
    return response.data.data
}

export const attachTicketLog = async (ticketId: number, data: any): Promise<any> => {
    const response = await apiClient.post('/ticket/log/' + ticketId, data)
    return response.data
}

export const getAllTicketStatuses = async (): Promise<any> => {
    const response = await apiClient.get('/ticket/status/all')
    return response.data
}