import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { getUserToken } from '@/modules/user/model/userStorage'
import { APP_URL } from '@/shared/utils/constants'

declare global {
    interface Window {
        Pusher: typeof Pusher
        Echo: Echo<'reverb'> | null
    }
}

window.Pusher = Pusher

let echoInstance: Echo<'reverb'> | null = null

const buildEcho = (token: string): Echo<'reverb'> => {
    return new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 80),
        wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: APP_URL + '/broadcasting/auth',
        auth: {
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/json'
            }
        }
    })
}

export const createEcho = (): Echo<'reverb'> | null => {
    const token = getUserToken()

    if (!token) {
        disconnectEcho()
        return null
    }

    if (echoInstance) {
        return echoInstance
    }

    echoInstance = buildEcho(token)
    window.Echo = echoInstance

    return echoInstance
}

export const getEcho = (): Echo<'reverb'> | null => {
    return echoInstance
}

export const disconnectEcho = (): void => {
    if (echoInstance) {
        echoInstance.disconnect()
    }

    echoInstance = null
    window.Echo = null
}