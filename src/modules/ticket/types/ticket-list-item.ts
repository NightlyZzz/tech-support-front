export type TicketListItem = {
    getId: () => number
    getDescription: () => string
    getContactPhone: () => string
    getSenderId: () => number
    getEmployeeId: () => number | null
    getTypeId: () => number
    getTypeName: () => string
    getStatusId: () => number
    getStatusName: () => string
    getCreatedAt: () => string
    getCreatedAtFormatted: () => string
    getSenderName: () => string
    canTake: () => boolean
    setReview: (employeeId: number) => void
    setStatus: (statusId: number, statusName?: string) => void
}