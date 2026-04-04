import { computed, type Ref } from 'vue'
import { useUser } from '@/modules/user/composables/useUser'
import { TicketStatus } from '@/enums/ticketStatus'

export const useTicketAccess = (
        ticketStatus: Ref<number | null>,
        assignedEmployeeId: Ref<number | null>
) => {
    const { user, userId, isAdmin, isUser } = useUser()

    const canOpen = computed(() => {
        if (!user.value) {
            return false
        }

        if (isAdmin.value) {
            return true
        }

        if (isUser.value) {
            return true
        }

        return assignedEmployeeId.value === userId.value
    })

    const canWrite = computed(() => {
        if (!user.value) {
            return false
        }

        if (isUser.value) {
            return ticketStatus.value !== TicketStatus.Resolved
        }

        return ticketStatus.value === TicketStatus.Review
    })

    return {
        canOpen,
        canWrite
    }
}