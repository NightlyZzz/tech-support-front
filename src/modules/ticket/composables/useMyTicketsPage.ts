import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUser } from '@/modules/user/composables/useUser'
import { usePagination } from '@/composables/common/usePagination'
import { usePaginationLoader } from '@/composables/common/usePaginationLoader'
import { useTickets } from '@/modules/ticket/composables/useTickets'
import { useTicketStatuses } from '@/modules/ticket/composables/useTicketStatuses'
import { useTicketFilter } from '@/modules/ticket/composables/useTicketFilter'
import { getMyTickets } from '@/modules/ticket/api/ticket.api'
import { Role } from '@/enums/role'
import { TicketStatus } from '@/enums/ticketStatus'
import { mapTicket } from '@/modules/ticket/model/mapTicket'
import { getEcho } from '@/shared/realtime/echo'
import type { TicketApi } from '@/types/ticket'
import router from '@/router'

let subscribedUserId: number | null = null

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

    const reloadPageData = async () => {
        await load(currentPage.value, setMeta)
        await loadStatuses()
    }

    const upsertTicket = (ticketData: TicketApi) => {
        const mappedTicket = mapTicket(ticketData)
        const existingTicketIndex = tickets.value.findIndex(ticketItem => ticketItem.getId() === mappedTicket.getId())

        if (existingTicketIndex === -1) {
            tickets.value.unshift(mappedTicket)
            return
        }

        tickets.value[existingTicketIndex] = mappedTicket
    }

    const unsubscribeFromMyTickets = () => {
        const echo = getEcho()

        if (!echo || subscribedUserId === null) {
            return
        }

        const channel = echo.private(`App.Models.User.${subscribedUserId}`)

        channel.stopListening('.ticket.created')
        channel.stopListening('.ticket.updated')

        subscribedUserId = null
    }

    const subscribeToMyTickets = () => {
        const echo = getEcho()

        if (!echo || !user.value) {
            return
        }

        const currentUserId = user.value.getId()

        if (subscribedUserId !== null && subscribedUserId !== currentUserId) {
            unsubscribeFromMyTickets()
        }

        if (subscribedUserId === currentUserId) {
            return
        }

        subscribedUserId = currentUserId

        const channel = echo.private(`App.Models.User.${currentUserId}`)

        channel.listen('.ticket.created', (createdTicket: TicketApi) => {
            upsertTicket(createdTicket)
        })

        channel.listen('.ticket.updated', (updatedTicket: TicketApi) => {
            upsertTicket(updatedTicket)
        })
    }

    const openTicket = (ticketId: number) => {
        router.push({ name: 'ticket', params: { id: ticketId } })
    }

    onMounted(async () => {
        await reloadPageData()
        subscribeToMyTickets()
    })

    watch(
            () => user.value?.getRole(),
            async (nextRole, prevRole) => {
                if (nextRole === undefined || nextRole === prevRole) {
                    return
                }

                selectedStatus.value = 0
                await reloadPageData()
            }
    )

    watch(
            () => user.value?.getId(),
            async (nextUserId, prevUserId) => {
                if (!nextUserId || nextUserId === prevUserId) {
                    return
                }

                unsubscribeFromMyTickets()
                subscribeToMyTickets()
                await reloadPageData()
            }
    )

    onUnmounted(() => {
        unsubscribeFromMyTickets()
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