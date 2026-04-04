import router from '@/router'
import { logoutRequest } from '@/modules/user/api/auth.api'
import { user } from '@/modules/user/model/userState'

export const logout = async (): Promise<void> => {
    try {
        await logoutRequest()
    } catch (e) {
        console.log('LOGOUT ERROR:', e)
    }

    localStorage.removeItem('token')
    localStorage.removeItem('user_data')
    user.value = null

    await router.push({ name: 'home' })
}