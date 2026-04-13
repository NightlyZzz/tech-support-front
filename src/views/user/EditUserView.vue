<script setup lang="ts">
    import { computed } from 'vue'
    import { Settings2, Shield, UserRound } from 'lucide-vue-next'
    import EditUserActionsCard from '@/components/user-edit/EditUserActionsCard.vue'
    import EditUserDepartmentCard from '@/components/user-edit/EditUserDepartmentCard.vue'
    import EditUserEmailCard from '@/components/user-edit/EditUserEmailCard.vue'
    import EditUserPersonalCard from '@/components/user-edit/EditUserPersonalCard.vue'
    import EditUserRoleCard from '@/components/user-edit/EditUserRoleCard.vue'
    import { Badge } from '@/components/ui/badge'
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
    ): void => {
        form[fieldName] = value
    }

    const updateDepartmentId = (value: number | null): void => {
        form.department_id = value
    }

    const updateRoleId = (value: number | null): void => {
        form.role_id = value
    }

    const selectedRoleName = computed(() => {
        return roles.value.find((roleItem) => roleItem.id === form.role_id)?.name ?? 'Роль не выбрана'
    })

    const selectedDepartmentName = computed(() => {
        return departments.value.find((departmentItem) => departmentItem.id === form.department_id)?.name ?? 'Подразделение не выбрано'
    })
</script>

<template>
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section class="rounded-3xl border bg-card/95 p-6 shadow-sm">
            <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div class="flex items-start gap-4">
                    <div class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Settings2 class="size-7"/>
                    </div>

                    <div class="space-y-3">
                        <div class="space-y-1">
                            <h1 class="text-3xl font-semibold tracking-tight">
                                Редактирование пользователя
                            </h1>
                            <p class="text-sm text-muted-foreground">
                                Изменение личных данных
                            </p>
                        </div>

                        <div class="flex flex-wrap gap-2">
                            <Badge variant="secondary" class="gap-2 rounded-full px-3 py-1">
                                <Shield class="size-3.5"/>
                                {{ selectedRoleName }}
                            </Badge>

                            <Badge variant="secondary" class="gap-2 rounded-full px-3 py-1">
                                <UserRound class="size-3.5"/>
                                {{ selectedDepartmentName }}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div class="flex flex-col gap-6">
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

            <div class="flex flex-col gap-6">
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