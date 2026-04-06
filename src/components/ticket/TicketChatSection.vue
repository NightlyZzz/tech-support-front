<script setup lang="ts">
    import type { ComponentPublicInstance } from 'vue'
    import TicketMessagesList from '@/components/ticket/TicketMessagesList.vue'
    import TicketMessageInput from '@/components/ticket/TicketMessageInput.vue'
    import type { TicketMessage } from '@/modules/ticket/composables/useTicketMessages'

    const message = defineModel<string>({
        required: true
    })

    const props = defineProps<{
        logs: TicketMessage[]
        setChatBoxElement: (element: HTMLElement | null) => void
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

    const setMessagesContainerRef = (
            element: Element | ComponentPublicInstance | null
    ): void => {
        props.setChatBoxElement(element instanceof HTMLElement ? element : null)
    }
</script>

<template>
    <section class="ticket-chat">
        <div class="ticket-chat-header">
            <div class="ticket-chat-header-text">
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

        <div :ref="setMessagesContainerRef" class="ticket-messages">
            <TicketMessagesList
                    :logs="logs"
                    :is-own-message="isOwnMessage"
                    :get-display-name="getDisplayName"
            />
        </div>

        <TicketMessageInput
                v-model="message"
                :can-write="canWrite"
                @submit="emit('submit')"
        />
    </section>
</template>

<style scoped>
    @import '@/assets/ticket.css';
</style>