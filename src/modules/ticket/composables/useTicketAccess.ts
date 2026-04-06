import { computed, type Ref } from 'vue'
import { useUser } from '@/modules/user/composables/useUser'
import { TicketStatus } from '@/enums/ticketStatus'
import { Role } from '@/enums/role'

export const useTicketAccess = (
        ticketStatus: Ref<number | null>,
        assignedEmployeeId: Ref<number | null>,
        ticketSenderId: Ref<number | null>
) => {
    const { user, userId } = useUser()

    const currentRole = computed<number>(() => {
        return Number(user.value?.getRole() ?? 0)
    })

    const canOpen = computed<boolean>(() => {
        if (!user.value || userId.value === null) {
            return false
        }

        if (currentRole.value === Role.Admin) {
            return true
        }

        if (currentRole.value === Role.User) {
            return ticketSenderId.value === userId.value
        }

        return assignedEmployeeId.value === userId.value
    })

    const canWrite = computed<boolean>(() => {
        if (!user.value || !canOpen.value) {
            return false
        }

        if (currentRole.value === Role.User) {
            return ticketStatus.value !== TicketStatus.Resolved
        }

        return ticketStatus.value === TicketStatus.Review
    })

    return {
        canOpen,
        canWrite
    }
}