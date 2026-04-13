<script setup lang="ts">
    import { computed } from 'vue'
    import { CalendarDays, FileText, Phone, Ticket, UserRound } from 'lucide-vue-next'
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
    import type { TicketInfoCardTicket } from '@/modules/ticket/types/ticket-info'

    const props = defineProps<{
        ticketId: number
        ticket: TicketInfoCardTicket | null
        displayedUserName: string
        formatPhoneNumber: (phoneNumber?: string | null) => string
    }>()

    const formattedPhoneNumber = computed(() => {
        return props.formatPhoneNumber(props.ticket?.getContactPhone() ?? '')
    })

    const createdAtText = computed(() => {
        return props.ticket?.getCreatedAtFormatted() ?? '—'
    })

    const descriptionText = computed(() => {
        return props.ticket?.getDescription() ?? '—'
    })

    const typeName = computed(() => {
        return props.ticket?.getTypeName() ?? '—'
    })
</script>

<template>
    <Card class="rounded-3xl">
        <CardHeader>
            <CardTitle class="text-xl">
                Заявка #{{ ticketId }}
            </CardTitle>
        </CardHeader>

        <CardContent class="space-y-4">
            <div class="grid gap-3 text-sm">
                <div class="flex items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3">
                    <Ticket class="size-4 text-foreground"/>
                    <div class="min-w-0">
                        <div class="text-xs text-muted-foreground">
                            Тип
                        </div>
                        <div class="truncate font-medium text-foreground">
                            {{ typeName }}
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3">
                    <UserRound class="size-4 text-foreground"/>
                    <div class="min-w-0">
                        <div class="text-xs text-muted-foreground">
                            Пользователь
                        </div>
                        <div class="truncate font-medium text-foreground">
                            {{ displayedUserName }}
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3">
                    <Phone class="size-4 text-foreground"/>
                    <div class="min-w-0">
                        <div class="text-xs text-muted-foreground">
                            Телефон
                        </div>
                        <div class="truncate font-medium text-foreground">
                            {{ formattedPhoneNumber }}
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3">
                    <CalendarDays class="size-4 text-foreground"/>
                    <div class="min-w-0">
                        <div class="text-xs text-muted-foreground">
                            Создана
                        </div>
                        <div class="truncate font-medium text-foreground">
                            {{ createdAtText }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-2xl border bg-background/70 p-4">
                <div class="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText class="size-4"/>
                    Описание
                </div>

                <p class="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {{ descriptionText }}
                </p>
            </div>
        </CardContent>
    </Card>
</template>