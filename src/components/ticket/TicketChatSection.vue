<script setup lang="ts">
    import type { TicketMessage } from '@/modules/ticket/composables/useTicketMessages'
    import TicketMessagesList from '@/components/ticket/TicketMessagesList.vue'
    import TicketMessageInput from '@/components/ticket/TicketMessageInput.vue'

    const message = defineModel<string>({
        required: true
    })

    defineProps<{
        logs: TicketMessage[]
        chatBox: HTMLElement | null
        canWrite: boolean
        ticketStatus: number | null
        currentStatusName: string
        getStatusBadge: (statusId: number) => string
        isOwnMessage: (message: TicketMessage) => boolean
        getDisplayName: (message: TicketMessage) => string
    }>()

    const emit = defineEmits<{
        (event: 'submit'): void
    }>()
</script>

<template>
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
                v-model="message"
                :canWrite="canWrite"
                @submit="emit('submit')"
        />
    </section>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/ticket.css';
</style>