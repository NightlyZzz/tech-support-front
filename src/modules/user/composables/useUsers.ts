import { shallowRef } from 'vue'
import { User } from '@/modules/user/model/user'
import type { PaginationMeta } from '@/types/common'
import type { UsersListResponse } from '@/modules/user/types/user'

type LoadUsersApi = (page: number, searchQuery: string) => Promise<UsersListResponse>
type SetPaginationMeta = (meta: PaginationMeta) => void

export const useUsers = (loadUsersApi: LoadUsersApi) => {
    const users = shallowRef<User[]>([])

    const load = async (
            page: number,
            setPaginationMeta: SetPaginationMeta,
            searchQuery = ''
    ): Promise<void> => {
        const responseData = await loadUsersApi(page, searchQuery)

        users.value = responseData.data.map((userData) => User.fromApi(userData))
        setPaginationMeta(responseData.meta)
    }

    return {
        users,
        load
    }
}