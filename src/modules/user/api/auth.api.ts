import type { RegisterForm } from '@/modules/user/types/register'
import type { AuthActionResponse, LoginRequest } from '@/modules/user/types/auth'
import type { CurrentUserResponse } from '@/modules/user/types/user'
import { apiClient } from '@/shared/api/client'
import { webApi } from '@/shared/api/public.api'

export const ensureCsrfCookie = async (): Promise<void> => {
    await webApi.get('/sanctum/csrf-cookie')
}

export const login = async (data: LoginRequest): Promise<AuthActionResponse> => {
    await ensureCsrfCookie()

    const response = await apiClient.post<AuthActionResponse>('/auth/login', data)
    return response.data
}

export const register = async (data: RegisterForm): Promise<AuthActionResponse> => {
    await ensureCsrfCookie()

    const response = await apiClient.post<AuthActionResponse>('/auth/register', data)
    return response.data
}

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
    const response = await apiClient.get<CurrentUserResponse>('/user')
    return response.data
}

export const logoutRequest = async (allDevices = false): Promise<void> => {
    await ensureCsrfCookie()

    await apiClient.post('/auth/logout', {
        all_devices: allDevices
    })
}