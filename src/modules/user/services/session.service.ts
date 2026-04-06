import router from '@/router'
import { initUser } from '@/modules/user/composables/useInitUser'
import { clearUserState } from '@/modules/user/model/userState'
import { clearUserStorage, setUserToken } from '@/modules/user/model/userStorage'
import { createEcho, disconnectEcho } from '@/shared/realtime/echo'

export const initializeAuthorizedSession = async (token: string): Promise<void> => {
    setUserToken(token)

    disconnectEcho()
    createEcho()

    await initUser()
}

export const clearClientSession = (): void => {
    disconnectEcho()
    clearUserStorage()
    clearUserState()
}

export const redirectToAuth = async (): Promise<void> => {
    if (router.currentRoute.value.name !== 'auth') {
        await router.replace({ name: 'auth' })
    }
}