import { apiClient } from '@/shared/api/client'
import type { TicketLog } from '@/types/ticket'

export const getTicketLogs = async (ticketId: number): Promise<TicketLog[]> => {
    const response = await apiClient.get('/ticket/log/' + ticketId)
    return response.data.data
}

export const attachTicketLog = async (ticketId: number, data: any): Promise<any> => {
    const response = await apiClient.post('/ticket/log/' + ticketId, data)
    return response.data
}