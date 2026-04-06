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
    <form @submit.prevent="handleLogin" class="auth-form">
        <BaseInput
                id="login-email"
                v-model="form.email"
                label="Электронная почта"
                type="email"
                placeholder="you@example.com"
                :required="true"
                :disabled="isSubmitting"
        />

        <div class="field">
            <label for="login-password">Пароль</label>

            <div class="password-wrapper">
                <BaseInput
                        id="login-password"
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Минимум 8 символов"
                        :required="true"
                        :minlength="8"
                        :disabled="isSubmitting"
                />

                <label class="check-label auth-checkbox-inline">
                    <input v-model="showPassword" type="checkbox" :disabled="isSubmitting">
                    Показать пароль
                </label>
            </div>
        </div>

        <label class="check-label">
            <input v-model="form.remember" type="checkbox" :disabled="isSubmitting">
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