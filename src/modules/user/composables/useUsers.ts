import { ref } from 'vue'
import { User } from '@/modules/user/model/user'
import type { PaginationMeta } from '@/types/common'

type LoadUsersApi = (page: number, searchQuery: string) => Promise<any>

type SetMeta = (meta: PaginationMeta) => void

export const useUsers = (api: LoadUsersApi) => {
    const users = ref<User[]>([])

    const load = async (
            page: number,
            setMeta: SetMeta,
            searchQuery = ''
    ): Promise<void> => {
        const responseJson = await api(page, searchQuery)

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