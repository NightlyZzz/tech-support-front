type TicketListItem = {
    getEmployeeId: () => number | null
}

type CanOpenTicketFromListOptions = {
    isAdmin: boolean
    isEmployee: boolean
}

export const canOpenTicketFromList = (
        ticket: TicketListItem,
        options: CanOpenTicketFromListOptions
): boolean => {
    if (options.isAdmin) {
        return true
    }

    if (!options.isEmployee) {
        return false
    }

    return ticket.getEmployeeId() !== null
}