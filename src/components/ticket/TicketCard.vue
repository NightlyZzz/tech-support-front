<template>
    <div class="ticket-card animate-in" @click="onClick(ticket.getId())">
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
            <div class="ticket-card-row" v-if="showUser">
                <b>Пользователь:</b>{{ ticket.getSenderName() }}
            </div>

            <div class="ticket-card-row">
                <b>Дата:</b>{{ formatDate(ticket.getCreatedAt()) }}
            </div>

            <div class="ticket-card-row">
                <b>Время:</b>{{ formatTime(ticket.getCreatedAt()) }}
            </div>
        </div>

        <div class="ticket-card-desc">
            <b>Описание:</b> {{ truncate(ticket.getDescription(), 50) }}
        </div>

        <div v-if="canTake" class="ticket-card-actions">
            <button class="btn btn--primary btn--sm" @click.stop="onTake?.(ticket)">
                Взять в работу
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Ticket } from '@/ticket/ticket'
    import { formatDate, formatTime, truncate, getStatusBadge } from '@/utils/utils'

    defineProps<{
        ticket: Ticket
        onClick: (id: number) => void
        onTake?: (ticket: Ticket) => void
        showUser?: boolean
        canTake?: boolean
    }>()
</script>
