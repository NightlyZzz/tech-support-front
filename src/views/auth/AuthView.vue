<script setup lang="ts">
    import { computed, ref } from 'vue'
    import LoginForm from '@/components/auth/LoginForm.vue'
    import RegisterForm from '@/components/auth/RegisterForm.vue'
    import { Button } from '@/components/ui/button'
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle
    } from '@/components/ui/card'
    import { cn } from '@/lib/utils'
    import { COMPANY_NAME } from '@/shared/utils/constants'

    type Mode = 'login' | 'register'

    const mode = ref<Mode>('login')

    const isLogin = computed(() => mode.value === 'login')

    const title = computed(() => {
        return isLogin.value ? 'Добро пожаловать' : 'Создать аккаунт'
    })

    const subtitle = computed(() => {
        return isLogin.value
                ? 'Войдите, чтобы продолжить работу в системе'
                : 'Заполните данные для регистрации нового аккаунта'
    })

    const setMode = (value: Mode): void => {
        mode.value = value
    }
</script>

<template>
    <div class="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,120,120,0.10),transparent_35%)]"></div>

        <Card class="relative z-10 w-full max-w-xl border-border/80 bg-card/95 shadow-2xl backdrop-blur">
            <CardHeader class="space-y-5">
                <div class="flex items-center gap-3">
                    <span class="size-3 rounded-full bg-primary"></span>
                    <span class="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                        {{ COMPANY_NAME }}
                    </span>
                </div>

                <div class="space-y-2">
                    <CardTitle class="text-3xl font-semibold tracking-tight">
                        {{ title }}
                    </CardTitle>
                    <CardDescription class="text-sm">
                        {{ subtitle }}
                    </CardDescription>
                </div>

                <div class="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                    <Button
                            type="button"
                            :variant="isLogin ? 'default' : 'ghost'"
                            class="w-full"
                            @click="setMode('login')"
                    >
                        Вход
                    </Button>

                    <Button
                            type="button"
                            :variant="!isLogin ? 'default' : 'ghost'"
                            class="w-full"
                            @click="setMode('register')"
                    >
                        Регистрация
                    </Button>
                </div>
            </CardHeader>

            <CardContent :class="cn('pt-0')">
                <LoginForm v-if="isLogin"/>
                <RegisterForm v-else/>
            </CardContent>
        </Card>
    </div>
</template>