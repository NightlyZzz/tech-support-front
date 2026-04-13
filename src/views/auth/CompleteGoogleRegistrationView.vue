<script setup lang="ts">
    import BaseButton from '@/components/base/BaseButton.vue'
    import BaseInput from '@/components/base/BaseInput.vue'
    import BaseSelect from '@/components/base/BaseSelect.vue'
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle
    } from '@/components/ui/card'
    import { useCompleteGoogleRegistrationForm } from '@/modules/user/composables/useCompleteGoogleRegistrationForm'

    const {
        form,
        departments,
        showPassword,
        isSubmitting,
        isLoadingDepartments,
        updateDepartmentId,
        handleSubmit
    } = useCompleteGoogleRegistrationForm()
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