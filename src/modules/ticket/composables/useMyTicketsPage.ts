import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import router from '@/router'
import { useUser } from '@/modules/user/composables/useUser'
import { usePagination } from '@/composables/common/usePagination'
import { usePaginationLoader } from '@/composables/common/usePaginationLoader'
import { useTickets } from '@/modules/ticket/composables/useTickets'
import { useTicketStatuses } from '@/modules/ticket/composables/useTicketStatuses'
import { useTicketFilter } from '@/modules/ticket/composables/useTicketFilter'
import { getMyTickets } from '@/modules/ticket/api/ticket.api'
import { Role } from '@/enums/role'
import { TicketStatus } from '@/enums/ticketStatus'
import { upsertTicketInList } from '@/modules/ticket/helpers/upsertTicketInList'
import { bindTicketChannel, leaveTicketChannel } from '@/modules/ticket/helpers/bindTicketChannel'
import type { TicketApi } from '@/modules/ticket/types/ticket'

let subscribedUserId: number | null = null

export const useMyTicketsPage = () => {
    const { user, isEmployee } = useUser()

    const selectedStatus = ref<number>(0)

    const { currentPage, lastPage, setMeta } = usePagination()
    const { tickets, load } = useTickets(getMyTickets)
    const { statuses, loadStatuses } = useTicketStatuses()

    usePaginationLoader(currentPage, load, setMeta)

    const availableStatuses = computed(() => {
        if (!user.value) {
            return []
        }

        if (user.value.getRole() === Role.User) {
            return statuses.value
        }

        return statuses.value.filter((statusItem) => statusItem.id !== TicketStatus.Pending)
    })

    const availableStatusesWithAll = computed(() => [
        { id: 0, name: 'Все статусы' },
        ...availableStatuses.value
    ])

    const filteredTickets = useTicketFilter(tickets, selectedStatus)

    const reloadPageData = async (): Promise<void> => {
        await load(currentPage.value, setMeta)
        await loadStatuses()
    }

    const upsertTicket = (ticketData: TicketApi): void => {
        upsertTicketInList(tickets, ticketData)
    }

    const unsubscribeFromMyTickets = (): void => {
        if (subscribedUserId === null) {
            return
        }

        leaveTicketChannel(`App.Models.User.${subscribedUserId}`)
        subscribedUserId = null
    }

    const subscribeToMyTickets = (): void => {
        if (!user.value) {
            return
        }

        const currentUserId = user.value.getId()
        const channelName = `App.Models.User.${currentUserId}`

        if (subscribedUserId !== null && subscribedUserId !== currentUserId) {
            unsubscribeFromMyTickets()
        }

        if (subscribedUserId === currentUserId) {
            return
        }

        const isBound = bindTicketChannel(channelName, upsertTicket)

        if (!isBound) {
            return
        }

        subscribedUserId = currentUserId
    }

    const openTicket = (ticketId: number): void => {
        void router.push({ name: 'ticket', params: { id: ticketId } })
    }

    onMounted(async () => {
        await reloadPageData()
        subscribeToMyTickets()
    })

    watch(
            () => user.value?.getRole(),
            async (nextRole, previousRole) => {
                if (nextRole === undefined || nextRole === previousRole) {
                    return
                }

                selectedStatus.value = 0
                await reloadPageData()
            }
    )

    watch(
            () => user.value?.getId(),
            async (nextUserId, previousUserId) => {
                if (!nextUserId || nextUserId === previousUserId) {
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