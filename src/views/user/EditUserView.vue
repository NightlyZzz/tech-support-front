<script setup lang="ts">
    import EditUserActionsCard from '@/components/user-edit/EditUserActionsCard.vue'
    import EditUserDepartmentCard from '@/components/user-edit/EditUserDepartmentCard.vue'
    import EditUserEmailCard from '@/components/user-edit/EditUserEmailCard.vue'
    import EditUserPersonalCard from '@/components/user-edit/EditUserPersonalCard.vue'
    import EditUserRoleCard from '@/components/user-edit/EditUserRoleCard.vue'
    import { useEditUserPage } from '@/modules/user/composables/useEditUserPage'

    const {
        form,
        departments,
        roles,
        saveChanges,
        confirmDelete
    } = useEditUserPage()

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

    const updateDepartmentId = (value: number | null) => {
        form.department_id = value
    }

    const updateRoleId = (value: number | null) => {
        form.role_id = value
    }
</script>

<template>
    <div class="page">
        <div class="page-header">
            <h1 class="page-title">Редактирование пользователя</h1>
        </div>

        <div class="profile-grid">
            <div class="profile-column">
                <EditUserPersonalCard
                        :last-name="form.last_name"
                        :first-name="form.first_name"
                        :middle-name="form.middle_name"
                        @update:last-name="updateLastName"
                        @update:first-name="updateFirstName"
                        @update:middle-name="updateMiddleName"
                />

                <EditUserEmailCard
                        :email="form.email"
                        :secondary-email="form.secondary_email"
                        @update:email="updateEmail"
                        @update:secondary-email="updateSecondaryEmail"
                />
            </div>

            <div class="profile-column">
                <EditUserDepartmentCard
                        :department-id="form.department_id"
                        :departments="departments"
                        @update:department-id="updateDepartmentId"
                />

                <EditUserRoleCard
                        :role-id="form.role_id"
                        :roles="roles"
                        @update:role-id="updateRoleId"
                />

                <EditUserActionsCard
                        @save="saveChanges"
                        @delete="confirmDelete"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>