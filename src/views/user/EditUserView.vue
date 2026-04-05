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
                <EditUserPersonalCard :form="form"/>
                <EditUserEmailCard :form="form"/>
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