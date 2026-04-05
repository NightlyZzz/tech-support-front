<script setup lang="ts">
    import TicketSidebar from '@/components/ticket/TicketSidebar.vue'
    import TicketChatSection from '@/components/ticket/TicketChatSection.vue'
    import { useTicketLogPage } from '@/modules/ticket/composables/useTicketLogPage'

    const {
        ticketId,
        ticket,
        logs,
        newMessage,
        chatBox,
        currentUser,
        allStatuses,
        ticketStatus,
        currentStatusName,
        canOpen,
        canWrite,
        displayedUserName,
        formatPhoneNumber,
        getStatusBadge,
        isOwnMessage,
        getDisplayName,
        sendLog,
        handleStatusSelectChange
    } = useTicketLogPage()
</script>

<template>
    <div v-if="canOpen" class="ticket-layout">
        <TicketSidebar
                :ticketId="ticketId"
                :ticket="ticket"
                :displayedUserName="displayedUserName"
                :formatPhoneNumber="formatPhoneNumber"
                :currentUserRole="currentUser?.getRole() ?? null"
                :ticketStatus="ticketStatus"
                :currentStatusName="currentStatusName"
                :allStatuses="allStatuses"
                :getStatusBadge="getStatusBadge"
                @changeStatus="handleStatusSelectChange"
        />

        <TicketChatSection
                v-model="newMessage"
                :logs="logs"
                :chatBox="chatBox"
                :canWrite="canWrite"
                :ticketStatus="ticketStatus"
                :currentStatusName="currentStatusName"
                :getStatusBadge="getStatusBadge"
                :isOwnMessage="isOwnMessage"
                :getDisplayName="getDisplayName"
                @submit="sendLog"
        />
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/ticket.css';
</style>