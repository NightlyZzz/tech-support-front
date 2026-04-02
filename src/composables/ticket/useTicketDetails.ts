import { ref, computed } from 'vue'
import { getTicket, updateTicket } from '@/api/ticket.api.ts'
import { mapTicket } from '@/ticket/data'
import { Ticket } from '@/ticket/ticket'

export const useTicketDetails = (ticketId: number) => {
    const ticket = ref<Ticket | null>(null)

    const loadTicket = async () => {
        const response = await getTicket(ticketId)
        ticket.value = mapTicket(response.data)
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