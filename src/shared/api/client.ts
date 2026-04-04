import axios from 'axios'
import router from '@/router'
import { getUserToken } from '@/modules/user/model/userStorage'
import { BACKEND_URL } from '@/shared/utils/constants'

export const apiClient = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

apiClient.interceptors.request.use(config => {
    const token = getUserToken()

    if (token) {
        config.headers.Authorization = 'Bearer ' + token
    }

    return config
})

apiClient.interceptors.response.use(
        response => response,
        async error => {
            const status = error.response?.status
            const token = getUserToken()

            if (status === 401) {
                if (token) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user_data')

                    await router.push({ name: 'auth' })
                }

                return Promise.reject(error)
            }

            if (status === 403) {
                await router.push({ name: 'home' })
                return Promise.reject(error)
            }

            return Promise.reject(error)
        }
)