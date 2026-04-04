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

    const loadLogs = async () => {
        logs.value = await getTicketLogs(ticketId)
        await scrollToBottom()
    }

    const sendLog = async () => {
        if (!newMessage.value.trim()) {
            return
        }

        const response = await attachTicketLog(ticketId, {
            message: newMessage.value
        })

        const newLog = response.data ?? response

        logs.value.push(newLog)
        newMessage.value = ''
        await scrollToBottom()
    }

    const scrollToBottom = async () => {
        await nextTick()
        if (chatBox.value) {
            chatBox.value.scrollTop = chatBox.value.scrollHeight
        }
    }

    return {
        logs,
        newMessage,
        chatBox,
        loadLogs,
        sendLog
    }
}