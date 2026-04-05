<script setup lang="ts">
    import BaseSelect from '@/components/BaseSelect.vue'
    import type { StatusOption } from '@/modules/ticket/types/ticket-status'

    defineProps<{
        ticketStatus: number
        currentStatusName: string
        allStatuses: StatusOption[]
        getStatusBadge: (statusId: number) => string
    }>()

    const emit = defineEmits<{
        (e: 'changeStatus', value: string | number | null): void
    }>()
</script>

<template>
    <div class="ticket-panel-card status-select-wrapper">
        <p class="ticket-panel-title">Статус заявки</p>

        <span
                :class="['badge', getStatusBadge(ticketStatus)]"
                style="margin-bottom:12px;display:inline-flex;"
        >
            {{ currentStatusName }}
        </span>

        <BaseSelect
                id="status"
                label="Изменить статус"
                placeholder="Выберите статус"
                :items="allStatuses"
                :modelValue="ticketStatus"
                valueKey="id"
                labelKey="name"
                @update:modelValue="emit('changeStatus', $event)"
        />
    </div>
</template>