<script setup lang="ts">
    import { onMounted, reactive, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import BaseButton from '@/components/base/BaseButton.vue'
    import BaseSelect from '@/components/base/BaseSelect.vue'
    import BaseInput from '@/components/base/BaseInput.vue'
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle
    } from '@/components/ui/card'
    import { completeGoogleRegistration } from '@/modules/user/api/auth.api'
    import { getAllDepartments } from '@/modules/user/api/user.lookup'
    import { getLaravelErrorMessage } from '@/modules/user/helpers/getLaravelErrorMessage'
    import { initializeAuthorizedSession } from '@/modules/user/services/session.service'
    import { showToast } from '@/shared/toast/toastService'
    import type { Department } from '@/modules/user/types/department'

    const router = useRouter()

    const form = reactive({
        department_id: null as number | null,
        password: ''
    })

    const departments = ref<Department[]>([])
    const showPassword = ref(false)
    const isSubmitting = ref(false)
    const isLoadingDepartments = ref(false)

    const updateDepartmentId = (value: number | null): void => {
        form.department_id = value
    }

    const loadDepartments = async (): Promise<void> => {
        isLoadingDepartments.value = true

        try {
            const departmentsResponse = await getAllDepartments()
            departments.value = departmentsResponse.data ?? []
        } catch {
            departments.value = []
        } finally {
            isLoadingDepartments.value = false
        }
    }

    const handleSubmit = async (): Promise<void> => {
        if (isSubmitting.value) {
            return
        }

        if (form.department_id === null) {
            showToast('Выберите подразделение', 'error')
            return
        }

        if (form.password.length < 8) {
            showToast('Пароль должен содержать не менее 8 символов', 'error')
            return
        }

        isSubmitting.value = true

        try {
            await completeGoogleRegistration({
                department_id: form.department_id,
                password: form.password
            })

            await initializeAuthorizedSession()
            await router.replace({ name: 'profile' })
        } catch (error: unknown) {
            const errorMessage = getLaravelErrorMessage(error)
            showToast(errorMessage ?? 'Не удалось завершить регистрацию через Google', 'error')
        } finally {
            isSubmitting.value = false
        }
    }

    onMounted(loadDepartments)
</script>

<template>
    <div class="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <Card class="w-full border-border/80 bg-card/95 shadow-2xl backdrop-blur">
            <CardHeader class="space-y-2">
                <CardTitle class="text-3xl font-semibold tracking-tight">
                    Завершение регистрации
                </CardTitle>
                <CardDescription class="text-sm">
                    Чтобы продолжить вход через Google, выберите подразделение и задайте пароль для аккаунта.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
                    <BaseSelect
                            id="google-department"
                            label="Подразделение"
                            placeholder="Выберите подразделение"
                            :model-value="form.department_id"
                            :items="departments"
                            label-key="name"
                            value-key="id"
                            :disabled="isSubmitting || isLoadingDepartments"
                            @update:model-value="updateDepartmentId"
                    />

                    <div class="flex flex-col gap-2">
                        <label for="google-password" class="text-sm font-medium text-foreground">
                            Пароль
                        </label>

                        <BaseInput
                                id="google-password"
                                v-model="form.password"
                                :type="showPassword ? 'text' : 'password'"
                                placeholder="Минимум 8 символов"
                                :required="true"
                                :minlength="8"
                                :disabled="isSubmitting"
                        />
                    </div>

                    <label class="flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                                v-model="showPassword"
                                type="checkbox"
                                class="size-4 rounded border-input accent-primary"
                                :disabled="isSubmitting"
                        >
                        Показать пароль
                    </label>

                    <BaseButton
                            type="submit"
                            variant="primary"
                            :full-width="true"
                            :loading="isSubmitting"
                    >
                        Завершить регистрацию
                    </BaseButton>
                </form>
            </CardContent>
        </Card>
    </div>
</template>