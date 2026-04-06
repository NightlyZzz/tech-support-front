<script setup lang="ts">
    import TicketCard from '@/components/ticket/TicketCard.vue'
    import type { TicketListItem } from '@/modules/ticket/types/ticket-list-item'

    withDefaults(defineProps<{
        tickets: TicketListItem[]
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

    const handleClick = (ticketId: number): void => {
        emit('click', ticketId)
    }

    const handleTake = (ticket: TicketListItem): void => {
        emit('take', ticket)
    }
</script>

<template>
    <div v-if="tickets.length === 0" class="empty-state">
        Заявок нет
    </div>

    <div v-else class="ticket-list">
        <TicketCard
                v-for="ticket in tickets"
                :key="ticket.getId()"
                :ticket="ticket"
                :show-user="showUser"
                :can-take="canTake && ticket.canTake()"
                @click="handleClick"
                @take="handleTake"
        />
    </div>
</template>