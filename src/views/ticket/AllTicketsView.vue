<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Все заявки</h1>
      <span>{{ filteredTickets.length }} шт.</span>
    </div>

    <Select
      id="status-filter"
      label="Статус"
      placeholder="Выберите статус"
      :items="statuses"
      v-model="selectedStatus"
      valueKey="id"
      labelKey="name"
    />

    <TicketList
      :tickets="filteredTickets"
      :onClick="openTicket"
      :onTake="takeToReview"
      :showUser="true"
      :canTake="isEmployee()"
    />

    <AppPagination
      :current-page="currentPage"
      :last-page="lastPage"
      @change="loadPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllTickets, updateTicket } from '@/utils/requests'
import { getUser } from '@/user/data'
import { isEmployee } from '@/utils/utils'
import { usePagination } from '@/composables/usePagination'
import { useTickets } from '@/composables/useTickets'
import { usePaginationLoader } from '@/composables/usePaginationLoader'
import { useTicketStatuses } from '@/composables/useTicketStatuses'
import { useTicketFilter } from '@/composables/useTicketFilter'
import router from '@/router'
import Select from '@/components/Select.vue'
import AppPagination from '@/components/AppPagination.vue'
import TicketList from '@/components/ticket/TicketList.vue'
import { Ticket } from '@/ticket/ticket'

const selectedStatus = ref<number>(0)

const { currentPage, lastPage, setMeta } = usePagination()
const { tickets, load } = useTickets(getAllTickets)
const { loadPage } = usePaginationLoader(currentPage, load, setMeta)

const { statuses, loadStatuses } = useTicketStatuses()

const filteredTickets = useTicketFilter(tickets, selectedStatus)

const openTicket = (id: number) => {
  if (isEmployee()) {
    router.push({ name: 'ticket', params: { id } })
  }
}

const takeToReview = async (ticket: Ticket) => {
  const user = getUser()
  const res = await updateTicket(
    ticket.getId(),
    { employee_id: user.getId() },
    user.getToken()
  )

  if (!res.ok) return

  ticket.setReview()
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
