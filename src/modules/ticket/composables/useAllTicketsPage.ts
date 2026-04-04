import { ref, computed, onMounted } from 'vue'
import { useUser } from '@/modules/user/composables/useUser'
import { usePagination } from '@/composables/common/usePagination'
import { usePaginationLoader } from '@/composables/common/usePaginationLoader'
import { useTickets } from '@/modules/ticket/composables/useTickets'
import { useTicketStatuses } from '@/modules/ticket/composables/useTicketStatuses'
import { useTicketFilter } from '@/modules/ticket/composables/useTicketFilter'
import { getAllTickets, updateTicket } from '@/modules/ticket/api/ticket.api'
import { Ticket } from '@/modules/ticket/model/ticket'
import router from '@/router'

export const useAllTicketsPage = () => {
    const { user, isAdmin, isEmployee } = useUser()

    const selectedStatus = ref<number>(0)

    const { currentPage, lastPage, setMeta } = usePagination()
    const { tickets, load } = useTickets(getAllTickets)
    usePaginationLoader(currentPage, load, setMeta)
    const { statuses, loadStatuses } = useTicketStatuses()

    const statusesWithAll = computed(() => [
        { id: 0, name: 'Все статусы' },
        ...statuses.value
    ])

    const filteredTickets = useTicketFilter(tickets, selectedStatus)

    const openTicket = (ticketId: number) => {
        if (!user.value) {
            return
        }

        const selectedTicket = tickets.value.find(ticketItem => ticketItem.getId() === ticketId)

        if (!selectedTicket) {
            return
        }

        if (isAdmin.value) {
            router.push({ name: 'ticket', params: { id: ticketId } })
            return
        }

        if (!isEmployee.value) {
            return
        }

        if (!selectedTicket.getEmployeeId()) {
            return
        }

        router.push({ name: 'ticket', params: { id: ticketId } })
    }

    const takeToReview = async (ticket: Ticket) => {
        if (!user.value) {
            return
        }

        await updateTicket(ticket.getId(), {
            employee_id: user.value.getId()
        })

        ticket.setReview(user.value.getId())
    }

    onMounted(async () => {
        await load(currentPage.value, setMeta)
        await loadStatuses()
    })

    return {
        selectedStatus,
        currentPage,
        lastPage,
        statusesWithAll,
        filteredTickets,
        openTicket,
        takeToReview,
        isEmployee
    }
}