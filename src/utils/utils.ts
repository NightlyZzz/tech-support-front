import { getUser, logout, setNavbarState, setUserData, setUserToken } from '@/user/data'
import { Role } from '@/enums/role'
import { getCurrentUser } from '@/utils/requests'
import { showToast } from '@/utils/toast'
import { TicketStatus } from '@/enums/ticketStatus'

let lastRefresh = 0

export const refreshAuthData = async (token: string): Promise<void> => {
  const now = Date.now()

  if (now - lastRefresh < 15000) {
    return
  }

  try {
    setUserToken(token)

    const data: any = await getCurrentUser()

    lastRefresh = now
    setUserData(data.data)
    setNavbarState(!!token && Object.keys(data.data).length > 0)
  } catch {
    showToast('Сессия истекла, войдите снова', 'info')
    logout()
  }
}

export const isUser = (): boolean => {
  const user = getUser()

  if (!user) {
    return false
  }

  return user.getRole() === Role.User;
}

export const isEmployee = (): boolean => {
  const user = getUser()

  if (!user) {
    return false
  }

  if (user.getRole() === Role.Employee) {
    return true
  }

  return user.getRole() === Role.Admin;
}

export const isAdmin = (): boolean => {
  const user = getUser()

  if (!user) {
    return false
  }

  return user.getRole() === Role.Admin;
}

export const truncate = (text: string, max = 100): string => {
  if (!text) {
    return ''
  }

  if (text.length <= max) {
    return text
  }

  const trimmed = text.slice(0, max)
  const lastSpace = trimmed.lastIndexOf(' ')

  if (lastSpace > 0) {
    return trimmed.slice(0, lastSpace) + '...'
  }

  return trimmed + '...'
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getStatusBadge = (statusId: number): string => {
  if (statusId === TicketStatus.Pending) {
    return 'badge--pending'
  }

  if (statusId === TicketStatus.Review) {
    return 'badge--review'
  }

  if (statusId === TicketStatus.Resolved) {
    return 'badge--resolved'
  }

  return ''
}
