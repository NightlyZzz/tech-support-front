import { user } from '@/modules/user/model/userState'
import { getUserToken } from '@/modules/user/model/userStorage'
import { apiClient } from "@/shared/api/client.ts";
import { User } from "@/modules/user/model/user.ts";

export const initUser = async (): Promise<void> => {
    const token = getUserToken()

    if (!token) {
        user.value = null
        return
    }

    try {
        const response = await apiClient.get('/user')
        const data = response.data.data

        localStorage.setItem('user_data', JSON.stringify(data))

        user.value = new User(
                token,
                data.id,
                data.email,
                data.first_name,
                data.last_name,
                data.middle_name,
                data.role_id,
                data.role_name,
                data.department_id,
                data.department_name,
                data.secondary_email
        )
    } catch {
        user.value = null
    }
}