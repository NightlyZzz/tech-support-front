<script setup lang="ts">
    import TicketCard from '@/components/ticket/TicketCard.vue'
    import type { Ticket } from '@/modules/ticket/model/ticket'

    defineProps<{
        tickets: Ticket[]
        showUser?: boolean
        canTake?: boolean
    }>()

    const emit = defineEmits<{
        (e: 'click', id: number): void
        (e: 'take', ticket: Ticket): void
    }>()

    const handleClick = (id: number) => {
        emit('click', id)
    }

    const handleTake = (ticket: Ticket) => {
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
                :showUser="showUser"
                :canTake="canTake && ticket.canTake()"
                @click="handleClick"
                @take="handleTake"
        />
    </div>
</template>