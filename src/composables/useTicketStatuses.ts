import { ref } from 'vue'
import { getAllTicketStatuses } from '@/utils/requests'
import { getUser } from '@/user/data'

interface TicketStatusOption {
  id: number
  name: string
}

export const useTicketStatuses = () => {
  const statuses = ref<TicketStatusOption[]>([])

  const loadStatuses = async () => {
    const token = getUser().getToken()
    const res = await getAllTicketStatuses(token)

    if (res.ok) {
      const json = await res.json()
      statuses.value = [{ id: 0, name: 'Все статусы' }, ...(json.data ?? [])]
    }
  }

  return {
    statuses,
    loadStatuses
  }
}
