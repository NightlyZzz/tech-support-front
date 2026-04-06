import { apiClient } from '@/shared/api/client'
import type { RegisterForm } from '@/modules/user/types/register'
import type { AuthTokenResponse, LoginRequest } from '@/modules/user/types/auth'
import type { CurrentUserResponse } from '@/modules/user/types/user'

export const login = async (data: LoginRequest): Promise<AuthTokenResponse> => {
    const response = await apiClient.post<AuthTokenResponse>('/auth/login', data)
    return response.data
}

export const register = async (data: RegisterForm): Promise<void> => {
    await apiClient.post('/auth/register', data)
}

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
    const response = await apiClient.get<CurrentUserResponse>('/user')
    return response.data
}

export const logoutRequest = async (allDevices = false): Promise<void> => {
    await apiClient.post('/auth/logout', {
        all_devices: allDevices
    })
}