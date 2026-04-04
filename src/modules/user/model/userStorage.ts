export const getUserToken = (): string | null => {
    return localStorage.getItem('token')
}

export const setUserToken = (token: string): void => {
    localStorage.setItem('token', token)
}

export const setUserData = (data: any): void => {
    localStorage.setItem('user_data', JSON.stringify(data))
}