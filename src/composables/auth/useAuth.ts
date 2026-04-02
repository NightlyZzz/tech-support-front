import { computed } from 'vue'
import { getUser } from '@/user/data'
import { Role } from '@/enums/role'

export const useAuth = () => {
    const user = computed(() => getUser() ?? null)

    const isUser = computed(() => {
        if (!user.value) {
            return false
        }

        return user.value.getRole() === Role.User
    })

    const isEmployee = computed(() => {
        if (!user.value) {
            return false
        }

        return user.value.getRole() >= Role.Employee
    })

    const isAdmin = computed(() => {
        if (!user.value) {
            return false
        }

        return user.value.getRole() === Role.Admin
    })

    return {
        user,
        isUser,
        isEmployee,
        isAdmin
    }
}
