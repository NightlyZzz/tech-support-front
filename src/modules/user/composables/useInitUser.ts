import { getCurrentUser } from '@/modules/user/api/auth.api'
import { useUser } from '@/modules/user/composables/useUser'
import { getUserToken, setUserData } from '@/modules/user/model/userStorage'
import {
    subscribeToCurrentUserUpdates,
    unsubscribeFromCurrentUserUpdates
} from '@/modules/user/composables/useUserRealtime'
import { clearClientSession } from '@/modules/user/services/session.service'
import type { UserData } from '@/modules/user/types/user'

export const initUser = async (): Promise<void> => {
    const token = getUserToken()

    if (!token) {
        unsubscribeFromCurrentUserUpdates()
        clearClientSession()
        return
    }

    try {
        const response = await getCurrentUser()
        const normalizedUser: UserData = {
            ...response.data,
            token
        }

        setUserData(normalizedUser)

        const { setUser } = useUser()
        setUser(normalizedUser)

        subscribeToCurrentUserUpdates()
    } catch {
        unsubscribeFromCurrentUserUpdates()
        clearClientSession()
    }
}