import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/modules/user/composables/useUser'
import { useUserSort } from '@/shared/composables/useUserSort'
import { useUsers } from '@/modules/user/composables/useUsers'
import { usePagination } from '@/composables/common/usePagination'
import { usePaginationLoader } from '@/composables/common/usePaginationLoader'
import { getAllUsers } from '@/modules/user/api/user.api'
import { Role } from '@/enums/role'
import { getEcho } from '@/shared/realtime/echo'

export const useUsersPage = () => {
    const router = useRouter()

    const { user, isAdmin } = useUser()
    const { sortUsers } = useUserSort()

    const searchQuery = ref('')
    const appliedSearchQuery = ref('')
    let searchTimeoutId: ReturnType<typeof setTimeout> | null = null

    const { currentPage, lastPage, totalItems, setMeta } = usePagination()
    const { users, load } = useUsers(getAllUsers)

    const loadUsersPage = async (page: number) => {
        await load(page, setMeta, appliedSearchQuery.value)
    }

    usePaginationLoader(
            currentPage,
            async (page, nextSetMeta) => {
                await load(page, nextSetMeta, appliedSearchQuery.value)
            },
            setMeta
    )

    const reloadUsers = async () => {
        await loadUsersPage(currentPage.value)
    }

    const applySearch = async (nextSearchQuery: string) => {
        const normalizedSearchQuery = nextSearchQuery.trim()

        if (appliedSearchQuery.value === normalizedSearchQuery) {
            return
        }

        appliedSearchQuery.value = normalizedSearchQuery

        if (currentPage.value !== 1) {
            currentPage.value = 1
            return
        }

        await reloadUsers()
    }

    const subscribeToUsers = () => {
        const echo = getEcho()

        if (!echo || !isAdmin.value) {
            return
        }

        echo.private('users.all').listen('.user.updated', async () => {
            await reloadUsers()
        }).listen('.user.deleted', async () => {
            await reloadUsers()
        })
    }

    const unsubscribeFromUsers = () => {
        const echo = getEcho()

        if (!echo || !isAdmin.value) {
            return
        }

        echo.leave('users.all')
    }

    onMounted(async () => {
        await reloadUsers()
        subscribeToUsers()
    })

    onUnmounted(() => {
        unsubscribeFromUsers()

        if (searchTimeoutId !== null) {
            clearTimeout(searchTimeoutId)
        }
    })

    watch(searchQuery, (nextSearchQuery) => {
        if (searchTimeoutId !== null) {
            clearTimeout(searchTimeoutId)
        }

        searchTimeoutId = setTimeout(async () => {
            await applySearch(nextSearchQuery)
        }, 300)
    })

    const visibleUsers = computed(() => {
        return sortUsers(users.value, {
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
        visibleUsers,
        totalUsers: totalItems,
        currentPage,
        lastPage,
        openUser,
        getInitials,
        isCurrentUser,
        getRoleClass
    }
}