<script setup lang="ts">
    import { Inbox } from 'lucide-vue-next'
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
    <div
            v-if="tickets.length === 0"
            class="flex min-h-60 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed bg-card px-6 py-10 text-center shadow-sm"
    >
        <div class="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Inbox class="size-7"/>
        </div>

        <div class="space-y-1">
            <h3 class="text-lg font-semibold">
                Заявок нет
            </h3>
            <p class="text-sm text-muted-foreground">
                Когда появятся обращения, они будут отображаться здесь
            </p>
        </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 xl:grid-cols-2">
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