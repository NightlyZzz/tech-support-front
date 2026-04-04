import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/modules/user/composables/useUser'
import { useUserSort } from '@/shared/composables/useUserSort'
import { useUsers } from '@/modules/user/composables/useUsers'
import { usePagination } from '@/composables/common/usePagination'
import { usePaginationLoader } from '@/composables/common/usePaginationLoader'
import { getAllUsers } from '@/modules/user/api/user.api'
import { Role } from '@/enums/role'

export const useUsersPage = () => {
    const router = useRouter()

    const { user } = useUser()
    const { sortUsers } = useUserSort()

    const searchQuery = ref('')

    const { currentPage, lastPage, setMeta } = usePagination()
    const { users, load } = useUsers(getAllUsers)

    usePaginationLoader(currentPage, load, setMeta)

    onMounted(async () => {
        await load(currentPage.value, setMeta)
    })

    const filteredUsers = computed(() => {
        const normalizedQuery = searchQuery.value.toLowerCase().trim()
        const currentUserId = user.value?.getId() ?? null

        const matchedUsers = users.value.filter(userItem =>
                `${userItem.getLastName()} ${userItem.getFirstName()} ${userItem.getMiddleName()}`.toLowerCase().includes(normalizedQuery)
        )

        return sortUsers(matchedUsers, currentUserId, {
            pinCurrentUser: true,
            roleOrder: [Role.Admin, Role.Employee, Role.User]
        })
    })

    const openUser = (userId: number) => {
        router.push({ name: 'edit-user', params: { id: userId } })
    }

    const getInitials = (userItem: any) => {
        return `${userItem.getLastName()[0] || ''}${userItem.getFirstName()[0] || ''}`
    }

    const isCurrentUser = (userItem: any) => {
        return user.value?.getId() === userItem.getId()
    }

    const getRoleClass = (userItem: any) => {
        if (userItem.getRoleName() === 'Администратор') {
            return 'admin'
        }

        if (userItem.getRoleName() === 'Сотрудник') {
            return 'employee'
        }

        return ''
    }

    return {
        searchQuery,
        filteredUsers,
        currentPage,
        lastPage,
        openUser,
        getInitials,
        isCurrentUser,
        getRoleClass
    }
}