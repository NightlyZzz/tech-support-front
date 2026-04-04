import axios from 'axios'
import { BACKEND_URL } from '@/shared/utils/constants'

export const publicApi = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})