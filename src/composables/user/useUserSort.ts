import type { User } from '@/user/user'

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
        const rolePriority: Record<number, number> = {}

        if (options.roleOrder) {
            options.roleOrder.forEach((role, index) => {
                rolePriority[role] = index + 1
            })
        }

        return [...users].sort((userA, userB) => {
            if (options.pinCurrentUser && currentUserId) {
                if (userA.getId() === currentUserId) {
                    return -1
                }
                if (userB.getId() === currentUserId) {
                    return 1
                }
            }

            if (options.roleOrder) {
                const roleA = rolePriority[userA.getRole()] ?? 999
                const roleB = rolePriority[userB.getRole()] ?? 999

                if (roleA !== roleB) {
                    return roleA - roleB
                }
            }

            return 0
        })
    }

    return {
        sortUsers
    }
}
