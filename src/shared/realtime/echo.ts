import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { BACKEND_URL } from '@/shared/utils/constants'

declare global {
    interface Window {
        Pusher: typeof Pusher
        Echo: Echo<'reverb'> | null
    }
}

window.Pusher = Pusher

let echoInstance: Echo<'reverb'> | null = null

const buildEcho = (): Echo<'reverb'> => {
    return new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 80),
        wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: BACKEND_URL + '/broadcasting/auth',
        auth: {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
    })
}

export const createEcho = (): Echo<'reverb'> | null => {
    if (echoInstance) {
        return echoInstance
    }

    echoInstance = buildEcho()
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