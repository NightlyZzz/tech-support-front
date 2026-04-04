<script setup lang="ts">
    import { ref, computed } from 'vue'
    import LoginForm from '@/components/auth/LoginForm.vue'
    import RegisterForm from '@/components/auth/RegisterForm.vue'
    import { COMPANY_NAME } from '@/shared/utils/constants'

    type Mode = 'login' | 'register'

    const mode = ref<Mode>('login')

    const isLogin = computed(() => mode.value === 'login')

    const title = computed(() =>
            isLogin.value ? 'Добро пожаловать' : 'Создать аккаунт'
    )

    const subtitle = computed(() =>
            isLogin.value
                    ? 'Войдите, чтобы продолжить'
                    : 'Заполните данные для регистрации'
    )

    const setMode = (value: Mode) => {
        mode.value = value
    }
</script>

<template>
    <div class="auth-layout">
        <div class="auth-box">
            <div class="auth-logo">
                <span class="auth-logo-dot"></span>
                <span class="auth-logo-text">{{ COMPANY_NAME }}</span>
            </div>

            <h1 class="auth-heading">{{ title }}</h1>
            <p class="auth-sub">{{ subtitle }}</p>

            <div class="auth-tabs">
                <button
                        class="auth-tab"
                        :class="{ active: isLogin }"
                        @click="setMode('login')"
                >
                    Вход
                </button>

                <button
                        class="auth-tab"
                        :class="{ active: !isLogin }"
                        @click="setMode('register')"
                >
                    Регистрация
                </button>
            </div>

            <LoginForm v-if="isLogin"/>
            <RegisterForm v-else/>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/auth.css';
</style>