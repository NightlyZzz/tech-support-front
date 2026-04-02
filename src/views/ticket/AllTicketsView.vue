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
                :onClick="openTicket"
                :onTake="takeToReview"
                :showUser="true"
                :canTake="isEmployee"
        />

        <BasePagination
                :current-page="currentPage"
                :last-page="lastPage"
                @change="loadPage"
        />
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import { getAllTickets, updateTicket } from '@/api/ticket.api.ts'
    import { useUser } from '@/composables/user/useUser'
    import { usePagination } from '@/composables/common/usePagination'
    import { useTickets } from '@/composables/ticket/useTickets'
    import { usePaginationLoader } from '@/composables/common/usePaginationLoader'
    import { useTicketStatuses } from '@/composables/ticket/useTicketStatuses'
    import { useTicketFilter } from '@/composables/ticket/useTicketFilter'
    import router from '@/router'
    import BaseSelect from '@/components/BaseSelect.vue'
    import BasePagination from '@/components/BasePagination.vue'
    import TicketList from '@/components/ticket/TicketList.vue'
    import { Ticket } from '@/ticket/ticket'

    const { user, isEmployee } = useUser()

    const selectedStatus = ref<number>(0)

    const { currentPage, lastPage, setMeta } = usePagination()
    const { tickets, load } = useTickets(getAllTickets)
    const { loadPage } = usePaginationLoader(currentPage, load, setMeta)
    const { statuses, loadStatuses } = useTicketStatuses()

    const statusesWithAll = computed(() => {
        return [{ id: 0, name: 'Все статусы' }, ...statuses.value]
    })

    const filteredTickets = useTicketFilter(tickets, selectedStatus)

    const openTicket = (ticketId: number) => {
        if (isEmployee.value) {
            router.push({ name: 'ticket', params: { id: ticketId } })
        }
    }

    const takeToReview = async (ticket: Ticket) => {
        try {
            if (!user.value) {
                return
            }

            await updateTicket(
                    ticket.getId(),
                    { employee_id: user.value.getId() }
            )

            ticket.setReview()
        } catch (error) {
            console.error('Ошибка при взятии заявки', error)
        }
    }

    onMounted(async () => {
        await load(currentPage.value, setMeta)
        await loadStatuses()
    })
</script>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>
