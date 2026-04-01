import { computed } from 'vue'
import { Ticket } from '@/ticket/ticket'

export const useTicketFilter = (tickets: any, selectedStatus: any) => {
  return computed(() => {
    let statusId = selectedStatus.value

    if (typeof statusId === 'object' && statusId !== null) {
      statusId = statusId.id
    }

    statusId = Number(statusId)

    if (statusId === 0) {
      return tickets.value
    }

    return tickets.value.filter((ticket: Ticket) => {
      const ticketStatusId = Number(ticket.getStatusId())
      return ticketStatusId === statusId;
    })
  })
}
