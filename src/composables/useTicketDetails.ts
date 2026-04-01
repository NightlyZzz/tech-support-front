import { ref } from 'vue'
import { getTicket, updateTicket } from '@/utils/requests'

export const useTicketDetails = (ticketId: number) => {
  const ticketStatus = ref<number | null>(null)
  const ticketSenderId = ref<number | null>(null)
  const ticketSenderName = ref('')
  const ticketType = ref('')
  const ticketDescription = ref('')
  const contactPhone = ref('')
  const createdAt = ref('')

  const loadTicket = async () => {
    const t = (await getTicket(ticketId)).data

    ticketStatus.value = t?.status_id ?? null
    ticketSenderName.value = t?.sender_name
    ticketSenderId.value = t?.sender_id
    ticketType.value = t?.type_name
    ticketDescription.value = t?.description
    contactPhone.value = t?.contact_phone || ''
    createdAt.value = new Date(t?.created_at).toLocaleString('ru-RU')
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
    loadTicket,
    updateStatus
  }
}
