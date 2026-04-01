import { ref, nextTick } from 'vue'
import { attachTicketLog, getTicketLogs } from '@/utils/requests'
import { getUser } from '@/user/data'

export const useTicketChat = (ticketId: number) => {
  const logs = ref<any[]>([])
  const newMessage = ref('')
  const chatBox = ref<HTMLElement | null>(null)

  const user = getUser()

  const loadLogs = async () => {
    const res = await getTicketLogs(ticketId, user.getToken())

    if (res.ok) {
      logs.value = (await res.json()).data
      await scrollToBottom()
    }
  }

  const sendLog = async () => {
    if (!newMessage.value.trim()) return

    const res = await attachTicketLog(
      ticketId,
      { message: newMessage.value },
      user.getToken()
    )

    if (res.ok) {
      logs.value.push((await res.json()).data)
      newMessage.value = ''
      await scrollToBottom()
    }
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
