import { getGoogleAuthRedirectUrl, logoutRequest } from '@/modules/user/api/auth.api'
import { unsubscribeFromCurrentUserUpdates } from '@/modules/user/composables/useUserRealtime'
import { clearClientSession, redirectToAuth } from '@/modules/user/services/session.service'

export const performLocalLogout = async (): Promise<void> => {
    unsubscribeFromCurrentUserUpdates()
    clearClientSession()
    await redirectToAuth()
}

export const logout = async (allDevices = false): Promise<void> => {
    try {
        await logoutRequest(allDevices)
    } catch {
    }

    await performLocalLogout()
}

export const redirectToGoogleAuth = (): void => {
    window.location.href = getGoogleAuthRedirectUrl()
}