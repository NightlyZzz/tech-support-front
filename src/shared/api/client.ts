import axios from 'axios'
import router from '@/router'
import { getUserToken } from '@/modules/user/model/userStorage'
import { BACKEND_URL } from '@/shared/utils/constants'
import { getEcho } from '@/shared/realtime/echo'
import { clearClientSession } from '@/modules/user/services/session.service'

export const apiClient = axios.create({
    baseURL: BACKEND_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

apiClient.interceptors.request.use((requestConfig) => {
    const token = getUserToken()

    if (token) {
        requestConfig.headers.Authorization = 'Bearer ' + token
    }

    const socketId = getEcho()?.socketId()

    if (socketId) {
        requestConfig.headers['X-Socket-Id'] = socketId
    }

    return requestConfig
})

apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            const responseStatus = error.response?.status
            const hasToken = !!getUserToken()
            const currentRouteName = router.currentRoute.value.name

            if (responseStatus === 401) {
                if (hasToken) {
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
)