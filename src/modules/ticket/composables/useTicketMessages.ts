import type { Ref } from 'vue'
import type { User } from '@/modules/user/model/user'
import type { TicketLog } from '@/modules/ticket/types/ticket-log'

export type TicketMessage = TicketLog

export const useTicketMessages = (currentUser: Ref<User | null>) => {
    const isOwnMessage = (message: TicketMessage): boolean => {
        const currentUserId = currentUser.value?.getId()

        if (!currentUserId) {
            return false
        }

        return (
                message.sender_id === currentUserId ||
                message.employee_id === currentUserId
        )
    }

    const getDisplayName = (message: TicketMessage): string => {
        if (isOwnMessage(message)) {
            return 'Вы'
        }

        if (message.sender_id !== null) {
            return message.sender_name || `Пользователь #${message.sender_id}`
        }

        if (message.employee_id !== null) {
            return `Сотрудник #${message.employee_id}`
        }

        return 'Удалённый пользователь'
    }

    return {
        isOwnMessage,
        getDisplayName
    }
}