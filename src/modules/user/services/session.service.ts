import router from '@/router'
import { initUser } from '@/modules/user/composables/useInitUser'
import { unsubscribeFromCurrentUserUpdates } from '@/modules/user/composables/useUserRealtime'
import { clearUserState } from '@/modules/user/model/userState'
import { clearUserStorage } from '@/modules/user/model/userStorage'
import { disconnectEcho } from '@/shared/realtime/echo'

export const initializeAuthorizedSession = async (): Promise<void> => {
    clearClientSession()

    try {
        await initUser(true)
    } catch {
        clearClientSession()
        throw new Error('Failed to initialize authorized session')
    }
}

export const clearClientSession = (): void => {
    unsubscribeFromCurrentUserUpdates()
    disconnectEcho()
    clearUserStorage()
    clearUserState()
}

export const redirectToAuth = async (): Promise<void> => {
    if (router.currentRoute.value.name !== 'auth') {
        await router.replace({ name: 'auth' })
    }
}