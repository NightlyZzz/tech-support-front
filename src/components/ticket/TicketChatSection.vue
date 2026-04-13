<script setup lang="ts">
    import type { ComponentPublicInstance } from 'vue'
    import { MessageSquare } from 'lucide-vue-next'
    import { Badge } from '@/components/ui/badge'
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card class="rounded-3xl">
        <CardHeader class="space-y-4">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-3">
                    <div class="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <MessageSquare class="size-5"/>
                    </div>

                    <div>
                        <CardTitle class="text-xl">
                            Переписка
                        </CardTitle>
                        <p class="text-sm text-muted-foreground">
                            {{ logs.length }} сообщений
                        </p>
                    </div>
                </div>

                <Badge
                        v-if="ticketStatus !== null"
                        variant="outline"
                        class="rounded-full px-3 py-1"
                >
                    {{ currentStatusName }}
                </Badge>
            </div>
        </CardHeader>

        <CardContent class="space-y-4">
            <div
                    :ref="setMessagesContainerRef"
                    class="max-h-[560px] min-h-[360px] overflow-y-auto rounded-2xl border bg-muted/20 p-4"
            >
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
        </CardContent>
    </Card>
</template>