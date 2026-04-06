import { createEcho, getEcho } from '@/shared/realtime/echo'
import type { TicketApi } from '@/modules/ticket/types/ticket'

type HandleTicketEvent = (ticketData: TicketApi) => void

export const bindTicketChannel = (
        channelName: string,
        handleTicketEvent: HandleTicketEvent
): boolean => {
    const echo = getEcho() ?? createEcho()

    if (!echo) {
        return false
    }

    echo.private(channelName).listen('.ticket.created', (createdTicket: TicketApi) => {
        handleTicketEvent(createdTicket)
    }).listen('.ticket.updated', (updatedTicket: TicketApi) => {
        handleTicketEvent(updatedTicket)
    })

    return true
}

export const leaveTicketChannel = (channelName: string): void => {
    const echo = getEcho()

    if (!echo) {
        return
    }

    echo.leave(channelName)
}