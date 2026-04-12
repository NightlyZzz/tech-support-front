import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { Role } from '@/enums/role'
import type { User } from '@/modules/user/model/user'

export type RouteRole = 'admin' | 'employee' | 'user'

export interface NavigationGuardContext {
    hasToken: boolean
    currentUser: User | null
}

const DEFAULT_AUTHORIZED_ROUTE_NAME = 'profile'
const AUTH_ROUTE_NAME = 'auth'
const HOME_ROUTE_NAME = 'home'

export const getDefaultAuthorizedRoute = (): RouteLocationRaw => {
    return { name: DEFAULT_AUTHORIZED_ROUTE_NAME }
}

export const getAuthRoute = (): RouteLocationRaw => {
    return { name: AUTH_ROUTE_NAME }
}

export const hasRouteAccess = (
        routeLocation: Pick<RouteLocationNormalized, 'meta'>,
        currentUser: User | null
): boolean => {
    const requiredRole = routeLocation.meta.role as RouteRole | undefined

    if (!requiredRole) {
        return true
    }

    if (!currentUser) {
        return false
    }

    const currentUserRole = currentUser.getRole()

    if (requiredRole === 'admin') {
        return currentUserRole === Role.Admin
    }

    if (requiredRole === 'employee') {
        return currentUserRole >= Role.Employee
    }

    if (requiredRole === 'user') {
        return currentUserRole === Role.User
    }

    return true
}

export const resolveNavigationGuard = (
        routeLocation: Pick<RouteLocationNormalized, 'name' | 'meta'>,
        context: NavigationGuardContext
): true | RouteLocationRaw => {
    const requiresAuth = Boolean(routeLocation.meta.requiresAuth)

    if (routeLocation.name === HOME_ROUTE_NAME) {
        return context.hasToken ? getDefaultAuthorizedRoute() : getAuthRoute()
    }

    if (requiresAuth && !context.hasToken) {
        return getAuthRoute()
    }

    if (routeLocation.name === AUTH_ROUTE_NAME && context.hasToken) {
        return getDefaultAuthorizedRoute()
    }

    if (!hasRouteAccess(routeLocation, context.currentUser)) {
        return context.hasToken ? getDefaultAuthorizedRoute() : getAuthRoute()
    }

    return true
}