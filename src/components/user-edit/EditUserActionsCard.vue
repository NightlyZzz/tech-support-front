<script setup lang="ts">
    import { Save, Trash2 } from 'lucide-vue-next'
    import BaseButton from '@/components/base/BaseButton.vue'
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle
    } from '@/components/ui/card'

    defineEmits<{
        (event: 'save'): void
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
                Сохранение изменений и удаление пользователя
            </CardDescription>
        </CardHeader>

        <CardContent class="space-y-3">
            <BaseButton
                    variant="primary"
                    :full-width="true"
                    @click="$emit('save')"
            >
                <Save class="size-4"/>
                Сохранить изменения
            </BaseButton>

            <BaseButton
                    variant="danger"
                    :full-width="true"
                    @click="$emit('delete')"
            >
                <Trash2 class="size-4"/>
                Удалить пользователя
            </BaseButton>
        </CardContent>
    </Card>
</template>