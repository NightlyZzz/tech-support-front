import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { attachTicketLog, getTicketLogs } from '@/modules/ticket/api/ticket.chat.api'
import { createEcho, getEcho } from '@/shared/realtime/echo'
import type { TicketLog } from '@/modules/ticket/types/ticket-log'

export const useTicketChat = (ticketId: number) => {
    const logs = ref<TicketLog[]>([])
    const newMessage = ref('')
    const chatBox = ref<HTMLElement | null>(null)

    const setChatBoxElement = (element: HTMLElement | null): void => {
        chatBox.value = element
    }

    const scrollToBottom = async (): Promise<void> => {
        await nextTick()

        if (chatBox.value) {
            chatBox.value.scrollTop = chatBox.value.scrollHeight
        }
    }

    const appendLog = async (ticketLog: TicketLog): Promise<void> => {
        const alreadyExists = logs.value.some((logItem) => logItem.id === ticketLog.id)

        if (alreadyExists) {
            return
        }

        logs.value.push(ticketLog)
        await scrollToBottom()
    }

    const loadLogs = async (): Promise<void> => {
        logs.value = await getTicketLogs(ticketId)
        await scrollToBottom()
    }

    const sendLog = async (): Promise<void> => {
        const trimmedMessage = newMessage.value.trim()

        if (!trimmedMessage) {
            return
        }

        const createdLog = await attachTicketLog(ticketId, {
            message: trimmedMessage
        })

        await appendLog(createdLog)
        newMessage.value = ''
    }

    const subscribeToTicketLogs = (): void => {
        const echo = getEcho() ?? createEcho()

        if (!echo) {
            return
        }

        const channel = echo.private(`ticket.${ticketId}`)

        channel.listen('.ticket.log.created', async (ticketLog: TicketLog) => {
            await appendLog(ticketLog)
        })
    }

    const unsubscribeFromTicketLogs = (): void => {
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
        loadLogs,
        sendLog,
        setChatBoxElement
    }
}