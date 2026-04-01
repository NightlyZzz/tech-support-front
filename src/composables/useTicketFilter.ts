import { computed } from 'vue'

export const useTicketFilter = (tickets: any, selectedStatus: any) => {
  return computed(() => {
    if (selectedStatus.value === 0) {
      return tickets.value
    }

    return tickets.value.filter(
      (t: any) => t.getStatusId() === selectedStatus.value
    )
  })
}
