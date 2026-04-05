import { getUserToken, setUserData, clearUserStorage } from '@/modules/user/model/userStorage'
import { clearUserState } from '@/modules/user/model/userState'
import { apiClient } from '@/shared/api/client'
import { useUser } from '@/modules/user/composables/useUser'
import {
    subscribeToCurrentUserUpdates,
    unsubscribeFromCurrentUserUpdates
} from '@/modules/user/composables/useUserRealtime'

export const initUser = async (): Promise<void> => {
    const token = getUserToken()

    if (!token) {
        unsubscribeFromCurrentUserUpdates()
        clearUserState()
        return
    }

    try {
        const response = await apiClient.get('/user')
        const data = response.data.data

        setUserData(data)

        const { setUser } = useUser()
        setUser({
            ...data,
            token
        })

        subscribeToCurrentUserUpdates()
    } catch {
        unsubscribeFromCurrentUserUpdates()
        clearUserStorage()
        clearUserState()
    }
}