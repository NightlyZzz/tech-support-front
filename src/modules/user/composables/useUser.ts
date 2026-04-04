import { computed } from 'vue'
import { user } from '@/modules/user/model/userState'
import { Role } from '@/enums/role'
import { User } from '@/modules/user/model/user'

export const useUser = () => {
    const setUser = (data: any) => {
        if (!data) {
            user.value = null
            return
        }

        user.value = new User(
                data.token ?? user.value?.getToken() ?? '',
                data.id,
                data.email,
                data.first_name,
                data.last_name,
                data.middle_name,
                data.role,
                data.role_name,
                data.department_id ?? data.department ?? 0,
                data.department_name ?? '',
                data.secondary_email ?? null
        )
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