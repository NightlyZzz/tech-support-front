import type { Ref } from 'vue'
import type { User } from '@/user/user'

interface TicketMessage {
    id: number
    message: string
    sender_id: number | null
    employee_id: number | null
    sender_name: string
    created_at: string
}

export const useTicketMessages = (currentUser: Ref<User | null>) => {
    const isOwnMessage = (message: TicketMessage): boolean => {
        return (
                message.sender_id === currentUser.value?.getId() ||
                message.employee_id === currentUser.value?.getId()
        )
    }

    const getDisplayName = (message: TicketMessage): string => {
        if (isOwnMessage(message)) {
            return 'Вы'
        }

        if (message.sender_id !== null) {
            return message.sender_name
        }

        if (message.employee_id !== null) {
            return 'Сотрудник #' + message.employee_id
        }

        return 'Удалённый пользователь'
    }

    return {
        isOwnMessage,
        getDisplayName
    }
}