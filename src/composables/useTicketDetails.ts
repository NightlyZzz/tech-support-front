import { ref } from 'vue'
import { getTicket, updateTicket } from '@/utils/requests'
import { getUser } from '@/user/data'

export const useTicketDetails = (ticketId: number) => {
  const ticketStatus = ref<number | null>(null)

  const ticketSenderId = ref<number | null>(null)
  const ticketSenderName = ref('')
  const ticketType = ref('')
  const ticketDescription = ref('')
  const contactPhone = ref('')
  const createdAt = ref('')

  const user = getUser()

  const loadTicket = async () => {
    const res = await getTicket(ticketId, user.getToken())

    if (res.ok) {
      const t = (await res.json()).data

      ticketStatus.value = t?.status_id ?? null
      ticketSenderName.value = t?.sender_name
      ticketSenderId.value = t?.sender_id
      ticketType.value = t?.type_name
      ticketDescription.value = t?.description
      contactPhone.value = t?.contact_phone || ''
      createdAt.value = new Date(t?.created_at).toLocaleString('ru-RU')
    }
  }

  const updateStatus = async () => {
    const res = await updateTicket(
      ticketId,
      { ticket_status_id: ticketStatus.value },
      user.getToken()
    )

    if (!res.ok) {
      console.error('Ошибка обновления статуса')
    }
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
