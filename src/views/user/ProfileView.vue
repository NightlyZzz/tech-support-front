<script setup lang="ts">
    import ProfileActionsCard from '@/components/profile/ProfileActionsCard.vue'
    import ProfileDepartmentCard from '@/components/profile/ProfileDepartmentCard.vue'
    import ProfileEmailCard from '@/components/profile/ProfileEmailCard.vue'
    import ProfileLogoutModal from '@/components/profile/ProfileLogoutModal.vue'
    import ProfilePasswordCard from '@/components/profile/ProfilePasswordCard.vue'
    import ProfilePersonalCard from '@/components/profile/ProfilePersonalCard.vue'
    import { useProfilePage } from '@/modules/user/composables/useProfilePage'

    const {
        user,
        form,
        departments,
        showPassword,
        loading,
        logoutModalOpen,
        logoutLoading,
        openLogoutModal,
        closeLogoutModal,
        handleLogout,
        saveChanges,
        confirmDelete
    } = useProfilePage()
</script>

<template>
    <div v-if="!user" class="page">
        Загрузка...
    </div>

    <div v-else class="page">
        <div class="page-header">
            <h1 class="page-title">Профиль</h1>
        </div>

        <div class="profile-grid">
            <div class="profile-column">
                <ProfilePersonalCard :form="form"/>
                <ProfileEmailCard :form="form"/>
            </div>

            <div class="profile-column">
                <ProfilePasswordCard
                        :form="form"
                        :show-password="showPassword"
                        @update:show-password="showPassword = $event"
                />

                <ProfileDepartmentCard
                        :department-id="form.department_id"
                        :departments="departments"
                        @update:department-id="form.department_id = $event"
                />

                <ProfileActionsCard
                        :loading="loading"
                        @save="saveChanges"
                        @logout="openLogoutModal"
                        @delete="confirmDelete"
                />
            </div>
        </div>

        <ProfileLogoutModal
                :open="logoutModalOpen"
                :loading="logoutLoading"
                @close="closeLogoutModal"
                @logout-current="handleLogout(false)"
                @logout-all="handleLogout(true)"
        />
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>