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
          <span class="ticket-field-value mono">
            {{ formatPhoneNumber(contactPhone) }}
          </span>
        </div>

        <div class="ticket-field">
          <span class="ticket-field-label">Создана</span>
          <span class="ticket-field-value">{{ createdAt }}</span>
        </div>

        <div class="ticket-divider"></div>

        <div class="ticket-field">
          <span class="ticket-field-label">Описание</span>
          <span
            class="ticket-field-value"
            style="white-space:pre-wrap;line-height:1.6;"
          >
            {{ ticketDescription }}
          </span>
        </div>
      </div>

      <div
        class="ticket-panel-card status-select-wrapper"
        v-if="currentUser.role !== Role.User && ticketStatus !== null"
      >
        <p class="ticket-panel-title">Статус заявки</p>

        <span
          :class="['badge', statusBadgeClass(ticketStatus)]"
          style="margin-bottom:12px;display:inline-flex;"
        >
          {{ currentStatusName }}
        </span>

        <BaseSelect
          id="status"
          label="Изменить статус"
          placeholder="Выберите статус"
          :items="allStatuses"
          :modelValue="ticketStatus"
          valueKey="id"
          labelKey="name"
          @update:modelValue="handleStatusChange"
        />
      </div>
    </aside>

    <section class="ticket-chat">
      <div class="ticket-chat-header">
        <div>
          <div class="ticket-chat-header-title">Переписка</div>
          <div class="ticket-chat-header-sub">{{ logs.length }} сообщений</div>
        </div>

        <span
          v-if="ticketStatus !== null"
          :class="['badge', statusBadgeClass(ticketStatus)]"
        >
          {{ currentStatusName }}
        </span>
      </div>

      <div class="ticket-messages" ref="chatBox">
        <div
          v-for="message in logs"
          :key="message.id"
          :class="['msg-row', isOwnMessage(message) ? 'own' : '']"
        >
          <div class="msg-bubble-wrap">
            <div class="msg-meta">{{ getDisplayName(message) }}</div>
            <div class="msg-bubble">{{ message.message }}</div>
            <div class="msg-time">
              {{ new Date(message.created_at).toLocaleString('ru-RU') }}
            </div>
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

        <button
          type="submit"
          class="btn btn--primary"
          :disabled="!newMessage.trim()"
        >
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
import { Role } from '@/enums/role'
import BaseSelect from '@/components/BaseSelect.vue'

import { useTicketChat } from '@/composables/useTicketChat'
import { useTicketDetails } from '@/composables/useTicketDetails'
import { useTicketPolling } from '@/composables/useTicketPolling'
import { useTicketStatuses } from '@/composables/useTicketStatuses'

interface TicketLog {
  id: number
  message: string
  created_at: string
  sender_id: number | null
  sender_name: string
  employee_id: number | null
}

const route = useRoute()
const ticketId = Number(route.params.id)

const currentUser = (() => {
  const user = getUser()

  if (!user) {
    throw new Error('User not authorized')
  }

  return user
})()

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
  if (ticketStatus.value === null) {
    return ''
  }

  const status = allStatuses.value.find(
    (statusItem) => statusItem.id === ticketStatus.value
  )

  return status?.name || ''
})

const isOwnMessage = (message: TicketLog): boolean => {
  return (
    message.sender_id === currentUser.getId() ||
    message.employee_id === currentUser.getId()
  )
}

const getDisplayName = (message: TicketLog): string => {
  if (isOwnMessage(message)) {
    return 'Вы'
  }

  if (message.sender_id !== null) {
    return message.sender_name
  }

  if (message.employee_id !== null) {
    return 'Сотрудник #' + message.employee_id
  }

  return 'Удалённый пользователь'
}

const statusBadgeClass = (statusId: number): string => {
  if (statusId === TicketStatus.Pending) {
    return 'badge--pending'
  }

  if (statusId === TicketStatus.Review) {
    return 'badge--review'
  }

  if (statusId === TicketStatus.Resolved) {
    return 'badge--resolved'
  }

  return ''
}

const formatPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '').replace(/^8/, '7')

  if (digits.length < 10) {
    return phone
  }

  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
}

const handleStatusChange = (value: number): void => {
  ticketStatus.value = Number(value)
  updateStatus()
}

const loadAllData = async (): Promise<void> => {
  await loadTicket()
  await loadLogs()
  await loadStatuses()
}

onMounted(loadAllData)

useTicketPolling(loadAllData, 3000)
</script>

<style scoped>
@import '@/assets/base.css';
@import '@/assets/ticket.css';
</style>
