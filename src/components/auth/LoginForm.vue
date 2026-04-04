<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import router from '@/router'
    import { login } from '@/modules/user/api/auth.api'
    import { showToast } from '@/shared/toast/toastService'
    import { setUserToken } from '@/modules/user/model/userStorage'
    import { initUser } from '@/modules/user/composables/useInitUser'

    interface LoginForm {
        email: string
        password: string
        remember: boolean
    }

    const form = reactive<LoginForm>({
        email: '',
        password: '',
        remember: false
    })

    const showPassword = ref(false)

    const handleLogin = async (): Promise<void> => {
        try {
            const loginResponse = await login({
                email: form.email,
                password: form.password
            })

            setUserToken(loginResponse.token)

            await initUser()

            await router.push({ name: 'home' })
        } catch {
            showToast('Неверный email или пароль', 'error')
        }
    }
</script>

<template>
    <form @submit.prevent="handleLogin" class="auth-form">
        <div class="field">
            <label for="login-email">Электронная почта</label>
            <input
                    id="login-email"
                    v-model="form.email"
                    type="email"
                    placeholder="you@example.com"
                    required
            />
        </div>

        <div class="field">
            <label for="login-password">Пароль</label>
            <div class="password-wrapper">
                <input
                        id="login-password"
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Минимум 8 символов"
                        minlength="8"
                        required
                />
                <label class="check-label" style="margin-top:4px;">
                    <input v-model="showPassword" type="checkbox"/>
                    Показать пароль
                </label>
            </div>
        </div>

        <label class="check-label">
            <input v-model="form.remember" type="checkbox"/>
            Запомнить меня
        </label>

        <button type="submit" class="btn btn--primary btn--full">
            Войти
        </button>
    </form>
</template>