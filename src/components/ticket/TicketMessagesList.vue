<script setup lang="ts">
    import type { TicketMessage } from '@/modules/ticket/composables/useTicketMessages'

    defineProps<{
        logs: TicketMessage[]
        isOwnMessage: (message: TicketMessage) => boolean
        getDisplayName: (message: TicketMessage) => string
    }>()
</script>

<template>
    <div
            v-for="message in logs"
            :key="message.id"
            :class="['msg-row', isOwnMessage(message) ? 'own' : '']"
    >
        <div class="msg-bubble-wrap">
            <div class="msg-meta">{{ getDisplayName(message) }}</div>
            <div class="msg-bubble">{{ message.message }}</div>
            <div class="msg-time">
                {{ new Date(message.created_at).toLocaleString('ru-RU') }}
            </div>
        </div>
    </div>
</template>