import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTicketAccess } from '@/modules/ticket/composables/useTicketAccess'
import { useTicketChat } from '@/modules/ticket/composables/useTicketChat'
import { useTicketDetails } from '@/modules/ticket/composables/useTicketDetails'
import { useTicketStatuses } from '@/modules/ticket/composables/useTicketStatuses'
import { useTicketMeta } from '@/modules/ticket/composables/useTicketMeta'
import { useTicketMessages } from '@/modules/ticket/composables/useTicketMessages'
import { useTicketPage } from '@/modules/ticket/composables/useTicketPage'
import { useUser } from '@/modules/user/composables/useUser'

export const useTicketLogPage = () => {
    const route = useRoute()
    const router = useRouter()
    const ticketId = Number(route.params.id)

    const { user } = useUser()

    const {
        logs,
        newMessage,
        chatBox,
        loadLogs,
        sendLog
    } = useTicketChat(ticketId)

    const {
        ticket,
        assignedEmployeeId,
        ticketSenderId,
        loadTicket,
        updateStatus
    } = useTicketDetails(ticketId)

    const { statuses: allStatuses, loadStatuses } = useTicketStatuses()

    const ticketStatus = computed({
        get: () => ticket.value?.getStatusId() ?? null,
        set: (nextStatusId: number | null) => {
            if (!ticket.value || nextStatusId === null) {
                return
            }

            ticket.value.setStatus(nextStatusId)
        }
    })

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
    } = useTicketAccess(ticketStatus, assignedEmployeeId, ticketSenderId)

    const displayedUserName = computed(() => {
        if (!currentUser.value || !ticket.value) {
            return ''
        }

        return ticket.value.getSenderId() === currentUser.value.getId()
                ? 'Вы'
                : ticket.value.getSenderName()
    })

    const handleStatusSelectChange = (selectedValue: string | number | null) => {
        if (selectedValue === null) {
            return
        }

        handleStatusChange(Number(selectedValue))
    }

    const redirectIfTicketBecameUnavailable = async () => {
        if (ticket.value === null) {
            return
        }

        if (canOpen.value) {
            return
        }

        if (router.currentRoute.value.name !== 'profile') {
            await router.replace({ name: 'profile' })
        }
    }

    watch(
            [
                () => user.value?.getRole(),
                () => user.value?.getId(),
                () => ticket.value?.getEmployeeId(),
                () => ticket.value?.getSenderId(),
                () => ticket.value?.getStatusId()
            ],
            async () => {
                await redirectIfTicketBecameUnavailable()
            },
            { immediate: true }
    )

    useTicketPage(loadTicket, loadLogs, loadStatuses, canOpen)

    return {
        ticketId,
        ticket,
        logs,
        newMessage,
        chatBox,
        currentUser,
        allStatuses,
        ticketStatus,
        currentStatusName,
        canOpen,
        canWrite,
        displayedUserName,
        formatPhoneNumber,
        getStatusBadge,
        isOwnMessage,
        getDisplayName,
        sendLog,
        handleStatusSelectChange
    }
}