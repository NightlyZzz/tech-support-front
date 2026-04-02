import { ref } from 'vue'
import { getTicket, updateTicket } from '@/api/ticket.api.ts'

export const useTicketDetails = (ticketId: number) => {
    const ticketStatus = ref<number | null>(null)
    const ticketSenderId = ref<number | null>(null)
    const ticketSenderName = ref('')
    const ticketType = ref('')
    const ticketDescription = ref('')
    const contactPhone = ref('')
    const createdAt = ref('')
    const assignedEmployeeId = ref<number | null>(null)

    const loadTicket = async () => {
        const response = await getTicket(ticketId)
        const data = response.data

        ticketStatus.value = data.status_id ?? null
        ticketSenderId.value = data.user_id ?? null
        ticketSenderName.value = data.user_name ?? ''
        ticketType.value = data.type_name ?? ''
        ticketDescription.value = data.description ?? ''
        contactPhone.value = data.contact_phone ?? ''
        createdAt.value = data.created_at ?? ''
        assignedEmployeeId.value = data.assigned_employee_id ?? null
    }

    const updateStatus = async () => {
        await updateTicket(ticketId, { ticket_status_id: ticketStatus.value })
    }

    return {
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