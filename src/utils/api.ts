import axios from 'axios'
import { BACKEND_URL } from '@/utils/constants'
import { logout } from '@/user/data'
import { showToast } from '@/utils/toast'
import { useAuth } from '@/composables/auth/useAuth'

const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const { user } = useAuth()
    const currentUser = user.value

    if (currentUser && currentUser.getToken() && !config.url?.startsWith('/public')) {
        config.headers.Authorization = 'Bearer ' + currentUser.getToken()
    }

    return config
})

api.interceptors.response.use(
        (response) => response,
        (error) => {
            const url = error?.config?.url || ''

            if (error?.response?.status === 401 && !url.startsWith('/public') && !url.startsWith('/auth')) {
                logout()
                showToast('Сессия истекла, войдите снова', 'info')
            }

            throw error
        }
)

export default api
