import router from '@/router'
import { logoutRequest } from '@/modules/user/api/auth.api'
import { clearUserStorage } from '@/modules/user/model/userStorage'
import { clearUserState } from '@/modules/user/model/userState'
import { disconnectEcho } from '@/shared/realtime/echo'
import { unsubscribeFromCurrentUserUpdates } from '@/modules/user/composables/useUserRealtime'

export const performLocalLogout = async (): Promise<void> => {
    unsubscribeFromCurrentUserUpdates()
    disconnectEcho()
    clearUserStorage()
    clearUserState()

    if (router.currentRoute.value.name !== 'auth') {
        await router.replace({ name: 'auth' })
    }
}

export const logout = async (allDevices = false): Promise<void> => {
    try {
        await logoutRequest(allDevices)
    } catch (e) {
        console.log('LOGOUT ERROR:', e)
    }

    await performLocalLogout()
}