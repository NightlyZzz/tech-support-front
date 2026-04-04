<script setup lang="ts">
    import { useAllTicketsPage } from '@/modules/ticket/composables/useAllTicketsPage'
    import BaseSelect from '@/components/BaseSelect.vue'
    import BasePagination from '@/components/BasePagination.vue'
    import TicketList from '@/components/ticket/TicketList.vue'

    const {
        selectedStatus,
        currentPage,
        lastPage,
        loadPage,
        statusesWithAll,
        filteredTickets,
        openTicket,
        takeToReview,
        isEmployee
    } = useAllTicketsPage()
</script>

<template>
    <div class="page">
        <div class="page-header">
            <h1 class="page-title">Все заявки</h1>
            <span>{{ filteredTickets.length }} шт.</span>
        </div>

        <BaseSelect
                id="status-filter"
                label="Статус"
                placeholder="Выберите статус"
                :items="statusesWithAll"
                v-model="selectedStatus"
                valueKey="id"
                labelKey="name"
        />

        <TicketList
                :tickets="filteredTickets"
                :showUser="true"
                :canTake="isEmployee"
                @click="openTicket"
                @take="takeToReview"
        />

        <BasePagination
                v-model="currentPage"
                :last-page="lastPage"
        />
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>