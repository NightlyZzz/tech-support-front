import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import router from '@/router'
import { useUser } from '@/modules/user/composables/useUser'
import { usePagination } from '@/composables/common/usePagination'
import { usePaginationLoader } from '@/composables/common/usePaginationLoader'
import { useTickets } from '@/modules/ticket/composables/useTickets'
import { useTicketStatuses } from '@/modules/ticket/composables/useTicketStatuses'
import { useTicketFilter } from '@/modules/ticket/composables/useTicketFilter'
import { getAllTickets, updateTicket } from '@/modules/ticket/api/ticket.api'
import { upsertTicketInList } from '@/modules/ticket/helpers/upsertTicketInList'
import { canOpenTicketFromList } from '@/modules/ticket/helpers/canOpenTicketFromList'
import { bindTicketChannel, leaveTicketChannel } from '@/modules/ticket/helpers/bindTicketChannel'
import type { TicketApi } from '@/modules/ticket/types/ticket'
import type { TicketListItem } from '@/modules/ticket/types/ticket-list-item'

const ALL_TICKETS_CHANNEL = 'tickets.all'

export const useAllTicketsPage = () => {
    const { user, isAdmin, isEmployee } = useUser()

    const selectedStatus = ref<number>(0)

    const { currentPage, lastPage, setMeta } = usePagination()
    const { tickets, load } = useTickets(getAllTickets)
    const { statuses, loadStatuses } = useTicketStatuses()

    usePaginationLoader(currentPage, load, setMeta)

    const statusesWithAll = computed(() => [
        { id: 0, name: 'Все статусы' },
        ...statuses.value
    ])

    const visibleTickets = computed(() => {
        if (isAdmin.value) {
            return tickets.value
        }

        return tickets.value.filter((ticketItem) => ticketItem.getEmployeeId() === null)
    })

    const filteredTickets = useTicketFilter(visibleTickets, selectedStatus)

    const upsertTicket = (ticketData: TicketApi): void => {
        upsertTicketInList(tickets, ticketData)
    }

    const subscribeToAllTickets = (): void => {
        if (!isEmployee.value) {
            return
        }

        bindTicketChannel(ALL_TICKETS_CHANNEL, upsertTicket)
    }

    const unsubscribeFromAllTickets = (): void => {
        leaveTicketChannel(ALL_TICKETS_CHANNEL)
    }

    const openTicket = (ticketId: number): void => {
        if (!user.value) {
            return
        }

        const selectedTicket = tickets.value.find((ticketItem) => ticketItem.getId() === ticketId)

        if (!selectedTicket) {
            return
        }

        if (!canOpenTicketFromList(selectedTicket, {
            isAdmin: isAdmin.value,
            isEmployee: isEmployee.value
        })) {
            return
        }

        void router.push({ name: 'ticket', params: { id: ticketId } })
    }

    const takeToReview = async (ticket: TicketListItem): Promise<void> => {
        if (!user.value) {
            return
        }

        await updateTicket(ticket.getId(), {
            employee_id: user.value.getId()
        })

        ticket.setReview(user.value.getId())
        tickets.value = [...tickets.value]
    }

    onMounted(async () => {
        await load(currentPage.value, setMeta)
        await loadStatuses()
        subscribeToAllTickets()
    })

    watch(
            () => isEmployee.value,
            async (nextIsEmployee) => {
                if (nextIsEmployee) {
                    return
                }

                unsubscribeFromAllTickets()
                await router.replace({ name: 'profile' })
            }
    )

    onUnmounted(() => {
        unsubscribeFromAllTickets()
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