<script setup lang="ts">
    import { UserRound } from 'lucide-vue-next'
    import BaseInput from '@/components/base/BaseInput.vue'
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle
    } from '@/components/ui/card'

    defineProps<{
        lastName: string
        firstName: string
        middleName: string
    }>()

    const emit = defineEmits<{
        (event: 'update:lastName', value: string): void
        (event: 'update:firstName', value: string): void
        (event: 'update:middleName', value: string): void
    }>()
</script>

<template>
    <Card class="rounded-3xl">
        <CardHeader class="space-y-3">
            <div class="flex items-center gap-3">
                <div class="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <UserRound class="size-5"/>
                </div>

                <div>
                    <CardTitle class="text-xl">
                        Личные данные
                    </CardTitle>
                    <CardDescription>
                        Основная информация о пользователе
                    </CardDescription>
                </div>
            </div>
        </CardHeader>

        <CardContent class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <BaseInput
                        id="edit-user-last-name"
                        :model-value="lastName"
                        label="Фамилия"
                        type="text"
                        @update:model-value="emit('update:lastName', $event)"
                />

                <BaseInput
                        id="edit-user-first-name"
                        :model-value="firstName"
                        label="Имя"
                        type="text"
                        @update:model-value="emit('update:firstName', $event)"
                />
            </div>

            <BaseInput
                    id="edit-user-middle-name"
                    :model-value="middleName"
                    label="Отчество"
                    type="text"
                    @update:model-value="emit('update:middleName', $event)"
            />
        </CardContent>
    </Card>
</template>