<script setup lang="ts">
    import { CircleDot } from 'lucide-vue-next'
    import BaseSelect from '@/components/base/BaseSelect.vue'
    import { Badge } from '@/components/ui/badge'
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
    import { cn } from '@/lib/utils'
    import type { StatusOption } from '@/modules/ticket/types/ticket-status'

    defineProps<{
        ticketStatus: number
        currentStatusName: string
        allStatuses: StatusOption[]
        getStatusBadge: (statusId: number) => string
    }>()

    const emit = defineEmits<{
        (event: 'changeStatus', value: number | null): void
    }>()
</script>

<template>
    <Card class="rounded-3xl">
        <CardHeader class="space-y-3">
            <div class="flex items-center gap-3">
                <div class="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <CircleDot class="size-5"/>
                </div>

                <div>
                    <CardTitle class="text-xl">
                        Статус заявки
                    </CardTitle>
                </div>
            </div>
        </CardHeader>

        <CardContent class="space-y-4">
            <Badge
                    variant="outline"
                    :class="cn('w-fit rounded-full px-3 py-1', getStatusBadge(ticketStatus))"
            >
                {{ currentStatusName }}
            </Badge>

            <BaseSelect
                    id="status"
                    label="Изменить статус"
                    placeholder="Выберите статус"
                    :items="allStatuses"
                    :model-value="ticketStatus"
                    value-key="id"
                    label-key="name"
                    @update:model-value="emit('changeStatus', $event)"
            />
        </CardContent>
    </Card>
</template>