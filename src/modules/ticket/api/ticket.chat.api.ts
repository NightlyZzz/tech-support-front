import { apiClient } from '@/shared/api/client'
import type { TicketLog } from '@/modules/ticket/types/ticket-log'

type TicketLogsResponse = {
    data: TicketLog[]
}

type TicketLogResponse = {
    data: TicketLog
}

type CreateTicketLogPayload = {
    message: string
}

export const getTicketLogs = async (ticketId: number): Promise<TicketLog[]> => {
    const response = await apiClient.get<TicketLogsResponse>(`/ticket/log/${ticketId}`)
    return response.data.data
}

export const attachTicketLog = async (
        ticketId: number,
        data: CreateTicketLogPayload
): Promise<TicketLog> => {
    const response = await apiClient.post<TicketLogResponse>(`/ticket/log/${ticketId}`, data)
    return response.data.data
}