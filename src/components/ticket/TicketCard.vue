<script setup lang="ts">
    import BaseButton from '@/components/base/BaseButton.vue'
    import { formatDate, formatTime, getStatusBadge, truncate } from '@/shared/utils/utils'
    import type { TicketListItem } from '@/modules/ticket/types/ticket-list-item'

    const props = withDefaults(defineProps<{
        ticket: TicketListItem
        showUser?: boolean
        canTake?: boolean
    }>(), {
        showUser: false,
        canTake: false
    })

    const emit = defineEmits<{
        (event: 'click', ticketId: number): void
        (event: 'take', ticket: TicketListItem): void
    }>()

    const handleClick = (): void => {
        emit('click', props.ticket.getId())
    }

    const handleTake = (): void => {
        emit('take', props.ticket)
    }
</script>

<template>
    <div class="ticket-card animate-in" @click="handleClick">
        <div class="ticket-card-head">
            <div class="ticket-card-head-main">
                <div class="ticket-card-title">{{ ticket.getTypeName() }}</div>
                <div class="ticket-card-id">#{{ ticket.getId() }}</div>
            </div>

            <span :class="['badge', getStatusBadge(ticket.getStatusId())]">
                {{ ticket.getStatusName() }}
            </span>
        </div>

        <div class="ticket-card-meta">
            <div v-if="showUser" class="ticket-card-row">
                <b>Пользователь:</b> {{ ticket.getSenderName() }}
            </div>

            <div class="ticket-card-row">
                <b>Дата:</b> {{ formatDate(ticket.getCreatedAt()) }}
            </div>

            <div class="ticket-card-row">
                <b>Время:</b> {{ formatTime(ticket.getCreatedAt()) }}
            </div>
        </div>

        <div class="ticket-card-desc">
            <b>Описание:</b> {{ truncate(ticket.getDescription(), 80) }}
        </div>

        <div v-if="canTake" class="ticket-card-actions">
            <BaseButton
                    variant="primary"
                    size="sm"
                    @click.stop="handleTake"
            >
                Взять в работу
            </BaseButton>
        </div>
    </div>
</template>