import { ref } from 'vue'
import { User } from '@/user/user'

export const useUsers = (api: any) => {
    const users = ref<User[]>([])

    const load = async (page: number, setMeta: any) => {
        const json = await api(page)

        users.value = json.data.map((rawUser: any) => {
            return new User(
                    '',
                    rawUser.id,
                    rawUser.email,
                    rawUser.first_name,
                    rawUser.last_name,
                    rawUser.middle_name,
                    rawUser.role_id,
                    rawUser.role_name,
                    rawUser.department_id,
                    rawUser.department_name,
                    rawUser.secondary_email
            )
        })

        setMeta(json.meta)
    }

    return {
        users,
        load
    }
}