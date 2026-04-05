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

    const updateLastName = (value: string) => {
        form.last_name = value
    }

    const updateFirstName = (value: string) => {
        form.first_name = value
    }

    const updateMiddleName = (value: string) => {
        form.middle_name = value
    }

    const updateEmail = (value: string) => {
        form.email = value
    }

    const updateSecondaryEmail = (value: string) => {
        form.secondary_email = value
    }

    const updateNewPassword = (value: string) => {
        form.new_password = value
    }

    const updateDepartmentId = (value: number | null) => {
        if (value === null) {
            return
        }

        form.department_id = value
    }
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
                <ProfilePersonalCard
                        :last-name="form.last_name"
                        :first-name="form.first_name"
                        :middle-name="form.middle_name"
                        @update:last-name="updateLastName"
                        @update:first-name="updateFirstName"
                        @update:middle-name="updateMiddleName"
                />

                <ProfileEmailCard
                        :email="form.email"
                        :secondary-email="form.secondary_email"
                        @update:email="updateEmail"
                        @update:secondary-email="updateSecondaryEmail"
                />
            </div>

            <div class="profile-column">
                <ProfilePasswordCard
                        :new-password="form.new_password"
                        :show-password="showPassword"
                        @update:new-password="updateNewPassword"
                        @update:show-password="showPassword = $event"
                />

                <ProfileDepartmentCard
                        :department-id="form.department_id"
                        :departments="departments"
                        @update:department-id="updateDepartmentId"
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