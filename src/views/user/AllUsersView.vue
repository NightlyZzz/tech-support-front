<script setup lang="ts">
    import { useUsersPage } from '@/modules/user/composables/useUsersPage'
    import BasePagination from '@/components/base/BasePagination.vue'

    const {
        searchQuery,
        visibleUsers,
        totalUsers,
        currentPage,
        lastPage,
        openUser,
        getInitials,
        isCurrentUser,
        getRoleClass
    } = useUsersPage()
</script>

<template>
    <div class="page">
        <div class="page-header">
            <h1 class="page-title">Пользователи</h1>
            <span style="font-size:.875rem;color:var(--c-text-3);">
                {{ totalUsers }} чел.
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

        <div v-if="visibleUsers.length === 0" class="empty-state">
            Пользователи не найдены
        </div>

        <div v-else style="display:flex;flex-direction:column;gap:10px;">
            <div
                    v-for="(userItem, index) in visibleUsers"
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
                        {{ userItem.getFullName() }}
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
                v-if="lastPage > 1"
                v-model="currentPage"
                :last-page="lastPage"
        />
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>