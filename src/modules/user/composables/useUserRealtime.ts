import router from '@/router'
import { Role } from '@/enums/role'
import { createEcho, getEcho } from '@/shared/realtime/echo'
import { useUser } from '@/modules/user/composables/useUser'
import { setUserData } from '@/modules/user/model/userStorage'
import { performLocalLogout } from '@/modules/user/services/auth.service'
import { clearClientSession, redirectToAuth } from '@/modules/user/services/session.service'
import { showToast } from '@/shared/toast/toastService'
import type { UserData } from '@/modules/user/types/user'

type RouteRole = 'admin' | 'employee' | 'user'

let subscribedUserId: number | null = null

const leaveCurrentUserChannel = () => {
    const echo = getEcho()

    if (!echo || subscribedUserId === null) {
        return
    }

    echo.leave(`App.Models.User.${subscribedUserId}`)
    subscribedUserId = null
}

const hasAccessToCurrentRoute = (roleId: number): boolean => {
    const requiredRole = router.currentRoute.value.meta.role as RouteRole | undefined

    if (!requiredRole) {
        return true
    }

    if (requiredRole === 'admin') {
        return roleId === Role.Admin
    }

    if (requiredRole === 'employee') {
        return roleId >= Role.Employee
    }

    if (requiredRole === 'user') {
        return roleId === Role.User
    }

    return true
}

const syncRouteAccess = async (roleId: number) => {
    if (hasAccessToCurrentRoute(roleId)) {
        return
    }

    await router.replace({ name: 'profile' })
}

const forceLogout = async (message?: string) => {
    leaveCurrentUserChannel()
    clearClientSession()

    if (message) {
        showToast(message, 'info')
    }

    await redirectToAuth()
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

    echo.private(`App.Models.User.${currentUserId}`).listen('.user.updated', async (updatedUser: UserData) => {
        const currentToken = user.value?.getToken() ?? ''
        const previousRoleId = Number(user.value?.getRole() ?? 0)
        const nextRoleId = Number(updatedUser.role_id ?? 0)

        if (previousRoleId !== 0 && nextRoleId !== 0 && previousRoleId !== nextRoleId) {
            await forceLogout('Ваша роль была изменена. Войдите в аккаунт заново.')
            return
        }

        const normalizedUser: UserData = {
            ...updatedUser,
            token: currentToken
        }

        setUser(normalizedUser)
        setUserData(normalizedUser)

        if (nextRoleId !== 0) {
            await syncRouteAccess(nextRoleId)
        }
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