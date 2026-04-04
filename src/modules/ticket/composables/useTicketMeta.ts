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

        const status = allStatuses.value.find(
                statusItem => statusItem.id === ticketStatus.value
        )

        return status ? status.name : ''
    })

    const formatPhoneNumber = (phone?: string | null): string => {
        if (!phone) {
            return '—'
        }

        const digits = phone.replace(/\D/g, '').replace(/^8/, '7')

        if (digits.length < 10) {
            return phone
        }

        return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
    }

    const handleStatusChange = (value: number): void => {
        ticketStatus.value = value
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