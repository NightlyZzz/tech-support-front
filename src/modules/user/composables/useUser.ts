import { computed } from 'vue'
import { getUser, setUserState } from '@/modules/user/model/userState'
import { Role } from '@/enums/role'
import { User } from '@/modules/user/model/user'
import type { UserData } from '@/modules/user/types/user'

export const useUser = () => {
    const user = getUser()

    const setUser = (userData: UserData | User | null) => {
        if (userData === null) {
            setUserState(null)
            return
        }

        if (userData instanceof User) {
            setUserState(userData)
            return
        }

        const fallbackToken = user.value?.getToken() ?? ''
        setUserState(User.fromApi(userData, fallbackToken))
    }

    const userId = computed<number | null>(() => user.value?.getId() ?? null)
    const roleId = computed<number | null>(() => user.value?.getRole() ?? null)
    const isUser = computed<boolean>(() => roleId.value === Role.User)
    const isEmployee = computed<boolean>(() => (roleId.value ?? 0) >= Role.Employee)
    const isAdmin = computed<boolean>(() => roleId.value === Role.Admin)

    return {
        user,
        userId,
        roleId,
        isUser,
        isEmployee,
        isAdmin,
        setUser
    }
}