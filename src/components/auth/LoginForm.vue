<script setup lang="ts">
    import BaseButton from '@/components/base/BaseButton.vue'
    import BaseInput from '@/components/base/BaseInput.vue'
    import { useLoginForm } from '@/modules/user/composables/useLoginForm'

    const {
        form,
        showPassword,
        isSubmitting,
        handleLogin
    } = useLoginForm()
</script>

<template>
    <form class="flex flex-col gap-5" @submit.prevent="handleLogin">
        <BaseInput
                id="login-email"
                v-model="form.email"
                label="Электронная почта"
                type="email"
                placeholder="you@example.com"
                :required="true"
                :disabled="isSubmitting"
        />

        <div class="flex flex-col gap-2">
            <label for="login-password" class="text-sm font-medium text-foreground">
                Пароль
            </label>

            <BaseInput
                    id="login-password"
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

        <label class="flex items-center gap-2 text-sm text-muted-foreground">
            <input
                    v-model="form.remember"
                    type="checkbox"
                    class="size-4 rounded border-input accent-primary"
                    :disabled="isSubmitting"
            >
            Запомнить меня
        </label>

        <BaseButton
                type="submit"
                variant="primary"
                :full-width="true"
                :loading="isSubmitting"
        >
            Войти
        </BaseButton>
    </form>
</template>