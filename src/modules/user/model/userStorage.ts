import type { UserData } from '@/modules/user/types/user'

const TOKEN_STORAGE_KEY = 'token'
const USER_DATA_STORAGE_KEY = 'user_data'

export const getUserToken = (): string | null => {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export const setUserToken = (token: string): void => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export const removeUserToken = (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export const getUserData = (): UserData | null => {
    const rawValue = localStorage.getItem(USER_DATA_STORAGE_KEY)

    if (!rawValue) {
        return null
    }

    try {
        return JSON.parse(rawValue) as UserData
    } catch {
        removeUserData()
        return null
    }
}

export const setUserData = (data: UserData): void => {
    localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(data))
}

export const removeUserData = (): void => {
    localStorage.removeItem(USER_DATA_STORAGE_KEY)
}

export const clearUserStorage = (): void => {
    removeUserToken()
    removeUserData()
}