import { computed, type Ref } from 'vue'
import { useUser } from '@/modules/user/composables/useUser'
import { getStatusBadge } from '@/shared/utils/utils'
import type { StatusOption } from '@/modules/ticket/types/ticket-status'

export const useTicketMeta = (
        ticketStatus: Ref<number | null>,
        allStatuses: Ref<StatusOption[]>,
        updateStatus: () => Promise<void>
) => {
    const { user } = useUser()

    const currentUser = computed(() => user.value ?? null)

    const currentStatusName = computed<string>(() => {
        if (ticketStatus.value === null) {
            return ''
        }

        const currentStatus = allStatuses.value.find((statusItem) => statusItem.id === ticketStatus.value)
        return currentStatus?.name ?? ''
    })

    const formatPhoneNumber = (phoneNumber?: string | null): string => {
        if (!phoneNumber) {
            return '—'
        }

        const normalizedDigits = phoneNumber.replace(/\D/g, '').replace(/^8/, '7')

        if (normalizedDigits.length < 11) {
            return phoneNumber
        }

        return `+7 (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7, 9)}-${normalizedDigits.slice(9, 11)}`
    }

    const handleStatusChange = async (nextStatusId: number): Promise<void> => {
        ticketStatus.value = nextStatusId
        await updateStatus()
    }

    return {
        currentUser,
        currentStatusName,
        formatPhoneNumber,
        handleStatusChange,
        getStatusBadge
    }
}