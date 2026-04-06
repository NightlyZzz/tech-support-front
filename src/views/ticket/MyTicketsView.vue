<script setup lang="ts">
    import BasePagination from '@/components/base/BasePagination.vue'
    import BaseSelect from '@/components/base/BaseSelect.vue'
    import TicketList from '@/components/ticket/TicketList.vue'
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
    <div class="page">
        <div class="page-header">
            <h1 class="page-title">Мои заявки</h1>
            <span class="page-counter">{{ filteredTickets.length }} шт.</span>
        </div>

        <BaseSelect
                id="status-filter"
                v-model="selectedStatus"
                label="Статус"
                placeholder="Выберите статус"
                :items="availableStatusesWithAll"
                value-key="id"
                label-key="name"
        />

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

<style scoped>
    @import '@/assets/list.css';
    @import '@/assets/ticket.css';
</style>