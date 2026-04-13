const getEnvValue = (key: 'VITE_BACKEND_URL' | 'VITE_COMPANY_NAME'): string => {
    const value = import.meta.env[key]

    if (!value || typeof value !== 'string') {
        throw new Error(`Missing environment variable: ${key}`)
    }

    return value
}

export const APP_URL: string = getEnvValue('VITE_BACKEND_URL').replace(/\/+$/, '')
export const BACKEND_APP_URL: string = APP_URL
export const BACKEND_URL: string = BACKEND_APP_URL + '/api'
export const COMPANY_NAME: string = getEnvValue('VITE_COMPANY_NAME')