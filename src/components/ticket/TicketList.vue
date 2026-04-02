<template>
    <div v-if="tickets.length === 0" class="empty-state">
        Заявок нет
    </div>

    <div v-else class="ticket-list">
        <TicketCard
                v-for="ticket in tickets"
                :key="ticket.getId()"
                :ticket="ticket"
                :onClick="onClick"
                :showUser="showUser"
                :onTake="onTake"
                :canTake="canTake && ticket.canTake()"
        />
    </div>
</template>

<script setup lang="ts">
    import TicketCard from '@/components/ticket/TicketCard.vue'
    import { Ticket } from '@/ticket/ticket'

    defineProps<{
        tickets: Ticket[]
        onClick: (id: number) => void
        onTake?: (ticket: Ticket) => void
        showUser?: boolean
        canTake?: boolean
    }>()
</script>
