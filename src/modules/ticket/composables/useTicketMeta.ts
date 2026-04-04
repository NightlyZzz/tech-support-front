import { computed, type Ref } from 'vue'
import { useUser } from '@/modules/user/composables/useUser'
import { getStatusBadge } from '@/shared/utils/utils'

type Status = {
    id: number
    name: string
}

export const useTicketMeta = (
        ticketStatus: Ref<number | null>,
        allStatuses: Ref<Status[]>,
        updateStatus: () => void
) => {
    const { user } = useUser()

    const currentUser = computed(() => user.value ?? null)

    const currentStatusName = computed(() => {
        if (ticketStatus.value === null) {
            return ''
        }

        const currentStatus = allStatuses.value.find(
                statusItem => statusItem.id === ticketStatus.value
        )

        return currentStatus ? currentStatus.name : ''
    })

    const formatPhoneNumber = (phoneNumber?: string | null): string => {
        if (!phoneNumber) {
            return '—'
        }

        const normalizedDigits = phoneNumber.replace(/\D/g, '').replace(/^8/, '7')

        if (normalizedDigits.length < 10) {
            return phoneNumber
        }

        return `+7 (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7, 9)}-${normalizedDigits.slice(9, 11)}`
    }

    const handleStatusChange = (nextStatusId: number): void => {
        ticketStatus.value = nextStatusId
        updateStatus()
    }

    return {
        currentUser,
        currentStatusName,
        formatPhoneNumber,
        handleStatusChange,
        getStatusBadge
    }
}