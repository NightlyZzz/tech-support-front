import axios, {
    AxiosHeaders,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from 'axios'
import router from '@/router'
import { BACKEND_URL } from '@/shared/utils/constants'
import { getEcho } from '@/shared/realtime/echo'
import { clearClientSession } from '@/modules/user/services/session.service'

export const apiClient = axios.create({
    baseURL: BACKEND_URL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

export const enrichApiRequestConfig = (
        requestConfig: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
    const nextConfig = requestConfig

    if (!(nextConfig.headers instanceof AxiosHeaders)) {
        nextConfig.headers = new AxiosHeaders(nextConfig.headers)
    }

    const socketId = getEcho()?.socketId()

    if (socketId) {
        nextConfig.headers.set('X-Socket-Id', socketId)
    }

    return nextConfig
}

export const handleApiClientError = async (error: {
    response?: {
        status?: number
    }
    config?: {
        url?: string
    }
}): Promise<never> => {
    const responseStatus = error.response?.status
    const requestUrl = String(error.config?.url ?? '')
    const currentRouteName = router.currentRoute.value.name

    if (responseStatus === 401) {
        const isAuthRequest =
                requestUrl.includes('/auth/login') ||
                requestUrl.includes('/auth/register') ||
                requestUrl.includes('/sanctum/csrf-cookie')

        if (!isAuthRequest) {
            clearClientSession()

            if (currentRouteName !== 'auth') {
                await router.replace({ name: 'auth' })
            }
        }

        return Promise.reject(error)
    }

    if (responseStatus === 403) {
        if (currentRouteName !== 'profile') {
            await router.replace({ name: 'profile' })
        }

        return Promise.reject(error)
    }

    return Promise.reject(error)
}

apiClient.interceptors.request.use((requestConfig) => {
    return enrichApiRequestConfig(requestConfig)
})

apiClient.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error) => handleApiClientError(error)
)