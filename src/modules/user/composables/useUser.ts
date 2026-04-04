import { computed } from 'vue'
import { getUser, setUserState } from '@/modules/user/model/userState'
import { Role } from '@/enums/role'
import { User } from '@/modules/user/model/user'

export const useUser = () => {
    const user = getUser()

    const setUser = (userData: any) => {
        if (!userData) {
            setUserState(null)
            return
        }

        const fallbackToken = user.value?.getToken() ?? ''
        setUserState(User.fromApi(userData, fallbackToken))
    }

    const isUser = computed(() => user.value?.getRole() === Role.User)
    const isEmployee = computed(() => (user.value?.getRole() ?? 0) >= Role.Employee)
    const isAdmin = computed(() => user.value?.getRole() === Role.Admin)
    const userId = computed(() => user.value?.getId() ?? null)

    return {
        user,
        userId,
        isUser,
        isEmployee,
        isAdmin,
        setUser
    }
}