import { ref } from 'vue'
import { User } from '@/modules/user/model/user'

export const useUsers = (api: any) => {
    const users = ref<User[]>([])

    const load = async (page: number, setMeta: any) => {
        const responseJson = await api(page)

        users.value = responseJson.data.map((rawUserData: any) => {
            return User.fromApi(rawUserData)
        })

        setMeta(responseJson.meta)
    }

    return {
        users,
        load
    }
}