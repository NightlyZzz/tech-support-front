import { ref } from 'vue'
import { mapTickets } from '@/ticket/data.ts'
import { getUser } from '@/user/data.ts'
import type { Ticket } from '@/ticket/ticket.ts'

type ApiFunction = (token: string, page: number) => Promise<Response>
type SetMetaFunction = (meta: any) => void

export const useTickets = (api: ApiFunction) => {
  const tickets = ref<Ticket[]>([])

  const load = async (page: number, setMeta: SetMetaFunction): Promise<void> => {
    const token = getUser().getToken()
    const res = await api(token, page)

    if (!res.ok) return

    const json = await res.json()

    tickets.value = mapTickets(json.data ?? [])
    setMeta(json.meta)
  }

  return { tickets, load }
}
