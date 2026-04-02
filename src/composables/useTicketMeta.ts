import { computed } from 'vue'
import { getUser } from '@/user/data'
import { getStatusBadge } from '@/utils/utils'

export const useTicketMeta = (
  ticketStatus: any,
  allStatuses: any,
  updateStatus: () => void
) => {
  const currentUser = (() => {
    const user = getUser()

    if (!user) {
      throw new Error('User not authorized')
    }

    return user
  })()

  const currentStatusName = computed(() => {
    if (ticketStatus.value === null) {
      return ''
    }

    const status = allStatuses.value.find((statusItem: any) => {
      return statusItem.id === ticketStatus.value
    })

    if (!status) {
      return ''
    }

    return status.name
  })

  const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '').replace(/^8/, '7')

    if (digits.length < 10) {
      return phone
    }

    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`
  }

  const handleStatusChange = (value: number): void => {
    ticketStatus.value = Number(value)
    updateStatus()
  }

  return {
    currentUser,
    currentStatusName,
    formatPhoneNumber,
    handleStatusChange,
    getStatusBadge
  }
}
