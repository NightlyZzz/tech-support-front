<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Все заявки</h1>
      <span style="font-size:.875rem;color:var(--c-text-3);">
        {{ filteredTickets.length }} шт.
      </span>
    </div>

    <Select
      id="status-filter"
      label="Статус"
      placeholder="Все статусы"
      :items="statuses"
      v-model="selectedStatus"
      valueKey="id"
      labelKey="name"
    />

    <div v-if="filteredTickets.length === 0" class="empty-state">
      Заявок с выбранным статусом нет
    </div>

    <div v-else style="display:flex;flex-direction:column;gap:12px;min-width:0;">
      <div
        v-for="(ticket, index) in filteredTickets"
        :key="ticket.id"
        class="ticket-card animate-in"
        :style="{ animationDelay: index * 0.05 + 's' }"
        @click="openTicket(ticket.id)"
      >
        <div class="ticket-card-head">
          <div>
            <div class="ticket-card-title">{{ ticket.type_name }}</div>
            <div class="ticket-card-id">#{{ ticket.id }}</div>
          </div>
          <span :class="['badge', statusBadgeClass(ticket.status_id)]">
            {{ ticket.status_name }}
          </span>
        </div>

        <div class="ticket-card-meta">
          <div class="ticket-card-row">
            <b>Пользователь:</b>{{ ticket.sender_name }}
          </div>

          <div class="ticket-card-row">
            <b>Дата:</b>{{ formatDate(ticket.created_at) }}
          </div>

          <div class="ticket-card-row">
            <b>Время:</b>{{ formatTime(ticket.created_at) }}
          </div>
        </div>

        <div class="ticket-card-desc">
          <b>Описание:</b> {{ truncate(ticket.description, 50) }}
        </div>

        <div
          v-if="isEmployee() && ticket.status_id === TicketStatus.Pending"
          class="ticket-card-actions"
        >
          <button class="btn btn--primary btn--sm" @click.stop="takeToReview(ticket)">
            Взять в работу
          </button>
        </div>
      </div>
    </div>

    <Pagination
      :current-page="currentPage"
      :last-page="lastPage"
      @change="loadPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getUser } from '@/user/data'
import { getAllTickets, getAllTicketStatuses, updateTicket } from '@/utils/requests'
import { isEmployee, truncate, formatDate, formatTime } from '@/utils/utils'
import router from '@/router'
import Select from '@/components/Select.vue'
import { TicketStatus } from '@/enums/ticketStatus'
import Pagination from "@/components/Pagination.vue";

interface Ticket {
  id: number
  description: string
  created_at: string
  type_name: string
  status_name: string
  status_id: number
  sender_name: string
}

interface TicketStatusOption {
  id: number
  name: string
}

const tickets = ref<Ticket[]>([])
const filteredTickets = ref<Ticket[]>([])
const statuses = ref<TicketStatusOption[]>([])
const selectedStatus = ref<number>(0)

const currentPage = ref(1)
const lastPage = ref(1)

const statusBadgeClass = (id: number) => {
  if (id === TicketStatus.Pending) return 'badge--pending'
  if (id === TicketStatus.Review) return 'badge--review'
  if (id === TicketStatus.Resolved) return 'badge--resolved'
  return ''
}

const openTicket = (id: number) => {
  if (isEmployee()) {
    router.push({name: 'ticket', params: {id}})
  }
}

const takeToReview = async (ticket: Ticket) => {
  const user = getUser()
  const response = await updateTicket(ticket.id, {employee_id: user.getId()}, user.getToken())

  if (response.ok) {
    ticket.status_name = 'На рассмотрении'
    ticket.status_id = TicketStatus.Review
    filterTickets()
  }
}

const filterTickets = () => {
  filteredTickets.value = Number(selectedStatus.value) === 0
    ? [...tickets.value]
    : tickets.value.filter(t => t.status_id === Number(selectedStatus.value))
}

const loadTickets = async () => {
  const token = getUser().getToken()
  const res = await getAllTickets(token, currentPage.value)

  if (!res.ok) return

  const json = await res.json()

  tickets.value = json.data ?? []

  const rawLastPage = json.meta?.last_page ?? 1
  lastPage.value = Array.isArray(rawLastPage) ? rawLastPage[0] : rawLastPage

  if (currentPage.value > lastPage.value) {
    currentPage.value = lastPage.value || 1
  }

  filterTickets()
}

const loadPage = async (page: number) => {
  currentPage.value = page
  await loadTickets()
}

onMounted(async () => {
  const token = getUser().getToken()

  const [ticketRes, statusRes] = await Promise.all([
    getAllTickets(token, currentPage.value),
    getAllTicketStatuses(token)
  ])

  if (ticketRes.ok) {
    const json = await ticketRes.json()

    tickets.value = json.data ?? []

    const rawLastPage = json.meta?.last_page ?? 1
    lastPage.value = Array.isArray(rawLastPage) ? rawLastPage[0] : rawLastPage

    filteredTickets.value = [...tickets.value]
  }

  if (statusRes.ok) {
    const json = await statusRes.json()
    statuses.value = [{id: 0, name: 'Все статусы'}, ...(json.data ?? [])]
  }
})

watch(selectedStatus, filterTickets)
</script>

<style scoped>
@import '@/assets/base.css';
@import '@/assets/list.css';
</style>
