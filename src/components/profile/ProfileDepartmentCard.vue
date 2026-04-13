<script setup lang="ts">
    import { Building2 } from 'lucide-vue-next'
    import BaseSelect from '@/components/base/BaseSelect.vue'
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle
    } from '@/components/ui/card'
    import type { Department } from '@/modules/user/types/department'

    defineProps<{
        departmentId: number
        departments: Department[]
    }>()

    const emit = defineEmits<{
        (event: 'update:departmentId', value: number | null): void
    }>()
</script>

<template>
    <Card class="rounded-3xl">
        <CardHeader class="space-y-3">
            <div class="flex items-center gap-3">
                <div class="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Building2 class="size-5"/>
                </div>

                <div>
                    <CardTitle class="text-xl">
                        Подразделение
                    </CardTitle>
                    <CardDescription>
                        Выберите текущее подразделение пользователя
                    </CardDescription>
                </div>
            </div>
        </CardHeader>

        <CardContent>
            <BaseSelect
                    id="profile-department"
                    label="Подразделение"
                    placeholder="Выберите подразделение"
                    :model-value="departmentId"
                    :items="departments"
                    label-key="name"
                    value-key="id"
                    @update:model-value="emit('update:departmentId', $event)"
            />
        </CardContent>
    </Card>
</template>