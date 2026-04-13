<script setup lang="ts">
    import { Building2, Mail, Shield, UserRound } from 'lucide-vue-next'
    import ProfileActionsCard from '@/components/profile/ProfileActionsCard.vue'
    import ProfileDepartmentCard from '@/components/profile/ProfileDepartmentCard.vue'
    import ProfileEmailCard from '@/components/profile/ProfileEmailCard.vue'
    import ProfileLogoutModal from '@/components/profile/ProfileLogoutModal.vue'
    import ProfilePasswordCard from '@/components/profile/ProfilePasswordCard.vue'
    import ProfilePersonalCard from '@/components/profile/ProfilePersonalCard.vue'
    import { Badge } from '@/components/ui/badge'
    import { useProfilePage } from '@/modules/user/composables/useProfilePage'
    import type { ProfileForm } from '@/modules/user/types/profile'

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

    const updateTextField = (
            fieldName: keyof Pick<
                    ProfileForm,
                    'last_name' | 'first_name' | 'middle_name' | 'email' | 'secondary_email' | 'new_password'
            >,
            value: string
    ): void => {
        form[fieldName] = value
    }

    const updateDepartmentId = (value: number | null): void => {
        if (value === null) {
            return
        }

        form.department_id = value
    }
</script>

<template>
    <div v-if="!user"
         class="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div class="rounded-2xl border bg-card px-6 py-4 text-sm text-muted-foreground shadow-sm">
            Загрузка профиля...
        </div>
    </div>

    <div v-else class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section class="rounded-3xl border bg-card/95 p-6 shadow-sm">
            <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div class="flex items-start gap-4">
                    <div class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <UserRound class="size-7"/>
                    </div>

                    <div class="space-y-3">
                        <div class="space-y-1">
                            <h1 class="text-3xl font-semibold tracking-tight">
                                Профиль
                            </h1>
                            <p class="text-sm text-muted-foreground">
                                Управление личными данными
                            </p>
                        </div>

                        <div class="flex flex-wrap gap-2">
                            <Badge variant="secondary" class="gap-2 rounded-full px-3 py-1">
                                <Mail class="size-3.5"/>
                                {{ form.email }}
                            </Badge>

                            <Badge variant="secondary" class="gap-2 rounded-full px-3 py-1">
                                <Building2 class="size-3.5"/>
                                ID подразделения: {{ form.department_id }}
                            </Badge>

                            <Badge variant="secondary" class="gap-2 rounded-full px-3 py-1">
                                <Shield class="size-3.5"/>
                                Аккаунт активен
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div class="flex flex-col gap-6">
                <ProfilePersonalCard
                        :last-name="form.last_name"
                        :first-name="form.first_name"
                        :middle-name="form.middle_name"
                        @update:last-name="updateTextField('last_name', $event)"
                        @update:first-name="updateTextField('first_name', $event)"
                        @update:middle-name="updateTextField('middle_name', $event)"
                />

                <ProfileEmailCard
                        :email="form.email"
                        :secondary-email="form.secondary_email"
                        @update:email="updateTextField('email', $event)"
                        @update:secondary-email="updateTextField('secondary_email', $event)"
                />
            </div>

            <div class="flex flex-col gap-6">
                <ProfilePasswordCard
                        :new-password="form.new_password"
                        :show-password="showPassword"
                        @update:new-password="updateTextField('new_password', $event)"
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