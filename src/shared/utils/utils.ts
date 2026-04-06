import { TicketStatus } from '@/enums/ticketStatus'

const parseDate = (dateString: string): Date | null => {
    if (!dateString) {
        return null
    }

    const normalizedDateString = dateString.replace(
            /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\.\d+Z$/,
            '$1Z'
    )

    const parsedDate = new Date(normalizedDateString)

    if (Number.isNaN(parsedDate.getTime())) {
        return null
    }

    return parsedDate
}

export const truncate = (text: string, max = 100): string => {
    if (!text) {
        return ''
    }

    if (text.length <= max) {
        return text
    }

    const trimmedText = text.slice(0, max)
    const lastSpaceIndex = trimmedText.lastIndexOf(' ')

    if (lastSpaceIndex > 0) {
        return trimmedText.slice(0, lastSpaceIndex) + '...'
    }

    return trimmedText + '...'
}

export const formatDate = (dateString: string): string => {
    const parsedDate = parseDate(dateString)

    if (!parsedDate) {
        return '—'
    }

    return parsedDate.toLocaleDateString('ru-RU')
}

export const formatTime = (dateString: string): string => {
    const parsedDate = parseDate(dateString)

    if (!parsedDate) {
        return '—'
    }

    return parsedDate.toLocaleTimeString('ru-RU', {
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