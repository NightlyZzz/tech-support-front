<template>
  <div class="ticket-layout" v-if="canOpen">
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
            {{
              currentUser?.getId() && ticketSenderId === currentUser.getId() ? 'Вы' : ticketSenderName
            }}
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
          <span class="ticket-field-value" style="white-space:pre-wrap;line-height:1.6;">
            {{ ticketDescription }}
          </span>
        </div>
      </div>

      <div
        class="ticket-panel-card status-select-wrapper"
        v-if="currentUser?.getRole() !== Role.User && ticketStatus !== null"
      >
        <p class="ticket-panel-title">Статус заявки</p>

        <span
          :class="['badge', getStatusBadge(ticketStatus)]"
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
          :class="['badge', getStatusBadge(ticketStatus)]"
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
        v-if="canWrite"
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
          :disabled="!newMessage.trim() || !canWrite"
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { TicketStatus } from '@/enums/ticketStatus'
import { Role } from '@/enums/role'
import BaseSelect from '@/components/BaseSelect.vue'

import { useTicketChat } from '@/composables/ticket/useTicketChat'
import { useTicketDetails } from '@/composables/ticket/useTicketDetails'
import { useTicketStatuses } from '@/composables/ticket/useTicketStatuses'

import { useTicketMeta } from '@/composables/ticket/useTicketMeta'
import { useTicketMessages } from '@/composables/ticket/useTicketMessages'
import { useTicketPage } from '@/composables/ticket/useTicketPage'

const route = useRoute()
const ticketId = Number(route.params.id)

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
  updateStatus,
  assignedEmployeeId
} = useTicketDetails(ticketId)

const { statuses: allStatuses, loadStatuses } = useTicketStatuses()

const {
  currentUser,
  currentStatusName,
  formatPhoneNumber,
  handleStatusChange,
  getStatusBadge
} = useTicketMeta(ticketStatus, allStatuses, updateStatus)

const {
  isOwnMessage,
  getDisplayName
} = useTicketMessages(currentUser)

const canWrite = computed(() => {
  if (!currentUser.value) {
    return false
  }

  if (currentUser.value.getRole() === Role.User) {
    return ticketStatus.value !== TicketStatus.Resolved;
  }

  if (ticketStatus.value !== TicketStatus.Review) {
    return false
  }

  if (currentUser.value.getRole() === Role.Admin) {
    return true
  }

  return assignedEmployeeId.value === currentUser.value.getId();
})

const canOpen = computed(() => {
  if (!currentUser.value) {
    return false
  }

  if (currentUser.value.getRole() === Role.User) {
    return true
  }

  if (currentUser.value.getRole() === Role.Admin) {
    return true
  }

  return assignedEmployeeId.value === currentUser.value.getId();
})

useTicketPage(loadTicket, loadLogs, loadStatuses, canOpen)
</script>

<style scoped>
@import '@/assets/base.css';
@import '@/assets/ticket.css';
</style>
