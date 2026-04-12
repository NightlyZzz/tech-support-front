import axios from 'axios'
import { APP_URL, BACKEND_URL } from '@/shared/utils/constants'

export const publicApi = axios.create({
    baseURL: BACKEND_URL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

export const webApi = axios.create({
    baseURL: APP_URL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
})