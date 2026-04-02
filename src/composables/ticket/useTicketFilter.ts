import { computed, type Ref } from 'vue'
import { Ticket } from '@/ticket/ticket'

export const useTicketFilter = (
    tickets: Ref<Ticket[]>,
    selectedStatus: Ref<number>
) => {
    return computed(() => {
        if (selectedStatus.value === 0) {
            return tickets.value
        }

        return tickets.value.filter((ticket: Ticket) => {
            return ticket.getStatusId() === selectedStatus.value;
        })
    })
}
