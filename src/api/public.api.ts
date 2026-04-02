import axios from 'axios'
import { BACKEND_URL } from '@/utils/constants'

export const publicApi = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})