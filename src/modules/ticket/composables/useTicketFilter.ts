import { computed, type Ref } from 'vue'

type FilterableTicket = {
    getStatusId: () => number
}

export const useTicketFilter = <TTicket extends FilterableTicket>(
        tickets: Ref<TTicket[]>,
        selectedStatus: Ref<number>
) => {
    return computed(() => {
        if (selectedStatus.value === 0) {
            return tickets.value
        }

        return tickets.value.filter(ticketItem =>
                ticketItem.getStatusId() === selectedStatus.value
        )
    })
}