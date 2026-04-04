import { apiClient } from '@/shared/api/client'

export const login = async (data: any): Promise<any> => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
}

export const register = async (data: any): Promise<any> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
}

export const getCurrentUser = async (): Promise<any> => {
    const response = await apiClient.get('/user')
    return response.data
}

export const logoutRequest = async (): Promise<void> => {
    await apiClient.post('/auth/logout')
}