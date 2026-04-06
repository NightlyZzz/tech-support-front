import axios from 'axios'
import { BACKEND_URL } from '@/shared/utils/constants'

export const publicApi = axios.create({
    baseURL: BACKEND_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})