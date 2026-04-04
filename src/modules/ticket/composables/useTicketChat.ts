import { ref, nextTick } from 'vue'
import { attachTicketLog, getTicketLogs } from '@/modules/ticket/api/ticket.chat.api'

type TicketLog = {
    id: number
    message: string
    created_at: string
    sender_id: number | null
    employee_id: number | null
    sender_name: string
}

export const useTicketChat = (ticketId: number) => {
    const logs = ref<TicketLog[]>([])
    const newMessage = ref('')
    const chatBox = ref<HTMLElement | null>(null)

    const scrollToBottom = async () => {
        await nextTick()

        if (chatBox.value) {
            chatBox.value.scrollTop = chatBox.value.scrollHeight
        }
    }

    const loadLogs = async () => {
        const ticketLogs = await getTicketLogs(ticketId)
        logs.value = ticketLogs
        await scrollToBottom()
    }

    const sendLog = async () => {
        const trimmedMessage = newMessage.value.trim()

        if (!trimmedMessage) {
            return
        }

        const response = await attachTicketLog(ticketId, {
            message: trimmedMessage
        })

        const createdLog = response.data ?? response

        logs.value.push(createdLog)
        newMessage.value = ''
        await scrollToBottom()
    }

    return {
        logs,
        newMessage,
        chatBox,
        loadLogs,
        sendLog
    }
}