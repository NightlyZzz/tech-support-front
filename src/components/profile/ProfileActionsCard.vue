<script setup lang="ts">
    import { LogOut, Save, Trash2 } from 'lucide-vue-next'
    import BaseButton from '@/components/base/BaseButton.vue'
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle
    } from '@/components/ui/card'

    defineProps<{
        loading: boolean
    }>()

    defineEmits<{
        (event: 'save'): void
        (event: 'logout'): void
        (event: 'delete'): void
    }>()
</script>

<template>
    <Card class="rounded-3xl">
        <CardHeader>
            <CardTitle class="text-xl">
                Действия
            </CardTitle>
            <CardDescription>
                Сохранение профиля и управление сессией
            </CardDescription>
        </CardHeader>

        <CardContent class="space-y-3">
            <BaseButton
                    variant="primary"
                    :loading="loading"
                    :full-width="true"
                    @click="$emit('save')"
            >
                <Save class="size-4"/>
                Сохранить изменения
            </BaseButton>

            <BaseButton
                    variant="secondary"
                    :full-width="true"
                    @click="$emit('logout')"
            >
                <LogOut class="size-4"/>
                Выйти
            </BaseButton>

            <BaseButton
                    variant="danger"
                    :full-width="true"
                    @click="$emit('delete')"
            >
                <Trash2 class="size-4"/>
                Удалить аккаунт
            </BaseButton>
        </CardContent>
    </Card>
</template>