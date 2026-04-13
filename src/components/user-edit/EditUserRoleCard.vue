<script setup lang="ts">
    import { Shield } from 'lucide-vue-next'
    import BaseSelect from '@/components/base/BaseSelect.vue'
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle
    } from '@/components/ui/card'
    import type { EditUserRole } from '@/modules/user/types/edit-user'

    defineProps<{
        roleId: number | null
        roles: EditUserRole[]
    }>()

    const emit = defineEmits<{
        (event: 'update:roleId', value: number | null): void
    }>()
</script>

<template>
    <Card class="rounded-3xl">
        <CardHeader class="space-y-3">
            <div class="flex items-center gap-3">
                <div class="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Shield class="size-5"/>
                </div>

                <div>
                    <CardTitle class="text-xl">
                        Роль
                    </CardTitle>
                    <CardDescription>
                        Управление уровнем доступа пользователя
                    </CardDescription>
                </div>
            </div>
        </CardHeader>

        <CardContent>
            <BaseSelect
                    id="edit-user-role"
                    label="Роль"
                    placeholder="Выберите роль"
                    :model-value="roleId"
                    :items="roles"
                    label-key="name"
                    value-key="id"
                    @update:model-value="emit('update:roleId', $event)"
            />
        </CardContent>
    </Card>
</template>