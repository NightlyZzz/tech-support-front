import { apiClient } from '@/shared/api/client'

export const getAnotherUser = async (id: number): Promise<any> => {
    const response = await apiClient.get(`/user/${id}`)
    return response.data
}

export const getAllUsers = async (page = 1, searchQuery = ''): Promise<any> => {
    const params = new URLSearchParams()

    params.set('page', String(page))

    const normalizedSearchQuery = searchQuery.trim()

    if (normalizedSearchQuery) {
        params.set('search', normalizedSearchQuery)
    }

    const response = await apiClient.get(`/user/all?${params.toString()}`)
    return response.data
}

export const updateUser = async (data: any): Promise<any> => {
    const response = await apiClient.put('/user', data)
    return response.data
}

export const updateAnotherUser = async (id: number, data: any): Promise<any> => {
    const response = await apiClient.put(`/user/${id}`, data)
    return response.data
}

export const deleteCurrentUser = async (): Promise<any> => {
    const response = await apiClient.delete('/user')
    return response.data
}

export const deleteAnotherUser = async (id: number): Promise<any> => {
    const response = await apiClient.delete(`/user/${id}`)
    return response.data
}