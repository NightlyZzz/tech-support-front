<script setup lang="ts">
    import { Role } from '@/enums/role'
    import TicketInfoCard from '@/components/ticket/TicketInfoCard.vue'
    import TicketStatusCard from '@/components/ticket/TicketStatusCard.vue'
    import type { StatusOption } from '@/modules/ticket/types/ticket-status'
    import type { TicketInfoCardTicket } from '@/modules/ticket/types/ticket-info'

    defineProps<{
        ticketId: number
        ticket: TicketInfoCardTicket | null
        displayedUserName: string
        formatPhoneNumber: (phoneNumber?: string | null) => string
        currentUserRole: number | null
        ticketStatus: number | null
        currentStatusName: string
        allStatuses: StatusOption[]
        getStatusBadge: (statusId: number) => string
    }>()

    const emit = defineEmits<{
        (event: 'changeStatus', value: string | number | null): void
    }>()
</script>

<template>
    <aside class="ticket-panel">
        <TicketInfoCard
                :ticketId="ticketId"
                :ticket="ticket"
                :displayedUserName="displayedUserName"
                :formatPhoneNumber="formatPhoneNumber"
        />

        <TicketStatusCard
                v-if="currentUserRole !== Role.User && ticketStatus !== null"
                :ticketStatus="ticketStatus"
                :currentStatusName="currentStatusName"
                :allStatuses="allStatuses"
                :getStatusBadge="getStatusBadge"
                @changeStatus="emit('changeStatus', $event)"
        />
    </aside>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/ticket.css';
</style>