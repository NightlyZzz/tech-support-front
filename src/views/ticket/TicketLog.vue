<script setup lang="ts">
    import { Badge } from '@/components/ui/badge'
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
    <div
            v-if="canOpen"
            class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8"
    >
        <section class="rounded-3xl border bg-card/95 p-6 shadow-sm">
            <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div class="space-y-3">
                    <div class="space-y-1">
                        <h1 class="text-3xl font-semibold tracking-tight">
                            Заявка #{{ ticketId }}
                        </h1>
                        <p class="text-sm text-muted-foreground">
                            Просмотр информации по обращению и переписки по заявке
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <Badge
                                v-if="ticketStatus !== null"
                                variant="outline"
                                class="rounded-full px-3 py-1"
                        >
                            {{ currentStatusName }}
                        </Badge>

                        <Badge variant="secondary" class="rounded-full px-3 py-1">
                            {{ displayedUserName }}
                        </Badge>

                        <Badge variant="secondary" class="rounded-full px-3 py-1">
                            {{ logs.length }} сообщений
                        </Badge>
                    </div>
                </div>
            </div>
        </section>

        <div class="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
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
    </div>

    <div
            v-else
            class="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8"
    >
        <div class="rounded-2xl border bg-card px-6 py-4 text-sm text-muted-foreground shadow-sm">
            Заявка недоступна
        </div>
    </div>
</template>