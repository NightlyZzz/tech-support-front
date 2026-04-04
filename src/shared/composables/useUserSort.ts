import type { User } from '@/modules/user/model/user'

type SortOptions = {
    pinCurrentUser?: boolean
    roleOrder?: number[]
}

export const useUserSort = () => {
    const sortUsers = (
            users: User[],
            currentUserId: number | null,
            options: SortOptions = {}
    ): User[] => {
        const rolePriorityMap: Record<number, number> = {}

        if (options.roleOrder) {
            options.roleOrder.forEach((roleId, index) => {
                rolePriorityMap[roleId] = index + 1
            })
        }

        return [...users].sort((firstUser, secondUser) => {
            if (options.pinCurrentUser && currentUserId) {
                if (firstUser.getId() === currentUserId) {
                    return -1
                }

                if (secondUser.getId() === currentUserId) {
                    return 1
                }
            }

            if (options.roleOrder) {
                const firstUserRolePriority = rolePriorityMap[firstUser.getRole()] ?? 999
                const secondUserRolePriority = rolePriorityMap[secondUser.getRole()] ?? 999

                if (firstUserRolePriority !== secondUserRolePriority) {
                    return firstUserRolePriority - secondUserRolePriority
                }
            }

            return 0
        })
    }

    return {
        sortUsers
    }
}