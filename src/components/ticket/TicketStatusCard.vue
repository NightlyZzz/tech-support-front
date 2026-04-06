<script setup lang="ts">
    import BaseSelect from '@/components/base/BaseSelect.vue'
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
    <div class="ticket-panel-card status-select-wrapper">
        <p class="ticket-panel-title">Статус заявки</p>

        <span :class="['badge', 'ticket-status-badge', getStatusBadge(ticketStatus)]">
            {{ currentStatusName }}
        </span>

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
    </div>
</template>