import { ref } from 'vue'
import { getTicket, updateTicket } from '@/api/ticket.api.ts'
import router from "@/router";

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
        try {
            const response = await getTicket(ticketId)

            ticketStatus.value = response.data.status_id
            ticketSenderId.value = response.data.user_id
            ticketSenderName.value = response.data.user_name
            ticketType.value = response.data.type_name
            ticketDescription.value = response.data.description
            contactPhone.value = response.data.phone
            createdAt.value = response.data.created_at
            assignedEmployeeId.value = response.data.assigned_employee_id
        } catch (error: any) {
            if (error.response?.status === 403 || error.response?.status === 404) {
                await router.push({ name: 'home' })
            }
        }
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
