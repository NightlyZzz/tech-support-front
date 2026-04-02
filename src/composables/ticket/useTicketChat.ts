import { ref, nextTick } from 'vue'
import { attachTicketLog, getTicketLogs } from '@/utils/requests'

export const useTicketChat = (ticketId: number) => {
  const logs = ref<any[]>([])
  const newMessage = ref('')
  const chatBox = ref<HTMLElement | null>(null)

  const loadLogs = async () => {
    const res = await getTicketLogs(ticketId)
    logs.value = res.data
    await scrollToBottom()
  }

  const sendLog = async () => {
    if (!newMessage.value.trim()) return

    const res = await attachTicketLog(ticketId, { message: newMessage.value })
    logs.value.push(res.data)
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
