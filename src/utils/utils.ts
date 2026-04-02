import { TicketStatus } from '@/enums/ticketStatus'

export const truncate = (text: string, max = 100): string => {
    if (!text) {
        return ''
    }

    if (text.length <= max) {
        return text
    }

    const trimmed = text.slice(0, max)
    const lastSpace = trimmed.lastIndexOf(' ')

    if (lastSpace > 0) {
        return trimmed.slice(0, lastSpace) + '...'
    }

    return trimmed + '...'
}

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU')
}

export const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

export const getStatusBadge = (statusId: number): string => {
    if (statusId === TicketStatus.Pending) {
        return 'badge--pending'
    }

    if (statusId === TicketStatus.Review) {
        return 'badge--review'
    }

    if (statusId === TicketStatus.Resolved) {
        return 'badge--resolved'
    }

    return ''
}