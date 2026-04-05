import type { User } from '@/modules/user/model/user'

type SortOptions = {
    roleOrder?: number[]
}

export const useUserSort = () => {
    const sortUsers = (
            users: User[],
            options: SortOptions = {}
    ): User[] => {
        const rolePriorityMap: Record<number, number> = {}

        if (options.roleOrder) {
            options.roleOrder.forEach((roleId, index) => {
                rolePriorityMap[roleId] = index
            })
        }

        return [...users].sort((firstUser, secondUser) => {
            if (options.roleOrder) {
                const firstUserRolePriority = rolePriorityMap[firstUser.getRole()] ?? Number.MAX_SAFE_INTEGER
                const secondUserRolePriority = rolePriorityMap[secondUser.getRole()] ?? Number.MAX_SAFE_INTEGER

                if (firstUserRolePriority !== secondUserRolePriority) {
                    return firstUserRolePriority - secondUserRolePriority
                }
            }

            const lastNameComparison = firstUser.getLastName().localeCompare(secondUser.getLastName(), 'ru', {
                sensitivity: 'base'
            })

            if (lastNameComparison !== 0) {
                return lastNameComparison
            }

            const firstNameComparison = firstUser.getFirstName().localeCompare(secondUser.getFirstName(), 'ru', {
                sensitivity: 'base'
            })

            if (firstNameComparison !== 0) {
                return firstNameComparison
            }

            const middleNameComparison = firstUser.getMiddleName().localeCompare(secondUser.getMiddleName(), 'ru', {
                sensitivity: 'base'
            })

            if (middleNameComparison !== 0) {
                return middleNameComparison
            }

            return firstUser.getId() - secondUser.getId()
        })
    }

    return {
        sortUsers
    }
}