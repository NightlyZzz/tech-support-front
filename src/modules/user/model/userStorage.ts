export const getUserToken = (): string | null => {
    return localStorage.getItem('token')
}

export const setUserToken = (token: string): void => {
    localStorage.setItem('token', token)
}

export const removeUserToken = (): void => {
    localStorage.removeItem('token')
}

export const getUserData = (): any | null => {
    const raw = localStorage.getItem('user_data')

    if (!raw) {
        return null
    }

    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}

export const setUserData = (data: any): void => {
    localStorage.setItem('user_data', JSON.stringify(data))
}

export const removeUserData = (): void => {
    localStorage.removeItem('user_data')
}

export const clearUserStorage = (): void => {
    removeUserToken()
    removeUserData()
}