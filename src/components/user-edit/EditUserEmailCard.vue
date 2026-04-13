<script setup lang="ts">
    import { Mail } from 'lucide-vue-next'
    import BaseInput from '@/components/base/BaseInput.vue'
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle
    } from '@/components/ui/card'

    defineProps<{
        email: string
        secondaryEmail: string
    }>()

    const emit = defineEmits<{
        (event: 'update:email', value: string): void
        (event: 'update:secondaryEmail', value: string): void
    }>()
</script>

<template>
    <Card class="rounded-3xl">
        <CardHeader class="space-y-3">
            <div class="flex items-center gap-3">
                <div class="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Mail class="size-5"/>
                </div>

                <div>
                    <CardTitle class="text-xl">
                        Почта
                    </CardTitle>
                    <CardDescription>
                        Основная почта и адрес для уведомлений
                    </CardDescription>
                </div>
            </div>
        </CardHeader>

        <CardContent class="space-y-4">
            <BaseInput
                    id="edit-user-email"
                    :model-value="email"
                    label="Основная почта"
                    type="email"
                    @update:model-value="emit('update:email', $event)"
            />

            <BaseInput
                    id="edit-user-secondary-email"
                    :model-value="secondaryEmail"
                    label="Почта для уведомлений"
                    type="email"
                    @update:model-value="emit('update:secondaryEmail', $event)"
            />
        </CardContent>
    </Card>
</template>