import router from '@/router'
import { Role } from '@/enums/role'
import { getEcho, createEcho, disconnectEcho } from '@/shared/realtime/echo'
import { useUser } from '@/modules/user/composables/useUser'
import { setUserData, clearUserStorage } from '@/modules/user/model/userStorage'
import { clearUserState } from '@/modules/user/model/userState'
import { performLocalLogout } from '@/modules/user/services/auth.service'
import { showToast } from '@/shared/toast/toastService'

let subscribedUserId: number | null = null

const leaveCurrentUserChannel = () => {
    const echo = getEcho()

    if (!echo || subscribedUserId === null) {
        return
    }

    echo.leave(`App.Models.User.${subscribedUserId}`)
    subscribedUserId = null
}

const hasAccessToCurrentRoute = (role: number): boolean => {
    const currentRoute = router.currentRoute.value
    const requiredRole = currentRoute.meta.role

    if (!requiredRole) {
        return true
    }

    if (requiredRole === 'admin') {
        return role === Role.Admin
    }

    if (requiredRole === 'employee') {
        return role >= Role.Employee
    }

    if (requiredRole === 'user') {
        return role === Role.User
    }

    return true
}

const syncRouteAccess = async (role: number) => {
    if (hasAccessToCurrentRoute(role)) {
        return
    }

    await router.push({ name: 'profile' })
}

const forceLogout = async (showMessage?: string) => {
    leaveCurrentUserChannel()
    disconnectEcho()
    clearUserStorage()
    clearUserState()

    if (showMessage) {
        showToast(showMessage, 'info')
    }

    if (router.currentRoute.value.name !== 'auth') {
        await router.replace({ name: 'auth' })
    }
}

export const subscribeToCurrentUserUpdates = () => {
    const { user, setUser } = useUser()

    if (!user.value) {
        leaveCurrentUserChannel()
        return
    }

    const echo = getEcho() ?? createEcho()

    if (!echo) {
        return
    }

    const currentUserId = user.value.getId()

    if (subscribedUserId !== null && subscribedUserId !== currentUserId) {
        leaveCurrentUserChannel()
    }

    if (subscribedUserId === currentUserId) {
        return
    }

    subscribedUserId = currentUserId

    echo.private(`App.Models.User.${currentUserId}`).listen('.user.updated', async (updatedUser: any) => {
        const currentToken = user.value?.getToken() ?? ''
        const previousRole = Number(user.value?.getRole() ?? 0)
        const nextRole = Number(updatedUser.role_id ?? updatedUser.role ?? 0)

        if (previousRole !== 0 && nextRole !== 0 && previousRole !== nextRole) {
            await forceLogout('Ваша роль была изменена. Войдите в аккаунт заново.')
            return
        }

        const normalizedUser = {
            ...updatedUser,
            token: currentToken
        }

        setUser(normalizedUser)
        setUserData(updatedUser)

        await syncRouteAccess(nextRole)
    }).listen('.user.deleted', async () => {
        await forceLogout()
    }).listen('.user.logged_out_everywhere', async () => {
        await performLocalLogout()
        showToast('Вы вышли из аккаунта на всех устройствах', 'info')
    })
}

export const unsubscribeFromCurrentUserUpdates = () => {
    leaveCurrentUserChannel()
}