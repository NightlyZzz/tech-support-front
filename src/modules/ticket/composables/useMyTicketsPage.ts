import { ref, computed, onMounted } from 'vue'
import { useUser } from '@/modules/user/composables/useUser'
import { usePagination } from '@/composables/common/usePagination'
import { usePaginationLoader } from '@/composables/common/usePaginationLoader'
import { useTickets } from '@/modules/ticket/composables/useTickets'
import { useTicketStatuses } from '@/modules/ticket/composables/useTicketStatuses'
import { useTicketFilter } from '@/modules/ticket/composables/useTicketFilter'
import { getMyTickets } from '@/modules/ticket/api/ticket.api'
import { Role } from '@/enums/role'
import { TicketStatus } from '@/enums/ticketStatus'
import router from '@/router'

export const useMyTicketsPage = () => {
    const { user, isEmployee } = useUser()

    const selectedStatus = ref<number>(0)

    const { currentPage, lastPage, setMeta } = usePagination()
    const { tickets, load } = useTickets(getMyTickets)
    usePaginationLoader(currentPage, load, setMeta)
    const { statuses, loadStatuses } = useTicketStatuses()

    const availableStatuses = computed(() => {
        if (!user.value) {
            return []
        }

        if (user.value.getRole() === Role.User) {
            return statuses.value
        }

        return statuses.value.filter(statusItem => statusItem.id !== TicketStatus.Pending)
    })

    const availableStatusesWithAll = computed(() => [
        { id: 0, name: 'Все статусы' },
        ...availableStatuses.value
    ])

    const filteredTickets = useTicketFilter(tickets, selectedStatus)

    const openTicket = (ticketId: number) => {
        router.push({ name: 'ticket', params: { id: ticketId } })
    }

    onMounted(async () => {
        await load(currentPage.value, setMeta)
        await loadStatuses()
    })

    return {
        selectedStatus,
        currentPage,
        lastPage,
        availableStatusesWithAll,
        filteredTickets,
        openTicket,
        isEmployee
    }
}