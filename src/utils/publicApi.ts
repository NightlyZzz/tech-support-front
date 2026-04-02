import axios from 'axios'
import { BACKEND_URL } from '@/utils/constants'

const publicApi = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default publicApi
