<script setup lang="ts">
    import EditUserActionsCard from '@/components/user-edit/EditUserActionsCard.vue'
    import EditUserDepartmentCard from '@/components/user-edit/EditUserDepartmentCard.vue'
    import EditUserEmailCard from '@/components/user-edit/EditUserEmailCard.vue'
    import EditUserPersonalCard from '@/components/user-edit/EditUserPersonalCard.vue'
    import EditUserRoleCard from '@/components/user-edit/EditUserRoleCard.vue'
    import { useEditUserPage } from '@/modules/user/composables/useEditUserPage'
    import type { EditUserForm } from '@/modules/user/types/edit-user'

    const {
        form,
        departments,
        roles,
        saveChanges,
        confirmDelete
    } = useEditUserPage()

    const updateTextField = (
            fieldName: keyof Pick<
                    EditUserForm,
                    'last_name' | 'first_name' | 'middle_name' | 'email' | 'secondary_email'
            >,
            value: string
    ) => {
        form[fieldName] = value
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
                        @update:last-name="updateTextField('last_name', $event)"
                        @update:first-name="updateTextField('first_name', $event)"
                        @update:middle-name="updateTextField('middle_name', $event)"
                />

                <EditUserEmailCard
                        :email="form.email"
                        :secondary-email="form.secondary_email"
                        @update:email="updateTextField('email', $event)"
                        @update:secondary-email="updateTextField('secondary_email', $event)"
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
    @import '@/assets/profile.css';
</style>