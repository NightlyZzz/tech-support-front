<template>
    <div class="auth-layout">
        <div class="auth-box">
            <div class="auth-logo">
                <span class="auth-logo-dot"></span>
                <span class="auth-logo-text">{{ COMPANY_NAME }}</span>
            </div>

            <h1 class="auth-heading">{{
                    mode === Mode.Login ? 'Добро пожаловать' : 'Создать аккаунт'
                }}</h1>
            <p class="auth-sub">{{
                    mode === Mode.Login ? 'Войдите, чтобы продолжить' : 'Заполните данные для регистрации'
                }}</p>

            <div class="auth-tabs">
                <button class="auth-tab" :class="{ active: mode === Mode.Login }"
                        @click="mode = Mode.Login">Вход
                </button>
                <button class="auth-tab" :class="{ active: mode === Mode.Register }"
                        @click="mode = Mode.Register">Регистрация
                </button>
            </div>

            <LoginForm v-if="mode === Mode.Login"/>
            <RegisterForm v-else/>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import LoginForm from '@/components/auth/LoginForm.vue'
    import RegisterForm from '@/components/auth/RegisterForm.vue'
    import { COMPANY_NAME } from '@/utils/constants'

    const enum Mode { Login, Register }

    const mode = ref<Mode>(Mode.Login)
</script>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/auth.css';
</style>
