import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getTicket, updateTicket } from '@/modules/ticket/api/ticket.api'
import { mapTicket } from '@/modules/ticket/model/mapTicket'
import type { Ticket } from '@/modules/ticket/model/ticket'
import { createEcho, getEcho } from '@/shared/realtime/echo'
import type { TicketApi } from '@/modules/ticket/types/ticket'

export const useTicketDetails = (ticketId: number) => {
    const ticket = ref<Ticket | null>(null)

    const setTicketFromPayload = (ticketData: TicketApi): void => {
        ticket.value = mapTicket(ticketData)
    }

    const loadTicket = async (): Promise<void> => {
        const ticketData = await getTicket(ticketId)
        setTicketFromPayload(ticketData)
    }

    const updateStatus = async (): Promise<void> => {
        if (!ticket.value) {
            return
        }

        await updateTicket(ticketId, {
            ticket_status_id: ticket.value.getStatusId()
        })
    }

    const subscribeToTicketUpdates = (): void => {
        const echo = getEcho() ?? createEcho()

        if (!echo) {
            return
        }

        echo.private(`ticket.${ticketId}`).listen('.ticket.updated', (updatedTicket: TicketApi) => {
            setTicketFromPayload(updatedTicket)
        })
    }

    const unsubscribeFromTicketUpdates = (): void => {
        const echo = getEcho()

        if (!echo) {
            return
        }

        echo.leave(`ticket.${ticketId}`)
    }

    onMounted(() => {
        subscribeToTicketUpdates()
    })

    onUnmounted(() => {
        unsubscribeFromTicketUpdates()
    })

    const assignedEmployeeId = computed<number | null>(() => ticket.value?.getEmployeeId() ?? null)
    const ticketSenderId = computed<number | null>(() => ticket.value?.getSenderId() ?? null)

    return {
        ticket,
        assignedEmployeeId,
        ticketSenderId,
        loadTicket,
        updateStatus
    }
}