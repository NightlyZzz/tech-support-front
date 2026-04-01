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
      :onClick="openTicket"
      :showUser="isEmployee()"
    />

    <AppPagination
      :current-page="currentPage"
      :last-page="lastPage"
      @change="loadPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getMyTickets } from '@/utils/requests'
import { isEmployee } from '@/utils/utils'
import { getUser } from '@/user/data'
import { Role } from '@/enums/role'
import { TicketStatus } from '@/enums/ticketStatus'
import { usePagination } from '@/composables/usePagination'
import { useTickets } from '@/composables/useTickets'
import { usePaginationLoader } from '@/composables/usePaginationLoader'
import { useTicketStatuses } from '@/composables/useTicketStatuses'
import { useTicketFilter } from '@/composables/useTicketFilter'
import router from '@/router'
import BaseSelect from '@/components/BaseSelect.vue'
import AppPagination from '@/components/AppPagination.vue'
import TicketList from '@/components/ticket/TicketList.vue'

const selectedStatus = ref<number>(0)

const { currentPage, lastPage, setMeta } = usePagination()
const { tickets, load } = useTickets(getMyTickets)
const { loadPage } = usePaginationLoader(currentPage, load, setMeta)
const { statuses, loadStatuses } = useTicketStatuses()

const currentUser = (() => {
  const user = getUser()
  if (!user) {
    throw new Error('User not authorized')
  }
  return user
})()

const availableStatuses = computed(() => {
  if (currentUser.role === Role.User) {
    return statuses.value
  }

  return statuses.value.filter((statusItem) => {
    return statusItem.id !== TicketStatus.Pending
  })
})

const availableStatusesWithAll = computed(() => {
  return [
    { id: 0, name: 'Все статусы' },
    ...availableStatuses.value
  ]
})

const filteredTickets = useTicketFilter(tickets, selectedStatus)

const openTicket = (ticketId: number): void => {
  router.push({ name: 'ticket', params: { id: ticketId } })
}

onMounted(async (): Promise<void> => {
  await load(currentPage.value, setMeta)
  await loadStatuses()
})
</script>

<style scoped>
@import '@/assets/base.css';
@import '@/assets/list.css';
</style>
