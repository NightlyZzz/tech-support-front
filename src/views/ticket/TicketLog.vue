<script setup lang="ts">
    import { useRoute } from 'vue-router'
    import { computed } from 'vue'
    import { Role } from '@/enums/role'
    import BaseSelect from '@/components/BaseSelect.vue'

    import { useTicketAccess } from '@/modules/ticket/composables/useTicketAccess'
    import { useTicketChat } from '@/modules/ticket/composables/useTicketChat'
    import { useTicketDetails } from '@/modules/ticket/composables/useTicketDetails'
    import { useTicketStatuses } from '@/modules/ticket/composables/useTicketStatuses'
    import { useTicketMeta } from '@/modules/ticket/composables/useTicketMeta'
    import { useTicketMessages } from '@/modules/ticket/composables/useTicketMessages'
    import { useTicketPage } from '@/modules/ticket/composables/useTicketPage'

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
        ticket,
        loadTicket,
        updateStatus
    } = useTicketDetails(ticketId)

    const { statuses: allStatuses, loadStatuses } = useTicketStatuses()

    const ticketStatus = computed({
        get: () => ticket.value?.getStatusId() ?? null,
        set: (value: number | null) => {
            if (!ticket.value || value === null) {
                return
            }

            ticket.value.setStatus(value)
        }
    })

    const assignedEmployeeId = computed(() => ticket.value?.getEmployeeId() ?? null)

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

    const {
        canOpen,
        canWrite
    } = useTicketAccess(ticketStatus, assignedEmployeeId)

    useTicketPage(loadTicket, loadLogs, loadStatuses, canOpen)
</script>

<template>
    <div class="ticket-layout" v-if="canOpen">
        <aside class="ticket-panel">
            <div class="ticket-panel-card">
                <p class="ticket-panel-title">Заявка</p>
                <div class="ticket-id-label">#{{ ticketId }}</div>

                <div class="ticket-field">
                    <span class="ticket-field-label">Тип</span>
                    <span class="ticket-field-value">{{ ticket?.getTypeName() }}</span>
                </div>

                <div class="ticket-field">
                    <span class="ticket-field-label">Пользователь</span>
                    <span class="ticket-field-value">
                        {{
                            currentUser?.getId() && ticket?.getSenderId() === currentUser.getId()
                                    ? 'Вы'
                                    : ticket?.getSenderName()
                        }}
                    </span>
                </div>

                <div class="ticket-field">
                    <span class="ticket-field-label">Телефон</span>
                    <span class="ticket-field-value mono">
                        {{ formatPhoneNumber(ticket?.getContactPhone() || '') }}
                    </span>
                </div>

                <div class="ticket-field">
                    <span class="ticket-field-label">Создана</span>
                    <span class="ticket-field-value">{{ ticket?.getCreatedAt() }}</span>
                </div>

                <div class="ticket-divider"></div>

                <div class="ticket-field">
                    <span class="ticket-field-label">Описание</span>
                    <span class="ticket-field-value" style="white-space:pre-wrap;line-height:1.6;">
                        {{ ticket?.getDescription() }}
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
                        @update:modelValue="(val) => handleStatusChange(Number(val))"
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

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/ticket.css';
</style>