<script setup lang="ts">
    import { CalendarDays, Clock3, FileText, UserRound } from 'lucide-vue-next'
    import BaseButton from '@/components/base/BaseButton.vue'
    import { Badge } from '@/components/ui/badge'
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
    import { TicketStatus } from '@/enums/ticketStatus'
    import { formatDate, formatTime, truncate } from '@/shared/utils/utils'
    import { cn } from '@/lib/utils'
    import type { TicketListItem } from '@/modules/ticket/types/ticket-list-item'

    const props = withDefaults(defineProps<{
        ticket: TicketListItem
        showUser?: boolean
        canTake?: boolean
    }>(), {
        showUser: false,
        canTake: false
    })

    const emit = defineEmits<{
        (event: 'click', ticketId: number): void
        (event: 'take', ticket: TicketListItem): void
    }>()

    const handleClick = (): void => {
        emit('click', props.ticket.getId())
    }

    const handleTake = (): void => {
        emit('take', props.ticket)
    }

    const getStatusClasses = (statusId: number): string => {
        if (statusId === TicketStatus.Pending) {
            return 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
        }

        if (statusId === TicketStatus.Review) {
            return 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400'
        }

        if (statusId === TicketStatus.Resolved) {
            return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
        }

        return 'border-border bg-secondary text-secondary-foreground'
    }
</script>

<template>
    <Card
            class="group min-w-0 cursor-pointer rounded-3xl border-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            @click="handleClick"
    >
        <CardHeader class="space-y-4">
            <div class="flex min-w-0 items-start justify-between gap-4">
                <div class="min-w-0 space-y-1">
                    <CardTitle class="wrap-break-word text-xl leading-tight">
                        {{ ticket.getTypeName() }}
                    </CardTitle>
                    <p class="text-sm text-muted-foreground">
                        Заявка #{{ ticket.getId() }}
                    </p>
                </div>

                <Badge
                        variant="outline"
                        :class="cn('shrink-0 rounded-full px-3 py-1 text-xs font-medium', getStatusClasses(ticket.getStatusId()))"
                >
                    {{ ticket.getStatusName() }}
                </Badge>
            </div>
        </CardHeader>

        <CardContent class="space-y-4">
            <div class="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <div
                        v-if="showUser"
                        class="flex min-w-0 items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2"
                >
                    <UserRound class="size-4 shrink-0 text-foreground"/>
                    <span class="truncate">
                        {{ ticket.getSenderName() }}
                    </span>
                </div>

                <div class="flex min-w-0 items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
                    <CalendarDays class="size-4 shrink-0 text-foreground"/>
                    <span class="truncate">{{ formatDate(ticket.getCreatedAt()) }}</span>
                </div>

                <div class="flex min-w-0 items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
                    <Clock3 class="size-4 shrink-0 text-foreground"/>
                    <span class="truncate">{{ formatTime(ticket.getCreatedAt()) }}</span>
                </div>
            </div>

            <div class="min-w-0 rounded-2xl border bg-background/70 p-4">
                <div class="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText class="size-4 shrink-0"/>
                    Описание
                </div>

                <p class="overflow-hidden wrap-break-word text-sm leading-6 text-muted-foreground">
                    {{ truncate(ticket.getDescription(), 140) }}
                </p>
            </div>
        </CardContent>

        <CardFooter v-if="canTake" class="pt-0">
            <BaseButton
                    variant="primary"
                    size="sm"
                    @click.stop="handleTake"
            >
                Взять в работу
            </BaseButton>
        </CardFooter>
    </Card>
</template>