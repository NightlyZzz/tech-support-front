<script setup lang="ts">
    import { useMyTicketsPage } from '@/modules/ticket/composables/useMyTicketsPage'
    import BaseSelect from '@/components/BaseSelect.vue'
    import BasePagination from '@/components/BasePagination.vue'
    import TicketList from '@/components/ticket/TicketList.vue'

    const {
        selectedStatus,
        currentPage,
        lastPage,
        loadPage,
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
            <span>{{ filteredTickets.length }} шт.</span>
        </div>

        <BaseSelect
                id="status-filter"
                label="Статус"
                placeholder="Выберите статус"
                :items="availableStatusesWithAll"
                v-model="selectedStatus"
                valueKey="id"
                labelKey="name"
        />

        <TicketList
                :tickets="filteredTickets"
                :showUser="isEmployee"
                @click="openTicket"
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