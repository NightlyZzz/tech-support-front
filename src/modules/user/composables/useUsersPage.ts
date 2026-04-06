import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/modules/user/composables/useUser'
import { useUserSort } from '@/shared/composables/useUserSort'
import { useUsers } from '@/modules/user/composables/useUsers'
import { usePagination } from '@/composables/common/usePagination'
import { usePaginationLoader } from '@/composables/common/usePaginationLoader'
import { getAllUsers } from '@/modules/user/api/user.api'
import { Role } from '@/enums/role'
import { getEcho } from '@/shared/realtime/echo'
import type { User } from '@/modules/user/model/user'

const SEARCH_DEBOUNCE_DELAY = 300
const ROLE_SORT_ORDER = [Role.Admin, Role.Employee, Role.User]

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

    const openUser = (userId: number) => {
        void router.push({ name: 'edit-user', params: { id: userId } })
    }

    const getInitials = (userItem: User): string => {
        return userItem.getInitials()
    }

    const isCurrentUser = (userItem: User): boolean => {
        return user.value?.getId() === userItem.getId()
    }

    const getRoleClass = (userItem: User): string => {
        if (userItem.getRole() === Role.Admin) {
            return 'admin'
        }

        if (userItem.getRole() === Role.Employee) {
            return 'employee'
        }

        return ''
    }

    usePaginationLoader(
            currentPage,
            async (page, nextSetMeta) => {
                await load(page, nextSetMeta, appliedSearchQuery.value)
            },
            setMeta
    )

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
        }, SEARCH_DEBOUNCE_DELAY)
    })

    const visibleUsers = computed(() => {
        return sortUsers(users.value, {
            roleOrder: ROLE_SORT_ORDER
        })
    })

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