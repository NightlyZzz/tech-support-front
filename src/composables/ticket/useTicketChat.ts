import { ref, nextTick } from 'vue'
import { attachTicketLog, getTicketLogs } from '@/api/ticket.api.ts'

type TicketLog = {
    id: number
    message: string
    created_at: string
    user_id: number
    user_name: string
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

        const newLog = await attachTicketLog(ticketId, {
            message: newMessage.value
        })

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