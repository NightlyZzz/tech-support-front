<script setup lang="ts">
    import type { TicketInfoCardTicket } from '@/modules/ticket/types/ticket-info'

    const props = defineProps<{
        ticketId: number
        ticket: TicketInfoCardTicket | null
        displayedUserName: string
        formatPhoneNumber: (phoneNumber?: string | null) => string
    }>()
</script>

<template>
    <div class="ticket-panel-card">
        <p class="ticket-panel-title">Заявка</p>
        <div class="ticket-id-label">#{{ ticketId }}</div>

        <div class="ticket-field">
            <span class="ticket-field-label">Тип</span>
            <span class="ticket-field-value">{{ props.ticket?.getTypeName() }}</span>
        </div>

        <div class="ticket-field">
            <span class="ticket-field-label">Пользователь</span>
            <span class="ticket-field-value">{{ displayedUserName }}</span>
        </div>

        <div class="ticket-field">
            <span class="ticket-field-label">Телефон</span>
            <span class="ticket-field-value mono">
                {{ formatPhoneNumber(props.ticket?.getContactPhone() || '') }}
            </span>
        </div>

        <div class="ticket-field">
            <span class="ticket-field-label">Создана</span>
            <span class="ticket-field-value">{{ props.ticket?.getCreatedAtFormatted() }}</span>
        </div>

        <div class="ticket-divider"></div>

        <div class="ticket-field">
            <span class="ticket-field-label">Описание</span>
            <span class="ticket-field-value" style="white-space:pre-wrap;line-height:1.6;">
                {{ props.ticket?.getDescription() }}
            </span>
        </div>
    </div>
</template>