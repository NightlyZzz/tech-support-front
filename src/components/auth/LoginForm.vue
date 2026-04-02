<template>
    <form @submit.prevent="handleLogin" class="auth-form">
        <div class="field">
            <label for="login-email">Электронная почта</label>
            <input
                    id="login-email"
                    type="email"
                    v-model="form.email"
                    placeholder="you@example.com"
                    required
            />
        </div>

        <div class="field">
            <label for="login-password">Пароль</label>
            <div class="password-wrapper">
                <input
                        id="login-password"
                        :type="showPassword ? 'text' : 'password'"
                        v-model="form.password"
                        placeholder="Минимум 8 символов"
                        minlength="8"
                        required
                />
                <label class="check-label" style="margin-top:4px;">
                    <input type="checkbox" v-model="showPassword"/>
                    Показать пароль
                </label>
            </div>
        </div>

        <label class="check-label">
            <input type="checkbox" v-model="form.remember"/>
            Запомнить меня
        </label>

        <button type="submit" class="btn btn--primary btn--full">
            Войти
        </button>
    </form>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue'
    import router from '@/router'
    import { login, getCurrentUser } from '@/api/auth.api'
    import { showToast } from '@/utils/toast'
    import { setUserToken, setUserData } from '@/user/data'

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
            const response = await login({
                email: form.email,
                password: form.password
            })

            setUserToken(response.token)

            const userResponse = await getCurrentUser()
            setUserData(userResponse.data)

            await router.push({ name: 'home' })
        } catch {
            showToast('Неверный email или пароль', 'error')
        }
    }
</script>