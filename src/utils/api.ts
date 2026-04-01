import axios from 'axios'
import { BACKEND_URL } from '@/utils/constants'
import { getUser, logout } from '@/user/data'
import { showToast } from '@/utils/toast'

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const user = getUser()

  console.log('TOKEN:', user?.getToken())

  if (user && user.getToken() && !config.url?.startsWith('/public')) {
    config.headers.Authorization = 'Bearer ' + user.getToken()
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.log('401 FROM:', error.config.url)
    }

    const url = error?.config?.url || ''

    if (
      error?.response?.status === 401 &&
      !url.startsWith('/public') &&
      !url.startsWith('/auth')
    ) {
      logout()
      showToast('Сессия истекла, войдите снова', 'info')
    }

    throw error
  }
)

export default api
