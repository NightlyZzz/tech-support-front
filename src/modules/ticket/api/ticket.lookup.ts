import { apiClient } from '@/shared/api/client'

export const getAllTicketTypes = async (): Promise<any> => {
    const response = await apiClient.get('/ticket/type/all')
    return response.data
}

export const getAllTicketStatuses = async (): Promise<any> => {
    const response = await apiClient.get('/ticket/status/all')
    return response.data
}