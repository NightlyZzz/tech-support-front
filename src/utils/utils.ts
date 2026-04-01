import { getUser, logout, setNavbarState, setUserData, setUserToken } from '@/user/data.ts'
import { Role } from '@/enums/role.ts'
import { User } from '@/user/user.ts'
import { getCurrentUser } from '@/utils/requests.ts'
import { showToast } from '@/utils/toast'
import { TicketStatus } from '@/enums/ticketStatus'

let lastRefresh = 0

export const refreshAuthData = async (token: string): Promise<void> => {
  const now = Date.now()
  if (now - lastRefresh < 15000) return

  try {
    const response: Response = await getCurrentUser(token)

    if (!response.ok) {
      throw new Error('Response is not OK')
    }

    const data: any = await response.json()

    lastRefresh = now
    setUserToken(token)
    setUserData(data.data)
    setNavbarState((!!token && Object.keys(data.data).length > 0))
  } catch (e: any) {
    showToast('Сессия истекла, войдите снова', 'info')
    logout()
  }
}

export const isUser = (): boolean => {
  return getUser().getRole() === Role.User
}

export const isEmployee = (): boolean => {
  const user: User = getUser()
  return user.getRole() === Role.Employee || user.getRole() === Role.Admin
}

export const isAdmin = (): boolean => {
  return getUser().getRole() === Role.Admin
}

export const truncate = (text: string, max = 100): string => {
  if (!text) return ''
  if (text.length <= max) return text

  const trimmed = text.slice(0, max)
  const lastSpace = trimmed.lastIndexOf(' ')

  return (lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed) + '...'
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

export const getStatusBadge = (id: number): string => {
  if (id === TicketStatus.Pending) return 'badge--pending'
  if (id === TicketStatus.Review) return 'badge--review'
  if (id === TicketStatus.Resolved) return 'badge--resolved'
  return ''
}
