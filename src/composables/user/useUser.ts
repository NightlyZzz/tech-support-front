import { computed } from 'vue'
import { getUser } from '@/user/data'
import { Role } from '@/enums/role'

export const useUser = () => {
    const user = getUser()

    const isUser = computed(() => user.value?.getRole() === Role.User)
    const isEmployee = computed(() => (user.value?.getRole() ?? 0) >= Role.Employee)
    const isAdmin = computed(() => user.value?.getRole() === Role.Admin)

    const userId = computed(() => user.value?.getId() ?? null)

    return {
        user,
        userId,
        isUser,
        isEmployee,
        isAdmin
    }
}