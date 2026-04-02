import { ref } from 'vue'
import { User } from '@/user/user'
import router from '@/router'

const user = ref<User | null>(null)

const getUserData = (): any => {
    try {
        const data = localStorage.getItem('user_data')
        return data ? JSON.parse(data) : null
    } catch {
        return null
    }
}

export const initUser = (): void => {
    const token = getUserToken()
    const data = getUserData()

    if (!token || !data) {
        user.value = null
        return
    }

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
}

export const setUserToken = (token: string): void => {
    localStorage.setItem('token', token)
}

export const setUserData = (data: any): void => {
    localStorage.setItem('user_data', JSON.stringify(data))
    initUser()
}

export const getUser = () => user

export const isAuthenticated = (): boolean => {
    return !!user.value
}

export const logout = (): void => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_data')
    user.value = null
    router.push({ name: 'home' })
}

export const getUserToken = (): string | null => {
    return localStorage.getItem('token')
}