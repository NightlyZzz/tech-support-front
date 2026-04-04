import { ref, computed } from 'vue'
import { getTicket, updateTicket } from '@/modules/ticket/api/ticket.api'
import { mapTicket } from '@/modules/ticket/model/mapTicket'
import { Ticket } from '@/modules/ticket/model/ticket'

export const useTicketDetails = (ticketId: number) => {
    const ticket = ref<Ticket | null>(null)

    const loadTicket = async () => {
        const ticketData = await getTicket(ticketId)
        ticket.value = mapTicket(ticketData)
    }

    const updateStatus = async () => {
        if (!ticket.value) {
            return
        }

        await updateTicket(ticketId, {
            ticket_status_id: ticket.value.getStatusId()
        })
    }

    const ticketStatus = computed(() => ticket.value?.getStatusId() ?? null)
    const ticketSenderId = computed(() => ticket.value?.getSenderId() ?? null)
    const ticketSenderName = computed(() => ticket.value?.getSenderName() ?? '')
    const ticketType = computed(() => ticket.value?.getTypeName() ?? '')
    const ticketDescription = computed(() => ticket.value?.getDescription() ?? '')
    const contactPhone = computed(() => ticket.value?.getContactPhone() ?? '')
    const createdAt = computed(() => ticket.value?.getCreatedAt() ?? '')
    const assignedEmployeeId = computed(() => ticket.value?.getEmployeeId() ?? null)

    return {
        ticket,
        ticketStatus,
        ticketSenderId,
        ticketSenderName,
        ticketType,
        ticketDescription,
        contactPhone,
        createdAt,
        assignedEmployeeId,
        loadTicket,
        updateStatus
    }
}