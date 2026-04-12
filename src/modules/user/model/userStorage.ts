import type { UserData } from '@/modules/user/types/user'

const USER_DATA_STORAGE_KEY = 'user_data'

export const hasStoredUserData = (): boolean => {
    return getUserData() !== null
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
    removeUserData()
}