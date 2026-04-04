<script setup lang="ts">
    import { formatDate, formatTime, truncate, getStatusBadge } from '@/shared/utils/utils'
    import type { Ticket } from '@/modules/ticket/model/ticket'

    const props = defineProps<{
        ticket: Ticket
        showUser?: boolean
        canTake?: boolean
    }>()

    const emit = defineEmits<{
        (e: 'click', ticketId: number): void
        (e: 'take', ticket: Ticket): void
    }>()

    const handleClick = () => {
        emit('click', props.ticket.getId())
    }

    const handleTake = () => {
        emit('take', props.ticket)
    }
</script>

<template>
    <div class="ticket-card animate-in" @click="handleClick">
        <div class="ticket-card-head">
            <div>
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
            <b>Описание:</b> {{ truncate(ticket.getDescription(), 50) }}
        </div>

        <div v-if="canTake" class="ticket-card-actions">
            <button class="btn btn--primary btn--sm" @click.stop="handleTake">
                Взять в работу
            </button>
        </div>
    </div>
</template>