import { apiClient } from '@/api/client'
import { publicApi } from '@/api/public.api'

export const getAnotherUser = async (id: number): Promise<any> => {
    const response = await apiClient.get('/user/' + id)
    return response.data
}

export const getAllUsers = async (): Promise<any> => {
    const response = await apiClient.get('/user/all')
    return response.data
}

export const updateUser = async (data: any): Promise<any> => {
    const response = await apiClient.put('/user', data)
    return response.data
}

export const updateAnotherUser = async (id: number, data: any): Promise<any> => {
    const response = await apiClient.put('/user/' + id, data)
    return response.data
}

export const deleteCurrentUser = async (): Promise<any> => {
    const response = await apiClient.delete('/user')
    return response.data
}

export const deleteAnotherUser = async (id: number): Promise<any> => {
    const response = await apiClient.delete('/user/' + id)
    return response.data
}

export const getAllDepartments = async (): Promise<any> => {
    const response = await publicApi.get('/public/departments')
    return response.data
}

export const getAllRoles = async (): Promise<any> => {
    const response = await publicApi.get('/public/roles')
    return response.data
}