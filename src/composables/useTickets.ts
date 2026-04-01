import { ref } from 'vue'
import { mapTickets } from '@/ticket/data'
import { getUser } from '@/user/data'

export const useTickets = (api: Function) => {
  const tickets = ref<any[]>([])

  const load = async (page: number, setMeta: Function) => {
    const token = getUser().getToken()
    const res = await api(token, page)

    if (!res.ok) return

    const json = await res.json()

    tickets.value = mapTickets(json.data ?? [])
    setMeta(json.meta)
  }

  return { tickets, load }
}
