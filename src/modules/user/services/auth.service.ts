import router from '@/router'
import { logoutRequest } from '@/modules/user/api/auth.api'
import { clearUserStorage } from '@/modules/user/model/userStorage'
import { clearUserState } from '@/modules/user/model/userState'

export const logout = async (): Promise<void> => {
    try {
        await logoutRequest()
    } catch (e) {
        console.log('LOGOUT ERROR:', e)
    }

    clearUserStorage()
    clearUserState()

    await router.push({ name: 'home' })
}