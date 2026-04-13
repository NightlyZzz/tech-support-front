<script setup lang="ts">
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
    import { useAuthView } from '@/modules/user/composables/useAuthView'
    import { COMPANY_NAME } from '@/shared/utils/constants'

    const {
        isLogin,
        title,
        subtitle,
        isProcessingGoogleAuth,
        setMode,
        handleGoogleAuth
    } = useAuthView()
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

                <div class="my-6 flex items-center gap-3">
                    <div class="h-px flex-1 bg-border"></div>
                    <span class="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        или
                    </span>
                    <div class="h-px flex-1 bg-border"></div>
                </div>

                <Button
                        type="button"
                        variant="outline"
                        class="w-full"
                        :disabled="isProcessingGoogleAuth"
                        @click="handleGoogleAuth"
                >
                    {{ isProcessingGoogleAuth ? 'Загрузка...' : 'Продолжить через Google' }}
                </Button>
            </CardContent>
        </Card>
    </div>
</template>