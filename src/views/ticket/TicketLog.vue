<script setup lang="ts">
    import TicketSidebar from '@/components/ticket/TicketSidebar.vue'
    import TicketChatSection from '@/components/ticket/TicketChatSection.vue'
    import { useTicketLogPage } from '@/modules/ticket/composables/useTicketLogPage'

    const {
        ticketId,
        ticket,
        logs,
        newMessage,
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
        setChatBoxElement,
        handleStatusSelectChange
    } = useTicketLogPage()
</script>

<template>
    <div v-if="canOpen" class="ticket-layout">
        <TicketSidebar
                :ticket-id="ticketId"
                :ticket="ticket"
                :displayed-user-name="displayedUserName"
                :format-phone-number="formatPhoneNumber"
                :current-user-role="currentUser?.getRole() ?? null"
                :ticket-status="ticketStatus"
                :current-status-name="currentStatusName"
                :all-statuses="allStatuses"
                :get-status-badge="getStatusBadge"
                @change-status="handleStatusSelectChange"
        />

        <TicketChatSection
                v-model="newMessage"
                :logs="logs"
                :set-chat-box-element="setChatBoxElement"
                :can-write="canWrite"
                :ticket-status="ticketStatus"
                :current-status-name="currentStatusName"
                :get-status-badge="getStatusBadge"
                :is-own-message="isOwnMessage"
                :get-display-name="getDisplayName"
                @submit="sendLog"
        />
    </div>

    <div v-else class="page">
        <div class="empty-state">
            Заявка недоступна
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/ticket.css';
</style>