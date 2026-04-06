import { apiClient } from '@/shared/api/client'
import type {
    UserActionResponse,
    UserResponse,
    UsersListResponse,
    UserUpdatePayload
} from '@/modules/user/types/user'

export const getAnotherUser = async (id: number): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>(`/user/${id}`)
    return response.data
}

export const getAllUsers = async (page = 1, searchQuery = ''): Promise<UsersListResponse> => {
    const params = new URLSearchParams()

    params.set('page', String(page))

    const normalizedSearchQuery = searchQuery.trim()

    if (normalizedSearchQuery) {
        params.set('search', normalizedSearchQuery)
    }

    const response = await apiClient.get<UsersListResponse>(`/user/all?${params.toString()}`)
    return response.data
}

export const updateUser = async (data: UserUpdatePayload): Promise<UserActionResponse> => {
    const response = await apiClient.put<UserActionResponse>('/user', data)
    return response.data
}

export const updateAnotherUser = async (id: number, data: UserUpdatePayload): Promise<UserActionResponse> => {
    const response = await apiClient.put<UserActionResponse>(`/user/${id}`, data)
    return response.data
}

export const deleteCurrentUser = async (): Promise<UserActionResponse> => {
    const response = await apiClient.delete<UserActionResponse>('/user')
    return response.data
}

export const deleteAnotherUser = async (id: number): Promise<UserActionResponse> => {
    const response = await apiClient.delete<UserActionResponse>(`/user/${id}`)
    return response.data
}