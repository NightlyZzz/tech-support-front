<template>
  <div class="ticket-layout">
    <aside class="ticket-panel">
      <div class="ticket-panel-card">
        <p class="ticket-panel-title">Заявка</p>
        <div class="ticket-id-label">#{{ ticketId }}</div>

        <div class="ticket-field">
          <span class="ticket-field-label">Тип</span>
          <span class="ticket-field-value">{{ ticketType }}</span>
        </div>

        <div class="ticket-field">
          <span class="ticket-field-label">Пользователь</span>
          <span class="ticket-field-value">
            {{ ticketSenderId === currentUser.getId() ? 'Вы' : ticketSenderName }}
          </span>
        </div>

        <div class="ticket-field">
          <span class="ticket-field-label">Телефон</span>
          <span class="ticket-field-value mono">{{ formatPhoneNumber(contactPhone) }}</span>
        </div>

        <div class="ticket-field">
          <span class="ticket-field-label">Создана</span>
          <span class="ticket-field-value">{{ createdAt }}</span>
        </div>

        <div class="ticket-divider"></div>

        <div class="ticket-field">
          <span class="ticket-field-label">Описание</span>
          <span class="ticket-field-value"
                style="white-space:pre-wrap;line-height:1.6;">{{ ticketDescription }}</span>
        </div>
      </div>

      <div
        class="ticket-panel-card status-select-wrapper"
        v-if="getUser().role !== Role.User && ticketStatus !== null"
      >
        <p class="ticket-panel-title">Статус заявки</p>
        <span :class="['badge', statusBadgeClass(ticketStatus)]"
              style="margin-bottom:12px;display:inline-flex;">
          {{ currentStatusName }}
        </span>
        <Select
          id="status"
          label="Изменить статус"
          placeholder="Выберите статус"
          :items="allStatuses"
          :modelValue="ticketStatus"
          valueKey="id"
          labelKey="name"
          @update:modelValue="(val) => { ticketStatus = Number(val); updateStatus() }"
        />
      </div>
    </aside>

    <section class="ticket-chat">
      <div class="ticket-chat-header">
        <div>
          <div class="ticket-chat-header-title">Переписка</div>
          <div class="ticket-chat-header-sub">{{ logs.length }} сообщений</div>
        </div>
        <span v-if="ticketStatus !== null" :class="['badge', statusBadgeClass(ticketStatus)]">
          {{ currentStatusName }}
        </span>
      </div>

      <div class="ticket-messages" ref="chatBox">
        <div
          v-for="log in logs"
          :key="log.id"
          :class="['msg-row', isOwnMessage(log) ? 'own' : '']"
        >
          <div class="msg-bubble-wrap">
            <div class="msg-meta">{{ getDisplayName(log) }}</div>
            <div class="msg-bubble">{{ log.message }}</div>
            <div class="msg-time">{{ new Date(log.created_at).toLocaleString('ru-RU') }}</div>
          </div>
        </div>
      </div>

      <form
        class="ticket-input-area"
        @submit.prevent="sendLog"
        v-if="ticketStatus !== TicketStatus.Resolved"
      >
        <input
          v-model="newMessage"
          type="text"
          placeholder="Введите сообщение…"
          class="ticket-input"
        />
        <button type="submit" class="btn btn--primary" :disabled="!newMessage.trim()">
          Отправить
        </button>
      </form>

      <div v-else class="ticket-closed">
        Переписка по этой заявке закрыта
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getUser } from '@/user/data'
import { TicketStatus } from '@/enums/ticketStatus'
import Select from '@/components/Select.vue'
import { Role } from '@/enums/role'

import { useTicketChat } from '@/composables/useTicketChat'
import { useTicketDetails } from '@/composables/useTicketDetails'
import { useTicketPolling } from '@/composables/useTicketPolling'
import { useTicketStatuses } from '@/composables/useTicketStatuses'

const route = useRoute()
const ticketId = Number(route.params.id)
const currentUser = getUser()

const {
  logs,
  newMessage,
  chatBox,
  loadLogs,
  sendLog
} = useTicketChat(ticketId)

const {
  ticketStatus,
  ticketSenderId,
  ticketSenderName,
  ticketType,
  ticketDescription,
  contactPhone,
  createdAt,
  loadTicket,
  updateStatus
} = useTicketDetails(ticketId)

const { statuses: allStatuses, loadStatuses } = useTicketStatuses()

const currentStatusName = computed(() => {
  if (ticketStatus.value === null) return ''
  return allStatuses.value.find(s => s.id === ticketStatus.value)?.name || ''
})

const isOwnMessage = (log: any): boolean =>
  log.sender_id === currentUser.getId() ||
  log.employee_id === currentUser.getId()

const getDisplayName = (log: any): string => {
  if (isOwnMessage(log)) return 'Вы'
  if (log.sender_id !== null) return log.sender_name
  if (log.employee_id !== null) return 'Сотрудник #' + log.employee_id
  return 'Удалённый пользователь'
}

const statusBadgeClass = (id: number) => {
  if (id === TicketStatus.Pending) return 'badge--pending'
  if (id === TicketStatus.Review) return 'badge--review'
  if (id === TicketStatus.Resolved) return 'badge--resolved'
  return ''
}

const formatPhoneNumber = (phone: string): string => {
  const d = phone.replace(/\D/g, '').replace(/^8/, '7')
  if (d.length < 10) return phone
  return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`
}

const loadAll = async () => {
  await loadTicket()
  await loadLogs()
  await loadStatuses()
}

onMounted(loadAll)

useTicketPolling(loadAll, 3000)
</script>

<style scoped>
@import '@/assets/base.css';
@import '@/assets/ticket.css';
</style>
