import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { attachTicketLog, getTicketLogs } from '@/modules/ticket/api/ticket.chat.api'
import { getEcho } from '@/shared/realtime/echo'

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

    const appendLog = async (ticketLog: TicketLog) => {
        const alreadyExists = logs.value.some(logItem => logItem.id === ticketLog.id)

        if (alreadyExists) {
            return
        }

        logs.value.push(ticketLog)
        await scrollToBottom()
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

        await appendLog(createdLog)
        newMessage.value = ''
    }

    const subscribeToTicketLogs = () => {
        const echo = getEcho()

        if (!echo) {
            return
        }

        const channel = echo.private(`ticket.${ticketId}`)

        channel.listen('.ticket.log.created', async (ticketLog: TicketLog) => {
            await appendLog(ticketLog)
        })
    }

    const unsubscribeFromTicketLogs = () => {
        const echo = getEcho()

        if (!echo) {
            return
        }

        const channel = echo.private(`ticket.${ticketId}`)

        channel.stopListening('.ticket.log.created')
    }

    onMounted(() => {
        subscribeToTicketLogs()
    })

    onUnmounted(() => {
        unsubscribeFromTicketLogs()
    })

    return {
        logs,
        newMessage,
        chatBox,
        loadLogs,
        sendLog
    }
}