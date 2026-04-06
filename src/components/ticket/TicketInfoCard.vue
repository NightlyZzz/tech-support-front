<script setup lang="ts">
    import { computed } from 'vue'
    import type { TicketInfoCardTicket } from '@/modules/ticket/types/ticket-info'

    const props = defineProps<{
        ticketId: number
        ticket: TicketInfoCardTicket | null
        displayedUserName: string
        formatPhoneNumber: (phoneNumber?: string | null) => string
    }>()

    const formattedPhoneNumber = computed(() => {
        return props.formatPhoneNumber(props.ticket?.getContactPhone() ?? '')
    })

    const createdAtText = computed(() => {
        return props.ticket?.getCreatedAtFormatted() ?? '—'
    })

    const descriptionText = computed(() => {
        return props.ticket?.getDescription() ?? '—'
    })

    const typeName = computed(() => {
        return props.ticket?.getTypeName() ?? '—'
    })
</script>

<template>
    <div class="ticket-panel-card">
        <p class="ticket-panel-title">Заявка</p>
        <div class="ticket-id-label">#{{ ticketId }}</div>

        <div class="ticket-field">
            <span class="ticket-field-label">Тип</span>
            <span class="ticket-field-value">{{ typeName }}</span>
        </div>

        <div class="ticket-field">
            <span class="ticket-field-label">Пользователь</span>
            <span class="ticket-field-value">{{ displayedUserName }}</span>
        </div>

        <div class="ticket-field">
            <span class="ticket-field-label">Телефон</span>
            <span class="ticket-field-value mono">
                {{ formattedPhoneNumber }}
            </span>
        </div>

        <div class="ticket-field">
            <span class="ticket-field-label">Создана</span>
            <span class="ticket-field-value">{{ createdAtText }}</span>
        </div>

        <div class="ticket-divider"></div>

        <div class="ticket-field">
            <span class="ticket-field-label">Описание</span>
            <span class="ticket-field-value ticket-description-text">
                {{ descriptionText }}
            </span>
        </div>
    </div>
</template>