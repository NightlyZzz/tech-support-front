import { ref } from 'vue'
import { User } from '@/user/user'
import router from '@/router'
import { logoutRequest } from '@/api/auth.api'
import { apiClient } from '@/api/client'

const user = ref<User | null>(null)

export const initUser = async (): Promise<void> => {
    const token = getUserToken()

    if (!token) {
        user.value = null
        return
    }

    try {
        const response = await apiClient.get('/user')
        const data = response.data.data

        localStorage.setItem('user_data', JSON.stringify(data))

        user.value = new User(
                token,
                data.id,
                data.email,
                data.first_name,
                data.last_name,
                data.middle_name,
                data.role_id,
                data.role_name,
                data.department_id,
                data.department_name,
                data.secondary_email
        )
    } catch {
        user.value = null
    }
}

export const setUserToken = (token: string): void => {
    localStorage.setItem('token', token)
}

export const setUserData = (data: any): void => {
    localStorage.setItem('user_data', JSON.stringify(data))
}

export const getUser = () => user

export const isAuthenticated = (): boolean => {
    return !!user.value
}

export const logout = async (): Promise<void> => {
    try {
        await logoutRequest()
    } catch (e) {
        console.log('LOGOUT ERROR:', e)
    }

    localStorage.removeItem('token')
    localStorage.removeItem('user_data')
    user.value = null

    await router.push({ name: 'home' })
}

export const getUserToken = (): string | null => {
    return localStorage.getItem('token')
}