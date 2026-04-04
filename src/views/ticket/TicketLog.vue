<script setup lang="ts">
    import { useRoute } from 'vue-router'
    import { computed } from 'vue'
    import { Role } from '@/enums/role'
    import TicketInfoCard from '@/components/ticket/TicketInfoCard.vue'
    import TicketStatusCard from '@/components/ticket/TicketStatusCard.vue'
    import TicketMessagesList from '@/components/ticket/TicketMessagesList.vue'
    import TicketMessageInput from '@/components/ticket/TicketMessageInput.vue'

    import { useTicketAccess } from '@/modules/ticket/composables/useTicketAccess'
    import { useTicketChat } from '@/modules/ticket/composables/useTicketChat'
    import { useTicketDetails } from '@/modules/ticket/composables/useTicketDetails'
    import { useTicketStatuses } from '@/modules/ticket/composables/useTicketStatuses'
    import { useTicketMeta } from '@/modules/ticket/composables/useTicketMeta'
    import { useTicketMessages } from '@/modules/ticket/composables/useTicketMessages'
    import { useTicketPage } from '@/modules/ticket/composables/useTicketPage'

    const route = useRoute()
    const ticketId = Number(route.params.id)

    const {
        logs,
        newMessage,
        chatBox,
        loadLogs,
        sendLog
    } = useTicketChat(ticketId)

    const {
        ticket,
        loadTicket,
        updateStatus
    } = useTicketDetails(ticketId)

    const { statuses: allStatuses, loadStatuses } = useTicketStatuses()

    const ticketStatus = computed({
        get: () => ticket.value?.getStatusId() ?? null,
        set: (nextStatusId: number | null) => {
            if (!ticket.value || nextStatusId === null) {
                return
            }

            ticket.value.setStatus(nextStatusId)
        }
    })

    const assignedEmployeeId = computed(() => ticket.value?.getEmployeeId() ?? null)

    const {
        currentUser,
        currentStatusName,
        formatPhoneNumber,
        handleStatusChange,
        getStatusBadge
    } = useTicketMeta(ticketStatus, allStatuses, updateStatus)

    const {
        isOwnMessage,
        getDisplayName
    } = useTicketMessages(currentUser)

    const {
        canOpen,
        canWrite
    } = useTicketAccess(ticketStatus, assignedEmployeeId)

    const displayedUserName = computed(() => {
        if (!currentUser.value || !ticket.value) {
            return ''
        }

        return ticket.value.getSenderId() === currentUser.value.getId()
                ? 'Вы'
                : ticket.value.getSenderName()
    })

    const handleStatusSelectChange = (selectedValue: string | number | null) => {
        if (selectedValue === null) {
            return
        }

        handleStatusChange(Number(selectedValue))
    }

    useTicketPage(loadTicket, loadLogs, loadStatuses, canOpen)
</script>

<template>
    <div v-if="canOpen" class="ticket-layout">
        <aside class="ticket-panel">
            <TicketInfoCard
                    :ticketId="ticketId"
                    :ticket="ticket"
                    :displayedUserName="displayedUserName"
                    :formatPhoneNumber="formatPhoneNumber"
            />

            <TicketStatusCard
                    v-if="currentUser?.getRole() !== Role.User && ticketStatus !== null"
                    :ticketStatus="ticketStatus"
                    :currentStatusName="currentStatusName"
                    :allStatuses="allStatuses"
                    :getStatusBadge="getStatusBadge"
                    @changeStatus="handleStatusSelectChange"
            />
        </aside>

        <section class="ticket-chat">
            <div class="ticket-chat-header">
                <div>
                    <div class="ticket-chat-header-title">Переписка</div>
                    <div class="ticket-chat-header-sub">{{ logs.length }} сообщений</div>
                </div>

                <span
                        v-if="ticketStatus !== null"
                        :class="['badge', getStatusBadge(ticketStatus)]"
                >
                    {{ currentStatusName }}
                </span>
            </div>

            <div ref="chatBox" class="ticket-messages">
                <TicketMessagesList
                        :logs="logs"
                        :isOwnMessage="isOwnMessage"
                        :getDisplayName="getDisplayName"
                />
            </div>

            <TicketMessageInput
                    v-model="newMessage"
                    :canWrite="canWrite"
                    @submit="sendLog"
            />
        </section>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/ticket.css';
</style>