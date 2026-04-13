<script setup lang="ts">
    import { ClipboardList } from 'lucide-vue-next'
    import BasePagination from '@/components/base/BasePagination.vue'
    import BaseSelect from '@/components/base/BaseSelect.vue'
    import TicketList from '@/components/ticket/TicketList.vue'
    import { Badge } from '@/components/ui/badge'
    import { useMyTicketsPage } from '@/modules/ticket/composables/useMyTicketsPage'

    const {
        selectedStatus,
        currentPage,
        lastPage,
        availableStatusesWithAll,
        filteredTickets,
        openTicket,
        isEmployee
    } = useMyTicketsPage()
</script>

<template>
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section class="rounded-3xl border bg-card/95 p-6 shadow-sm">
            <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div class="flex items-start gap-4">
                    <div class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ClipboardList class="size-7"/>
                    </div>

                    <div class="space-y-3">
                        <div class="space-y-1">
                            <h1 class="text-3xl font-semibold tracking-tight">
                                Мои заявки
                            </h1>
                            <p class="text-sm text-muted-foreground">
                                Список обращений с актуальными статусами и быстрым переходом в карточку заявки
                            </p>
                        </div>

                        <Badge variant="secondary" class="rounded-full px-3 py-1">
                            {{ filteredTickets.length }} шт.
                        </Badge>
                    </div>
                </div>
            </div>
        </section>

        <section class="rounded-3xl border bg-card p-5 shadow-sm">
            <div class="max-w-sm">
                <BaseSelect
                        id="status-filter"
                        v-model="selectedStatus"
                        label="Статус"
                        placeholder="Выберите статус"
                        :items="availableStatusesWithAll"
                        value-key="id"
                        label-key="name"
                />
            </div>
        </section>

        <TicketList
                :tickets="filteredTickets"
                :show-user="isEmployee"
                @click="openTicket"
        />

        <BasePagination
                v-if="lastPage > 1"
                v-model="currentPage"
                :last-page="lastPage"
        />
    </div>
</template>