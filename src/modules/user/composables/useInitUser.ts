import { getCurrentUser } from '@/modules/user/api/auth.api'
import { useUser } from '@/modules/user/composables/useUser'
import {
    subscribeToCurrentUserUpdates,
    unsubscribeFromCurrentUserUpdates
} from '@/modules/user/composables/useUserRealtime'
import { clearUserStorage, setUserData } from '@/modules/user/model/userStorage'
import { clearUserState } from '@/modules/user/model/userState'
import type { UserData } from '@/modules/user/types/user'

export const initUser = async (shouldThrowOnFailure = false): Promise<void> => {
    try {
        const response = await getCurrentUser()
        const normalizedUser: UserData = {
            ...response.data
        }

        setUserData(normalizedUser)

        const { setUser } = useUser()
        setUser(normalizedUser)

        subscribeToCurrentUserUpdates()
    } catch (error) {
        unsubscribeFromCurrentUserUpdates()
        clearUserStorage()
        clearUserState()

        if (shouldThrowOnFailure) {
            throw error
        }
    }
}