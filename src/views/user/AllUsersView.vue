<template>
    <div class="page">
        <div class="page-header">
            <h1 class="page-title">Пользователи</h1>
            <span style="font-size:.875rem;color:var(--c-text-3);">
                {{ filteredUsers.length }} чел.
            </span>
        </div>

        <div class="search-field">
            <span class="search-field-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
                </svg>
            </span>
            <input v-model="searchQuery" type="text" placeholder="Поиск по ФИО…"/>
        </div>

        <div v-if="filteredUsers.length === 0" class="empty-state">
            Пользователи не найдены
        </div>

        <div v-else style="display:flex;flex-direction:column;gap:10px;">
            <div
                    v-for="(userItem, index) in filteredUsers"
                    :key="userItem.getId()"
                    :class="[
                    'user-card',
                    'animate-in',
                    getRoleClass(userItem),
                    isCurrentUser(userItem) ? 'self' : ''
                ]"
                    :style="{ animationDelay: index * 0.05 + 's' }"
                    @click="openUser(userItem.getId())"
            >
                <div class="user-avatar">
                    {{ getInitials(userItem) }}
                </div>

                <div class="user-card-body">
                    <div class="user-card-name">
                        {{ userItem.getLastName() }} {{ userItem.getFirstName() }} {{ userItem.getMiddleName() }}
                    </div>
                    <div class="user-card-meta">
                        {{ userItem.getRoleName() }} · {{ userItem.getDepartmentName() }}
                    </div>
                </div>

                <div v-if="isCurrentUser(userItem)" class="user-self-badge">
                    Вы
                </div>
            </div>
        </div>

        <BasePagination
                :current-page="currentPage"
                :last-page="lastPage"
                @change="loadPage"
        />
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useUser } from '@/composables/user/useUser'
    import { getAllUsers } from '@/api/user.api'
    import { Role } from '@/enums/role'
    import { useUserSort } from '@/composables/user/useUserSort'
    import { useUsers } from '@/composables/user/useUsers'
    import { usePagination } from '@/composables/common/usePagination'
    import { usePaginationLoader } from '@/composables/common/usePaginationLoader'
    import BasePagination from '@/components/BasePagination.vue'

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

    const getInitials = (userItem: any): string => {
        return (userItem.getLastName()[0] || '') + (userItem.getFirstName()[0] || '')
    }

    const openUser = (userId: number): void => {
        router.push({ name: 'edit-user', params: { id: userId } })
    }

    const filteredUsers = computed(() => {
        const query = searchQuery.value.toLowerCase()
        const currentUserId = user.value?.getId() ?? null

        const filteredList = users.value.filter((userItem: any) => {
            return `${userItem.getLastName()} ${userItem.getFirstName()} ${userItem.getMiddleName()}`.toLowerCase().includes(query)
        })

        return sortUsers(filteredList, currentUserId, {
            pinCurrentUser: true,
            roleOrder: [Role.Admin, Role.Employee, Role.User]
        })
    })

    const getRoleClass = (userItem: any): string => {
        if (userItem.getRoleName() === 'Администратор') {
            return 'admin'
        }

        if (userItem.getRoleName() === 'Сотрудник') {
            return 'employee'
        }

        return ''
    }

    const isCurrentUser = (userItem: any): boolean => {
        if (!user.value) {
            return false
        }
        return user.value.getId() === userItem.getId()
    }
</script>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>