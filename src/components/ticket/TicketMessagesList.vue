<script setup lang="ts">
    import type { TicketMessage } from '@/modules/ticket/composables/useTicketMessages'
    import { cn } from '@/lib/utils'

    defineProps<{
        logs: TicketMessage[]
        isOwnMessage: (message: TicketMessage) => boolean
        getDisplayName: (message: TicketMessage) => string
    }>()

    const formatMessageTime = (createdAt: string): string => {
        return new Date(createdAt).toLocaleString('ru-RU')
    }
</script>

<template>
    <div
            v-if="logs.length === 0"
            class="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed bg-background/70 px-6 py-10 text-center text-sm text-muted-foreground"
    >
        Сообщений пока нет
    </div>

    <div v-else class="flex flex-col gap-4">
        <div
                v-for="message in logs"
                :key="message.id"
                :class="cn('flex', isOwnMessage(message) ? 'justify-end' : 'justify-start')"
        >
            <div class="flex max-w-[85%] flex-col gap-1">
                <div
                        :class="cn(
                        'px-1 text-xs',
                        isOwnMessage(message) ? 'text-right text-muted-foreground' : 'text-left text-muted-foreground'
                    )"
                >
                    {{ getDisplayName(message) }}
                </div>

                <div
                        :class="cn(
                        'rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm',
                        isOwnMessage(message)
                            ? 'rounded-br-md bg-primary text-primary-foreground'
                            : 'rounded-bl-md border bg-card text-card-foreground'
                    )"
                >
                    {{ message.message }}
                </div>

                <div
                        :class="cn(
                        'px-1 text-[11px] text-muted-foreground',
                        isOwnMessage(message) ? 'text-right' : 'text-left'
                    )"
                >
                    {{ formatMessageTime(message.created_at) }}
                </div>
            </div>
        </div>
    </div>
</template>