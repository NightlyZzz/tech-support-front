import { computed, type Ref } from 'vue'
import type { Ticket } from '@/ticket/ticket'

export const useTicketFilter = (
        tickets: Ref<Ticket[], Ticket[]>,
        selectedStatus: Ref<number>
) => {
    return computed(() => {
        if (selectedStatus.value === 0) {
            return tickets.value
        }

        return tickets.value.filter(ticket =>
                ticket.getStatusId() === selectedStatus.value
        )
    })
}