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
    const { loadPage } = usePaginationLoader(currentPage, load, setMeta)

    onMounted(async () => {
        await load(currentPage.value, setMeta)
    })

    const filteredUsers = computed(() => {
        const query = searchQuery.value.toLowerCase()
        const currentUserId = user.value?.getId() ?? null

        const filtered = users.value.filter(u =>
                `${u.getLastName()} ${u.getFirstName()} ${u.getMiddleName()}`.toLowerCase().includes(query)
        )

        return sortUsers(filtered, currentUserId, {
            pinCurrentUser: true,
            roleOrder: [Role.Admin, Role.Employee, Role.User]
        })
    })

    const openUser = (id: number) => {
        router.push({ name: 'edit-user', params: { id } })
    }

    const getInitials = (u: any) => {
        return (u.getLastName()[0] || '') + (u.getFirstName()[0] || '')
    }

    const isCurrentUser = (u: any) => {
        if (!user.value) {
            return false
        }
        return user.value.getId() === u.getId()
    }

    const getRoleClass = (u: any) => {
        if (u.getRoleName() === 'Администратор') {
            return 'admin'
        }
        if (u.getRoleName() === 'Сотрудник') {
            return 'employee'
        }
        return ''
    }

    return {
        searchQuery,
        filteredUsers,
        currentPage,
        lastPage,
        loadPage,
        openUser,
        getInitials,
        isCurrentUser,
        getRoleClass
    }
}